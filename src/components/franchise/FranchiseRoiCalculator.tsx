import { useState } from 'react';
import { Sliders, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface CalculatorProps {
  onApplyClick?: () => void;
  className?: string;
}

export default function FranchiseRoiCalculator({ onApplyClick, className = '' }: CalculatorProps) {
  // Preset states or custom adjustments
  const [activePreset, setActivePreset] = useState<'tier3' | 'metro' | 'custom'>('tier3');
  
  const [dailyGlasses, setDailyGlasses] = useState<number>(250);
  const [sodaPrice, setSodaPrice] = useState<number>(20);
  const [dailyGola, setDailyGola] = useState<number>(30);
  const [golaPrice, setGolaPrice] = useState<number>(30);

  // Preset Handlers
  const handleLoadTier3 = () => {
    setActivePreset('tier3');
    setDailyGlasses(250);
    setSodaPrice(20);
    setDailyGola(30);
    setGolaPrice(30);
  };

  const handleLoadMetro = () => {
    setActivePreset('metro');
    setDailyGlasses(350);
    setSodaPrice(30);
    setDailyGola(75);
    setGolaPrice(50);
  };

  // Calculations
  const dailySodaRevenue = dailyGlasses * sodaPrice;
  const dailyGolaRevenue = dailyGola * golaPrice;
  const dailyTotalRevenue = dailySodaRevenue + dailyGolaRevenue;

  const monthlyRevenue = dailyTotalRevenue * 30;
  const annualGrossTurnover = dailyTotalRevenue * 360; // 360 operational days

  const netProfit25 = annualGrossTurnover * 0.25;
  const netProfit30 = annualGrossTurnover * 0.30;

  // Format INR Lakhs
  const formatLakhs = (val: number) => {
    const inLakhs = val / 100000;
    return `₹${inLakhs.toFixed(2)} Lakhs`;
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div
      id="custom-roi-calculator"
      className={`relative w-full rounded-3xl bg-[#1C120C] text-[#FFF8ED] p-6 sm:p-10 lg:p-12 border-2 border-[#3D2619] shadow-2xl overflow-hidden ${className}`}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6392F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2E1A11] border border-[#52301F] text-[#F5A623] text-xs font-black tracking-widest uppercase shadow-inner">
          <Sliders className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>INTERACTIVE FINANCIAL MODEL</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
          Calculate Your Custom Revenue &amp; Profit Potential
        </h2>

        <p className="text-xs sm:text-sm text-[#C4B79D] max-w-xl mx-auto leading-relaxed">
          Adjust daily volume and price points to see projected daily, monthly, and yearly cash flow.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* LEFT COLUMN: PRESETS & INTERACTIVE SLIDERS */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleLoadTier3}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activePreset === 'tier3'
                  ? 'border-[#F5A623] bg-[#2E1A11] text-white ring-1 ring-[#F5A623]'
                  : 'border-[#3D2619] bg-[#170E08] text-[#A8987E] hover:border-[#52301F] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wider uppercase text-[#F5A623]">Preset</span>
                {activePreset === 'tier3' && <Check className="w-4 h-4 text-[#F5A623]" />}
              </div>
              <p className="font-display text-base font-bold text-white mt-0.5">
                Tier 3 Preset (250 Glasses @ ₹20)
              </p>
            </button>

            <button
              type="button"
              onClick={handleLoadMetro}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activePreset === 'metro'
                  ? 'border-[#F5A623] bg-[#2E1A11] text-white ring-1 ring-[#F5A623]'
                  : 'border-[#3D2619] bg-[#170E08] text-[#A8987E] hover:border-[#52301F] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wider uppercase text-[#F5A623]">Preset</span>
                {activePreset === 'metro' && <Check className="w-4 h-4 text-[#F5A623]" />}
              </div>
              <p className="font-display text-base font-bold text-white mt-0.5">
                Metro Tier 1 &amp; 2 (350 @ ₹30)
              </p>
            </button>
          </div>

          {/* Sliders Box */}
          <div className="space-y-6 p-6 rounded-2xl bg-[#170E08] border border-[#3D2619]">
            
            {/* 1. Daily Soda Glasses */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#C4B79D] uppercase tracking-wider">Daily Soda Glasses:</span>
                <span className="font-display text-xl font-bold text-[#F5A623]">
                  {dailyGlasses} glasses / day
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={800}
                step={10}
                value={dailyGlasses}
                onChange={(e) => {
                  setActivePreset('custom');
                  setDailyGlasses(Number(e.target.value));
                }}
                className="w-full h-2.5 bg-[#2E1A11] rounded-lg appearance-none cursor-pointer accent-[#F5A623]"
              />
              <div className="flex justify-between text-[10px] text-[#7A6B56] font-semibold">
                <span>50 min</span>
                <span>250 standard</span>
                <span>500 peak</span>
                <span>800 max</span>
              </div>
            </div>

            {/* 2. Average Soda Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#C4B79D] uppercase tracking-wider">Average Soda Price:</span>
                <span className="font-display text-xl font-bold text-[#F5A623]">
                  ₹{sodaPrice} per glass
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={50}
                step={5}
                value={sodaPrice}
                onChange={(e) => {
                  setActivePreset('custom');
                  setSodaPrice(Number(e.target.value));
                }}
                className="w-full h-2.5 bg-[#2E1A11] rounded-lg appearance-none cursor-pointer accent-[#F5A623]"
              />
              <div className="flex justify-between text-[10px] text-[#7A6B56] font-semibold">
                <span>₹15 basic</span>
                <span>₹20 Tier 3</span>
                <span>₹30 Metro</span>
                <span>₹50 Large/Special</span>
              </div>
            </div>

            {/* 3. Daily Ice-Gola Sales */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#C4B79D] uppercase tracking-wider">Daily Ice-Gola Sales:</span>
                <span className="font-display text-xl font-bold text-[#F5A623]">
                  {dailyGola} pcs @ ₹{golaPrice}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={150}
                step={5}
                value={dailyGola}
                onChange={(e) => {
                  setActivePreset('custom');
                  setDailyGola(Number(e.target.value));
                }}
                className="w-full h-2.5 bg-[#2E1A11] rounded-lg appearance-none cursor-pointer accent-[#F5A623]"
              />
              <div className="flex justify-between text-[10px] text-[#7A6B56] font-semibold">
                <span>0 pcs</span>
                <span>30 pcs standard</span>
                <span>75 pcs metro</span>
                <span>150 peak</span>
              </div>
            </div>

          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#A8987E]">
            <ShieldCheck className="w-4 h-4 text-[#F5A623]" />
            <span>Includes 8-tap soda syrup yield &amp; ice-gola unit margins.</span>
          </div>

        </div>

        {/* RIGHT COLUMN: RESULTS CARD & LIVE METRIC LEDGER */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-[#170E08] border border-[#3D2619] space-y-6 shadow-xl">
            
            {/* Top 2 Big Revenue Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Daily Revenue Card */}
              <div className="p-5 rounded-2xl bg-[#24150D] border border-[#422718]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A8987E] block">
                  DAILY PROJECTED REVENUE
                </span>
                <p className="font-display text-3xl sm:text-4xl font-black text-white mt-1">
                  {formatCurrency(dailyTotalRevenue)}
                </p>
                <span className="text-[10px] text-[#7A6B56] block mt-1">
                  ({dailyGlasses} sodas + {dailyGola} golas)
                </span>
              </div>

              {/* Monthly Revenue Card */}
              <div className="p-5 rounded-2xl bg-[#24150D] border border-[#422718]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5A623] block">
                  MONTHLY PROJECTED REVENUE
                </span>
                <p className="font-display text-3xl sm:text-4xl font-black text-[#F5A623] mt-1">
                  {formatCurrency(monthlyRevenue)}
                </p>
                <span className="text-[10px] text-[#7A6B56] block mt-1">
                  (Based on 30 operational days)
                </span>
              </div>

            </div>

            {/* Detailed Annual Metric Rows */}
            <div className="space-y-3 pt-2">
              
              {/* Annual Gross Turnover */}
              <div className="flex items-center justify-between py-2 border-b border-[#2E1A11]">
                <span className="text-xs sm:text-sm font-semibold text-[#C4B79D]">
                  Annual Projected Gross Turnover:
                </span>
                <span className="font-display text-xl sm:text-2xl font-black text-white">
                  {formatLakhs(annualGrossTurnover)}
                </span>
              </div>

              {/* Net Profit @ 25% */}
              <div className="flex items-center justify-between py-2 border-b border-[#2E1A11]">
                <span className="text-xs sm:text-sm font-semibold text-[#C4B79D]">
                  Estimated Net Profit @ 25%:
                </span>
                <span className="font-display text-xl sm:text-2xl font-black text-[#4ADE80]">
                  {formatLakhs(netProfit25)} / yr
                </span>
              </div>

              {/* Net Profit @ 30% */}
              <div className="flex items-center justify-between py-2 border-b border-[#2E1A11]">
                <span className="text-xs sm:text-sm font-semibold text-[#C4B79D]">
                  Estimated Net Profit @ 30%:
                </span>
                <span className="font-display text-xl sm:text-2xl font-black text-[#4ADE80]">
                  {formatLakhs(netProfit30)} / yr
                </span>
              </div>

            </div>

            {/* Bottom Payback & Apply Button Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#24150D] border border-[#422718]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A8987E] block">
                  PROJECTED PAYBACK
                </span>
                <span className="font-display text-2xl sm:text-3xl font-black text-white">
                  18 – 24 Months
                </span>
              </div>

              {onApplyClick ? (
                <button
                  type="button"
                  onClick={onApplyClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E6392F] hover:bg-white hover:text-[#171717] text-white font-display text-lg tracking-wider transition-all shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Apply for Territory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href="#inquiry-form"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E6392F] hover:bg-white hover:text-[#171717] text-white font-display text-lg tracking-wider transition-all shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Apply for Territory</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
