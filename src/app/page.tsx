"use client";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/HeroSection";
import DifferentiatorSection from "@/components/sections/DifferentiatorSection";
import ParallaxStatementSection from "@/components/sections/ParallaxStatementSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import PolicySection from "@/components/sections/PolicySection";
import CTASection from "@/components/sections/CTASection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Home() {
  // Synchronized Lenis + GSAP ScrollTrigger ticker spine
  useSmoothScroll();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DifferentiatorSection />
        <ParallaxStatementSection />
        <HowItWorksSection />
        <PricingSection />
        <PolicySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
