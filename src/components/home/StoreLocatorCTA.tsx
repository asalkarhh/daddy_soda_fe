import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, Phone, ArrowRight } from 'lucide-react';
import { STORES } from '@/data/stores';

export default function StoreLocatorCTA() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Featured store: Kolhapur or matching search
  const filtered = STORES.filter(
    (s) =>
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pincode.includes(searchQuery) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredStore = filtered.length > 0 ? filtered[0] : STORES[0];

  return (
    <section className="py-16 sm:py-24 bg-[#FFF8ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#FAF2E2] rounded-3xl p-8 sm:p-12 border border-[#E8D9BD] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading and Search */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
                  LOCATIONS & DRIVE-THRU
                </span>
                <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight mt-1 leading-none">
                  FIND YOUR Daddy
                </h2>
                <p className="text-sm text-[#7A6B56] mt-2">
                  Drive-thru windows, walk-up counters, and late-night dirty soda hubs open across Maharashtra & Bengaluru.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <MapPin className="w-5 h-5 text-[#E6392F] absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter city (e.g. Kolhapur, Pune, Mumbai) or pincode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-[#E8D9BD] text-sm font-semibold focus:outline-none focus:border-[#E6392F] shadow-xs"
                />
                <Link
                  to={`/stores?q=${encodeURIComponent(searchQuery)}`}
                  className="absolute right-2 top-2 px-4 py-2 rounded-xl bg-[#171717] text-white font-display text-sm tracking-wider hover:bg-[#E6392F] transition-colors"
                >
                  SEARCH
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-bold text-[#7A6B56]">
                <span>Popular:</span>
                {['Kolhapur', 'Pune', 'Mumbai', 'Bengaluru'].map((city) => (
                  <button
                    key={city}
                    onClick={() => setSearchQuery(city)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E8D9BD] hover:border-[#171717] text-[#171717] transition-colors cursor-pointer"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Featured Nearby Store Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8D9BD] shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E6392F]/10 rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    Open Now • Drive-thru Active
                  </span>
                  <span className="font-display text-base font-bold text-[#E6392F]">
                    {featuredStore.distanceKm} KM AWAY
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
                  {featuredStore.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6B56] mt-1 mb-4">
                  {featuredStore.address}, {featuredStore.city} - {featuredStore.pincode}
                </p>

                <div className="space-y-2 text-xs font-medium text-[#171717] border-y border-[#E8D9BD] py-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A8987E]" />
                    <span>Hours: {featuredStore.openHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#A8987E]" />
                    <span>Call: {featuredStore.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredStore.features.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-md bg-[#FFF8ED] border border-[#E8D9BD] text-[11px] font-bold text-[#7A6B56]"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${featuredStore.name} ${featuredStore.address}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 rounded-xl bg-[#171717] text-white font-display text-base tracking-wider hover:bg-[#E6392F] transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>GET DIRECTIONS</span>
                  </a>
                  <Link
                    to="/stores"
                    className="py-3 px-4 rounded-xl border border-[#E8D9BD] text-[#171717] font-display text-base tracking-wider hover:bg-[#FAF2E2] transition-colors flex items-center gap-1"
                  >
                    <span>ALL STORES</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
