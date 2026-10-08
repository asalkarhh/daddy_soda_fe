import { Link } from 'react-router-dom';
import { Star, Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';

export default function Favorites() {
  // Take the top 4 flagship favorites
  const favorites = PRODUCTS.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#FFF8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#701A1A] mb-1">
              <Sparkles className="w-3.5 h-3.5 fill-[#701A1A]" />
              <span>THE REBEL FOUNTAIN FLAVORS</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight">
              SIGNATURE Daddy FLAVORS
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-display text-xl text-[#701A1A] hover:text-[#E6392F] transition-colors group"
          >
            <span>VIEW COMPLETE PRODUCT RANGE</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Card Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => {
            return (
              <div
                key={product.id}
                className="group relative bg-[#FAF2E2] rounded-3xl p-5 border border-[#E8D9BD] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-[#701A1A]/40 overflow-hidden"
              >
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#171717] text-[#FFF8ED] shadow-sm">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Star Rating Top Right */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-[#171717] border border-[#E8D9BD]">
                  <Star className="w-3 h-3 fill-[#FFB000] text-[#FFB000]" />
                  <span>{product.rating}</span>
                </div>

                {/* Product Image with Hover Rise & Bubbles */}
                <Link
                  to={`/menu/${product.slug}`}
                  className="block relative w-full h-64 rounded-2xl overflow-hidden bg-white/60 mb-5 border border-[#E8D9BD]/50 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1.5"
                  />
                  
                  {/* Subtle carbonation bubbles on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bubble" style={{ left: '25%', bottom: '20%', width: '10px', height: '10px', animationDelay: '0.1s' }} />
                    <div className="bubble" style={{ left: '55%', bottom: '30%', width: '8px', height: '8px', animationDelay: '0.6s' }} />
                    <div className="bubble" style={{ left: '75%', bottom: '15%', width: '12px', height: '12px', animationDelay: '1.2s' }} />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/menu/${product.slug}`}>
                      <h3 className="font-display text-2xl font-black text-[#171717] tracking-tight hover:text-[#E6392F] transition-colors leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#7A6B56] font-medium mt-1 mb-4 line-clamp-2">
                      {product.ingredients.join(' • ')}
                    </p>
                  </div>

                  {/* Price & View Details Action */}
                  <div className="pt-3 border-t border-[#E8D9BD] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#A8987E]">Dispenser Pricing</span>
                        <p className="font-display text-2xl font-black text-[#171717]">
                          ₹{product.price} <span className="text-xs text-[#A8987E]">/ glass</span>
                        </p>
                      </div>

                      <Link
                        to={`/menu/${product.slug}`}
                        className="px-4 py-2 rounded-xl bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-sm tracking-wider transition-all shadow-xs"
                      >
                        DETAILS →
                      </Link>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
