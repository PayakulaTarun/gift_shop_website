import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { CartSheet } from "@/components/CartSheet";
import { SearchDialog } from "@/components/SearchDialog";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { toast } from "sonner";

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const { addToCart } = useCart();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (searchParams.get("category")) {
            setActiveCategory(searchParams.get("category") || "All");
        }
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === "All") return PRODUCTS;
        return PRODUCTS.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        setSearchParams(category === "All" ? {} : { category });
    };

    const handleAddToCart = (e: React.MouseEvent, product: typeof PRODUCTS[0]) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            name: product.name,
            price: product.price,
            displayPrice: product.displayPrice,
            image: product.image
        });
        toast.success(`${product.name} added to your bag`);
    };

    return (
        <div className="min-h-screen flex flex-col pt-16 section-warm-white">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl md:text-5xl text-luxury-black mb-4">Our Collections</h1>
                    <p className="font-body text-luxury-black/60 max-w-2xl mx-auto">
                        Discover our curated selection of personalized gifts, meticulously crafted to help you celebrate every special moment.
                    </p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`font-ui text-sm px-5 py-2 rounded-full transition-all ${activeCategory === category
                                    ? "bg-gold text-luxury-black font-semibold shadow-md"
                                    : "bg-white border border-border/50 text-luxury-black/70 hover:border-gold"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-border/50 group flex flex-col"
                        >
                            <Link to={`/product/${product.id}`} className="relative block overflow-hidden aspect-square">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                    <Star className="w-3 h-3 fill-gold text-gold" />
                                    <span className="font-ui text-xs font-semibold">{product.rating}</span>
                                </div>

                                <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/20 transition-all duration-300" />
                            </Link>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="font-ui text-xs text-luxury-black/50 uppercase tracking-wider">{product.category}</span>
                                </div>
                                <Link to={`/product/${product.id}`} className="font-heading text-lg text-luxury-black mb-2 hover:text-gold transition-colors line-clamp-1">
                                    {product.name}
                                </Link>
                                <div className="mt-auto flex items-center justify-between pt-4 pb-1">
                                    <span className="font-ui font-semibold text-gold text-lg">{product.displayPrice}</span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className="w-10 h-10 rounded-full bg-luxury-black text-warm-white flex items-center justify-center hover:bg-gold hover:text-luxury-black transition-colors shadow-sm"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="font-heading text-2xl text-luxury-black/60">No products found for this category.</h3>
                        <button onClick={() => handleCategoryClick("All")} className="mt-6 btn-outline-gold text-luxury-black">
                            View All Products
                        </button>
                    </div>
                )}
            </main>

            <Footer />
            <FloatingActions />
            <CartSheet />
            <SearchDialog />
        </div>
    );
};

export default Shop;
