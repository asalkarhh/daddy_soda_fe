import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HimmatEmblem } from '@/components/common/DaddyLogo';
import { HIMMAT_GROUP_DETAILS, LEADERSHIP } from '@/data/franchiseData';

export default function HimmatLegacySection() {
  return (
    <section className="py-16 sm:py-24 bg-[#FFF8ED] border-b border-[#E8D9BD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F] mb-2">
              <HimmatEmblem className="w-4 h-4" />
              <span>A VENTURE OF HIMMAT GROUP OF BUSINESS • EST. 1973</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-none">
              BACKED BY 50+ YEARS OF LEGACY
            </h2>
            <p className="font-display text-xl text-[#7A6B56] uppercase tracking-wide mt-2">
              From a single Business to a diversified business conglomerate across Maharashtra.
            </p>
          </div>

          <Link
            to="/story"
            className="inline-flex items-center gap-2 font-display text-xl text-[#E6392F] hover:text-[#171717] transition-colors group"
          >
            <span>DISCOVER OUR STORY</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {HIMMAT_GROUP_DETAILS.stats.map((st) => (
            <div
              key={st.label}
              className="bg-white rounded-3xl p-6 border border-[#E8D9BD] text-center shadow-xs hover:shadow-md transition-all flex flex-col justify-center items-center"
            >
              <span className="font-display text-5xl sm:text-6xl font-black text-[#E6392F] leading-none">
                {st.value}
              </span>
              <span className="text-xs font-bold text-[#7A6B56] uppercase tracking-wider mt-2">
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Founder & Leadership Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Founder Box */}
          <div className="lg:col-span-4 bg-[#E6392F] text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs uppercase font-bold text-[#E6A15C] tracking-widest block mb-1">
                OUR INSPIRATION & FOUNDER
              </span>
              <h3 className="font-display text-3xl font-black text-white">
                Late Shri Nandkumar Shivaji Kadam
              </h3>
              <p className="text-xs text-[#FAF2E2]/80 mt-3 leading-relaxed">
                Founded the enterprise in 1973 with unrelenting commitment to consumer trust and quality. Today, that legacy powers the explosive growth of Himmat Beverages and Daddy Soda House.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/20 flex items-center gap-2 text-xs font-bold text-[#E6A15C]">
              <HimmatEmblem className="w-4 h-4" />
              <span>Himmat Group of Business (Est. 1973)</span>
            </div>
          </div>

          {/* Directors Box */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 border border-[#E8D9BD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
                  EXECUTIVE BOARD LEADERSHIP
                </span>
                <span className="text-xs font-bold text-[#7A6B56]">
                  Himmat Beverages Pvt. Ltd.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {LEADERSHIP.map((leader) => (
                  <div key={leader.name} className="bg-[#FAF2E2] rounded-2xl p-5 border border-[#E8D9BD]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#E6392F] text-white flex items-center justify-center font-display text-xl font-black">
                        {leader.initials}
                      </div>
                      <div>
                        <h4 className="font-display text-xl font-bold text-[#171717] leading-tight">
                          {leader.name}
                        </h4>
                        <span className="text-[11px] font-bold text-[#E6392F] uppercase">
                          {leader.role}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#7A6B56] leading-relaxed">
                      {leader.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8D9BD] flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="font-bold text-[#171717]">
                5 Verticals: Enterprise • Petroleum • Finance • Liquors • Beverages
              </span>
              <Link
                to="/franchise"
                className="font-display text-base text-[#E6392F] hover:underline font-bold"
              >
                Franchise Partnership Inquiries →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
