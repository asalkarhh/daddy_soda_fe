import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, Sparkles, ArrowRight, Phone } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { CategoryType } from '@/types';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') as CategoryType | null;

  const [activeCategory, setActiveCategory] = useState<CategoryType>(catParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
    if (category === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', category);
    }
    setSearchParams(searchParams);
  };

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-8 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F] mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 fill-[#E6392F]" />
            <span className="tracking-widest uppercase">8 DEDICATED SODA TAPS + ICE-GOLA COUNTER</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#171717] tracking-tight leading-none mb-3">
            PRODUCTS &amp; FLAVORS
          </h1>
          <p className="text-sm sm:text-base text-[#7A6B56]">
            Proprietary concentrates manufactured by Himmat Beverages Pvt. Ltd. (Est. 1973). Guaranteed consistent taste, zero-wastage dispensing, and exceptional profit margins.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 mb-10">
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-[#A8987E] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by flavor, ingredient (e.g. Jeera, Mojito, Gola)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-[#E8D9BD] text-sm font-semibold focus:outline-hidden focus:border-[#E6392F] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs text-[#A8987E] hover:text-[#171717] font-bold"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as CategoryType)}
                  className={`px-5 py-2.5 rounded-xl font-display text-base tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#E6392F] text-white shadow-md'
                      : 'bg-white border border-[#E8D9BD] text-[#7A6B56] hover:text-[#171717] hover:border-[#171717]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FAF2E2] rounded-3xl border border-[#E8D9BD] p-8 max-w-lg mx-auto">
            <span className="text-5xl block mb-3">🥤</span>
            <h3 className="font-display text-2xl font-bold text-[#171717] mb-1">
              NO FLAVOR MATCHES THAT
            </h3>
            <p className="text-xs text-[#7A6B56] mb-4">
              Explore our full 8-flavor commercial draft setup and ice-gola unit on the franchise page.
            </p>
            <Link
              to="/franchise"
              className="inline-block px-6 py-3 rounded-xl bg-[#E6392F] hover:bg-[#171717] text-white font-display text-lg tracking-wider transition-colors"
            >
              VIEW FRANCHISE OPPORTUNITY
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-3xl p-4 sm:p-5 border border-[#E8D9BD] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#E6392F]/40 overflow-hidden"
                >
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#171717] text-[#FFF8ED] shadow-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Star Rating */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-bold text-[#171717] border border-[#E8D9BD]">
                    <Star className="w-3 h-3 fill-[#FFB000] text-[#FFB000]" />
                    <span>{product.rating}</span>
                  </div>

                  {/* Product Image */}
                  <Link
                    to={`/menu/${product.slug}`}
                    className="block relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#FAF2E2] mb-4 border border-[#E8D9BD]/50 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1"
                    />

                    {/* Carbonation bubbles on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bubble" style={{ left: '20%', bottom: '20%', width: '8px', height: '8px' }} />
                      <div className="bubble" style={{ left: '50%', bottom: '25%', width: '6px', height: '6px', animationDelay: '0.4s' }} />
                      <div className="bubble" style={{ left: '75%', bottom: '15%', width: '10px', height: '10px', animationDelay: '0.8s' }} />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/menu/${product.slug}`}>
                        <h3 className="font-display text-xl sm:text-2xl font-black text-[#171717] tracking-tight hover:text-[#E6392F] transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] sm:text-xs text-[#7A6B56] font-medium mt-1 mb-3 line-clamp-2">
                        {product.ingredients.join(' • ')}
                      </p>
                    </div>

                    {/* Price and Action */}
                    <div className="pt-3 border-t border-[#E8D9BD] space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#A8987E] block">Target Retail</span>
                          <span className="font-display text-xl sm:text-2xl font-black text-[#171717]">
                            ₹{product.price}
                          </span>
                        </div>

                        <Link
                          to={`/menu/${product.slug}`}
                          className="px-3.5 py-1.5 rounded-xl font-display text-sm tracking-wider bg-[#E6392F] hover:bg-[#171717] text-white transition-all shadow-xs flex items-center gap-1"
                        >
                          <span>DETAILS</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Franchise Opportunity Banner */}
        <div className="mt-16 bg-[#171717] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border-4 border-[#E6392F]">
          <h3 className="font-display text-3xl sm:text-5xl font-black text-white">
            WANT TO SERVE THESE AT YOUR OUTLET?
          </h3>
          <p className="text-sm text-[#FAF2E2]/90 max-w-xl mx-auto mt-2 mb-6">
            Get the full 8-tap soda dispensing machine, Ice-Gola counter, and proprietary concentrates with complete franchise support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/franchise"
              className="px-8 py-3.5 rounded-xl bg-[#E6392F] hover:bg-white hover:text-[#171717] text-white font-display text-xl tracking-wider transition-all shadow-md"
            >
              EXPLORE FRANCHISE MODEL
            </Link>
            <a
              href="tel:8237522072"
              className="px-8 py-3.5 rounded-xl bg-black/30 hover:bg-black/50 text-white font-display text-xl tracking-wider transition-all border border-white/20 flex items-center gap-2"
            >
              <Phone className="w-5 h-5 text-[#F8E71C]" />
              <span>CALL 8237522072</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductsPage;
