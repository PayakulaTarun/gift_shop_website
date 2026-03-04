/**
 * orders.test.ts — Integration tests for the Order System (Phase 4).
 *
 * Runs against the live backend (requires VITE_API_URL set).
 *
 * Flow tested:
 *   1. Register a fresh test user
 *   2. Add items to cart
 *   3. POST /api/orders → Success
 *   4. GET /api/cart → Should be empty
 *   5. GET /api/orders → contains the new order
 */
import { describe, it, expect, beforeAll } from "vitest";

const API = import.meta.env.VITE_API_URL;
const SKIP = !API;

async function registerTestUser() {
    const email = `order-test-${Date.now()}@giftstudio.in`;
    const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "TestPass1", name: "Order Test" }),
    });
    expect(res.status).toBe(201);
    const data = (await res.json()) as { accessToken: string };
    return { token: data.accessToken, email };
}

async function authedFetch(path: string, token: string, options: RequestInit = {}) {
    return fetch(`${API}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers ?? {}),
        },
    });
}

describe.skipIf(SKIP)("Order System API (requires live backend)", () => {
    let token = "";
    const PRODUCT_ID = "photo-mug-custom";

    beforeAll(async () => {
        const user = await registerTestUser();
        token = user.token;
    });

    it("creates an order from cart and clears cart", async () => {
        // 1. Add item to cart
        await authedFetch("/api/cart/items", token, {
            method: "POST",
            body: JSON.stringify({ productId: PRODUCT_ID, quantity: 2, customization: "Order Test" }),
        });

        // 2. Create Order
        const orderRes = await authedFetch("/api/orders", token, {
            method: "POST",
            body: JSON.stringify({
                customerName: "Ravi Teja",
                customerEmail: "ravi@example.com",
                customerPhone: "9876543210",
                shippingAddress: "Street 10, Hyderabad",
            }),
        });
        expect(orderRes.status).toBe(201);
        const orderData = await orderRes.json();
        expect(orderData.orderNumber).toMatch(/^GS-\d+/);
        expect(orderData.totalAmount).toBe(349 * 2);

        // 3. Verify cart is empty
        const cartRes = await authedFetch("/api/cart", token);
        const cartData = await cartRes.json();
        expect(cartData.items).toHaveLength(0);

        // 4. Verify order appears in history
        const historyRes = await authedFetch("/api/orders", token);
        const historyData = await historyRes.json();
        expect(historyData).toHaveLength(1);
        expect(historyData[0].orderNumber).toBe(orderData.orderNumber);
        expect(historyData[0].items).toHaveLength(1);
        expect(historyData[0].items[0].productName).toBe("Custom Photo Mug");
    });

    it("fails to create order with empty cart", async () => {
        const res = await authedFetch("/api/orders", token, {
            method: "POST",
            body: JSON.stringify({
                customerName: "No Cart",
                customerEmail: "no@example.com",
                customerPhone: "0000000000",
            }),
        });
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe("Cart is empty");
    });
});
