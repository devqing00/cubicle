import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/HeroSection";
import DifferentiatorSection from "@/components/sections/DifferentiatorSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";
import PolicySection from "@/components/sections/PolicySection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DifferentiatorSection />
        <HowItWorksSection />
        <PricingSection />
        <PolicySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
