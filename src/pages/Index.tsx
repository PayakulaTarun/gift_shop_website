import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import OccasionsSection from "@/components/home/OccasionsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { CartSheet } from "@/components/CartSheet";
import { SearchDialog } from "@/components/SearchDialog";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <CategoriesSection />
      <BestSellersSection />
      <HowItWorksSection />
      <OccasionsSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
      <FloatingActions />
      <CartSheet />
      <SearchDialog />
    </div>
  );
};

export default Index;
