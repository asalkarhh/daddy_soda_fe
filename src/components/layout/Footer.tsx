import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, ShieldCheck } from 'lucide-react';
import DaddyLogo, { HimmatEmblem } from '@/components/common/DaddyLogo';

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-[#F5E9D0] pt-16 pb-24 md:pb-16 border-t-4 border-[#701A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Manifesto Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#333333]">
          
          {/* Brand & Himmat Group Parentage */}
          <div className="md:col-span-5 space-y-4">
            <DaddyLogo size="xl" variant="logo-only" />
            
            <p className="text-sm text-[#C4B79D] leading-relaxed max-w-sm">
              Daddy Soda House is a proud venture of <strong>Himmat Beverages Pvt. Ltd.</strong>, backed by the 50+ year legacy of <strong>Himmat Group of Business (Est. 1973)</strong>.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#242424] border border-[#3A3A3A] space-y-1 text-xs">
              <div className="flex items-center gap-2 text-[#E6A15C] font-bold">
                <HimmatEmblem className="w-4 h-4" />
                <span>Himmat Beverages Pvt. Ltd.</span>
              </div>
              <p className="text-[#C4B79D]">
                Directors: <strong>Milind Nandkumar Kadam</strong> & <strong>Ketan Nandkumar Kadam</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#FFB000]">
              <Sparkles className="w-4 h-4" />
              <span>REFRESHING TASTE • CONSISTENT QUALITY • PROFITABLE PARTNERSHIP</span>
            </div>
          </div>

          {/* Franchise & Partnership Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display text-lg text-white tracking-wider">FRANCHISE</h4>
            <ul className="space-y-2 text-sm text-[#C4B79D]">
              <li>
                <Link to="/franchise" className="hover:text-[#E6392F] transition-colors text-[#F8E71C] font-bold">
                  Franchise Model ★
                </Link>
              </li>
              <li>
                <Link to="/franchise" className="hover:text-[#E6392F] transition-colors">
                  Tier 3 & Metro ROI
                </Link>
              </li>
              <li>
                <Link to="/franchise" className="hover:text-[#E6392F] transition-colors">
                  Apply for Franchise
                </Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-[#E6392F] transition-colors">
                  Himmat Group Legacy
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#E6392F] transition-colors">
                  8-Tap Product Range
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Menu Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display text-lg text-white tracking-wider">FLAVORS</h4>
            <ul className="space-y-2 text-sm text-[#C4B79D]">
              <li><Link to="/menu?cat=classic" className="hover:text-[#E6392F] transition-colors">Jeera Masala Soda</Link></li>
              <li><Link to="/menu?cat=citrus" className="hover:text-[#E6392F] transition-colors">Orange & Lemon Fizz</Link></li>
              <li><Link to="/menu?cat=citrus" className="hover:text-[#E6392F] transition-colors">Craft Mojito Soda</Link></li>
              <li><Link to="/menu?cat=limited" className="hover:text-[#E6392F] transition-colors">Rainbow Ice-Gola</Link></li>
              <li><Link to="/build" className="hover:text-[#E6392F] transition-colors">Build Custom Soda</Link></li>
            </ul>
          </div>

          {/* Contact & Get In Touch (Brochure Page 15) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-lg text-white tracking-wider">GET IN TOUCH</h4>
            <div className="space-y-2 text-xs text-[#C4B79D]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E6392F] shrink-0" />
                <a href="tel:8237522072" className="text-white hover:text-[#E6392F] font-bold text-sm">
                  8237522072
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#E6392F] shrink-0 mt-0.5" />
                <a href="mailto:himmat.beverages1290@gmail.com" className="text-white hover:text-[#E6392F] break-all">
                  himmat.beverages1290@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#242424] border border-[#3A3A3A] text-xs text-[#C4B79D] space-y-1">
              <span className="font-bold text-white block">Himmat Group Verticals</span>
              <p className="text-[11px]">Enterprise • Petroleum • Finance • Liquors • Beverages</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#8C806A] gap-4">
          <div>
            © {new Date().getFullYear()} Himmat Beverages Pvt. Ltd. | Daddy Soda House. All rights reserved. Est. 1973.
          </div>
          
          <div className="flex items-center gap-1.5 text-[#A8987E]">
            <span>Developed by</span>
            <a
              href="https://www.asalkar.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F8E71C] font-bold hover:underline hover:text-white transition-colors"
            >
              Asalkar Techworks Pvt Ltd
            </a>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-[#C4B79D]">
              <ShieldCheck className="w-4 h-4 text-[#FFB000]" /> Proprietary Concentrates &amp; Consistent Quality
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
