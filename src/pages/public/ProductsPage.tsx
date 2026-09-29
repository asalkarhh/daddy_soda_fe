import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, GlassWater } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { usePageMeta } from '../../hooks/usePageMeta';
import { FlavourCard } from '../../components/public/FlavourCard';

export const ProductsPage: React.FC = () => {
  usePageMeta({
    title: 'Soda Flavours & Drinks | Daddy Soda House',
    description:
      'Explore our full lineup of authentic Indian soda flavours including Jeera Masala, Kala Khatta, Nimbu Fresh, Orange Burst, and Fruit Fizzes.',
  });

  const categories = ['All', 'Spiced Classics', 'Refreshing Citrus', 'Fruity Fizz'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFlavours = useMemo(() => {
    if (selectedCategory === 'All') {
      return siteConfig.flavours;
    }
    return siteConfig.flavours.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-16 md:space-y-20 pb-16">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-teal-900 to-teal-800 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800 border border-teal-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <GlassWater className="w-3.5 h-3.5" />
            <span>Signature Flavour Lineup</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            High-Fizz Indian Soda Flavours
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 leading-relaxed">
            Crafted for maximum fizz, tingling spices, and thirst-quenching satisfaction.
            Every flavour is manufactured with high-quality food-grade formulation.
          </p>
        </div>
      </section>

      {/* Main Flavour Section with Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Flavour Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFlavours.map((flavour) => (
            <FlavourCard key={flavour.id} flavour={flavour} />
          ))}
        </div>

        {/* Brand Quality Assurance Note */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-teal-950">
                Proprietary Standardized Syrups
              </h4>
              <p className="text-sm text-teal-800/90 mt-1 max-w-2xl leading-relaxed">
                All syrups are produced in controlled batch environments ensuring uniform flavor density, fizz retention, and consistent taste across all Daddy Soda House franchise outlets.
              </p>
            </div>
          </div>

          <Link
            to="/franchise"
            className="shrink-0 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2"
          >
            <span>Serve These at Your Outlet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
            Business Opportunities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Want to Launch a Daddy Soda House in Your City?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Fill out a simple franchise enquiry form to receive complete outlet setup details directly on WhatsApp.
          </p>
          <div className="pt-2">
            <Link
              to="/franchise"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Apply for Franchise</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
