import { Link, useLocation } from 'react-router-dom';
import { Home, GlassWater, Building2, Phone, Briefcase } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFF8ED]/95 backdrop-blur-lg border-t border-[#E8D9BD] py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            pathname === '/' ? 'text-[#701A1A]' : 'text-[#7A6B56]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* Menu / Flavors */}
        <Link
          to="/menu"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            pathname.startsWith('/menu') || pathname.startsWith('/products') ? 'text-[#701A1A]' : 'text-[#7A6B56]'
          }`}
        >
          <GlassWater className="w-5 h-5" />
          <span>Flavors</span>
        </Link>

        {/* Prominent Center Franchise CTA Button */}
        <Link
          to="/franchise"
          className="relative -top-5 flex flex-col items-center group"
          aria-label="Franchise Opportunity"
        >
          <div className="w-14 h-14 rounded-full bg-[#701A1A] text-white flex items-center justify-center shadow-lg shadow-[#701A1A]/40 border-4 border-[#FFF8ED] group-hover:scale-105 group-hover:bg-[#E6392F] transition-all">
            <Briefcase className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-display tracking-wider font-black text-[#701A1A] mt-0.5">
            FRANCHISE
          </span>
        </Link>

        {/* About Us */}
        <Link
          to="/story"
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            pathname === '/story' || pathname === '/about' ? 'text-[#701A1A]' : 'text-[#7A6B56]'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span>About</span>
        </Link>

        {/* Call Hotline */}
        <a
          href="tel:8237522072"
          className="flex flex-col items-center gap-1 text-[11px] font-bold text-[#7A6B56] hover:text-[#701A1A]"
        >
          <Phone className="w-5 h-5" />
          <span>Call Us</span>
        </a>

      </div>
    </div>
  );
}
