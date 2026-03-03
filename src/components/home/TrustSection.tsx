import { motion } from "framer-motion";
import { Diamond, Paintbrush, ShieldCheck } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const trustItems = [
  { icon: Diamond, title: "Premium Materials", desc: "Only the finest quality for your precious memories" },
  { icon: Paintbrush, title: "Personalized Designs", desc: "Each gift crafted uniquely just for you" },
  { icon: ShieldCheck, title: "Trusted Local Store", desc: "Loved by thousands of happy customers" },
];

const TrustSection = () => {
  const ref = useScrollReveal();

  return (
    <section id="trust" className="section-warm-white py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {trustItems.map((item, i) => (
            <div key={item.title} className="scroll-reveal" style={{ transitionDelay: `${i * 150}ms` }}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-warm-white rounded-2xl p-8 text-center shadow-soft border border-border"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-heading text-xl text-luxury-black mb-2">{item.title}</h3>
                <p className="font-body text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
