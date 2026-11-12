import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BROCHURE_SODA_FLAVORS } from '@/data/franchiseData';

// Select 7 showcase flavours spanning key taste profiles
const SHOWCASE_IDS = [
  'blue-cauraco',
  'mojito',
  'jeera-masala',
  'super-cola',
  'lemon',
  'kalakhatta',
  'mango',
];

export default function ProductRangeShowcase() {
  const showcaseFlavors = SHOWCASE_IDS.map((id) =>
    BROCHURE_SODA_FLAVORS.find((f) => f.id === id)
  ).filter(Boolean) as typeof BROCHURE_SODA_FLAVORS;

  return (
    <section className="py-16 sm:py-24 bg-[#FAF2E2] border-b border-[#E8D9BD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-display text-xs sm:text-sm font-bold shadow-xs">
                Product Range
              </span>
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-[#171717] font-display text-xs sm:text-sm font-black uppercase tracking-wide shadow-xs">
                24 Dedicated Soda Machines + Ice-Gola Counter
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-[#171717] tracking-tight leading-none">
              24 DEDICATED SODA TAPS + ICE-GOLA
            </h2>
            <p className="font-display text-base sm:text-xl text-[#7A6B56] uppercase tracking-wide mt-2">
              Refreshing Taste. Consistent Quality. Proprietary Concentrates.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-display text-lg sm:text-xl text-[#E6392F] hover:text-[#171717] transition-colors group shrink-0"
          >
            <span>VIEW ALL 24 FLAVORS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 8-Card Grid: 7 Flavours + 1 Excitement "Show All" Card */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* 7 Showcase Flavour Cards */}
          {showcaseFlavors.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8D9BD] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Product Image */}
                {item.image && (
                  <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden bg-[#FAF2E2] mb-3.5 border border-[#E8D9BD]/60 group-hover:border-[#E6392F]/40 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: 'center 15%' }}
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 z-10 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-lg border border-white/60 shadow-xs">
                      {item.icon}
                    </div>
                    {item.badge && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#171717]/90 text-[#FFF8ED] backdrop-blur-xs">
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <h3 className="font-display text-xl sm:text-2xl font-black text-[#171717] group-hover:text-[#E6392F] transition-colors mb-4">
                  {item.name}
                </h3>
              </div>

              <div className="pt-3.5 border-t border-[#E8D9BD] flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8987E]">
                  Dedicated Soda Tap
                </span>

                <Link
                  to={`/menu/${item.id}`}
                  className="px-3 sm:px-4 py-1.5 rounded-xl bg-[#FAF2E2] hover:bg-[#E6392F] hover:text-white text-[#E6392F] font-display text-xs sm:text-sm tracking-wider transition-all"
                >
                  DETAILS →
                </Link>
              </div>
            </div>
          ))}

          {/* 8th Position: Exciting "SHOW ALL FLAVOURS" Card */}
          <Link
            to="/menu"
            className="group relative rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#E6392F] via-[#D12B22] to-[#171717] text-white shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden border-2 border-[#E6392F] cursor-pointer"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#F8E71C]/25 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              {/* Graphic Centerpiece - Matches identical h-40 sm:h-48 of product image */}
              <div className="relative w-full h-40 sm:h-48 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/15 p-3 flex flex-col items-center justify-center text-center mb-3.5 overflow-hidden group-hover:border-[#F8E71C]/40 transition-colors">
                {/* Header Tag */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#F8E71C] text-[#171717] flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5 fill-[#171717]" />
                    <span>+17 FLAVORS</span>
                  </span>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest">
                    FULL SUITE
                  </span>
                </div>

                {/* Big 24 counter */}
                <div className="flex flex-col items-center justify-center my-auto">
                  <span className="font-display text-5xl sm:text-6xl font-black text-[#F8E71C] leading-none group-hover:scale-105 transition-transform">
                    24
                  </span>
                  <span className="font-display text-[11px] sm:text-xs font-black uppercase tracking-widest text-white/90 mt-1">
                    TOTAL PRODUCTS
                  </span>
                </div>

                {/* Mini Emoji Ticker */}
                <div className="flex items-center gap-1.5 text-base sm:text-lg opacity-90">
                  <span>🍉</span>
                  <span>🥥</span>
                  <span>🍏</span>
                  <span>🫐</span>
                  <span>🍍</span>
                </div>
              </div>

              {/* Title - Matches identical typography and mb-4 of other cards */}
              <h3 className="font-display text-xl sm:text-2xl font-black text-white group-hover:text-[#F8E71C] transition-colors mb-4 leading-tight">
                VIEW ALL 24 FLAVORS
              </h3>
            </div>

            {/* Bottom Action Bar - Matches identical pt-3.5 border-t of other cards */}
            <div className="relative z-10 pt-3.5 border-t border-white/20 flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#F8E71C]">
                Dedicated Soda Suite
              </span>

              <div className="px-3 sm:px-4 py-1.5 rounded-xl bg-white group-hover:bg-[#F8E71C] text-[#E6392F] group-hover:text-[#171717] font-display text-xs sm:text-sm tracking-wider transition-all flex items-center gap-1 shadow-xs">
                <span>EXPLORE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

        </div>

        {/* Highlights & Footnote from brochure */}
        <div className="mt-12 pt-8 border-t border-[#E8D9BD] flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8833A] text-white font-display text-xs sm:text-sm font-bold shadow-sm">
              <span>🍃</span>
              <span>Zero Sugar Options</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#10B981] text-white font-display text-xs sm:text-sm font-bold shadow-sm">
              <span>💚</span>
              <span>Prebiotic Gut-Health Drinks</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284C7] text-white font-display text-xs sm:text-sm font-bold shadow-sm">
              <span>🍧</span>
              <span>NEW: Ice - Gola</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm font-semibold italic text-[#7A6B56] text-center">
            * Sugar based variants also Drink Ice-Gola available
          </p>
        </div>

      </div>
    </section>
  );
}
