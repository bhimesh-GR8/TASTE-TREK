import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Add error handlers IMMEDIATELY before anything else
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Don't exit the process
});

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// CORS headers for image loading from Unsplash
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '3600');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// CSP headers to allow external images
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; font-src 'self' https: data:"
  );
  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    log("Setting up routes...");
    await registerRoutes(httpServer, app);
    log("Routes registered successfully");

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      // Don't re-throw - let the error be handled
    });

    log("Setting up static files/vite...");
    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }
    log("Vite setup complete");

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || "3000", 10);
    log("Starting HTTP server on port " + port);
    
    httpServer.on('error', (err) => {
      console.error("[SERVER] HTTP Server error:", err);
    });
    
    httpServer.on('close', () => {
      console.log("[SERVER] HTTP Server closed");
    });
    
    httpServer.listen(
      {
        port,
        host: "127.0.0.1",
      },
      () => {
        log(`serving on port ${port}`);
        console.log("[SERVER] ===== HTTP SERVER IS LISTENING =====");
      },
    );
    
    console.log("[SERVER] After httpServer.listen() call");
    console.log("[SERVER] IIFE IS COMPLETING NOW");
  } catch (err) {
    console.error("[SERVER] Failed to start server:", err);
    // Don't exit - keep the process alive for debugging
  }
})().catch(err => {
  console.error("[SERVER] Unhandled error in IIFE:", err);
  // Explicitly don't call process.exit() - let handlers manage it
});

// Add event listener for process exit to see WHY it's exiting
process.on('exit', (code) => {
  console.log("⚠️  Process exit event fired with code:", code);
});

// Keep process alive indefinitely
const keepAlive = () => {
  setTimeout(keepAlive, 60000); // Reschedule every minute
};
keepAlive();

// Schedule a check 2 seconds from now to ensure we're still running
setTimeout(() => {
  console.log("[SERVER] ===== STILL RUNNING AFTER 2 SECONDS ===== ");
}, 2000);

// Schedule another check at 10 seconds
setTimeout(() => {
  console.log("[SERVER] ===== STILL RUNNING AFTER 10 SECONDS ===== ");
}, 10000);

console.log("🔥 Process keep-alive scheduled! Should never exit now.");

// Prevent unhandled rejections from crashing the process
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

// Prevent uncaught exceptions from immediately crashing
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
