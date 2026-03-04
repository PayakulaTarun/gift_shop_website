/**
 * migrate.ts — Run Drizzle migrations programmatically.
 *
 * Usage: tsx src/db/migrate.ts
 * This is safe to run multiple times (idempotent).
 */
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
    console.log("⏳  Running database migrations…");
    try {
        await migrate(db, {
            migrationsFolder: path.join(__dirname, "migrations"),
        });
        console.log("✅  Migrations complete.");
    } catch (err) {
        console.error("❌  Migration failed:", err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigrations();
