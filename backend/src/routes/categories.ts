/**
 * routes/categories.ts — Category endpoints.
 *
 * GET /api/categories — ordered list of all categories
 */
import { Hono } from "hono";
import { db } from "../db/index.js";
import { categories } from "../db/schema.js";
import { asc } from "drizzle-orm";

const router = new Hono();

// GET /api/categories
router.get("/", async (c) => {
    const rows = await db
        .select()
        .from(categories)
        .orderBy(asc(categories.sort));

    return c.json(rows);
});

export default router;
