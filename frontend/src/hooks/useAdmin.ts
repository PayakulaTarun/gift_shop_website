/**
 * useAdmin.ts — TanStack Query hooks for the Admin Dashboard (Phase 5).
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { OrderSchema } from "./useOrders";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const StatusBreakdownSchema = z.object({
    status: z.string(),
    count: z.number().int(),
});

const AdminStatsSchema = z.object({
    totalRevenue: z.number(),
    totalOrders: z.number(),
    totalUsers: z.number(),
    statusBreakdown: z.array(StatusBreakdownSchema),
});

export type AdminStats = z.infer<typeof AdminStatsSchema>;

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch platform-wide analytics */
export function useAdminStats() {
    return useQuery({
        queryKey: ["admin", "stats"],
        queryFn: () => apiClient.get("/api/admin/stats", AdminStatsSchema),
    });
}

/** Fetch all orders for management */
export function useAllOrders() {
    return useQuery({
        queryKey: ["admin", "orders"],
        queryFn: () => apiClient.get("/api/admin/orders", z.array(OrderSchema)),
    });
}

/** Update an order's status */
export function useUpdateStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            apiClient.patch(`/api/admin/orders/${id}`, { status }, z.unknown()),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["admin", "orders"] });
            qc.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
}
