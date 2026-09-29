import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../components/public/PublicHeader';
import { PublicFooter } from '../components/public/PublicFooter';
import { PublicStatusBanner } from '../components/public/PublicStatusBanner';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Non-blocking API Status Banner */}
      <PublicStatusBanner />

      {/* Sticky Header */}
      <PublicHeader />

      {/* Main Public Page Content */}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
