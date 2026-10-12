import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BROCHURE_SODA_FLAVORS } from '@/data/franchiseData';

export default function ProductRangeShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF2E2] border-b border-[#E8D9BD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E6392F] mb-1">
              <Sparkles className="w-3.5 h-3.5 fill-[#E6392F]" />
              <span>THE OFFICIAL BROCHURE MENU</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-none">
              8 DEDICATED SODA TAPS + ICE-GOLA COUNTER
            </h2>
            <p className="font-display text-xl text-[#7A6B56] uppercase tracking-wide mt-2">
              Refreshing Taste. Consistent Quality. Proprietary Concentrates.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-display text-xl text-[#E6392F] hover:text-[#171717] transition-colors group"
          >
            <span>VIEW ALL FLAVORS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BROCHURE_SODA_FLAVORS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-[#E8D9BD] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF2E2] flex items-center justify-center text-3xl border border-[#E8D9BD] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#171717] text-[#FFF8ED]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-black text-[#171717] group-hover:text-[#E6392F] transition-colors">
                  {item.name}
                </h3>
                
                <p className="text-xs text-[#7A6B56] mt-1.5 mb-6 leading-relaxed">
                  {item.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8D9BD] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#A8987E]">Tier 3 / Tier 1 Price</span>
                  <p className="font-display text-2xl font-black text-[#171717]">
                    ₹{item.price} <span className="text-xs text-[#A8987E]">/ ₹{item.priceTier1}</span>
                  </p>
                </div>

                <Link
                  to={`/menu/${item.id}`}
                  className="px-4 py-2 rounded-xl bg-[#FAF2E2] hover:bg-[#E6392F] hover:text-white text-[#E6392F] font-display text-sm tracking-wider transition-all"
                >
                  DETAILS →
                </Link>
              </div>
            </div>
          ))}

          {/* Health & Zero Sugar Callout Card */}
          <div className="bg-gradient-to-br from-[#E6392F] to-[#171717] text-white rounded-3xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl border border-white/20 mb-4">
                🥗
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#F8E71C] text-[#171717] inline-block mb-2">
                HEALTH CONSCIOUS
              </span>
              <h3 className="font-display text-2xl font-black text-white">
                ZERO SUGAR & PREBIOTICS
              </h3>
              <p className="text-xs text-[#FAF2E2]/80 mt-1.5 leading-relaxed">
                Zero sugar variants and prebiotic gut-health craft sodas crafted for health-conscious consumers.
              </p>
            </div>

            <div className="pt-4 border-t border-white/20">
              <span className="text-xs font-bold text-[#E6A15C]">
                * Sugar-based variants also available.
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
