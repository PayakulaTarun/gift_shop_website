/**
 * cart.test.ts — Integration tests for the server cart API (Phase 3).
 *
 * Runs against the live backend (requires VITE_API_URL set).
 * Tests are skipped in static-only mode (no VITE_API_URL).
 *
 * Flow tested:
 *   1. Register a fresh test user
 *   2. GET  /api/cart         → empty
 *   3. POST /api/cart/items   → add item
 *   4. GET  /api/cart         → 1 item
 *   5. PATCH /api/cart/items/:id → update qty
 *   6. POST /api/cart/merge   → merge guest items
 *   7. DELETE /api/cart/items/:id → remove
 *   8. DELETE /api/cart       → clear
 *   9. GET  /api/cart (no auth) → 401
 */
import { describe, it, expect, beforeAll } from "vitest";

const API = import.meta.env.VITE_API_URL;
const SKIP = !API;

// ---------------------------------------------------------------------------
// Helper — register a unique test user and return an access token
// ---------------------------------------------------------------------------
async function registerTestUser() {
    const email = `cart-test-${Date.now()}@giftstudio.in`;
    const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "TestPass1", name: "Cart Test" }),
    });
    expect(res.status).toBe(201);
    const data = (await res.json()) as { accessToken: string };
    return { token: data.accessToken, email };
}

async function cartFetch(
    path: string,
    token: string,
    options: RequestInit = {}
) {
    return fetch(`${API}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers ?? {}),
        },
    });
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------
describe.skipIf(SKIP)("Server Cart API (requires live backend)", () => {
    let token = "";
    let cartItemId = "";
    // Use an actual product ID seeded in Phase 1
    const PRODUCT_ID = "photo-mug-custom";

    beforeAll(async () => {
        const user = await registerTestUser();
        token = user.token;
    });

    it("GET /api/cart → empty cart for new user", async () => {
        const res = await cartFetch("/api/cart", token);
        expect(res.status).toBe(200);
        const data = await res.json() as { items: unknown[]; total: number };
        expect(data.items).toEqual([]);
        expect(data.total).toBe(0);
    });

    it("POST /api/cart/items → adds a product", async () => {
        const res = await cartFetch("/api/cart/items", token, {
            method: "POST",
            body: JSON.stringify({ productId: PRODUCT_ID, quantity: 2, customization: "Name: Ravi" }),
        });
        expect(res.status).toBe(201);
        const item = await res.json() as { id: string; quantity: number };
        expect(item.id).toBeTruthy();
        expect(item.quantity).toBe(2);
        cartItemId = item.id;
    });

    it("GET /api/cart → returns 1 item with product details", async () => {
        const res = await cartFetch("/api/cart", token);
        expect(res.status).toBe(200);
        const data = await res.json() as { items: Array<{ productId: string; name: string; price: number }>; total: number };
        expect(data.items).toHaveLength(1);
        expect(data.items[0].productId).toBe(PRODUCT_ID);
        expect(data.items[0].name).toBe("Custom Photo Mug");
        expect(data.items[0].price).toBe(349);
        expect(data.total).toBe(349 * 2);
    });

    it("POST /api/cart/items again → increments quantity (same productId+customization)", async () => {
        await cartFetch("/api/cart/items", token, {
            method: "POST",
            body: JSON.stringify({ productId: PRODUCT_ID, quantity: 1, customization: "Name: Ravi" }),
        });
        const res = await cartFetch("/api/cart", token);
        const data = await res.json() as { items: Array<{ quantity: number }> };
        expect(data.items[0].quantity).toBe(3);
    });

    it("PATCH /api/cart/items/:id → updates quantity", async () => {
        const res = await cartFetch(`/api/cart/items/${cartItemId}`, token, {
            method: "PATCH",
            body: JSON.stringify({ quantity: 5 }),
        });
        expect(res.status).toBe(200);
        const item = await res.json() as { quantity: number };
        expect(item.quantity).toBe(5);
    });

    it("POST /api/cart/merge → merges guest items (max qty wins)", async () => {
        // Guest had qty=2 of same product; server has qty=5 → max=5 (no change)
        const res = await cartFetch("/api/cart/merge", token, {
            method: "POST",
            body: JSON.stringify({
                items: [{ productId: PRODUCT_ID, quantity: 2, customization: "Name: Ravi" }],
            }),
        });
        expect(res.status).toBe(200);
        const data = await res.json() as { items: Array<{ quantity: number }> };
        expect(data.items[0].quantity).toBe(5); // max(5, 2) = 5
    });

    it("DELETE /api/cart/items/:id → removes one item", async () => {
        const res = await cartFetch(`/api/cart/items/${cartItemId}`, token, {
            method: "DELETE",
        });
        expect(res.status).toBe(204);

        const afterRes = await cartFetch("/api/cart", token);
        const data = await afterRes.json() as { items: unknown[] };
        expect(data.items).toHaveLength(0);
    });

    it("adds two items then DELETE /api/cart clears all", async () => {
        await cartFetch("/api/cart/items", token, {
            method: "POST",
            body: JSON.stringify({ productId: PRODUCT_ID, quantity: 1, customization: "" }),
        });
        await cartFetch("/api/cart/items", token, {
            method: "POST",
            body: JSON.stringify({ productId: "led-shadow-lamp", quantity: 1, customization: "" }),
        });

        const clearRes = await cartFetch("/api/cart", token, { method: "DELETE" });
        expect(clearRes.status).toBe(204);

        const afterRes = await cartFetch("/api/cart", token);
        const data = await afterRes.json() as { items: unknown[] };
        expect(data.items).toHaveLength(0);
    });

    it("GET /api/cart without token → 401", async () => {
        const res = await fetch(`${API}/api/cart`);
        expect(res.status).toBe(401);
    });

    it("PATCH /api/cart/items/:id for wrong user → 404", async () => {
        // Register second user
        const { token: token2 } = await registerTestUser();
        // Add an item as user1 first
        const addRes = await cartFetch("/api/cart/items", token, {
            method: "POST",
            body: JSON.stringify({ productId: PRODUCT_ID, quantity: 1, customization: "user1" }),
        });
        const item = await addRes.json() as { id: string };

        // Try to PATCH as user2 → should 404 (userId mismatch)
        const res = await cartFetch(`/api/cart/items/${item.id}`, token2, {
            method: "PATCH",
            body: JSON.stringify({ quantity: 99 }),
        });
        expect(res.status).toBe(404);
    });
});
