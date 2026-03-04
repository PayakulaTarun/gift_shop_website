import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import OccasionsSection from "@/components/home/OccasionsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import Footer from "@/components/Footer";
import { CartSheet } from "@/components/CartSheet";
import { SearchDialog } from "@/components/SearchDialog";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <HeroSection />
      <TrustSection />
      <CategoriesSection />
      <BestSellersSection />
      <HowItWorksSection />
      <OccasionsSection />
      <TestimonialsSection />
      <ContactSection />
      <FinalCTASection />
      <Footer />
      <CartSheet />
      <SearchDialog />
    </div>
  );
};

export default Index;
