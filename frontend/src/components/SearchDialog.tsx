import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { useCart } from '@/context/CartContext';
import { Input } from '@/components/ui/input';
import { PRODUCTS } from '@/data/products';

export const SearchDialog = () => {
    const { isSearchOpen, setIsSearchOpen, addToCart } = useCart();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogContent className="sm:max-w-lg bg-luxury-black text-warm-white border border-warm-white/10 p-0 gap-0 overflow-hidden">
                <div className="flex items-center border-b border-warm-white/10 px-4">
                    <Search className="w-5 h-5 text-warm-white/50 shrink-0" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for gifts, categories..."
                        className="flex-1 border-0 bg-transparent text-warm-white placeholder:text-warm-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-14 text-base"
                        autoFocus
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            className="p-2 text-warm-white/50 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="max-h-[60vh] overflow-y-auto w-full">
                    {query.trim() === '' ? (
                        <div className="p-6 text-center text-warm-white/50 text-sm font-ui">
                            Start typing to explore personalized gifts
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center text-warm-white/50 text-sm font-ui">
                            No results found for "{query}"
                        </div>
                    ) : (
                        <div className="py-2 flex flex-col w-full">
                            {filtered.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        navigate(`/product/${item.id}`);
                                    }}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-warm-white/5 w-full text-left transition-colors group"
                                >
                                    <div>
                                        <h4 className="font-heading text-lg text-warm-white group-hover:text-gold transition-colors">{item.name}</h4>
                                        <p className="font-ui text-sm text-warm-white/50">{item.category} • {item.displayPrice}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-warm-white/20 group-hover:text-gold transition-colors transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
