import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, MessageCircle, Clock, Phone } from "lucide-react";
import { useState } from "react";

const AnnouncementBar = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-luxury-black border-b border-warm-white/5 relative z-50"
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-2 gap-2 overflow-x-auto scrollbar-none">
                        {/* Left: hours */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <Clock className="w-3 h-3 text-green-400" />
                            <span className="font-ui text-xs text-warm-white/60 whitespace-nowrap">
                                Open: <span className="text-green-400 font-semibold">10:30 AM – 9:00 PM</span>
                            </span>
                        </div>

                        {/* Center: main message */}
                        <div className="flex-1 text-center mx-4 hidden sm:block">
                            <span className="font-ui text-xs text-warm-white/50">
                                🎁&nbsp; Personalized gifts crafted with love — <span className="text-gold">Order on WhatsApp</span>
                            </span>
                        </div>

                        {/* Right: social + phone */}
                        <div className="flex items-center gap-3 shrink-0">
                            <a
                                href="tel:+919951710569"
                                className="flex items-center gap-1 font-ui text-xs text-warm-white/60 hover:text-gold transition-colors whitespace-nowrap"
                            >
                                <Phone className="w-3 h-3" />
                                +91 99517 10569
                            </a>
                            <a
                                href="https://www.instagram.com/creativegifts.attapur/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 font-ui text-xs text-pink-400 hover:text-pink-300 transition-colors whitespace-nowrap"
                            >
                                <Instagram className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">@creativegifts.attapur</span>
                                <span className="md:hidden">Instagram</span>
                            </a>
                            <a
                                href="https://wa.me/919951710569"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white font-ui text-xs px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                            >
                                <MessageCircle className="w-3 h-3" />
                                WhatsApp
                            </a>
                        </div>

                        {/* Close */}
                        <button
                            onClick={() => setVisible(false)}
                            className="shrink-0 text-warm-white/30 hover:text-warm-white/70 transition-colors ml-2"
                            aria-label="Close"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AnnouncementBar;
