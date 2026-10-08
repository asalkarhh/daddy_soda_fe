import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Clock, Phone, Navigation } from 'lucide-react';
import { STORES } from '@/data/stores';

export const StoresPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const cities = ['All', 'Kolhapur', 'Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'];

  const filteredStores = STORES.filter((store) => {
    const matchesCity = selectedCity === 'All' || store.city === selectedCity;
    const matchesSearch =
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase()) ||
      store.pincode.includes(search);
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-8 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F] mb-3">
            <MapPin className="w-4 h-4 fill-[#E6392F]" />
            <span className="tracking-widest uppercase">FOUNTAIN BARS & DRIVE-THRU</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#171717] tracking-tight leading-none mb-3">
            FIND YOUR Daddy
          </h1>
          <p className="text-sm sm:text-base text-[#7A6B56]">
            Locate nearby Daddy Soda drive-thrus and walk-up bars. Open late into the night for your carbonated cravings.
          </p>
        </div>

        {/* Search & City Filter */}
        <div className="max-w-xl mx-auto space-y-4 mb-10">
          <div className="relative">
            <Search className="w-5 h-5 text-[#A8987E] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by city, area, or pincode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-[#E8D9BD] text-sm font-semibold focus:outline-none focus:border-[#E6392F] shadow-xs"
            />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === city
                    ? 'bg-[#171717] text-white'
                    : 'bg-white border border-[#E8D9BD] text-[#7A6B56] hover:text-[#171717]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-3xl p-6 border border-[#E8D9BD] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    Open Now
                  </span>
                  <span className="font-display text-sm font-bold text-[#E6392F]">
                    {store.distanceKm} KM AWAY
                  </span>
                </div>

                <h3 className="font-display text-2xl font-black text-[#171717] tracking-tight">
                  {store.name}
                </h3>
                <p className="text-xs text-[#7A6B56] mt-1 mb-4 leading-relaxed">
                  {store.address}, {store.city} — {store.pincode}
                </p>

                <div className="space-y-2 text-xs font-medium text-[#171717] border-y border-[#E8D9BD] py-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A8987E]" />
                    <span>{store.openHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#A8987E]" />
                    <span>{store.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {store.features.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-md bg-[#FAF2E2] border border-[#E8D9BD] text-[10px] font-bold text-[#7A6B56]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${store.name} ${store.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#171717] text-white font-display text-sm tracking-wider hover:bg-[#E6392F] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>GET DIRECTIONS</span>
                </a>
                <Link
                  to="/franchise#inquiry-form"
                  className="py-3 px-4 rounded-xl bg-[#FAF2E2] border border-[#E8D9BD] text-[#701A1A] font-display text-sm tracking-wider hover:bg-[#701A1A] hover:text-white transition-colors"
                >
                  FRANCHISE INQUIRY
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StoresPage;
