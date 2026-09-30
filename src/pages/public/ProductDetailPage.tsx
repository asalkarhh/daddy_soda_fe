import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '@/data/products';
import {
  Star,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Briefcase,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-display text-4xl font-bold text-[#171717] mb-2">PRODUCT NOT FOUND</h2>
        <p className="text-sm text-[#7A6B56] mb-6">The requested beverage flavor could not be located.</p>
        <Link
          to="/menu"
          className="px-6 py-3 rounded-xl bg-[#701A1A] text-white font-display text-lg tracking-wider"
        >
          BACK TO ALL FLAVORS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-8 pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A6B56] hover:text-[#701A1A] transition-colors mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Flavors</span>
        </Link>

        {/* Product Grid */}
        <div className="bg-white rounded-3xl border border-[#E8D9BD] shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            
            {/* Left: Big Product Image */}
            <div className="md:col-span-6 relative aspect-square rounded-3xl overflow-hidden bg-[#FAF2E2] border border-[#E8D9BD] shadow-inner flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Product Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#171717] text-[#FFF8ED] shadow-sm">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Floating Bubbles */}
              <div className="bubble" style={{ left: '25%', bottom: '15%', width: '12px', height: '12px' }} />
              <div className="bubble" style={{ left: '60%', bottom: '20%', width: '8px', height: '8px', animationDelay: '0.8s' }} />
            </div>

            {/* Right: Flavor & Franchise Info */}
            <div className="md:col-span-6 space-y-6">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#171717]">
                    <Star className="w-3.5 h-3.5 fill-[#FFB000] text-[#FFB000]" />
                    <span>{product.rating}</span>
                    <span className="text-[#A8987E]">({product.reviewsCount} customer rating)</span>
                  </div>
                  <span className="text-xs font-bold text-[#7A6B56] uppercase tracking-wider">
                    {product.calories} KCAL
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl font-black text-[#171717] tracking-tight leading-none">
                  {product.name}
                </h1>
                <p className="text-sm font-bold text-[#701A1A] mt-1">
                  {product.tagline}
                </p>
                <p className="text-sm text-[#7A6B56] mt-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Flavor Profile Ingredients */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A8987E]">
                  Proprietary Formulation &amp; Ingredients
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-3 py-1 rounded-lg bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#171717]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Franchise Dispenser Economics */}
              <div className="p-4 rounded-2xl bg-[#FAF2E2] border border-[#E8D9BD] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#7A6B56] uppercase">Commercial Dispensing:</span>
                  <span className="text-[#701A1A]">Dedicated Draft Tap</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E8D9BD] text-center">
                    <span className="text-[10px] uppercase font-bold text-[#A8987E] block">Tier 3 City Price</span>
                    <span className="font-display text-2xl font-black text-[#171717]">₹20 / glass</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E8D9BD] text-center">
                    <span className="text-[10px] uppercase font-bold text-[#A8987E] block">Metro City Price</span>
                    <span className="font-display text-2xl font-black text-[#701A1A]">₹30 / glass</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to="/franchise#inquiry-form"
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-lg tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>INQUIRE FOR YOUR OUTLET</span>
                </Link>

                <a
                  href="tel:8237522072"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#FAF2E2] hover:bg-[#E8D9BD] text-[#171717] font-display text-base tracking-wider transition-all border border-[#E8D9BD] flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#701A1A]" />
                  <span>8237522072</span>
                </a>
              </div>

              {/* Quality Note */}
              <div className="flex items-center gap-2 text-xs text-[#7A6B56] pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Manufactured by Himmat Beverages Pvt. Ltd. (Est. 1973).</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
