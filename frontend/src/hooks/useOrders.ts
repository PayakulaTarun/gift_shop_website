/**
 * useOrders.ts — TanStack Query hooks for the Order System (Phase 4).
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
export const OrderItemSchema = z.object({
    id: z.string(),
    productId: z.string().nullable(),
    productName: z.string(),
    price: z.number().int(),
    quantity: z.number().int(),
    customization: z.string().nullable(),
});

export const OrderSchema = z.object({
    id: z.string(),
    orderNumber: z.string(),
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
    totalAmount: z.number().int(),
    customerName: z.string(),
    customerEmail: z.string(),
    customerPhone: z.string(),
    shippingAddress: z.string().nullable(),
    createdAt: z.string(),
    items: z.array(OrderItemSchema),
});

export type Order = z.infer<typeof OrderSchema>;

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: () => apiClient.get("/api/orders", z.array(OrderSchema)),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => apiClient.get(`/api/orders/${id}`, OrderSchema),
        enabled: Boolean(id),
    });
}

export type CreateOrderPayload = {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress?: string;
};

export function useCreateOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateOrderPayload) =>
            apiClient.post("/api/orders", payload, OrderSchema),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] });
            qc.invalidateQueries({ queryKey: ["server-cart"] });
        },
    });
}
