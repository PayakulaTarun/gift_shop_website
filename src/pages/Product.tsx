import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { CartSheet } from "@/components/CartSheet";
import { SearchDialog } from "@/components/SearchDialog";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { toast } from "sonner";

const Product = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [customText, setCustomText] = useState("");
    const { addToCart } = useCart();

    const product = PRODUCTS.find(p => p.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col pt-16 section-warm-white">
                <Navbar />
                <main className="flex-1 container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
                    <h1 className="font-heading text-4xl text-luxury-black mb-4">Product Not Found</h1>
                    <p className="font-body text-luxury-black/60 mb-8">The gift you are looking for doesn't exist or has been removed.</p>
                    <Link to="/shop" className="btn-gold">
                        Return to Shop
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const handleAddToCart = () => {
        const itemToAdd = {
            name: product.name,
            price: product.price,
            displayPrice: product.displayPrice,
            image: product.image,
            customization: customText.trim() ? customText : undefined
        };

        // Add the specific quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(itemToAdd);
        }

        toast.success(`${quantity}x ${product.name} added to your bag`);
        setCustomText(""); // Reset text field after successful add
    };

    return (
        <div className="min-h-screen flex flex-col pt-16 bg-warm-white selection:bg-gold/20">
            <Navbar />

            <main className="flex-1 container mx-auto px-6 py-12">
                <div className="mb-8">
                    <Link to="/shop" className="inline-flex items-center gap-2 font-ui text-sm text-luxury-black/60 hover:text-gold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Shop
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl overflow-hidden bg-white shadow-soft border border-border/50 sticky top-24 aspect-[4/5] md:aspect-square"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-8"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="font-ui text-xs bg-luxury-black text-warm-white px-3 py-1 rounded-full uppercase tracking-wider">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1.5 font-ui text-sm text-luxury-black/70">
                                    <Star className="w-4 h-4 fill-gold text-gold" />
                                    <span className="font-semibold text-luxury-black">{product.rating}</span>
                                    <span>({product.reviewsCount} reviews)</span>
                                </div>
                            </div>

                            <h1 className="font-heading text-4xl md:text-5xl text-luxury-black leading-tight mb-4">
                                {product.name}
                            </h1>

                            <p className="font-heading text-3xl text-gold">
                                {product.displayPrice}
                            </p>
                        </div>

                        <p className="font-body text-luxury-black/70 text-lg leading-relaxed border-b border-border/50 pb-8">
                            {product.description}
                        </p>

                        {/* Customization Options */}
                        <div className="space-y-4">
                            <label className="font-heading text-lg text-luxury-black block">
                                Personalization Details
                            </label>
                            <p className="font-ui text-sm text-luxury-black/70 -mt-2">
                                {product.customizationPrompt}
                            </p>
                            <textarea
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder="Start typing here..."
                                className="w-full h-24 p-4 rounded-xl border border-border/50 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-luxury-black/80 resize-none transition-all"
                            />
                            <p className="font-ui text-xs text-luxury-black/50">
                                Please double check spelling. Our team will contact you on WhatsApp to confirm details before crafting.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/50">
                            <div className="flex items-center border border-border/50 bg-white rounded-full p-1 w-fit h-14">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-full flex items-center justify-center text-luxury-black/70 hover:text-luxury-black hover:bg-warm-white rounded-full transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-ui text-lg font-semibold text-luxury-black">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-full flex items-center justify-center text-luxury-black/70 hover:text-luxury-black hover:bg-warm-white rounded-full transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 h-14 bg-luxury-black text-warm-white rounded-full font-heading text-lg flex items-center justify-center gap-2 hover:bg-gold hover:text-luxury-black transition-all shadow-lg hover:shadow-gold/20 group"
                            >
                                <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                Add to Bag
                            </button>

                            <button className="h-14 w-14 flex shrink-0 items-center justify-center border border-border/50 rounded-full hover:bg-warm-white hover:text-coral transition-all text-luxury-black/50 bg-white">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-6 mt-2 border-t border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <h4 className="font-heading text-sm text-luxury-black">Premium Quality</h4>
                                    <p className="font-ui text-xs text-luxury-black/60">Crafted with precision</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                                    <Truck className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <h4 className="font-heading text-sm text-luxury-black">Fast Delivery</h4>
                                    <p className="font-ui text-xs text-luxury-black/60">Doorstep shipping</p>
                                </div>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="pt-8">
                            <h3 className="font-heading text-xl text-luxury-black mb-4">Product Features</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-luxury-black/80 font-body text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </motion.div>
                </div>
            </main>

            <Footer />
            <FloatingActions />
            <CartSheet />
            <SearchDialog />
        </div>
    );
};

export default Product;
