/**
 * Tests for useProducts and useProduct hooks.
 *
 * Strategy:
 * - When VITE_API_URL is set (CI/live): hooks hit the real backend (integration tests).
 * - When VITE_API_URL is not set (offline): hooks use the static data fallback (unit tests).
 * - All assertions are written to be valid in BOTH modes.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import { useProducts, useProduct, useCategories } from "@/hooks/useProducts";

const HAS_BACKEND = Boolean(import.meta.env.VITE_API_URL);

// ---------------------------------------------------------------------------
// Test wrapper — provides a fresh QueryClient per test
// ---------------------------------------------------------------------------
function makeWrapper() {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: ReactNode }) =>
        createElement(QueryClientProvider, { client }, children);
}

// ---------------------------------------------------------------------------
// useProducts
// ---------------------------------------------------------------------------
describe(`useProducts (${HAS_BACKEND ? "API mode" : "static fallback"})`, () => {
    let wrapper: ReturnType<typeof makeWrapper>;

    beforeEach(() => {
        wrapper = makeWrapper();
    });

    it("returns a paginated product list with correct shape", async () => {
        const { result } = renderHook(() => useProducts({ limit: 5 }), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 10_000,
        });

        const data = result.current.data!;
        expect(data).toBeDefined();
        expect(typeof data.total).toBe("number");
        expect(data.total).toBeGreaterThan(0);
        expect(Array.isArray(data.data)).toBe(true);
        expect(data.data.length).toBeLessThanOrEqual(5);
        expect(data.data.length).toBeGreaterThan(0);
    });

    it("filters by category (LED Gifts)", async () => {
        const { result } = renderHook(
            () => useProducts({ category: "LED Gifts", limit: 100 }),
            { wrapper }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 10_000,
        });

        expect(result.current.data!.data.length).toBeGreaterThan(0);
        result.current.data!.data.forEach((p) => {
            expect(p.category).toBe("LED Gifts");
        });
    });

    it("filters by search query (mug)", async () => {
        const { result } = renderHook(
            () => useProducts({ q: "mug", limit: 100 }),
            { wrapper }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 10_000,
        });

        // All results should contain "mug" in some text field
        result.current.data!.data.forEach((p) => {
            const matchesName = p.name.toLowerCase().includes("mug");
            const matchesDesc = p.description.toLowerCase().includes("mug");
            const matchesCat = p.category.toLowerCase().includes("mug");
            expect(matchesName || matchesDesc || matchesCat).toBe(true);
        });
    });

    it("sorts by price ascending", async () => {
        const { result } = renderHook(
            () => useProducts({ sort: "price_asc", limit: 100 }),
            { wrapper }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 10_000,
        });

        const prices = result.current.data!.data.map((p) => p.price);
        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
        }
    });

    it("returns correctly typed Product objects", async () => {
        const { result } = renderHook(() => useProducts({ limit: 1 }), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 10_000,
        });

        const product = result.current.data!.data[0];
        expect(typeof product.id).toBe("string");
        expect(typeof product.name).toBe("string");
        expect(typeof product.price).toBe("number");
        expect(product.price).toBeGreaterThan(0);
        expect(typeof product.displayPrice).toBe("string");
        expect(typeof product.image).toBe("string");
        expect(typeof product.rating).toBe("number");
        expect(product.rating).toBeGreaterThanOrEqual(0);
        expect(product.rating).toBeLessThanOrEqual(5);
        expect(Array.isArray(product.features)).toBe(true);
        expect(typeof product.inStock).toBe("boolean");
    });
});

// ---------------------------------------------------------------------------
// useProduct
// ---------------------------------------------------------------------------
describe(`useProduct (${HAS_BACKEND ? "API mode" : "static fallback"})`, () => {
    let wrapper: ReturnType<typeof makeWrapper>;

    beforeEach(() => {
        wrapper = makeWrapper();
    });

    it("returns the correct product for a known ID", async () => {
        const { result } = renderHook(
            () => useProduct("photo-mug-custom"),
            { wrapper }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 10_000,
        });

        expect(result.current.data).toBeDefined();
        expect(result.current.data!.id).toBe("photo-mug-custom");
        expect(result.current.data!.name).toBe("Custom Photo Mug");
        expect(result.current.data!.price).toBe(349);
    });

    it("throws for an unknown ID", async () => {
        const { result } = renderHook(
            () => useProduct("does-not-exist"),
            { wrapper }
        );

        await waitFor(() => expect(result.current.isError).toBe(true), {
            timeout: 10_000,
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toMatch(/not found/i);
    });

    it("does not fetch when id is undefined", () => {
        const { result } = renderHook(
            () => useProduct(undefined),
            { wrapper }
        );

        expect(result.current.isFetching).toBe(false);
        expect(result.current.data).toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// useCategories
// ---------------------------------------------------------------------------
describe(`useCategories (${HAS_BACKEND ? "API mode" : "static fallback"})`, () => {
    it("returns a non-empty string array of category names", async () => {
        const wrapper = makeWrapper();
        const { result } = renderHook(() => useCategories(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 10_000,
        });

        const cats = result.current.data!;
        expect(Array.isArray(cats)).toBe(true);
        expect(cats.length).toBeGreaterThan(0);
        cats.forEach((c) => expect(typeof c).toBe("string"));

        // Static mode includes "All"; API mode doesn't — we don't assert exact contents
        // Both should include the core categories
        expect(cats).toEqual(expect.arrayContaining(["Photo Gifts", "LED Gifts"]));
    });
});
