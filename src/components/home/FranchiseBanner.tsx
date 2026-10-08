import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { HimmatEmblem } from '@/components/common/DaddyLogo';
import FranchiseRoiCalculator from '@/components/franchise/FranchiseRoiCalculator';

export default function FranchiseBanner() {
  return (
    <section className="py-16 sm:py-24 bg-[#171717] text-white border-y-4 border-[#701A1A] relative overflow-hidden">
      {/* Subtle Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6392F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E6A15C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701A1A] text-[#FAF2E2] text-xs font-bold uppercase tracking-wider">
              <HimmatEmblem className="w-4 h-4" />
              <span>FRANCHISE OPPORTUNITY • Daddy SODA HOUSE</span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]">
              OWN A PROFITABLE <br />
              <span className="text-[#F8E71C]">SODA FOUNTAIN FRANCHISE</span>
            </h2>

            <p className="text-sm sm:text-base text-[#FAF2E2]/90 leading-relaxed max-w-xl">
              Turnkey draft soda dispensing business backed by 50+ years of Himmat Group legacy. Low barrier to entry, no chef required, remote CCTV & POS tracking, and 18–24 months expected ROI.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#242424] border border-[#3A3A3A]">
                <span className="text-[10px] uppercase font-bold text-[#C4B79D] block">Franchise Fee</span>
                <span className="font-display text-2xl font-bold text-[#F8E71C]">₹2,00,000*</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#242424] border border-[#3A3A3A]">
                <span className="text-[10px] uppercase font-bold text-[#C4B79D] block">Investment</span>
                <span className="font-display text-2xl font-bold text-white">₹12L – ₹25L</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#242424] border border-[#3A3A3A] col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-[#C4B79D] block">Expected ROI</span>
                <span className="font-display text-2xl font-bold text-emerald-400">18–24 Mo</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/franchise"
                className="px-8 py-4 rounded-xl bg-[#E6392F] text-white font-display text-xl tracking-wider hover:bg-white hover:text-[#171717] transition-all shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>EXPLORE FRANCHISE MODEL</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:8237522072"
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display text-lg tracking-wider transition-all border border-white/20 flex items-center gap-2"
              >
                <Phone className="w-5 h-5 text-[#E6392F]" />
                <span>8237522072</span>
              </a>
            </div>
          </div>

          {/* Right Feature Highlights */}
          <div className="lg:col-span-5 bg-[#242424] rounded-3xl p-8 border border-[#3A3A3A] space-y-5">
            <h3 className="font-display text-2xl font-bold text-white">
              THE EASIEST BUSINESS TO RUN
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Exclusive Flavor Factory</strong>
                  <span className="text-[#C4B79D]">Own manufacturing plant & proprietary concentrates ensure consistent taste.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Tech-Driven Operations</strong>
                  <span className="text-[#C4B79D]">Smart POS with per-glass sales tracking and remote CCTV monitoring on mobile app.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Plug & Play in 1.5 Months</strong>
                  <span className="text-[#C4B79D]">Full onboarding, machine installation, SOP training, and grand opening support.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3A3A3A] text-xs text-[#A8987E]">
              <p className="font-bold text-[#E6A15C]">Himmat Beverages Pvt. Ltd. | Est. 1973</p>
              <p>Directors: Milind Nandkumar Kadam & Ketan Nandkumar Kadam</p>
            </div>
          </div>

        </div>

        {/* Interactive Calculator Block below */}
        <div className="mt-14 pt-12 border-t border-[#333333]">
          <FranchiseRoiCalculator />
        </div>

      </div>
    </section>
  );
}
