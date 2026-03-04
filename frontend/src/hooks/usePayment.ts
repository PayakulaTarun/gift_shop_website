/**
 * usePayment.ts — Payment integration with Stripe.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { z } from "zod";

const IntentResponseSchema = z.object({
    clientSecret: z.string(),
    amount: z.number(),
    currency: z.string(),
    publishableKey: z.string(),
});

export function useCreateIntent() {
    return useMutation({
        mutationFn: async (orderId: string) =>
            apiClient.post("/api/payments/create-intent", { orderId }, IntentResponseSchema),
    });
}

/** Sync DB with payment status */
export function useUpdatePaymentStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (orderId: string) =>
            apiClient.post(`/api/payments/confirm/${orderId}`, {}, z.any()),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}
