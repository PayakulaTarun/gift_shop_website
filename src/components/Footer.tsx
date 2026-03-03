import { Instagram, MessageCircle, Mail, MapPin, Phone, Clock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const WHATSAPP_URL = "https://wa.me/919951710569";
const INSTAGRAM_URL = "https://www.instagram.com/creativegifts.attapur/";

const Footer = () => {
  return (
    <footer className="bg-luxury-black border-t border-warm-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <h3 className="font-heading text-2xl text-warm-white tracking-wide">
                Creative <span className="text-gradient-gold">Gifts</span> Store
              </h3>
              <p className="font-ui text-xs text-warm-white/40 tracking-[0.15em] uppercase mt-0.5">
                Personalized Gifts Store
              </p>
            </div>
            <p className="font-body text-sm text-warm-white/50 leading-relaxed mb-5">
              Wrap your love in our stunning gifts! From unique designs to personalized touches, we make every moment memorable with the perfect present.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:creativegifts.at@gmail.com"
                className="w-9 h-9 rounded-full bg-warm-white/10 flex items-center justify-center text-warm-white hover:bg-gold/20 transition-colors hover:scale-110"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-ui text-sm font-semibold text-warm-white mb-5 tracking-wider uppercase">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Shop All Gifts", href: "/shop" },
                { label: "Customize Gift", href: "/#how-it-works" },
                { label: "Best Sellers", href: "/#best-sellers" },
                { label: "About Us", href: "/#trust" },
                { label: "Contact Us", href: "/#final-cta" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="font-body text-sm text-warm-white/50 hover:text-gold transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-ui text-sm font-semibold text-warm-white mb-5 tracking-wider uppercase">Gift Categories</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "📸 Photo Gifts", cat: "Photo Gifts" },
                { label: "💡 LED Gifts", cat: "LED Gifts" },
                { label: "💎 Crystal Gifts", cat: "Crystal Gifts" },
                { label: "🪵 Wooden Engravings", cat: "Wooden Engravings" },
                { label: "🎨 Artistic Gifts", cat: "Artistic Gifts" },
                { label: "🏠 Home Decor", cat: "Home Decor" },
              ].map((item) => (
                <a
                  key={item.cat}
                  href={`/shop?category=${encodeURIComponent(item.cat)}`}
                  className="font-body text-sm text-warm-white/50 hover:text-gold transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-ui text-sm font-semibold text-warm-white mb-5 tracking-wider uppercase">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:+919951710569`}
                className="flex items-start gap-3 text-sm text-warm-white/50 hover:text-gold transition-colors group"
              >
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span>+91 99517 10569</span>
              </a>
              <a
                href={`mailto:creativegifts.at@gmail.com`}
                className="flex items-start gap-3 text-sm text-warm-white/50 hover:text-gold transition-colors group"
              >
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span>creativegifts.at@gmail.com</span>
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-warm-white/50 hover:text-pink-400 transition-colors group"
              >
                <Instagram className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                <span>@creativegifts.attapur</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-warm-white/50">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span>Gowtham Model School Cellar, Near SVS Baker's, Hyderguda Main Road, Gumma Konda Colony, Hyderabad, Telangana 500048</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-warm-white/50">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-green-400 font-semibold">Open Now</p>
                  <p>Mon – Sun: 10:30 AM – 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-warm-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-warm-white/30">
            © 2026 Creative Gifts Store, Hyderabad. All rights reserved.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-ui px-4 py-2 rounded-full hover:bg-green-500/20 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Order on WhatsApp — +91 99517 10569
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
