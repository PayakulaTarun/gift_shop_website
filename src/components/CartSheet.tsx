import React from 'react';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

export const CartSheet = () => {
    const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    const handleCheckout = () => {
        // Generate text for WhatsApp
        if (cart.length === 0) return;
        let message = "Hi Creative Gifts Store! 🎁 I would like to place an order for the following items:\n\n";
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} x ${item.quantity} (${formatPrice(item.price * item.quantity)})\n`;
            if (item.customization) {
                message += `   Customization: "${item.customization}"\n`;
            }
        });
        message += `\nTotal Amount: ${formatPrice(cartTotal)}\n\n`;
        message += "Please let me know the next steps for payment and delivery. Thank you! 🙏";

        // Redirect to WhatsApp
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/919951710569?text=${encodedMessage}`, '_blank');
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-luxury-black text-warm-white border-l border-warm-white/10 p-0">
                <SheetHeader className="p-6 border-b border-warm-white/10">
                    <SheetTitle className="text-xl font-heading text-warm-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gold" />
                        Your Shopping Bag
                        <span className="ml-auto text-sm font-ui bg-gold/20 text-gold px-2.5 py-0.5 rounded-full">
                            {cart.reduce((count, item) => count + item.quantity, 0)} items
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-hidden">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-warm-white/5 flex items-center justify-center text-warm-white/20 mb-4">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <p className="text-lg font-heading">Your bag is empty</p>
                            <p className="text-sm font-ui text-warm-white/50">Looks like you haven't added any gifts yet.</p>
                            <Button
                                variant="outline"
                                className="mt-4 border-gold text-gold hover:bg-gold hover:text-luxury-black"
                                onClick={() => setIsCartOpen(false)}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <ScrollArea className="h-full">
                            <div className="p-6 space-y-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-warm-white/10 relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-heading text-sm">{item.name}</h4>
                                                    <p className="font-ui text-gold text-sm font-medium">{formatPrice(item.price)}</p>
                                                    {item.customization && (
                                                        <p className="font-ui text-xs text-warm-white/50 mt-1 italic break-all line-clamp-2">
                                                            "{item.customization}"
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-warm-white/40 hover:text-coral transition-colors p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-warm-white/20 rounded-md">
                                                    <button
                                                        className="p-1 px-2 text-warm-white/70 hover:text-white"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="font-ui text-sm w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        className="p-1 px-2 text-warm-white/70 hover:text-white"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-warm-white/10 bg-luxury-black-light/50">
                        <div className="space-y-3 mb-6 font-ui">
                            <div className="flex justify-between text-warm-white/70 text-sm">
                                <span>Subtotal</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-warm-white/70 text-sm">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <Separator className="bg-warm-white/10" />
                            <div className="flex justify-between text-warm-white text-lg font-heading">
                                <span>Total</span>
                                <span className="text-gold">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full bg-gold hover:bg-gold/90 text-luxury-black font-semibold h-12 text-md rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                onClick={handleCheckout}
                            >
                                Checkout via WhatsApp
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-warm-white/50 hover:text-warm-white font-ui text-sm"
                                onClick={clearCart}
                            >
                                Clear Bag
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
