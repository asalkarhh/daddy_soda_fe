import React, { useState } from 'react';
import {
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  Send,
  Zap,
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
      const res = await publicApi.submitEnquiry({
        fullName: formData.name,
        mobile: formData.phone,
        email: formData.email,
        city: formData.city,
        message: `Model: ${formData.tier === 'tier3' ? 'Tier 3 (12-15L)' : 'Metro (15-25L)'} | Investment: ${formData.investmentReady} | Details: ${formData.comments}`,
      });

      if (res?.data?.whatsAppUrl) {
        window.location.href = res.data.whatsAppUrl;
        return;
      }
      setSubmitted(true);
    } catch {
      const text = encodeURIComponent(
        `Hi Daddy Soda House team! I am ${formData.name} from ${formData.city || 'India'}. I want to apply for a franchise (Tier: ${formData.tier}, Investment: ${formData.investmentReady}).`
      );
      window.location.href = `https://wa.me/918237522072?text=${text}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-6 pb-28">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER (BROCHURE PAGE 1 & 2)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#701A1A] text-white py-16 sm:py-24 border-b-4 border-[#8B2500]">
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
                className="px-8 py-4 rounded-xl bg-[#E6392F] text-white font-display text-xl tracking-wider hover:bg-white hover:text-[#171717] transition-all shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>CALCULATE REVENUE &amp; ROI</span>
                <ChevronRight className="w-5 h-5" />
              </a>
              <a
                href="#inquiry-form"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display text-xl tracking-wider transition-all border border-white/20"
              >
                APPLY FOR FRANCHISE
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CORE USPs: WHY DADDY SODA HOUSE? (BROCHURE PAGES 5 & 6)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-black uppercase tracking-widest text-[#701A1A] mb-2">
            <Zap className="w-4 h-4 fill-[#701A1A]" />
            <span>THE EASIEST BUSINESS TO RUN</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight leading-none">
            WHY DADDY SODA HOUSE?
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#701A1A]">
                COMPLETE OUTLET MENU SUITE
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-none">
                8 DEDICATED SODA TAPS + ICE-GOLA COUNTER
              </h2>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-[#E8D9BD] text-xs font-bold text-[#171717] shadow-xs shrink-0">
              🍧 Ice-Gola priced at <strong className="text-[#701A1A]">₹30/piece</strong> — averaging 50 sales/day
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BROCHURE_SODA_FLAVORS.map((fl) => (
              <div
                key={fl.id}
                className="bg-white rounded-2xl p-5 border border-[#E8D9BD] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{fl.icon}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#171717] text-[#FFF8ED]">
                      {fl.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#171717]">
                    {fl.name}
                  </h3>
                  <p className="text-xs text-[#7A6B56] mt-1 mb-4">
                    {fl.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8D9BD] flex items-center justify-between text-xs">
                  <span className="text-[#7A6B56] font-semibold">Tier 3 / Metro Price:</span>
                  <span className="font-display text-lg font-black text-[#701A1A]">
                    ₹{fl.price} / ₹{fl.priceTier1}
                  </span>
                </div>
              </div>
            ))}

            {/* Health and Zero Sugar Banner Card */}
            <div className="bg-gradient-to-br from-[#171717] to-[#333333] text-white rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-3xl mb-3 block">🥗</span>
                <h3 className="font-display text-2xl font-bold text-white">
                  HEALTH &amp; PREBIOTICS
                </h3>
                <p className="text-xs text-[#C4B79D] mt-1">
                  Zero sugar craft options + Prebiotic gut-health drinks available across all franchise outlets.
                </p>
              </div>
              <div className="pt-3 border-t border-white/20 text-xs text-[#FFB000] font-bold">
                ✓ High Margins • Pure Taste
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE FINANCIAL MODEL / ROI CALCULATOR
          ───────────────────────────────────────────────────────────── */}
      <section id="roi-breakdown" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FranchiseRoiCalculator />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SETUP & EQUIPMENT INCLUDES (BROCHURE PAGES 9 & 11)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-[#E8D9BD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#701A1A]">
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
          <span className="text-xs font-bold uppercase tracking-widest text-[#701A1A]">
            CLEAR OPERATIONAL RESPONSIBILITIES
          </span>
          <h3 className="font-display text-3xl sm:text-5xl font-black text-[#171717] tracking-tight leading-none mt-1">
            WHAT WE PROVIDE VS WHAT YOU DO
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Company Provides Box */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#701A1A] shadow-md">
            <div className="flex items-center gap-3 pb-6 border-b border-[#E8D9BD] mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#701A1A] text-white flex items-center justify-center text-2xl shadow-sm">
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
              <div className="w-12 h-12 rounded-2xl bg-[#FAF2E2] text-[#701A1A] border border-[#E6A15C] flex items-center justify-center text-2xl shadow-sm">
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
            <span className="text-xs font-bold uppercase tracking-widest text-[#701A1A]">
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
                className="bg-white rounded-2xl p-6 border border-[#E8D9BD] shadow-xs flex flex-col justify-between relative group hover:border-[#701A1A] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-12 h-12 rounded-xl bg-[#701A1A] text-white flex items-center justify-center font-display text-2xl font-bold shadow-sm">
                      {step.step}
                    </span>
                    {step.step === '04' && (
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
        <div id="inquiry-form" className="bg-[#1C120C] text-white rounded-3xl p-8 sm:p-14 border-4 border-[#701A1A] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Contact & Leadership Details */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701A1A] text-[#FAF2E2] text-xs font-bold uppercase tracking-wider">
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
                  <div className="w-12 h-12 rounded-xl bg-[#701A1A] flex items-center justify-center text-white shrink-0">
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
                  <div className="w-12 h-12 rounded-xl bg-[#701A1A] flex items-center justify-center text-white shrink-0">
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
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-3xl font-bold text-white">
                    APPLICATION RECEIVED!
                  </h4>
                  <p className="text-sm text-[#C4B79D] max-w-md mx-auto">
                    Thank you {formData.name || 'Partner'}. Our franchise development team at Himmat Beverages Pvt. Ltd. will contact you shortly on {formData.phone || 'your phone'} to discuss the {formData.city || 'your'} location.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 rounded-xl bg-[#701A1A] text-white font-display text-sm cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
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
                    className="w-full py-4 rounded-xl bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-xl tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#E6A15C]/30 disabled:opacity-50"
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
