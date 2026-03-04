/**
 * routes/products.ts — Product & category endpoints.
 *
 * GET /api/products          — paginated, filterable list
 * GET /api/products/:id      — single product detail
 */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "../db/index.js";
import { products, categories } from "../db/schema.js";
import { eq, ilike, and, asc, desc, count, SQL } from "drizzle-orm";
import type { ProductRow } from "../db/schema.js";

const router = new Hono();

// ---------------------------------------------------------------------------
// Query param schema for GET /api/products
// ---------------------------------------------------------------------------
const listQuerySchema = z.object({
    category: z.string().optional(),
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(24),
    sort: z.enum(["price_asc", "price_desc", "rating_desc", "newest"]).optional(),
    inStock: z
        .string()
        .optional()
        .transform((v) => {
            if (v === "true") return true;
            if (v === "false") return false;
            return undefined;
        }),
});

// ---------------------------------------------------------------------------
// Helper: map DB row → API shape consumed by the frontend Product type
// ---------------------------------------------------------------------------
function toApiProduct(row: ProductRow & { category?: { name: string } | null }) {
    const imageList = row.images as Array<{ url: string; alt: string; isPrimary?: boolean }>;
    const primaryImage =
        imageList.find((img) => img.isPrimary)?.url ?? imageList[0]?.url ?? "";

    return {
        id: row.id,
        name: row.name,
        price: row.price,
        displayPrice: row.displayPrice,
        image: primaryImage,
        images: imageList,
        category: row.category?.name ?? row.categoryId,
        description: row.description,
        features: row.features as string[],
        rating: parseFloat(row.rating ?? "0"),
        reviewsCount: row.reviewsCount,
        customizationPrompt: row.customizationPrompt,
        badge: row.badge ?? undefined,
        inStock: row.inStock,
    };
}

// ---------------------------------------------------------------------------
// GET /api/products
// ---------------------------------------------------------------------------
router.get("/", zValidator("query", listQuerySchema), async (c) => {
    const { category, q, page, limit, sort, inStock } = c.req.valid("query");
    const offset = (page - 1) * limit;

    // Build WHERE conditions ─────────────────────────────────────────────────
    const conditions: SQL[] = [];

    if (category && category !== "All") {
        // Accept both category slug (led-gifts) and display name (LED Gifts)
        const cat = await db.query.categories.findFirst({
            where: (cats, { or, eq: eqFn }) =>
                or(eqFn(cats.id, category), eqFn(cats.name, category)),
        });
        if (cat) conditions.push(eq(products.categoryId, cat.id));
    }

    if (inStock !== undefined) {
        conditions.push(eq(products.inStock, inStock));
    }

    if (q) {
        conditions.push(ilike(products.name, `%${q}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // Sorting ────────────────────────────────────────────────────────────────
    let orderBy;
    switch (sort) {
        case "price_asc": orderBy = asc(products.price); break;
        case "price_desc": orderBy = desc(products.price); break;
        case "rating_desc": orderBy = desc(products.rating); break;
        case "newest": orderBy = desc(products.createdAt); break;
        default: orderBy = asc(products.createdAt); break;
    }

    // Run paginated data + total count in parallel ───────────────────────────
    const [rows, countRows] = await Promise.all([
        db.query.products.findMany({
            where,
            orderBy,
            limit,
            offset,
            with: { category: true },
        }),
        db
            .select({ total: count() })
            .from(products)
            .where(where),
    ]);

    const total = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.ceil(total / limit);
    const data = rows.map((r) => toApiProduct(r as ProductRow & { category?: { name: string } | null }));

    return c.json({ data, total, page, totalPages, limit });
});

// ---------------------------------------------------------------------------
// GET /api/products/:id
// ---------------------------------------------------------------------------
router.get("/:id", async (c) => {
    const id = c.req.param("id");

    const row = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: { category: true },
    });

    if (!row) {
        return c.json({ message: "Product not found", code: "NOT_FOUND" }, 404);
    }

    return c.json(toApiProduct(row as ProductRow & { category?: { name: string } | null }));
});

export default router;
