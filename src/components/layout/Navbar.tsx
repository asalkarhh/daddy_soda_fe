import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone, ArrowRight, UserCircle, ShoppingBag } from 'lucide-react';
import DaddyLogo from '@/components/common/DaddyLogo';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, setIsDrawerOpen } = useCart();

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT US', href: '/story' },
    { label: 'PRODUCTS & FLAVORS', href: '/menu' },
    { label: 'FRANCHISE MODEL', href: '/franchise', highlight: true },
    { label: 'BUILD SODA', href: '/build' },
    { label: 'LOCATIONS', href: '/stores' },
  ];

  return (
    <>
      {/* Top Banner Ticker */}
      <div className="bg-[#701A1A] text-[#FAF2E2] text-xs font-semibold py-2 px-4 border-b border-[#8B2500]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F8E71C] animate-ping shrink-0" />
            <span className="tracking-wide text-[11px] sm:text-xs truncate">
              <strong>EST. 1973</strong> • Himmat Beverages Pvt. Ltd. — Turnkey Soda Franchise Available Across India
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#FAF2E2] shrink-0">
            <a href="tel:8237522072" className="hover:text-white flex items-center gap-1.5 font-bold">
              <Phone className="w-3.5 h-3.5 text-[#F8E71C]" />
              <span>+91 8237522072</span>
            </a>
            <Link to="/login" className="hover:text-white flex items-center gap-1 font-semibold text-[#F5E9D0] bg-[#8B2500] px-2 py-0.5 rounded text-[11px]">
              <UserCircle className="w-3.5 h-3.5" />
              <span>Partner Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#FFF8ED]/95 backdrop-blur-md border-b border-[#E8D9BD] transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 sm:h-24 md:h-28 flex items-center justify-between gap-4">
          
          {/* Brand Logo Only at Left Corner */}
          <Link to="/" className="group flex items-center shrink-0 py-2" aria-label="Daddy Soda House Home">
            <DaddyLogo size="lg" variant="logo-only" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`font-display text-base tracking-wider transition-all relative py-1 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#701A1A] font-bold'
                      : 'text-[#171717] hover:text-[#701A1A]'
                  } ${link.highlight ? 'text-[#701A1A] font-bold' : ''}`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-[#F5A623] animate-pulse" />}
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#701A1A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Elements */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Phone Button */}
            <a
              href="tel:8237522072"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#171717] hover:border-[#701A1A] transition-colors shadow-xs"
              title="Call Franchise Team"
            >
              <Phone className="w-3.5 h-3.5 text-[#701A1A]" />
              <span className="font-semibold">8237522072</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-[#FAF2E2] border border-[#E8D9BD] text-[#171717] hover:border-[#701A1A] transition-colors shadow-xs cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#701A1A]" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E6392F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Primary CTA: Apply for Franchise */}
            <Link
              to="/franchise"
              className="hidden md:inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-[#701A1A] text-white font-display text-base tracking-wider hover:bg-[#E6392F] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 gap-1.5 whitespace-nowrap"
            >
              <span>APPLY FOR FRANCHISE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#171717] hover:bg-[#F5E9D0] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FFF8ED] border-b border-[#E8D9BD] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between font-display text-lg tracking-wider py-2.5 px-3 rounded-lg ${
                  pathname === link.href
                    ? 'bg-[#701A1A] text-white'
                    : 'text-[#171717] hover:bg-[#F5E9D0]'
                }`}
              >
                <span>{link.label}</span>
                {link.highlight && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#F8E71C] text-[#4A0E0E]">
                    HOT
                  </span>
                )}
              </Link>
            ))}
            
            <div className="pt-3 flex flex-col gap-2 border-t border-[#E8D9BD]">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#FAF2E2] text-xs font-bold text-[#171717] border border-[#E8D9BD]"
              >
                <UserCircle className="w-4 h-4 text-[#701A1A]" />
                <span>Franchise Partner Portal Login</span>
              </Link>

              <a
                href="tel:8237522072"
                className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF2E2] text-xs font-bold text-[#701A1A] border border-[#E8D9BD]"
              >
                <Phone className="w-4 h-4 text-[#701A1A]" />
                <span>📞 Hotline: 8237522072</span>
              </a>
              
              <Link
                to="/franchise"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-center rounded-xl text-lg tracking-wider"
              >
                APPLY FOR FRANCHISE
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
