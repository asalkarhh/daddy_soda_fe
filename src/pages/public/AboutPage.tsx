import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Building2,
  Users,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import DaddyLogo, { HimmatEmblem } from '@/components/common/DaddyLogo';
import { HIMMAT_GROUP_DETAILS, LEADERSHIP, CORE_USPS } from '@/data/franchiseData';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-6 pb-28">
      
      {/* 1. HERO HEADER: HIMMAT GROUP LEGACY + DADDY SODA HOUSE */}
      <section className="relative overflow-hidden pt-8 pb-16 border-b border-[#E8D9BD]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F] mb-6 shadow-xs">
            <HimmatEmblem className="w-4 h-4" />
            <span className="tracking-widest uppercase">ESTABLISHED 1973 • 50+ YEARS OF EXCELLENCE</span>
          </div>

          <div className="flex justify-center mb-6">
            <DaddyLogo size="xl" variant="full" />
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-[#171717] tracking-tight leading-[0.95] max-w-4xl mx-auto mb-4">
            HALF A CENTURY OF TRUST. <br />
            <span className="text-[#E6392F]">A NEW ERA OF SODA.</span>
          </h1>

          <p className="font-display text-xl sm:text-2xl text-[#7A6B56] uppercase tracking-wide max-w-2xl mx-auto">
            Refreshing Taste. Consistent Quality. Profitable Partnership.
          </p>

        </div>
      </section>

      {/* 2. ABOUT HIMMAT GROUP (FROM BROCHURE PAGE 3) */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Legacy Highlight Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Left Column: EST 1973 & Founder */}
          <div className="lg:col-span-4 bg-[#701A1A] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl border-4 border-[#8B2500]">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <HimmatEmblem className="w-64 h-64" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#E6A15C] font-black text-sm uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Foundational Legacy</span>
              </div>
              <p className="text-xs uppercase font-bold text-[#E6A15C] tracking-widest">EST.</p>
              <h2 className="font-display text-7xl sm:text-8xl font-black leading-none text-[#FFF8ED]">
                1973
              </h2>
              <div className="w-16 h-1 bg-[#E6A15C] my-4 rounded-full" />
              <h3 className="font-display text-3xl font-black text-[#FFF8ED]">
                Himmat Group of Business
              </h3>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs uppercase font-semibold text-[#E6A15C] tracking-wider">Founded by</p>
              <p className="font-display text-xl font-bold text-white mt-1">
                Late Shri Nandkumar Shivaji Kadam
              </p>
              <p className="text-xs text-[#FAF2E2]/80 mt-1">
                A visionary entrepreneur whose values of integrity, quality, and community trust laid the cornerstone for over 5 decades of growth across Maharashtra.
              </p>
            </div>
          </div>

          {/* Right Column: About Narrative & 4 Key Metric Cards */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
            
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8D9BD] shadow-sm">
              <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-[#E6392F] mb-2">
                <Building2 className="w-4 h-4" />
                <span>Corporate Heritage</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight mb-4">
                ABOUT HIMMAT GROUP
              </h2>
              <p className="text-base sm:text-lg text-[#7A6B56] leading-relaxed">
                From a single restaurant to a diversified business conglomerate — <strong>Himmat Group</strong> has built <strong>50+ years of trust, credibility, and entrepreneurial success across Maharashtra.</strong>
              </p>
            </div>

            {/* 4 Key Stat Cards from Brochure Page 3 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {HIMMAT_GROUP_DETAILS.stats.map((st) => (
                <div
                  key={st.label}
                  className="bg-[#FAF2E2] rounded-2xl p-5 text-center border border-[#E8D9BD] shadow-xs flex flex-col justify-center"
                >
                  <span className="font-display text-4xl sm:text-5xl font-black text-[#E6392F] leading-none">
                    {st.value}
                  </span>
                  <span className="text-xs font-bold text-[#7A6B56] uppercase tracking-wider mt-2">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* 5 Business Verticals */}
        <div className="bg-[#FAF2E2] rounded-3xl p-8 sm:p-12 border border-[#E8D9BD] mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
              DIVERSIFIED CONGLOMERATE
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight mt-1">
              THE 5 BUSINESS VERTICALS
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B56] mt-2">
              Spanning retail, energy, financial services, hospitality, and modern beverage manufacturing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {HIMMAT_GROUP_DETAILS.verticals.map((v) => (
              <div
                key={v.name}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between ${
                  v.name.includes('Beverages')
                    ? 'border-2 border-[#E6392F] shadow-sm bg-[#FFF8ED]'
                    : 'border-[#E8D9BD]'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#FAF2E2] flex items-center justify-center text-2xl mb-4 border border-[#E8D9BD]">
                    {v.icon}
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#171717] leading-tight mb-2">
                    {v.name}
                  </h4>
                  <p className="text-xs text-[#7A6B56] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
                {v.name.includes('Beverages') && (
                  <div className="mt-4 pt-3 border-t border-[#E8D9BD]">
                    <span className="text-[10px] font-black uppercase text-[#E6392F] tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Home of Daddy Soda
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. LEADERSHIP SECTION (FROM BROCHURE PAGE 4) */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E6392F] mb-1">
              <Users className="w-4 h-4" />
              <span>EXECUTIVE BOARD</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight">
              OUR LEADERSHIP
            </h2>
            <p className="text-sm text-[#7A6B56]">
              Steered by visionary directors championing innovation and scalable retail franchises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8D9BD] shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Director Avatar Circle */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#701A1A] to-[#E6392F] p-1 shadow-md mb-6 relative">
                  <div className="w-full h-full rounded-full bg-[#FAF2E2] flex items-center justify-center font-display text-3xl font-black text-[#701A1A] border-2 border-white">
                    {leader.initials}
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-[#171717] mb-2">
                  {leader.name}
                </h3>

                <div className="inline-block px-4 py-1 rounded-full bg-[#E6392F] text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
                  {leader.role}
                </div>

                <p className="text-sm text-[#7A6B56] leading-relaxed max-w-sm">
                  {leader.desc}
                </p>

                <div className="mt-6 pt-4 border-t border-[#E8D9BD] w-full flex items-center justify-center gap-2 text-xs font-bold text-[#171717]">
                  <HimmatEmblem className="w-4 h-4" />
                  <span>Himmat Beverages Pvt. Ltd.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. WHY DADDY SODA HOUSE / USP PILLARS (BROCHURE PAGES 5 & 6) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8D9BD] shadow-sm mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
              THE WINNING ADVANTAGE
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight mt-1">
              WHY DADDY SODA HOUSE?
            </h3>
            <p className="font-display text-xl text-[#7A6B56] uppercase tracking-wide mt-1">
              No expertise. No stress. Just business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_USPS.map((usp) => (
              <div
                key={usp.title}
                className="bg-[#FAF2E2] rounded-2xl p-6 border border-[#E8D9BD] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-4 border border-[#E8D9BD] shadow-xs">
                    {usp.icon}
                  </div>
                  <h4 className="font-display text-2xl font-bold text-[#171717] mb-3">
                    {usp.title}
                  </h4>
                  <ul className="space-y-2">
                    {usp.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2 text-xs sm:text-sm text-[#7A6B56]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. CALL TO ACTION: FRANCHISE & PARTNERSHIP */}
        <div className="bg-[#171717] text-white rounded-3xl p-8 sm:p-12 text-center border-4 border-[#E6392F] relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6392F] text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN INDIA&apos;S NEXT BIG SODA BRAND</span>
            </div>
            
            <h3 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight">
              PROFITABLE FOUNTAIN PARTNERSHIP
            </h3>
            
            <p className="text-sm sm:text-base text-[#FAF2E2]/90 leading-relaxed">
              Backed by 50+ years of Himmat Group legacy, powered by innovation, and built for entrepreneurs like you. Setup your Daddy Soda House in just 1.5 months.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/franchise"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E6392F] text-white font-display text-xl tracking-wider hover:bg-white hover:text-[#171717] transition-all shadow-lg hover:-translate-y-0.5"
              >
                <span>EXPLORE FRANCHISE OPPORTUNITY</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="tel:8237522072"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display text-xl tracking-wider transition-all border border-white/20"
              >
                <Phone className="w-5 h-5 text-[#E6392F]" />
                <span>CALL: 8237522072</span>
              </a>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-[#C4B79D]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#E6392F]" /> himmat.beverages1290@gmail.com
              </span>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default AboutPage;
