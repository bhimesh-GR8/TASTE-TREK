import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";

// Only import PostgreSQL session store if DATABASE_URL is available
let connectPg: any = null;
try {
  if (process.env.DATABASE_URL) {
    connectPg = require("connect-pg-simple");
  }
} catch (e) {
  // Optional dependency
}

import { authStorage } from "./storage";

const getOidcConfig = memoize(
  async () => {
    if (!process.env.OIDC_ISSUER_URL) {
      throw new Error("OIDC_ISSUER_URL environment variable is not set");
    }
    if (!process.env.OIDC_CLIENT_ID) {
      throw new Error("OIDC_CLIENT_ID environment variable is not set");
    }
    return await client.discovery(
      new URL(process.env.OIDC_ISSUER_URL),
      process.env.OIDC_CLIENT_ID
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use PostgreSQL store if available, otherwise use memory store
  let store: any;
  if (connectPg && process.env.DATABASE_URL) {
    const pgStore = connectPg(session);
    store = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  } else {
    // Fallback to memory store (not recommended for production)
    store = new session.MemoryStore();
  }
  
  return session({
    secret: process.env.SESSION_SECRET || "development-secret-key",
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await authStorage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  // Skip auth setup if OIDC is not configured
  if (!process.env.OIDC_CLIENT_ID || !process.env.OIDC_ISSUER_URL) {
    console.warn("OIDC_CLIENT_ID or OIDC_ISSUER_URL not set - skipping OIDC Auth setup");
    return;
  }

  try {
    app.set("trust proxy", 1);
    app.use(getSession());
    app.use(passport.initialize());
    app.use(passport.session());

    const config = await getOidcConfig();

    const verify: VerifyFunction = async (
      tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
      verified: passport.AuthenticateCallback
    ) => {
      const user = {};
      updateUserSession(user, tokens);
      await upsertUser(tokens.claims());
      verified(null, user);
    };

    // Keep track of registered strategies
    const registeredStrategies = new Set<string>();

    // Helper function to ensure strategy exists for a domain
    const ensureStrategy = (domain: string) => {
      const strategyName = `oidcauth:${domain}`;
      if (!registeredStrategies.has(strategyName)) {
        const strategy = new Strategy(
          {
            name: strategyName,
            config,
            scope: process.env.OIDC_SCOPES || "openid email profile offline_access",
            callbackURL: `${process.env.CALLBACK_URL_OVERRIDE || `https://${domain}`}/api/callback`,
          },
          verify
        );
        passport.use(strategy);
        registeredStrategies.add(strategyName);
      }
    };

    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));

    app.get("/api/login", (req, res, next) => {
      ensureStrategy(req.hostname);
      passport.authenticate(`oidcauth:${req.hostname}`, {
        prompt: "login consent",
        scope: (process.env.OIDC_SCOPES || "openid email profile offline_access").split(" "),
      })(req, res, next);
    });

    app.get("/api/callback", (req, res, next) => {
      ensureStrategy(req.hostname);
      passport.authenticate(`oidcauth:${req.hostname}`, {
        successReturnToOrRedirect: "/",
        failureRedirect: "/api/login",
      })(req, res, next);
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: process.env.OIDC_CLIENT_ID!,
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    });
  } catch (error) {
    console.error("Failed to setup auth:", error);
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!user || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
