import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (desktop fixed, mobile drawer) */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content wrapper with margin for fixed desktop sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
