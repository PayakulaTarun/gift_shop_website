/**
 * OrderManager.tsx — Platform-wide Order Management (Phase 5).
 *
 * Allows admins to view all orders and update their statuses.
 */
import React from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Calendar,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Loader2,
    ChevronDown,
    ExternalLink
} from 'lucide-react';
import { useAllOrders, useUpdateStatus } from '@/hooks/useAdmin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'delivered': return <CheckCircle2 className="w-3.5 h-3.5" />;
        case 'shipped': return <Truck className="w-3.5 h-3.5" />;
        case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
        default: return <Clock className="w-3.5 h-3.5" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'shipped': return 'bg-gold/10 text-gold border-gold/20';
        case 'cancelled': return 'bg-coral/10 text-coral border-coral/20';
        case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        default: return 'bg-warm-white/10 text-warm-white/40 border-warm-white/20';
    }
};

const AdminOrderManager = () => {
    const { data: orders, isLoading } = useAllOrders();
    const updateMut = useUpdateStatus();
    const [search, setSearch] = React.useState("");

    const filteredOrders = orders?.filter(o =>
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const handleStatusUpdate = (orderId: string, status: string) => {
        updateMut.mutate({ id: orderId, status });
    };

    return (
        <div className="min-h-screen flex flex-col bg-luxury-black text-warm-white">
            <Navbar />

            <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-heading text-warm-white">Master Order List</h1>
                            <p className="text-warm-white/50 text-sm font-ui">Manage and track all customer orders</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 group-focus-within:text-gold transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search order or customer..."
                                    className="bg-warm-white/5 border border-warm-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm font-ui focus:outline-none focus:border-gold/50 min-w-[300px] transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-24 bg-warm-white/5 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-luxury-black-light border border-warm-white/10 rounded-3xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-warm-white/5 border-b border-warm-white/10">
                                            <th className="px-6 py-4 text-xs font-ui uppercase tracking-wider text-warm-white/40">Order</th>
                                            <th className="px-6 py-4 text-xs font-ui uppercase tracking-wider text-warm-white/40">Customer</th>
                                            <th className="px-6 py-4 text-xs font-ui uppercase tracking-wider text-warm-white/40">Amount</th>
                                            <th className="px-6 py-4 text-xs font-ui uppercase tracking-wider text-warm-white/40">Status</th>
                                            <th className="px-6 py-4 text-xs font-ui uppercase tracking-wider text-warm-white/40 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-warm-white/5">
                                        {filteredOrders?.map((order) => (
                                            <tr key={order.id} className="hover:bg-warm-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-heading text-warm-white group-hover:text-gold transition-colors">#{order.orderNumber}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Calendar className="w-3 h-3 text-warm-white/30" />
                                                            <span className="text-[10px] text-warm-white/40 font-ui whitespace-nowrap">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-ui text-warm-white/80">{order.customerName}</p>
                                                        <p className="text-xs text-warm-white/30 font-ui truncate max-w-[150px]">{order.customerEmail}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-heading text-gold">{formatPrice(order.totalAmount)}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={`flex items-center gap-1.5 w-fit capitalize font-ui text-[10px] px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gold/10 hover:text-gold transition-all">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-luxury-black border border-warm-white/10 rounded-xl text-warm-white font-ui shadow-2xl">
                                                                <div className="px-2 py-1.5 text-[10px] text-warm-white/40 uppercase tracking-widest">Set Status</div>
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'confirmed')} className="text-xs hover:bg-gold/10 hover:text-gold focus:bg-gold/10 focus:text-gold cursor-pointer rounded-lg">Confirm Order</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')} className="text-xs hover:bg-gold/10 hover:text-gold focus:bg-gold/10 focus:text-gold cursor-pointer rounded-lg">Mark as Shipped</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'delivered')} className="text-xs hover:bg-emerald-500/10 hover:text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer rounded-lg">Mark as Delivered</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="text-xs hover:bg-coral/10 hover:text-coral focus:bg-coral/10 focus:text-coral cursor-pointer rounded-lg">Cancel Order</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <button
                                                            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gold/10 text-warm-white/30 hover:text-gold transition-all"
                                                            title="Chat with Customer"
                                                            onClick={() => {
                                                                const msg = encodeURIComponent(`Hi ${order.customerName}, about your Order #${order.orderNumber}...`);
                                                                window.open(`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${msg}`, '_blank');
                                                            }}
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredOrders?.length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-warm-white/30 font-ui italic">No orders found matching "{search}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminOrderManager;
