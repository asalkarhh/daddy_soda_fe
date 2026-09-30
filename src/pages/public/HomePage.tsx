import React from 'react';
import Hero from '@/components/home/Hero';
import ProductRangeShowcase from '@/components/home/ProductRangeShowcase';
import WhyDaddySodaSection from '@/components/home/WhyDaddySodaSection';
import HimmatLegacySection from '@/components/home/HimmatLegacySection';
import FranchiseBanner from '@/components/home/FranchiseBanner';
import CinematicSection from '@/components/home/CinematicSection';
import StoreLocatorCTA from '@/components/home/StoreLocatorCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8ED]">
      {/* 1. Landing Page Video Hero */}
      <Hero />
      
      {/* 2. 8 Dedicated Soda Machines + Ice-Gola Counter from Brochure */}
      <ProductRangeShowcase />
      
      {/* 3. Why Daddy Soda House - The Easiest Business to Run (6 USPs) */}
      <WhyDaddySodaSection />
      
      {/* 4. Himmat Group 50+ Years Legacy & Leadership Section */}
      <HimmatLegacySection />
      
      {/* 5. Franchise Opportunity Section & Interactive Financial ROI Calculator */}
      <FranchiseBanner />
      
      {/* 6. Craft Fountain Cinematic Flow */}
      <CinematicSection />
      
      {/* 7. Locations & Store Locator Network */}
      <StoreLocatorCTA />
    </div>
  );
};

export default HomePage;
