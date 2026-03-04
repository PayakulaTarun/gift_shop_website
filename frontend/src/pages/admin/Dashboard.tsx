/**
 * Dashboard.tsx — Administrative Overview (Phase 5).
 *
 * Displays key metrics: Revenue, Orders, Users.
 * Shows a status breakdown chart and recent activity summary.
 */
import React from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Users as UsersIcon,
    IndianRupee,
    TrendingUp,
    Package,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdmin';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
    <div className="bg-luxury-black-light border border-warm-white/10 rounded-3xl p-6 hover:border-gold/30 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-ui px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-coral/10 text-coral'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}
                </div>
            )}
        </div>
        <div>
            <p className="text-warm-white/40 text-xs font-ui uppercase tracking-wider mb-1">{title}</p>
            <p className="text-2xl font-heading text-warm-white">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { data: stats, isLoading, isError } = useAdminStats();

    return (
        <div className="min-h-screen flex flex-col bg-luxury-black text-warm-white">
            <Navbar />

            <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading text-warm-white">Admin Dashboard</h1>
                                <p className="text-warm-white/50 text-sm font-ui">Manage your platform and track performance</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => window.location.href = '/admin/orders'}
                                className="bg-warm-white/5 border border-warm-white/10 text-warm-white/70 hover:text-gold px-4 py-2 rounded-full text-xs font-ui transition-all"
                            >
                                View All Orders
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 rounded-3xl bg-warm-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Total Revenue"
                                    value={formatPrice(stats?.totalRevenue || 0)}
                                    icon={IndianRupee}
                                    trend="up"
                                    trendValue="+12%"
                                />
                                <StatCard
                                    title="Total Orders"
                                    value={stats?.totalOrders || 0}
                                    icon={ShoppingBag}
                                    trend="up"
                                    trendValue="+5"
                                />
                                <StatCard
                                    title="Total Customers"
                                    value={stats?.totalUsers || 0}
                                    icon={UsersIcon}
                                />
                                <StatCard
                                    title="Avg. Order Value"
                                    value={formatPrice(Math.round((stats?.totalRevenue || 0) / (stats?.totalOrders || 1)))}
                                    icon={TrendingUp}
                                />
                            </div>

                            {/* Status Breakdown Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-luxury-black-light border border-warm-white/10 rounded-3xl p-8">
                                    <h3 className="text-xl font-heading mb-6">Order Status Breakdown</h3>
                                    <div className="space-y-6">
                                        {stats?.statusBreakdown.map((item: any) => (
                                            <div key={item.status} className="space-y-2">
                                                <div className="flex justify-between text-sm font-ui">
                                                    <span className="capitalize text-warm-white/60">{item.status}</span>
                                                    <span className="text-warm-white font-medium">{item.count} orders</span>
                                                </div>
                                                <div className="h-2 bg-warm-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${item.status === 'delivered' ? 'bg-emerald-500' :
                                                                item.status === 'shipped' ? 'bg-gold' :
                                                                    item.status === 'pending' ? 'bg-amber-500' :
                                                                        item.status === 'cancelled' ? 'bg-coral' : 'bg-warm-white/20'
                                                            }`}
                                                        style={{ width: `${(item.count / (stats.totalOrders || 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-luxury-black-light border border-warm-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-heading mb-2">Inventory Sync</h4>
                                    <p className="text-sm font-ui text-warm-white/40 mb-6">
                                        Automated stock management is currently active.
                                    </p>
                                    <button
                                        className="w-full bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-luxury-black py-3 rounded-2xl text-sm font-ui font-semibold transition-all"
                                        onClick={() => window.location.href = '/admin/products'}
                                    >
                                        Manage Products
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
