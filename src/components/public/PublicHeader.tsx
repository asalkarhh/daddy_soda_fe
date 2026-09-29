import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, LogIn, ChevronRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const PublicHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Flavours', path: '/products' },
    { label: 'Franchise', path: '/franchise' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg group"
            aria-label="Daddy Soda House Home"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-800 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                Daddy Soda <span className="text-teal-700">House</span>
              </span>
              <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
                Indian Soda & Franchise
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-teal-900 bg-teal-50 border border-teal-200/60 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/franchise"
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Enquire Franchise</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/50 text-slate-700 hover:text-teal-900 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              title="Internal Partner and Admin Portal"
            >
              <LogIn className="w-4 h-4 text-teal-700" />
              <span>Partner Login</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/login"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-700" />
              <span>Login</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-teal-100 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-teal-900 bg-teal-50 border border-teal-200/80 font-bold'
                      : 'text-slate-700 hover:text-teal-800 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Link
              to="/franchise"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-center flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Enquire for Franchise</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 text-slate-800 font-semibold text-center flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-teal-700" />
              <span>Partner Login</span>
            </Link>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Helpline: {siteConfig.contact.phoneDisplay}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
