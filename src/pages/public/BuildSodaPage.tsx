import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, RefreshCw } from 'lucide-react';
import SodaCupCanvas from '@/components/builder/SodaCupCanvas';
import {
  SODA_BASES,
  SODA_FLAVORS,
  SODA_CREAMS,
  SODA_TOPPINGS,
  SIZE_CONFIG,
  ICE_OPTIONS,
} from '@/data/builderOptions';
import { SodaBase, SodaFlavor, SodaCream, SodaTopping, CupSize, IceLevel } from '@/types';
import { useCart } from '@/contexts/CartContext';

export const BuildSodaPage: React.FC = () => {
  const { addCustomSoda, setIsDrawerOpen } = useCart();

  const [selectedBase, setSelectedBase] = useState<SodaBase>(SODA_BASES[0]);
  const [selectedFlavors, setSelectedFlavors] = useState<SodaFlavor[]>([SODA_FLAVORS[0]]);
  const [selectedCream, setSelectedCream] = useState<SodaCream | null>(SODA_CREAMS[1]);
  const [selectedToppings, setSelectedToppings] = useState<SodaTopping[]>([SODA_TOPPINGS[0]]);
  const [selectedSize, setSelectedSize] = useState<CupSize>('regular');
  const [selectedIce, setSelectedIce] = useState<IceLevel>('regular');
  const [customName, setCustomName] = useState('THE DADDY SIGNATURE');

  // Toggle flavor selection (up to 3)
  const toggleFlavor = (flavor: SodaFlavor) => {
    if (selectedFlavors.some((f) => f.id === flavor.id)) {
      if (selectedFlavors.length > 1) {
        setSelectedFlavors((prev) => prev.filter((f) => f.id !== flavor.id));
      }
    } else {
      if (selectedFlavors.length < 3) {
        setSelectedFlavors((prev) => [...prev, flavor]);
      }
    }
  };

  // Toggle topping selection (up to 2)
  const toggleTopping = (topping: SodaTopping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings((prev) => prev.filter((t) => t.id !== topping.id));
    } else {
      if (selectedToppings.length < 2) {
        setSelectedToppings((prev) => [...prev, topping]);
      }
    }
  };

  // Calculate total price
  const basePrice = selectedBase.price;
  const flavorPrice = selectedFlavors.reduce((sum, f) => sum + f.price, 0);
  const creamPrice = selectedCream?.price || 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const sizePrice = SIZE_CONFIG[selectedSize].addPrice;

  const totalPrice = basePrice + flavorPrice + creamPrice + toppingsPrice + sizePrice;

  const handleAddToCart = () => {
    addCustomSoda({
      id: `custom-${Date.now()}`,
      customName: customName.trim() || 'Custom Soda Rebel',
      base: selectedBase,
      flavors: selectedFlavors,
      cream: selectedCream,
      toppings: selectedToppings,
      ice: selectedIce,
      size: selectedSize,
      totalPrice,
    });
    setIsDrawerOpen(true);
  };

  const handleReset = () => {
    setSelectedBase(SODA_BASES[0]);
    setSelectedFlavors([SODA_FLAVORS[0]]);
    setSelectedCream(SODA_CREAMS[1]);
    setSelectedToppings([SODA_TOPPINGS[0]]);
    setSelectedSize('regular');
    setSelectedIce('regular');
    setCustomName('THE DADDY SIGNATURE');
  };

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-8 pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F] mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="tracking-widest uppercase">INTERACTIVE CUSTOM SODA LAB</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-[#171717] tracking-tight leading-none mb-3">
            BUILD YOUR REBEL SODA
          </h1>
          <p className="text-sm sm:text-base text-[#7A6B56]">
            Choose your base fizzy fountain, blend fruit purees, top with sweet cold foam, and add juicy popping boba.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Sticky Cup Visualizer */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <SodaCupCanvas
              base={selectedBase}
              flavors={selectedFlavors}
              cream={selectedCream}
              toppings={selectedToppings}
              ice={selectedIce}
              size={selectedSize}
              drinkName={customName}
            />

            {/* Price Card & Action */}
            <div className="p-6 bg-white rounded-3xl border border-[#E8D9BD] shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8987E] block">
                    TOTAL ESTIMATED PRICE
                  </span>
                  <span className="font-display text-3xl font-black text-[#E6392F]">
                    ₹{totalPrice}
                  </span>
                </div>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-[#E8D9BD] text-xs font-bold text-[#7A6B56] hover:text-[#171717] flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-2xl bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-xl tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>ADD TO DADDY CART</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D9BD] shadow-sm">
            
            {/* Step 0: Drink Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#7A6B56] mb-2">
                Step 1: Name Your Creation
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Give your custom soda a cool name..."
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF2E2] border border-[#E8D9BD] font-display text-xl tracking-wide text-[#171717] focus:outline-none focus:border-[#701A1A]"
              />
            </div>

            {/* Step 1: Base Soda */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#7A6B56]">
                  Step 2: Choose Fountain Soda Base
                </label>
                <span className="text-xs font-bold text-[#E6392F]">
                  Selected: {selectedBase.name} (₹{selectedBase.price})
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SODA_BASES.map((base) => {
                  const isSelected = selectedBase.id === base.id;
                  return (
                    <button
                      key={base.id}
                      type="button"
                      onClick={() => setSelectedBase(base)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#701A1A] bg-[#FAF2E2] ring-2 ring-[#701A1A]'
                          : 'border-[#E8D9BD] bg-white hover:border-[#171717]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black/5 text-[#7A6B56]">
                          {base.tag}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#701A1A]" />}
                      </div>
                      <p className="font-display text-base font-bold text-[#171717] mt-2">
                        {base.name}
                      </p>
                      <span className="text-xs font-bold text-[#E6392F]">₹{base.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Flavors */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#7A6B56]">
                  Step 3: Infuse Syrups &amp; Purees (Pick up to 3)
                </label>
                <span className="text-xs font-bold text-[#A8987E]">
                  {selectedFlavors.length}/3 chosen
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SODA_FLAVORS.map((flavor) => {
                  const isSelected = selectedFlavors.some((f) => f.id === flavor.id);
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => toggleFlavor(flavor)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#701A1A] bg-[#FAF2E2] ring-1 ring-[#701A1A]'
                          : 'border-[#E8D9BD] bg-white hover:border-[#171717]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{flavor.emoji}</div>
                      <p className="font-display text-sm font-bold text-[#171717] truncate">
                        {flavor.name}
                      </p>
                      <span className="text-[11px] font-bold text-[#7A6B56]">+₹{flavor.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Cold Foam & Creams */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-[#7A6B56] block">
                Step 4: Top with Cold Foam or Cream
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SODA_CREAMS.map((cream) => {
                  const isSelected = selectedCream?.id === cream.id;
                  return (
                    <button
                      key={cream.id}
                      type="button"
                      onClick={() => setSelectedCream(cream)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#701A1A] bg-[#FAF2E2] ring-1 ring-[#701A1A]'
                          : 'border-[#E8D9BD] bg-white hover:border-[#171717]'
                      }`}
                    >
                      <p className="font-display text-sm font-bold text-[#171717] truncate">
                        {cream.name}
                      </p>
                      <span className="text-[11px] font-bold text-[#7A6B56]">
                        {cream.price === 0 ? 'Free' : `+₹${cream.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Toppings & Boba */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#7A6B56]">
                  Step 5: Add Popping Boba &amp; Garnishes (Up to 2)
                </label>
                <span className="text-xs font-bold text-[#A8987E]">
                  {selectedToppings.length}/2 chosen
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SODA_TOPPINGS.map((topping) => {
                  const isSelected = selectedToppings.some((t) => t.id === topping.id);
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => toggleTopping(topping)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#701A1A] bg-[#FAF2E2] ring-1 ring-[#701A1A]'
                          : 'border-[#E8D9BD] bg-white hover:border-[#171717]'
                      }`}
                    >
                      <div>
                        <p className="font-display text-base font-bold text-[#171717]">
                          {topping.name}
                        </p>
                        <p className="text-[11px] text-[#7A6B56]">{topping.description}</p>
                      </div>
                      <span className="text-xs font-bold text-[#E6392F] shrink-0 ml-2">
                        +₹{topping.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Cup Size & Ice Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#E8D9BD]">
              {/* Size */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#7A6B56] block">
                  Cup Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(SIZE_CONFIG) as CupSize[]).map((sizeKey) => {
                    const cfg = SIZE_CONFIG[sizeKey];
                    const isSelected = selectedSize === sizeKey;
                    return (
                      <button
                        key={sizeKey}
                        type="button"
                        onClick={() => setSelectedSize(sizeKey)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#701A1A] bg-[#701A1A] text-white'
                            : 'border-[#E8D9BD] bg-white text-[#171717]'
                        }`}
                      >
                        <p className="font-display text-sm font-bold">{cfg.label}</p>
                        <span className="text-[10px] block opacity-80">{cfg.volume}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ice Level */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-[#7A6B56] block">
                  Ice Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ICE_OPTIONS.map((opt) => {
                    const isSelected = selectedIce === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedIce(opt.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#701A1A] bg-[#701A1A] text-white'
                            : 'border-[#E8D9BD] bg-white text-[#171717]'
                        }`}
                      >
                        <p className="font-display text-sm font-bold">{opt.label}</p>
                        <span className="text-[10px] block opacity-80">{opt.percentage}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BuildSodaPage;
