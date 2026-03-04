/**
 * Orders.tsx — User's Order History Page (Phase 4).
 *
 * Displays a list of recent orders with status, total, and items.
 * Uses TanStack Query for data fetching.
 */
import React from 'react';
import { Package, Calendar, Clock, ChevronRight, ShoppingBag, ExternalLink } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'cancelled': return 'bg-coral/10 text-coral border-coral/20';
        case 'shipped': return 'bg-gold/10 text-gold border-gold/20';
        default: return 'bg-warm-white/10 text-warm-white/60 border-warm-white/20';
    }
};

const Orders = () => {
    const { data: orders, isLoading, isError } = useOrders();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-luxury-black text-warm-white selection:bg-gold/20">
            <AnnouncementBar />
            <Navbar />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-heading text-warm-white">Your Orders</h1>
                            <p className="text-warm-white/50 text-sm font-ui">Track status and view history</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-3xl bg-warm-white/5 animate-pulse border border-warm-white/10" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-20 rounded-3xl bg-warm-white/5 border border-coral/20 p-8">
                            <p className="text-coral mb-4 font-ui">Failed to load order history.</p>
                            <Button variant="outline" className="border-coral text-coral hover:bg-coral hover:text-white" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    ) : !orders || orders.length === 0 ? (
                        <div className="text-center py-20 rounded-3xl bg-warm-white/5 border border-warm-white/10 p-8">
                            <div className="w-20 h-20 rounded-full bg-warm-white/5 flex items-center justify-center text-warm-white/20 mx-auto mb-6">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-heading mb-2">No orders yet</h3>
                            <p className="text-warm-white/50 mb-8 max-w-xs mx-auto text-sm font-ui">
                                Once you place your first gift order, it will appear here for you to track.
                            </p>
                            <Button
                                className="bg-gold text-luxury-black rounded-full px-8"
                                onClick={() => window.location.href = '/shop'}
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="group rounded-3xl bg-luxury-black-light border border-warm-white/10 overflow-hidden hover:border-gold/30 transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                            <div className="space-y-1">
                                                <p className="text-gold font-ui font-bold text-lg">#{order.orderNumber}</p>
                                                <div className="flex items-center gap-3 text-xs text-warm-white/40 font-ui">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <Badge variant="outline" className={`capitalize font-ui ${getStatusColor(order.status)} px-4 py-1 rounded-full`}>
                                                {order.status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm font-ui">
                                                    <div className="flex-1 pr-4">
                                                        <span className="text-warm-white/80">{item.productName}</span>
                                                        <span className="text-warm-white/40 mx-2">×</span>
                                                        <span className="text-warm-white/40">{item.quantity}</span>
                                                        {item.customization && (
                                                            <p className="text-[10px] text-gold/60 italic mt-0.5 mt-1">
                                                                "{item.customization}"
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="text-warm-white/60 font-medium">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator className="my-6 bg-warm-white/5" />

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-warm-white/40 font-ui uppercase tracking-wider mb-1">Total Paid</p>
                                                <p className="text-xl font-heading text-gold">{formatPrice(order.totalAmount)}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full border-warm-white/10 bg-warm-white/5 hover:bg-gold hover:text-luxury-black transition-all group"
                                                onClick={() => {
                                                    const message = encodeURIComponent(`Hi! Checking status of Order #${order.orderNumber}`);
                                                    window.open(`https://wa.me/919951710569?text=${message}`, '_blank');
                                                }}
                                            >
                                                Support <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Orders;
