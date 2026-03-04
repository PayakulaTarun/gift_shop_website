/**
 * StripePayment.tsx — Phase 6 Payment Integration.
 *
 * Provides a secure, luxury checkout experience using Stripe Elements.
 */
import React from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
    Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import { useUpdatePaymentStatus } from '@/hooks/usePayment';
import { toast } from 'sonner';

// Re-use the formatPrice utility or define local
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

// Initialize Stripe outside of component to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_sample");

const CheckoutForm = ({ orderId, amount, onSuccess }: { orderId: string, amount: number, onSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const updatePayment = useUpdatePaymentStatus();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // In a real app, this would be a URL on your site.
                // For this demo, we handle the result in-place.
                return_url: window.location.href,
            },
            redirect: 'if_required',
        });

        if (error) {
            toast.error(error.message || "Payment failed.");
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Confirm with backend
            try {
                await updatePayment.mutateAsync(orderId);
                toast.success("Payment successful!");
                onSuccess();
            } catch (err) {
                toast.error("Payment recorded but status update failed. Please contact support.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-warm-white/5 border border-warm-white/10 p-6 rounded-2xl mb-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-warm-white/40 text-sm font-ui">Amount to Pay</span>
                    <span className="text-gold font-heading text-xl">{formatPrice(amount)}</span>
                </div>

                {/* Stripe Element Injection */}
                <div className="stripe-element-container py-2 text-left">
                    <PaymentElement options={{ layout: 'tabs' }} />
                </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-warm-white/30 uppercase tracking-widest justify-center mb-4">
                <ShieldCheck className="w-3 h-3" /> Secure SSL Encrypted Payment
            </div>

            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-gold hover:bg-gold/90 text-luxury-black font-bold h-14 rounded-xl text-lg transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
                {isProcessing ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Finalizing...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Pay {formatPrice(amount)}
                    </span>
                )}
            </Button>
        </form>
    );
};

interface PaymentWrapperProps {
    clientSecret: string;
    orderId: string;
    amount: number;
    onSuccess: () => void;
}

export const StripePayment = ({ clientSecret, orderId, amount, onSuccess }: PaymentWrapperProps) => {
    return (
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Elements
                stripe={stripePromise}
                options={{
                    clientSecret,
                    appearance: {
                        theme: 'night',
                        variables: {
                            colorPrimary: '#D4AF37',
                            colorBackground: '#0F0F0F',
                            colorText: '#F5F5F0',
                            colorDanger: '#FF4D4D',
                            fontFamily: 'Instrument Sans, sans-serif',
                            borderRadius: '12px',
                        }
                    }
                }}
            >
                <CheckoutForm orderId={orderId} amount={amount} onSuccess={onSuccess} />
            </Elements>
        </div>
    );
};
