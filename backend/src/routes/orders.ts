/**
 * orders.ts — Order management API (Phase 4).
 */
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/index.js";
import { orders, orderItems, cartItems, products } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = new Hono();

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const CreateOrderSchema = z.object({
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(10),
    shippingAddress: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateOrderNumber() {
    const prefix = "GS";
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digits
    return `${prefix}-${year}${random}`;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * POST /api/orders
 * Creates a new order from the current authenticated user's cart.
 */
router.post("/", requireAuth, zValidator("json", CreateOrderSchema), async (c) => {
    const user = c.get("user");
    const payload = c.req.valid("json");

    // 1. Fetch cart items
    const userCart = await db.query.cartItems.findMany({
        where: eq(cartItems.userId, user.sub),
        with: {
            product: true,
        },
    });

    if (userCart.length === 0) {
        return c.json({ error: "Cart is empty" }, 400);
    }

    // 2. Calculate total
    const totalAmount = userCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // 3. Create Order in transaction
    try {
        const orderResult = await db.transaction(async (tx) => {
            // A. Create Order
            const [newOrder] = await tx.insert(orders).values({
                orderNumber: generateOrderNumber(),
                userId: user.sub,
                totalAmount,
                customerName: payload.customerName,
                customerEmail: payload.customerEmail,
                customerPhone: payload.customerPhone,
                shippingAddress: payload.shippingAddress,
            }).returning();

            // B. Create Order Items
            for (const item of userCart) {
                await tx.insert(orderItems).values({
                    orderId: newOrder.id,
                    productId: item.productId,
                    productName: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    customization: item.customization,
                });
            }

            // C. Clear Cart
            await tx.delete(cartItems).where(eq(cartItems.userId, user.sub));

            return newOrder;
        });

        return c.json(orderResult, 201);
    } catch (err) {
        console.error("Order creation failed:", err);
        return c.json({ error: "Failed to create order" }, 500);
    }
});

/**
 * GET /api/orders
 * List authenticated user's orders
 */
router.get("/", requireAuth, async (c) => {
    const user = c.get("user");

    const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, user.sub),
        orderBy: [desc(orders.createdAt)],
        with: {
            items: true,
        },
    });

    return c.json(userOrders);
});

/**
 * GET /api/orders/:id
 * Get specific order details
 */
router.get("/:id", requireAuth, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    const order = await db.query.orders.findFirst({
        where: and(eq(orders.id, id), eq(orders.userId, user.sub)),
        with: {
            items: true,
        },
    });

    if (!order) {
        return c.json({ error: "Order not found" }, 404);
    }

    return c.json(order);
});

export default router;
