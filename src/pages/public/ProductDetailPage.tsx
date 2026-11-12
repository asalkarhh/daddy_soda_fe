import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import {
  Star,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const currentIndex = PRODUCTS.findIndex(
    (p) => p.slug === slug || p.id === slug
  );
  const product = currentIndex !== -1 ? PRODUCTS[currentIndex] : null;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-display text-4xl font-bold text-[#171717] mb-2">PRODUCT NOT FOUND</h2>
        <p className="text-sm text-[#7A6B56] mb-6">The requested beverage flavor could not be located.</p>
        <Link
          to="/menu"
          className="px-6 py-3 rounded-xl bg-[#E6392F] hover:bg-[#171717] text-white font-display text-lg tracking-wider transition-colors"
        >
          BACK TO ALL FLAVORS
        </Link>
      </div>
    );
  }

  const prevProduct =
    currentIndex > 0
      ? PRODUCTS[currentIndex - 1]
      : PRODUCTS[PRODUCTS.length - 1];
  const nextProduct =
    currentIndex < PRODUCTS.length - 1
      ? PRODUCTS[currentIndex + 1]
      : PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-8 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6B56] hover:text-[#E6392F] transition-colors mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Flavors</span>
        </Link>

        {/* Product Grid */}
        <div className="bg-white rounded-3xl border border-[#E8D9BD] shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch p-6 sm:p-8 lg:p-10">
            
            {/* Left: Big Product Image */}
            <div className="md:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#FAF2E2] border border-[#E8D9BD] shadow-inner flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 8%' }}
              />
              
              {/* Product Badge / Flag */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#171717] text-[#FFF8ED] shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#F8E71C]" />
                    <span>{product.badge}</span>
                  </span>
                </div>
              )}

              {/* Floating Bubbles */}
              <div className="bubble" style={{ left: '25%', bottom: '15%', width: '12px', height: '12px' }} />
              <div className="bubble" style={{ left: '60%', bottom: '20%', width: '8px', height: '8px', animationDelay: '0.8s' }} />
            </div>

            {/* Right: Premium Showcase Card */}
            <div className="md:col-span-6 flex flex-col justify-between py-2 sm:py-3 space-y-6">
              
              {/* Top Section: Eyebrow + Name + Rating */}
              <div className="space-y-4">
                
                {/* Category Pill */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FAF2E2] text-[#7A6B56] border border-[#E8D9BD]">
                    Dedicated Soda Tap
                  </span>
                  {product.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#171717] text-[#FFF8ED] shadow-xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-[#171717] tracking-tight leading-none">
                  {product.name}
                </h1>

                {/* Star Rating Bar */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FAF2E2] border border-[#E8D9BD]">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-4 h-4 ${
                          starIndex <= Math.round(product.rating)
                            ? 'fill-[#FFB000] text-[#FFB000]'
                            : 'text-[#D4C3A3]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-display text-base font-black text-[#171717]">
                    {product.rating}
                  </span>
                  <span className="text-xs font-semibold text-[#A8987E]">
                    / 5.0 Rated
                  </span>
                </div>

              </div>

              {/* Middle Section: Interactive 24-Flavour Browser */}
              <div className="p-4 rounded-2xl bg-[#FAF2E2]/70 border border-[#E8D9BD] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#A8987E]">
                  <span>Explore Menu</span>
                  <span className="font-black text-[#E6392F]">
                    Flavour {String(currentIndex + 1).padStart(2, '0')} of {PRODUCTS.length}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    to={`/menu/${prevProduct.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8D9BD] text-xs font-bold text-[#171717] hover:text-[#E6392F] hover:border-[#E6392F]/40 transition-all group max-w-[45%]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="truncate">{prevProduct.name}</span>
                  </Link>

                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8D9BD]" />

                  <Link
                    to={`/menu/${nextProduct.slug}`}
                    className="flex items-center justify-end gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8D9BD] text-xs font-bold text-[#171717] hover:text-[#E6392F] hover:border-[#E6392F]/40 transition-all group max-w-[45%]"
                  >
                    <span className="truncate">{nextProduct.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Bottom Action CTAs */}
              <div className="space-y-2.5 pt-2">
                <Link
                  to="/franchise#inquiry-form"
                  className="w-full py-3.5 rounded-xl bg-[#E6392F] hover:bg-[#171717] text-white font-display text-base sm:text-lg tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>INQUIRE FOR YOUR OUTLET</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center gap-2.5">
                  <Link
                    to="/menu"
                    className="flex-1 py-2.5 rounded-xl bg-[#FAF2E2] hover:bg-[#E8D9BD] text-[#171717] font-display text-xs sm:text-sm tracking-wider transition-all border border-[#E8D9BD] text-center"
                  >
                    VIEW ALL 24 FLAVORS
                  </Link>

                  <a
                    href="tel:8237522072"
                    className="px-4 py-2.5 rounded-xl bg-[#FAF2E2] hover:bg-[#E8D9BD] text-[#171717] font-display text-xs sm:text-sm tracking-wider transition-all border border-[#E8D9BD] flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E6392F]" />
                    <span>8237522072</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
