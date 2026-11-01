import React, { useState } from 'react';
import {
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  Send,
  Zap,
  MessageCircle,
} from 'lucide-react';
import DaddyLogo, { HimmatEmblem } from '@/components/common/DaddyLogo';
import FranchiseRoiCalculator from '@/components/franchise/FranchiseRoiCalculator';
import {
  SETUP_EQUIPMENT_INCLUDES,
  COMPANY_PROVIDES,
  FRANCHISEE_HANDLES,
  PATH_TO_PARTNERSHIP,
  CORE_USPS,
  BROCHURE_SODA_FLAVORS,
} from '@/data/franchiseData';
import { publicApi } from '@/api/public.api';

export const FranchisePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    tier: 'tier3',
    investmentReady: '12-15 Lakhs',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; phone?: string; email?: string } = {};
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Full Name must be at least 2 characters';
    }
    if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Mobile number must be exactly 10 digits';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const cleanMobile = formData.phone.replace(/\D/g, '').slice(-10);
      const res = await publicApi.submitEnquiry({
        fullName: formData.name.trim(),
        mobile: cleanMobile,
        email: formData.email.trim() || undefined,
        city: formData.city.trim() || undefined,
        message: `Model: ${formData.tier === 'tier3' ? 'Tier 3 (12-15L)' : 'Metro (15-25L)'} | Investment: ${formData.investmentReady} | Details: ${formData.comments.trim()}`,
      });

      let targetUrl = '';
      if (res?.data?.whatsAppUrl) {
        targetUrl = res.data.whatsAppUrl
          .replace('919876543210', '918237522072')
          .replace('9876543210', '918237522072');
      } else {
        const text = encodeURIComponent(
          `Hi Daddy Soda House team! I am ${formData.name} from ${formData.city || 'India'}. I want to apply for a franchise (Tier: ${formData.tier}, Investment: ${formData.investmentReady}).`
        );
        targetUrl = `https://wa.me/918237522072?text=${text}`;
      }
      setWhatsAppUrl(targetUrl);
      setSubmitted(true);
    } catch {
      const text = encodeURIComponent(
        `Hi Daddy Soda House team! I am ${formData.name} from ${formData.city || 'India'}. I want to apply for a franchise (Tier: ${formData.tier}, Investment: ${formData.investmentReady}).`
      );
      setWhatsAppUrl(`https://wa.me/918237522072?text=${text}`);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-6 pb-28">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER (BROCHURE PAGE 1 & 2)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#E6392F] text-white py-16 sm:py-24 border-b-4 border-[#C92A20]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Himmat Group & Franchise Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-[#E6A15C]/40 text-[#FAF2E2] text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <HimmatEmblem className="w-4 h-4" />
              <span>FRANCHISE OPPORTUNITY • EST. 1973</span>
            </div>

            {/* Logo and Slogan */}
            <div className="flex justify-center">
              <DaddyLogo size="xl" variant="full" dark={true} />
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95]">
              BUILD A HIGH PROFIT <br />
              <span className="text-[#F8E71C]">SODA FOUNTAIN BUSINESS</span>
            </h1>

            <p className="font-display text-xl sm:text-2xl text-[#FAF2E2] uppercase tracking-wider max-w-2xl mx-auto">
              Refreshing Taste. Consistent Quality. Profitable Partnership.
            </p>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 max-w-xl mx-auto backdrop-blur-xs text-xs sm:text-sm text-[#FAF2E2]/90">
              <p className="font-bold text-[#E6A15C]">
                Himmat Beverages Pvt. Ltd. (A Venture of Himmat Group of Business)
              </p>
              <p className="text-[11px] mt-0.5 text-[#C4B79D]">
                Directors: Milind Nandkumar Kadam &amp; Ketan Nandkumar Kadam
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#roi-breakdown"
                className="px-8 py-4 rounded-xl bg-white hover:bg-[#171717] text-[#E6392F] hover:text-white font-display text-xl font-bold tracking-wider transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>CALCULATE REVENUE &amp; ROI</span>
                <ChevronRight className="w-5 h-5" />
              </a>
              <a
                href="#inquiry-form"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#E6392F] font-display text-xl font-bold tracking-wider transition-all border-2 border-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer backdrop-blur-xs"
              >
                APPLY FOR FRANCHISE
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CORE USPs: WHY Daddy SODA HOUSE? (BROCHURE PAGES 5 & 6)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-black uppercase tracking-widest text-[#E6392F] mb-2">
            <Zap className="w-4 h-4 fill-[#E6392F]" />
            <span>THE EASIEST BUSINESS TO RUN</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-none">
            WHY Daddy SODA HOUSE?
          </h2>
          <p className="font-display text-xl sm:text-2xl text-[#7A6B56] uppercase tracking-wide mt-2">
            No expertise. No stress. Just business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_USPS.map((usp) => (
            <div
              key={usp.title}
              className="bg-white rounded-3xl p-7 border border-[#E8D9BD] shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#FAF2E2] flex items-center justify-center text-3xl mb-5 border border-[#E8D9BD]">
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
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. PRODUCT RANGE HIGHLIGHT: 8 SODA MACHINES + ICE-GOLA (PAGE 7 & 8)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#FAF2E2] border-y border-[#E8D9BD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-display text-xs sm:text-sm font-bold shadow-xs">
                  Product Range
                </span>
                <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-[#171717] font-display text-xs sm:text-sm font-black uppercase tracking-wide shadow-xs">
                  8 Dedicated Soda Machines + Ice-Gola Counter
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-none">
                COMPLETE OUTLET MENU SUITE
              </h2>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-[#E8D9BD] text-xs font-bold text-[#171717] shadow-xs shrink-0">
              🍧 Ice-Gola Counter — averaging 50+ sales/day
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {BROCHURE_SODA_FLAVORS.map((fl) => (
              <div
                key={fl.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8D9BD] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {fl.image && (
                    <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-[#FAF2E2] mb-3 border border-[#E8D9BD]/50">
                      <img
                        src={fl.image}
                        alt={fl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ objectPosition: 'center 15%' }}
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center text-base border border-white/60 shadow-xs">
                        {fl.icon}
                      </div>
                      {fl.badge && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-[#171717]/90 text-[#FFF8ED] backdrop-blur-xs">
                          {fl.badge}
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#171717] group-hover:text-[#E6392F] transition-colors">
                    {fl.name}
                  </h3>
                  <p className="text-xs text-[#7A6B56] mt-1 mb-3 line-clamp-2 leading-relaxed">
                    {fl.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8D9BD] flex items-center justify-between text-xs">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8987E]">
                    Dedicated Soda Tap
                  </span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    ✓ High Margin
                  </span>
                </div>
              </div>
            ))}
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

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE FINANCIAL MODEL / ROI CALCULATOR
          ───────────────────────────────────────────────────────────── */}
      <section id="roi-breakdown" className="scroll-mt-24 sm:scroll-mt-28 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FranchiseRoiCalculator />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SETUP & EQUIPMENT INCLUDES (BROCHURE PAGES 9 & 11)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-[#E8D9BD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
              TURNKEY DELIVERABLES
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-none mt-1">
              SETUP &amp; EQUIPMENT INCLUDES
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B56] mt-2">
              Everything required to open and operate a high-volume Daddy Soda House outlet from Day 1.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SETUP_EQUIPMENT_INCLUDES.map((eq) => (
              <div
                key={eq.name}
                className="bg-[#FAF2E2] rounded-2xl p-5 border border-[#E8D9BD] flex items-start gap-4 shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shrink-0 border border-[#E8D9BD] shadow-xs">
                  {eq.icon}
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-[#171717] leading-tight">
                    {eq.name}
                  </h4>
                  <p className="text-xs text-[#7A6B56] mt-1 leading-relaxed">
                    {eq.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. WHAT WE PROVIDE VS WHAT YOU DO (BROCHURE PAGE 13)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
            CLEAR OPERATIONAL RESPONSIBILITIES
          </span>
          <h3 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-none mt-1">
            WHAT WE PROVIDE VS WHAT YOU DO
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Company Provides Box */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#E6392F] shadow-md">
            <div className="flex items-center gap-3 pb-6 border-b border-[#E8D9BD] mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#E6392F] text-white flex items-center justify-center text-2xl shadow-sm">
                🏢
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-[#171717]">
                  COMPANY PROVIDES
                </h4>
                <p className="text-xs text-[#7A6B56]">Himmat Beverages Pvt. Ltd. Support</p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {COMPANY_PROVIDES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#171717] font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Franchisee Handles Box */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#E6A15C] shadow-md">
            <div className="flex items-center gap-3 pb-6 border-b border-[#E8D9BD] mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF2E2] text-[#E6392F] border border-[#E6A15C] flex items-center justify-center text-2xl shadow-sm">
                🤝
              </div>
              <div>
                <h4 className="font-display text-2xl font-black text-[#171717]">
                  FRANCHISEE HANDLES
                </h4>
                <p className="text-xs text-[#7A6B56]">Franchise Partner Operations</p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {FRANCHISEE_HANDLES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#171717] font-medium">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. YOUR PATH TO PARTNERSHIP (BROCHURE PAGE 14)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#FAF2E2] border-t border-[#E8D9BD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
              TIMELINE TO LAUNCH
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-none mt-1">
              YOUR PATH TO PARTNERSHIP
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B56] mt-1">
              From application to grand opening in just <strong>1.5 months</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PATH_TO_PARTNERSHIP.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-6 border border-[#E8D9BD] shadow-xs flex flex-col justify-between relative group hover:border-[#E6392F] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#E6392F] text-white flex items-center justify-center font-display text-2xl font-bold shadow-sm">
                      {step.step}
                    </span>
                    {step.step === '03' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#E6392F] text-white animate-pulse">
                        ⏱ 1.5 Months Window
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-2xl font-bold text-[#171717] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6B56] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. CONTACT & INQUIRY FORM (BROCHURE PAGE 15)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="inquiry-form" className="scroll-mt-24 sm:scroll-mt-28 bg-[#1C120C] text-white rounded-3xl p-8 sm:p-14 border-4 border-[#E6392F] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Contact & Leadership Details */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6392F] text-[#FAF2E2] text-xs font-bold uppercase tracking-wider">
                <HimmatEmblem className="w-4 h-4" />
                <span>50+ YEARS OF HIMMAT GROUP LEGACY</span>
              </div>

              <h3 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight leading-[0.95]">
                JOIN INDIA&apos;S NEXT <br />
                <span className="text-[#F8E71C]">BIG SODA BRAND</span>
              </h3>

              <p className="text-sm text-[#FAF2E2]/90 leading-relaxed">
                Backed by 50+ years of Himmat Group legacy, powered by innovation, built for entrepreneurs like you.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#24150D] border border-[#3E2618] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E6392F] flex items-center justify-center text-white shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-[#C4B79D] uppercase font-bold">Call Franchise Hotline</p>
                    <a href="tel:8237522072" className="font-display text-2xl font-bold text-white hover:text-[#F8E71C] transition-colors">
                      8237522072
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#24150D] border border-[#3E2618] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#E6392F] flex items-center justify-center text-white shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-[#C4B79D] uppercase font-bold">Direct Email</p>
                    <a href="mailto:himmat.beverages1290@gmail.com" className="text-sm sm:text-base font-bold text-white hover:text-[#F8E71C] transition-colors break-all">
                      himmat.beverages1290@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#A8987E]">
                <p className="font-bold text-[#E6A15C]">Himmat Beverages Pvt. Ltd. | Daddy Soda House</p>
                <p>Directors: Milind Nandkumar Kadam &amp; Ketan Nandkumar Kadam</p>
              </div>

            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-[#24150D] rounded-2xl p-6 sm:p-8 border border-[#3E2618]">
              
              {submitted ? (
                <div className="text-center py-8 sm:py-10 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#F5A623]">
                      APPLICATION RECEIVED
                    </span>
                    <h4 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
                      THANK YOU, {formData.name ? formData.name.toUpperCase() : 'PARTNER'}!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#C4B79D] max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you for expressing your interest in Daddy Soda House. Our franchise team at Himmat Beverages Pvt. Ltd. will contact you shortly on <strong className="text-white">{formData.phone}</strong> to discuss your target location in <strong className="text-white">{formData.city || 'your area'}</strong>.
                    </p>
                  </div>

                  {/* Send on WhatsApp Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsAppUrl || 'https://wa.me/918237522072'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-display text-lg tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-105 duration-200"
                    >
                      <MessageCircle className="w-5 h-5 fill-current" />
                      <span>SEND ON WHATSAPP</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          city: '',
                          tier: 'tier3',
                          investmentReady: '12-15 Lakhs',
                          comments: '',
                        });
                      }}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#170E08] hover:bg-[#2E1A11] text-[#C4B79D] hover:text-white border border-[#3E2618] font-display text-sm tracking-wide transition-all cursor-pointer"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <h4 className="font-display text-2xl font-bold text-white mb-2">
                    EXPRESS YOUR INTEREST
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Patil"
                        className="w-full px-4 py-3 rounded-xl bg-[#170E08] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1 font-semibold">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="mobile" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                        Mobile Number *
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9822000000"
                        className="w-full px-4 py-3 rounded-xl bg-[#170E08] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-xs mt-1 font-semibold">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#170E08] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1 font-semibold">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                        Target City / Region *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Kolhapur, Pune, Satara..."
                        className="w-full px-4 py-3 rounded-xl bg-[#170E08] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="tier" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                        City Model Preference
                      </label>
                      <select
                        id="tier"
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#170E08] border border-[#3E2618] text-white text-sm focus:outline-hidden focus:border-[#F5A623]"
                      >
                        <option value="tier3">Tier 3 City (₹12L - ₹15L)</option>
                        <option value="tier1_2">Tier 1 &amp; 2 Metro (₹15L - ₹25L)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="investmentReady" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                        Investment Capacity
                      </label>
                      <select
                        id="investmentReady"
                        value={formData.investmentReady}
                        onChange={(e) => setFormData({ ...formData, investmentReady: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#170E08] border border-[#3E2618] text-white text-sm focus:outline-hidden focus:border-[#F5A623]"
                      >
                        <option value="12-15 Lakhs">₹12 - ₹15 Lakhs</option>
                        <option value="15-25 Lakhs">₹15 - ₹25 Lakhs</option>
                        <option value="25+ Lakhs">₹25+ Lakhs (Multi-Unit)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comments" className="block text-xs font-bold uppercase text-[#C4B79D] mb-1">
                      Message / Commercial Location Details (Optional)
                    </label>
                    <textarea
                      id="comments"
                      rows={2}
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Share available commercial area (sq ft), prime market street, etc."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#170E08] border border-[#3E2618] text-white placeholder-[#7A6B56] text-sm focus:outline-hidden focus:border-[#F5A623]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-[#E6392F] hover:bg-[#171717] text-white font-display text-xl tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#E6A15C]/30 disabled:opacity-50"
                  >
                    <span>{loading ? 'SUBMITTING APPLICATION...' : 'SUBMIT FRANCHISE APPLICATION'}</span>
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default FranchisePage;
