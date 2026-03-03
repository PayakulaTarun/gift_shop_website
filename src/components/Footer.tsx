import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-luxury-black border-t border-warm-white/5 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-heading text-xl text-warm-white mb-4">
              Gift<span className="text-gradient-gold">Studio</span>
            </h3>
            <p className="font-body text-sm text-warm-white/50 leading-relaxed">
              Crafting personalized gifts that turn your memories into timeless treasures.
            </p>
          </div>
          <div>
            <h4 className="font-ui text-sm font-semibold text-warm-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Shop All", "Customize", "Best Sellers", "About Us"].map((link) => (
                <a key={link} href="#" className="font-body text-sm text-warm-white/50 hover:text-gold transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-ui text-sm font-semibold text-warm-white mb-4">Categories</h4>
            <div className="flex flex-col gap-2">
              {["Photo Gifts", "LED Gifts", "Crystal Gifts", "Wooden Engravings"].map((link) => (
                <a key={link} href="#" className="font-body text-sm text-warm-white/50 hover:text-gold transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-ui text-sm font-semibold text-warm-white mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/919999999999" className="flex items-center gap-2 text-sm text-warm-white/50 hover:text-green-400 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href="https://instagram.com" className="flex items-center gap-2 text-sm text-warm-white/50 hover:text-pink-400 transition-colors">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <span className="flex items-center gap-2 text-sm text-warm-white/50">
                <Mail className="w-4 h-4" /> hello@giftstudio.com
              </span>
              <span className="flex items-center gap-2 text-sm text-warm-white/50">
                <MapPin className="w-4 h-4" /> Mumbai, India
              </span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-warm-white/5 text-center">
          <p className="font-body text-xs text-warm-white/30">
            © 2026 GiftStudio. All rights reserved. Crafted with love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
