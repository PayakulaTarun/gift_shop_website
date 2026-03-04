/**
 * ProductManager.tsx — Inventory & Content Management (Phase 5).
 *
 * Allows admins to edit existing products or add new ones.
 * Directly modifies the 'products' table in the DB.
 */
import React from 'react';
import { z } from 'zod';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Image as ImageIcon,
    Check,
    X,
    Save,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { apiClient } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

const AdminProductManager = () => {
    const { data: productsData, isLoading } = useProducts({});
    const qc = useQueryClient();
    const [isEditing, setIsEditing] = React.useState<any>(null);
    const [search, setSearch] = React.useState("");

    const filteredProducts = productsData?.data.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing.id.startsWith('new-')) {
                // Post new
                const { id, ...payload } = isEditing;
                await apiClient.post('/api/admin/products', payload, z.unknown());
                toast.success("Product created successfully!");
            } else {
                // Patch existing
                await apiClient.patch(`/api/admin/products/${isEditing.id}`, isEditing, z.unknown());
                toast.success("Product updated successfully!");
            }
            qc.invalidateQueries({ queryKey: ["products"] });
            setIsEditing(null);
        } catch (err) {
            toast.error("Failed to save product.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        try {
            await apiClient.delete(`/api/admin/products/${id}`, z.unknown());
            toast.success("Product deleted.");
            qc.invalidateQueries({ queryKey: ["products"] });
        } catch (err) {
            toast.error("Delete failed.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-luxury-black text-warm-white">
            <Navbar />

            <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-heading text-warm-white">Inventory Manager</h1>
                            <p className="text-warm-white/50 text-sm font-ui">Manage your product catalog and pricing</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
                                <input
                                    type="text"
                                    placeholder="Find product..."
                                    className="bg-warm-white/5 border border-warm-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm font-ui focus:outline-none focus:border-gold/50 transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                className="bg-gold text-luxury-black rounded-full font-semibold"
                                onClick={() => setIsEditing({
                                    id: `new-${Date.now()}`,
                                    name: "",
                                    description: "",
                                    price: 0,
                                    displayPrice: "₹0",
                                    categoryId: "photo-frames",
                                    badge: null,
                                    inStock: true,
                                    stockQty: 99,
                                    customizationPrompt: "Add your customized text here",
                                    features: [],
                                    images: [{ url: "", alt: "", isPrimary: true }]
                                })}
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Product
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-gold" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts?.map((p) => (
                                <div key={p.id} className="bg-luxury-black-light border border-warm-white/10 rounded-3xl overflow-hidden group hover:border-gold/30 transition-all">
                                    <div className="h-48 relative">
                                        <img src={p.images[0]?.url} alt={p.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(p)}
                                                className="bg-luxury-black/60 backdrop-blur-md p-2 rounded-full text-warm-white hover:text-gold transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="bg-coral/20 backdrop-blur-md p-2 rounded-full text-coral hover:bg-coral hover:text-white transition-all shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-heading text-lg">{p.name}</h3>
                                            <Badge variant="outline" className="text-[10px] capitalize border-warm-white/10 text-warm-white/40">
                                                {p.categoryId.replace('-', ' ')}
                                            </Badge>
                                        </div>
                                        <p className="text-gold font-ui font-bold mb-4">{formatPrice(p.price)}</p>
                                        <div className="flex items-center gap-2 text-xs font-ui">
                                            <span className={`w-2 h-2 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-coral'}`} />
                                            <span className="text-warm-white/40">{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                                            <span className="text-warm-white/20">•</span>
                                            <span className="text-warm-white/40">{p.stockQty} units remaining</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Modal Overlay */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] bg-luxury-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-luxury-black border border-warm-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl animate-in fade-in zoom-in duration-300">
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-heading text-warm-white">
                                    {isEditing.id.startsWith('new-') ? 'New Product' : 'Edit Product'}
                                </h2>
                                <button type="button" onClick={() => setIsEditing(null)} className="text-warm-white/40 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-ui uppercase tracking-widest text-warm-white/40">Name</label>
                                        <input
                                            required
                                            className="w-full bg-warm-white/5 border border-warm-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold/50 outline-none"
                                            value={isEditing.name}
                                            onChange={(e) => setIsEditing({ ...isEditing, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-ui uppercase tracking-widest text-warm-white/40">Price (INR)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full bg-warm-white/5 border border-warm-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold/50 outline-none"
                                            value={isEditing.price}
                                            onChange={(e) => setIsEditing({ ...isEditing, price: Number(e.target.value), displayPrice: `₹${e.target.value}` })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-ui uppercase tracking-widest text-warm-white/40">Description</label>
                                    <textarea
                                        required
                                        className="w-full bg-warm-white/5 border border-warm-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold/50 outline-none h-24 resize-none"
                                        value={isEditing.description}
                                        onChange={(e) => setIsEditing({ ...isEditing, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-ui uppercase tracking-widest text-warm-white/40">Category</label>
                                        <select
                                            className="w-full bg-warm-white/5 border border-warm-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold/50 outline-none"
                                            value={isEditing.categoryId}
                                            onChange={(e) => setIsEditing({ ...isEditing, categoryId: e.target.value })}
                                        >
                                            <option value="photo-frames">Photo Frames</option>
                                            <option value="photo-clocks">Photo Clocks</option>
                                            <option value="led-gifts">LED Gifts</option>
                                            <option value="corporate-gifts">Corporate Gifts</option>
                                            <option value="personalized-mugs">Mugs</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-ui uppercase tracking-widest text-warm-white/40">Stock Qty</label>
                                        <input
                                            type="number"
                                            className="w-full bg-warm-white/5 border border-warm-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold/50 outline-none"
                                            value={isEditing.stockQty}
                                            onChange={(e) => setIsEditing({ ...isEditing, stockQty: Number(e.target.value), inStock: Number(e.target.value) > 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-ui uppercase tracking-widest text-warm-white/40">Primary Image URL</label>
                                    <input
                                        required
                                        className="w-full bg-warm-white/5 border border-warm-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold/50 outline-none font-mono"
                                        value={isEditing.images[0]?.url || ""}
                                        onChange={(e) => {
                                            const newImages = [...isEditing.images];
                                            if (!newImages[0]) newImages[0] = { url: "", alt: "", isPrimary: true };
                                            newImages[0].url = e.target.value;
                                            newImages[0].alt = isEditing.name;
                                            setIsEditing({ ...isEditing, images: newImages });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" className="flex-1 bg-gold text-luxury-black rounded-xl py-6 font-bold text-md">
                                    <Save className="w-5 h-5 mr-2" /> Save Changes
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsEditing(null)} className="rounded-xl py-6 border-warm-white/10 text-warm-white/60 hover:text-white">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AdminProductManager;
