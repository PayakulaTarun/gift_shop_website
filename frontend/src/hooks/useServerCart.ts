/**
 * useCart.ts — TanStack Query hooks for the server-backed cart (Phase 3).
 *
 * These hooks are ONLY active when the user is authenticated (VITE_API_URL set
 * + JWT present). The CartContext uses them internally; components don't call
 * these hooks directly.
 *
 * API:
 *   useServerCart()               — fetch full cart
 *   useAddToServerCart()          — add/increment item mutation
 *   useUpdateServerCartItem()     — patch quantity
 *   useRemoveServerCartItem()     — delete item
 *   useClearServerCart()          — delete all items
 *   useMergeCart()                — merge guest localStorage cart on login
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
export const ServerCartItemSchema = z.object({
    id: z.string(),
    productId: z.string(),
    name: z.string(),
    price: z.number().int(),
    displayPrice: z.string(),
    image: z.string(),
    quantity: z.number().int().positive(),
    customization: z.string().default(""),
});

export const ServerCartSchema = z.object({
    items: z.array(ServerCartItemSchema),
    total: z.number().int().nonnegative(),
});

export type ServerCartItem = z.infer<typeof ServerCartItemSchema>;
export type ServerCart = z.infer<typeof ServerCartSchema>;

const CART_KEY = ["server-cart"] as const;

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
export function useServerCart(enabled: boolean) {
    return useQuery({
        queryKey: CART_KEY,
        queryFn: () => apiClient.get("/api/cart", ServerCartSchema),
        enabled,
        staleTime: 60 * 1000,   // 1-min stale (cart changes come via mutations)
        retry: false,
    });
}

type AddItemPayload = { productId: string; quantity: number; customization: string };

export function useAddToServerCart() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: AddItemPayload) =>
            apiClient.post("/api/cart/items", payload, z.unknown()),
        onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    });
}

export function useUpdateServerCartItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
            apiClient.patch(`/api/cart/items/${id}`, { quantity }, z.unknown()),
        onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    });
}

export function useRemoveServerCartItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            apiClient.delete(`/api/cart/items/${id}`, z.unknown()),
        onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    });
}

export function useClearServerCart() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => apiClient.delete("/api/cart", z.unknown()),
        onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
    });
}

type MergePayload = { items: Array<{ productId: string; quantity: number; customization: string }> };

export function useMergeCart() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: MergePayload) =>
            apiClient.post("/api/cart/merge", payload, ServerCartSchema),
        onSuccess: (data) => {
            // Populate cache directly from merge response to avoid an extra fetch
            qc.setQueryData(CART_KEY, data);
        },
    });
}
