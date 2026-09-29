import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Package,
  CheckCircle,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { usePageMeta } from '../../hooks/usePageMeta';
import { FlavourCard } from '../../components/public/FlavourCard';
import { FranchiseEnquiryForm } from '../../components/public/FranchiseEnquiryForm';
import { FaqAccordion } from '../../components/public/FaqAccordion';

export const HomePage: React.FC = () => {
  usePageMeta({
    title: 'Daddy Soda House | Authentic Indian Soda Flavours & Franchise Opportunities',
    description:
      'Explore refreshing handcrafted Indian sodas like Jeera Masala and Kala Khatta. Start your high-demand Daddy Soda House franchise outlet today.',
  });

  const featuredFlavours = siteConfig.flavours.slice(0, 4);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* SECTION A: HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-teal-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Taste of Authentic Indian Fizz</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight">
                Refreshing Soda Flavours. <br className="hidden sm:inline" />
                <span className="text-amber-300">Scalable Franchise</span> Opportunity.
              </h1>

              <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience tingling carbonation, desi spices, and irresistible fruit fizzes.
                Join hands with Daddy Soda House for a structured, high-demand beverage franchise.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#enquiry-section"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm shadow-lg shadow-amber-950/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enquire for Franchise</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/products"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-800/80 hover:bg-teal-700/80 border border-teal-600/60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Flavours</span>
                </Link>
              </div>

              {/* Quick stats / trust points */}
              <div className="pt-6 border-t border-teal-700/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl font-extrabold text-white">8+</div>
                  <div className="text-xs text-teal-200">Signature Flavours</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">100%</div>
                  <div className="text-xs text-teal-200">Food-Grade Syrups</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">Fast-Track</div>
                  <div className="text-xs text-teal-200">Outlet Onboarding</div>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-teal-800/90 to-teal-950/90 rounded-3xl border border-teal-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
                    Franchise Model
                  </span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-teal-700/80 border border-teal-500/30 flex items-center justify-center text-amber-300 mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Daddy Soda House Outlet
                </h3>
                <p className="text-sm text-teal-200 leading-relaxed mb-6">
                  High-capacity carbonation equipment, consistent syrup mixing ratios, and fast customer turnaround for peak market hours.
                </p>

                <div className="space-y-3 bg-teal-900/60 rounded-xl p-4 border border-teal-700/40 text-xs text-teal-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Compact kiosk and storefront setups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Direct supply of proprietary flavour syrups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Comprehensive machine and operator training</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-teal-700/40 text-center">
                  <span className="text-xs text-teal-300">
                    Direct WhatsApp connection with franchise manager
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: WHY DADDY SODA HOUSE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Why Partner With Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Built for High Footfall & Consistent Taste
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Daddy Soda House is designed to provide high-volume beverage operations with standard quality and low operational friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Flavour-Focused Experience</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Authentic Indian palate favorites like Jeera Masala and Kala Khatta engineered with premium ingredients.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">High Demand Category</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Soda and fizzy drinks enjoy round-the-year demand with lightning-fast cup serving times.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Standardized Supply Chain</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Centralized syrup supply guarantees exact recipe consistency and simple inventory tracking.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Easy Enquiry & Onboarding</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Straightforward partner discovery and personalized setup consultation via WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION C: FEATURED FLAVOURS */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
                Menu Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Soda Flavours
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                A glimpse of customer favorites crafted with maximum fizz and bold spices.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-teal-900 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all"
            >
              <span>View All Flavours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFlavours.map((flavour) => (
              <FlavourCard key={flavour.id} flavour={flavour} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D & E: HOW IT WORKS / ONBOARDING STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            How Franchise Onboarding Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Get your soda franchise running smoothly with our 3-step structured journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {siteConfig.onboardingSteps.map((step) => (
            <div
              key={step.step}
              className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center relative flex flex-col items-center justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-teal-900/10">
                0{step.step}
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-teal-700">
                Step 0{step.step} of 03
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION F: FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Quick answers about the Daddy Soda House brand and franchise onboarding.
          </p>
        </div>

        <FaqAccordion items={siteConfig.faqs.slice(0, 4)} />

        <div className="mt-6 text-center">
          <Link
            to="/franchise"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-900 hover:underline"
          >
            <span>Have more questions? Visit our Franchise details page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* SECTION G: FINAL CTA & EMBEDDED ENQUIRY FORM */}
      <section id="enquiry-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-br from-teal-900 via-teal-850 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left pitch */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800 border border-teal-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>Start Your Franchise Journey</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Interested in Becoming a Franchise Partner?
              </h2>

              <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
                Connect directly with our franchise team. We will review your preferred city and discuss setup formats tailored for high footfall zones.
              </p>

              <div className="space-y-3 pt-2 text-sm text-teal-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Immediate automated connection to WhatsApp coordinator</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>No upfront fee required to submit initial enquiry</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Complete machine setup and supply chain support</span>
                </div>
              </div>

              <div className="pt-4 text-xs text-teal-300/80">
                Helpline: {siteConfig.contact.phoneDisplay} | {siteConfig.contact.workingHours}
              </div>
            </div>

            {/* Right form card */}
            <div className="lg:col-span-6">
              <FranchiseEnquiryForm
                title="Submit Franchise Enquiry"
                subtitle="Enter your contact details to connect on WhatsApp with our onboarding team."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
