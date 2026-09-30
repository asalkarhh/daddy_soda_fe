import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { CORE_USPS } from '@/data/franchiseData';

export default function WhyDaddySodaSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E8D9BD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-black uppercase tracking-widest text-[#701A1A] mb-2">
            <Zap className="w-3.5 h-3.5 fill-[#701A1A]" />
            <span>THE EASIEST BUSINESS TO RUN</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-none">
            WHY DADDY SODA HOUSE?
          </h2>

          <p className="font-display text-xl sm:text-2xl text-[#7A6B56] uppercase tracking-wide mt-2">
            No expertise. No stress. Just business.
          </p>
        </div>

        {/* 6 Core USPs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CORE_USPS.map((usp) => (
            <div
              key={usp.title}
              className="bg-[#FAF2E2] rounded-3xl p-7 border border-[#E8D9BD] shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl mb-5 border border-[#E8D9BD] shadow-xs">
                  {usp.icon}
                </div>
                <h3 className="font-display text-2xl font-black text-[#171717] mb-3">
                  {usp.title}
                </h3>
                <ul className="space-y-2.5">
                  {usp.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#7A6B56]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium text-[#171717]">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Action Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF2E2] border border-[#E8D9BD] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-display text-2xl sm:text-3xl font-black text-[#171717]">
              READY TO LAUNCH IN 1.5 MONTHS?
            </h4>
            <p className="text-xs sm:text-sm text-[#7A6B56]">
              Franchise fee of ₹2,00,000* + GST. Comprehensive setup, SOP training &amp; automated POS tracking included.
            </p>
          </div>
          <Link
            to="/franchise"
            className="px-6 py-3 rounded-xl bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-lg tracking-wider transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>CALCULATE ROI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
