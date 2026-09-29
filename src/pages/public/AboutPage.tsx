import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  Target,
  Eye,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Users,
} from 'lucide-react';
import { usePageMeta } from '../../hooks/usePageMeta';

export const AboutPage: React.FC = () => {
  usePageMeta({
    title: 'About Us | Daddy Soda House - Authentic Indian Beverage Story',
    description:
      'Learn about Daddy Soda House, our passion for authentic Indian soda recipes, consistent quality syrups, and partner-centric franchise network.',
  });

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal-900 to-teal-800 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800 border border-teal-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage & Purpose</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Crafting the True Spirit of Indian Soda
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed">
            From the bustling street corners of India to modern beverage kiosks, Daddy Soda House is dedicated to delivering crisp, high-carbonation fizzy drinks with unmatched flavor depth.
          </p>
        </div>
      </section>

      {/* Brand Overview & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              The Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Reinventing Nostalgic Indian Flavours for Today's Consumers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              India has a rich tradition of local soda houses, from spiced Jeera and tangy Kala Khatta to invigorating fresh lemon sodas. Daddy Soda House was founded to standardize this beloved beverage experience.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We combine authentic culinary spice profiles with precision carbonation machinery and food-grade syrups, ensuring that every customer receives the exact same refreshing punch across every outlet in our network.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-100">
                <div className="text-2xl font-black text-teal-900">100%</div>
                <div className="text-xs font-semibold text-teal-700 mt-1">
                  Food-Grade Ingredients
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-2xl font-black text-amber-900">High Fizz</div>
                <div className="text-xs font-semibold text-amber-700 mt-1">
                  Carbonation Technology
                </div>
              </div>
            </div>
          </div>

          {/* Story graphic box */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white mb-6">
              <Droplets className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Our Core Philosophy</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              "Great beverages should be refreshing, high quality, and accessible to everyone. We empower local entrepreneurs to build viable businesses through standardized product recipes and reliable supply chains."
            </p>
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Daddy Soda House Leadership Team</span>
              <span className="text-amber-400 font-semibold">Pune, Maharashtra</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To deliver superior taste, crisp fizz, and pure refreshment through standardized soda dispensers and proprietary syrup formulations, while creating sustainable livelihood and enterprise opportunities for franchise partners.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To emerge as India's most trusted neighborhood beverage brand, renowned for uncompromising hygiene, consistent product quality, and high-turnaround franchise satisfaction across urban and semi-urban markets.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
              What Guides Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Our Core Principles
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every bottle, cup, and partner engagement is built on a foundation of integrity and consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Quality & Hygiene</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                We prioritize rigorous food-grade standards and clean dispensing systems to deliver safe, fresh soda in every serving.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Authentic Taste</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every syrup blend is carefully crafted using authentic spice formulations to preserve traditional Indian taste memories.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Partner Success</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                We view every franchise owner as a long-term business partner, providing dedicated supply chain and operational guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Build With Daddy Soda House?
          </h3>
          <p className="text-sm sm:text-base text-teal-100 max-w-xl mx-auto leading-relaxed">
            Explore our franchise model or submit an enquiry to discuss setup options with our expansion team.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/franchise"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Franchise Model</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-semibold text-sm border border-teal-600/60 transition-all flex items-center justify-center"
            >
              <span>Contact Head Office</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
