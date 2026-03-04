/**
 * db/index.ts — Database connection singleton.
 *
 * Uses node-postgres (pg) Pool + Drizzle ORM.
 * Pool is created once at module load and reused across all requests.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../lib/env.js";
import * as schema from "./schema.js";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,                   // max pool size
    idleTimeoutMillis: 30_000, // close idle connections after 30s
    connectionTimeoutMillis: 5_000,
});

// Surface connection errors immediately on startup
pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
});

export const db = drizzle(pool, { schema });
export { pool };
