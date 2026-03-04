import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WHATSAPP_URL = "https://wa.me/919951710569";
const INSTAGRAM_URL = "https://www.instagram.com/creativegifts.attapur/";
const MAPS_URL = "https://maps.google.com/?q=Gowtham+Model+School+Cellar+Hyderguda+Main+Road+Gumma+Konda+Colony+Hyderabad+Telangana+500048";

const contactDetails = [
    {
        icon: Phone,
        label: "Phone / WhatsApp",
        value: "+91 99517 10569",
        href: "tel:+919951710569",
        color: "text-green-400",
        bg: "bg-green-400/10",
    },
    {
        icon: Mail,
        label: "Email",
        value: "creativegifts.at@gmail.com",
        href: "mailto:creativegifts.at@gmail.com",
        color: "text-gold",
        bg: "bg-gold/10",
    },
    {
        icon: Instagram,
        label: "Instagram",
        value: "@creativegifts.attapur",
        href: INSTAGRAM_URL,
        color: "text-pink-400",
        bg: "bg-pink-400/10",
    },
    {
        icon: MapPin,
        label: "Our Store",
        value: "Gowtham Model School Cellar, Near SVS Baker's, Hyderguda Main Road, Gumma Konda Colony, Hyderabad – 500048",
        href: MAPS_URL,
        color: "text-coral",
        bg: "bg-coral/10",
    },
];

const ContactSection = () => {
    const ref = useScrollReveal();

    return (
        <section id="contact" className="py-24 bg-warm-white" ref={ref}>
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 scroll-reveal">
                    <p className="font-ui text-gold text-sm tracking-[0.2em] uppercase mb-3">Find Us</p>
                    <h2 className="font-heading text-3xl md:text-5xl text-luxury-black mb-4">
                        Visit or <span className="text-gradient-gold italic">Contact</span> Us
                    </h2>
                    <p className="font-body text-luxury-black/60 text-lg max-w-lg mx-auto">
                        We're open daily! Stop by our store in Hyderabad or reach out on WhatsApp to place your order.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left — contact info */}
                    <div className="scroll-reveal space-y-5">

                        {/* Store hours banner */}
                        <div className="bg-luxury-black rounded-2xl p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                <Clock className="w-7 h-7 text-green-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="font-ui text-green-400 text-sm font-semibold">Open Now</span>
                                </div>
                                <p className="font-heading text-warm-white text-lg">Mon – Sun: 10:30 AM – 9:00 PM</p>
                                <p className="font-ui text-warm-white/50 text-xs mt-0.5">Open until 9:00 PM today</p>
                            </div>
                        </div>

                        {/* Contact cards */}
                        {contactDetails.map((item) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                whileHover={{ x: 4 }}
                                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-ui text-xs text-luxury-black/40 uppercase tracking-wider mb-1">{item.label}</p>
                                    <p className={`font-body text-sm text-luxury-black/80 group-hover:${item.color} transition-colors break-all`}>{item.value}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-luxury-black/20 group-hover:text-gold transition-colors shrink-0 mt-0.5" />
                            </motion.a>
                        ))}
                    </div>

                    {/* Right — WhatsApp CTA + Map embed */}
                    <div className="scroll-reveal space-y-6">

                        {/* WhatsApp CTA Card */}
                        <div className="bg-luxury-black rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-heading text-2xl text-warm-white mb-2">Order on WhatsApp</h3>
                            <p className="font-body text-warm-white/60 text-sm mb-6">
                                Send us a message with your requirements and we'll help you create the perfect personalized gift!
                            </p>
                            <motion.a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white font-heading text-lg px-8 py-4 rounded-full transition-colors shadow-lg shadow-green-500/30 w-full justify-center"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Chat Now — +91 99517 10569
                            </motion.a>
                            <p className="font-ui text-warm-white/30 text-xs mt-4">Usually responds in minutes ⚡</p>
                        </div>

                        {/* Address box with map link */}
                        <motion.a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.01 }}
                            className="block bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            {/* Fake map placeholder */}
                            <div className="h-40 bg-gradient-to-br from-warm-white to-border/30 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[radial-gradient(#d4af3730_1px,transparent_1px)] bg-[size:20px_20px]" />
                                <div className="text-center relative z-10">
                                    <MapPin className="w-10 h-10 text-coral mx-auto mb-2" />
                                    <p className="font-ui text-sm text-luxury-black/60">Click to open in Google Maps</p>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-heading text-luxury-black text-sm">Creative Gifts Store</p>
                                        <p className="font-body text-luxury-black/60 text-xs mt-1 leading-relaxed">
                                            Gowtham Model School Cellar, Near SVS Baker's, Hyderguda Main Road,
                                            Gumma Konda Colony, Hyderabad, Telangana 500048
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.a>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
