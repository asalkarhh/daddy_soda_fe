import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { RewardsProvider } from '@/contexts/RewardsContext';

export const PublicLayout: React.FC = () => {
  return (
    <RewardsProvider>
      <div className="min-h-screen flex flex-col bg-[#FFF8ED] text-[#171717] antialiased">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileNav />
      </div>
    </RewardsProvider>
  );
};

export default PublicLayout;
