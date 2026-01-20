import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use environment variable for database URL
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:bhimesh123@localhost:5432/taste_trek";

let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

// Set up global handlers FIRST
process.on('unhandledRejection', (reason) => {
  console.error('[GLOBAL] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[GLOBAL] Uncaught exception:', err);
});

// Initialize connection pool immediately
try {
  pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error("[DB POOL ERROR]:", err);
    // Don't re-emit or re-throw, just log
  });

  db = drizzle(pool, { schema });
  
  // Test connection asynchronously without blocking startup
  const testConnection = async () => {
    try {
      if (!pool) {
        console.error("[DB] Pool is null!");
        return;
      }
      const client = await pool.connect();
      try {
        console.log("[DB] Running query...");
        await client.query('SELECT NOW()');
        console.log("[DB] Query success!");
        console.log("✅ Database connected successfully");
      } catch (queryErr) {
        console.error("[DB] Query failed:", queryErr);
      } finally {
        try {
          console.log("[DB] Releasing client...");
          client.release();
          console.log("[DB] Client released!");
        } catch (releaseErr) {
          console.error("[DB] Error releasing client:", releaseErr);
        }
      }
    } catch (err) {
      console.error("❌ Database connection test failed:", err);
    }
  };
  
  // Start the test but don't wait for it
  testConnection()
    .then(() => {
      console.log("[DB] testConnection RESOLVED");
    })
    .catch(err => {
      console.error("❌ testConnection caught error:", err);
    })
    .finally(() => {
      console.log("[DB] testConnection FINALLY block");
    });
  
  console.log("[DB] Exporting db and pool modules");
} catch (err) {
  console.error("Failed to initialize database:", err);
  // Don't re-throw - let server continue even if db init fails
}

export { db, pool };
export let connection = { pool, db };
console.log("[DB] ===== DB MODULE FULLY LOADED =====");
