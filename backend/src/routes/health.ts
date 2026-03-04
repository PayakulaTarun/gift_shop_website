/**
 * routes/health.ts — Health check endpoint.
 *
 * GET /api/health — checks DB connectivity and returns uptime.
 * Used by Railway, Uptime Robot, and load balancers.
 */
import { Hono } from "hono";
import { pool } from "../db/index.js";

const router = new Hono();
const startTime = Date.now();

router.get("/", async (c) => {
    let dbStatus = "ok";

    try {
        const client = await pool.connect();
        await client.query("SELECT 1");
        client.release();
    } catch {
        dbStatus = "error";
    }

    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const status = dbStatus === "ok" ? "ok" : "degraded";

    return c.json(
        {
            status,
            db: dbStatus,
            uptime,
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version ?? "1.0.0",
        },
        dbStatus === "ok" ? 200 : 503
    );
});

export default router;
