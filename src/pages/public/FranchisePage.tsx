import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { usePageMeta } from '../../hooks/usePageMeta';
import { FranchiseEnquiryForm } from '../../components/public/FranchiseEnquiryForm';
import { FaqAccordion } from '../../components/public/FaqAccordion';

export const FranchisePage: React.FC = () => {
  usePageMeta({
    title: 'Franchise Opportunity | Daddy Soda House - Beverage Business Partnership',
    description:
      'Partner with Daddy Soda House. Discover our scalable soda kiosk & storefront franchise model, standardized syrup supply chain, and dedicated partner support.',
  });

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Header & Form Split Section */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-850 to-teal-900 text-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Pitch */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800 border border-teal-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Partner With India's Fresh Soda Brand</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Daddy Soda House <br />
                <span className="text-amber-300">Franchise Partnership</span>
              </h1>

              <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed">
                Join a rapidly expanding network of high-turnover soda outlets. We provide complete dispensing equipment, standardized syrups, operator SOPs, and ongoing supply chain replenishment.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-teal-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fast Turnaround Times:</strong> Automated dispenser taps enable instant cup serving during peak hours.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-teal-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span>
                    <strong>Standardized Recipes:</strong> No guesswork or culinary skill required from staff.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-teal-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dedicated WhatsApp Channel:</strong> Instant response from our franchise development managers.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-teal-700/60 flex items-center gap-4 text-xs text-teal-200">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>Rapid 7-14 Day Setup Readiness</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Transparent Onboarding Process</span>
                </div>
              </div>
            </div>

            {/* Right Conversion Form */}
            <div className="lg:col-span-6">
              <FranchiseEnquiryForm
                title="Apply for Franchise Onboarding"
                subtitle="Submit your contact info to instantly connect with our franchise coordinator on WhatsApp."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner with Daddy Soda House */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Franchise Advantages
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Why Partner with Daddy Soda House?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A comprehensive business package tailored for high footfall retail environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.benefits.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{b.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-teal-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Partner Benefit</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Get Started Steps */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Onboarding Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How to Get Started
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From your initial enquiry to full commercial launch in clear, simple milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center relative shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                01
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Submit Enquiry</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fill in your contact details and preferred territory. Your submission is recorded in our partner database.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center relative shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                02
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Discovery Consultation</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our business development team reviews location feasibility and shares detailed kiosk or shop layout options.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center relative shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center mx-auto mb-6 shadow-md">
                03
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Setup & Launch</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive commercial machine installation, operator training, stock supplies, and initiate public sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens After Enquiry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-50/70 border border-teal-200/80 rounded-3xl p-8 sm:p-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-800">
                Transparency First
              </span>
              <h3 className="text-2xl font-bold text-teal-950">
                What Happens After You Submit Your Enquiry?
              </h3>
              <p className="text-sm text-teal-800 leading-relaxed">
                We believe in straightforward, responsive communication with prospective partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white rounded-xl p-5 border border-teal-100 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center mb-3 text-sm">
                  1
                </div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">Instant Lead Recording</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your enquiry is safely logged in our central portal with a unique tracking reference number.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-teal-100 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center mb-3 text-sm">
                  2
                </div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">WhatsApp Redirect</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You are directed to WhatsApp to instantly message our franchise manager without delays.
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-teal-100 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center mb-3 text-sm">
                  3
                </div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">Personalized Discovery</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We schedule a 1-on-1 call to discuss machine models, pricing, and launch dates for your target area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Franchise Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Detailed answers regarding outlet setup, operational training, and brand support.
          </p>
        </div>

        <FaqAccordion items={siteConfig.faqs} />
      </section>

      {/* Bottom CTA Anchor */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-teal-800 to-teal-900 rounded-3xl p-8 sm:p-10 text-white space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold">Ready to Start Your Franchise Journey?</h3>
          <p className="text-sm text-teal-100 max-w-lg mx-auto">
            Fill out our enquiry form above to connect immediately with our franchise manager on WhatsApp.
          </p>
          <div className="pt-2">
            <a
              href="#enquiry-form"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Go to Enquiry Form</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FranchisePage;
