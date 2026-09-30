import { SodaBase, SodaFlavor, SodaCream, SodaTopping, IceLevel, CupSize } from '@/types';

interface SodaCupCanvasProps {
  base: SodaBase;
  flavors: SodaFlavor[];
  cream: SodaCream | null;
  toppings: SodaTopping[];
  ice: IceLevel;
  size: CupSize;
  drinkName: string;
}

export default function SodaCupCanvas({
  base,
  flavors,
  cream,
  toppings,
  ice,
  size,
  drinkName,
}: SodaCupCanvasProps) {
  // Determine primary flavor tint if any
  const primaryFlavor = flavors.length > 0 ? flavors[0] : null;

  // Ice count
  const iceCount = ice === 'light' ? 2 : ice === 'regular' ? 4 : 6;

  // Check if boba topping selected
  const hasBoba = toppings.some(
    (t) => t.id.includes('boba') || t.id.includes('jelly')
  );

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#FAF2E2] rounded-3xl border border-[#E8D9BD] shadow-lg overflow-hidden min-h-[460px]">
      
      {/* Background Soft Glow matching the liquid */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 transition-colors duration-700 pointer-events-none"
        style={{ backgroundColor: primaryFlavor?.tintColor || base.liquidColor }}
      />

      {/* Floating badge info */}
      <div className="absolute top-4 left-4 z-20">
        <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#171717] text-[#FFF8ED] shadow-xs">
          LIVE CUP VISUALIZER
        </span>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-[#E6392F] border border-[#E8D9BD]">
          {size === 'regular' ? '350 ML' : size === 'large' ? '500 ML' : '750 ML TUB'}
        </span>
      </div>

      {/* SVG Cup Visualizer */}
      <div className="relative w-64 h-80 my-4 flex items-center justify-center">
        
        {/* Straw */}
        <div
          className="absolute -top-10 left-36 w-4 h-32 bg-gradient-to-r from-[#E6392F] via-white to-[#E6392F] rounded-t-full shadow-md z-30 transform rotate-12 transition-transform"
        />

        {/* Lime Garnish on Rim */}
        <div className="absolute -top-3 left-16 z-30 w-12 h-12 rounded-full border-4 border-[#84cc16] bg-[#a3e635]/80 flex items-center justify-center shadow-md transform -rotate-12">
          <div className="w-8 h-8 rounded-full border border-dashed border-[#4d7c0f] flex items-center justify-center text-[10px] font-bold text-[#365314]">
            🍋
          </div>
        </div>

        {/* Cup Glass Container */}
        <div className="relative w-52 h-72 rounded-b-[42px] rounded-t-[14px] border-4 border-white/90 bg-white/10 backdrop-blur-xs shadow-2xl overflow-hidden flex flex-col justify-end">
          
          {/* Glass Specular Highlight Left */}
          <div className="absolute top-0 left-2 w-3 h-full bg-gradient-to-r from-white/40 to-transparent z-20 pointer-events-none rounded-l-full" />
          {/* Glass Specular Highlight Right */}
          <div className="absolute top-0 right-2 w-1.5 h-full bg-gradient-to-l from-white/30 to-transparent z-20 pointer-events-none" />

          {/* Liquid Fill (Heights scale with size) */}
          <div
            className="relative w-full transition-all duration-700 ease-out overflow-hidden"
            style={{
              height: size === 'daddy-tub' ? '92%' : size === 'large' ? '88%' : '82%',
              background: base.liquidGradient,
            }}
          >
            {/* Flavor Syrup Swirl Layer */}
            {primaryFlavor && (
              <div
                className="absolute inset-0 opacity-60 mix-blend-multiply transition-colors duration-500"
                style={{
                  background: `radial-gradient(ellipse at 50% 80%, ${primaryFlavor.tintColor} 0%, transparent 75%)`,
                }}
              />
            )}

            {/* Rising Carbonation Bubbles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="bubble" style={{ left: '20%', bottom: '10%', animationDelay: '0.1s', width: '8px', height: '8px' }} />
              <div className="bubble" style={{ left: '40%', bottom: '25%', animationDelay: '0.9s', width: '6px', height: '6px' }} />
              <div className="bubble" style={{ left: '60%', bottom: '15%', animationDelay: '0.5s', width: '10px', height: '10px' }} />
              <div className="bubble" style={{ left: '80%', bottom: '30%', animationDelay: '1.4s', width: '7px', height: '7px' }} />
              <div className="bubble" style={{ left: '30%', bottom: '40%', animationDelay: '1.8s', width: '9px', height: '9px' }} />
              <div className="bubble" style={{ left: '50%', bottom: '5%', animationDelay: '2.1s', width: '6px', height: '6px' }} />
            </div>

            {/* Floating Boba / Toppings at the bottom */}
            {hasBoba && (
              <div className="absolute bottom-2 inset-x-2 flex flex-wrap justify-center gap-1.5 z-10 animate-in fade-in duration-500">
                {[...Array(14)].map((_, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full bg-[#171717] border border-[#FFB000]/60 shadow-xs flex items-center justify-center transform hover:scale-125 transition-transform"
                    style={{
                      backgroundColor: toppings[0]?.id.includes('strawberry')
                        ? '#d90429'
                        : '#ff9100',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Ice Cubes Floating */}
            <div className="absolute top-4 inset-x-3 flex flex-wrap justify-around gap-2 z-10">
              {[...Array(iceCount)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-lg bg-white/40 border border-white/80 backdrop-blur-xs shadow-xs transform rotate-6 animate-pulse"
                  style={{
                    animationDuration: `${3 + i}s`,
                    transform: `rotate(${(i * 18) - 10}deg)`,
                  }}
                />
              ))}
            </div>

            {/* Cream Foam Layer Swirl on Top */}
            {cream && cream.id !== 'none' && (
              <div
                className="absolute top-0 inset-x-0 h-12 rounded-t-[10px] shadow-md z-15 transition-all duration-500 flex items-center justify-center border-b-2 border-white/60"
                style={{ backgroundColor: cream.color }}
              >
                <div className="w-full text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#7A6B56]/80">
                    {cream.name}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Exterior Condensation Droplets */}
          <div className="absolute bottom-6 left-3 w-1.5 h-2 rounded-full bg-white/70" />
          <div className="absolute bottom-14 left-4 w-1 h-3 rounded-full bg-white/70" />
          <div className="absolute bottom-20 right-4 w-1.5 h-2 rounded-full bg-white/70" />
          <div className="absolute bottom-10 right-6 w-2 h-2 rounded-full bg-white/70" />
        </div>

      </div>

      {/* Drink Title & Tag */}
      <div className="text-center z-10 mt-1">
        <h4 className="font-display text-2xl font-black text-[#171717] tracking-wide">
          {drinkName || 'THE CUSTOM REBEL'}
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold text-[#7A6B56] mt-1">
          <span className="px-2 py-0.5 rounded-md bg-white border border-[#E8D9BD]">
            {base.name}
          </span>
          {flavors.map((f) => (
            <span key={f.id} className="px-2 py-0.5 rounded-md bg-white border border-[#E8D9BD]">
              {f.emoji} {f.name}
            </span>
          ))}
          {cream && cream.id !== 'none' && (
            <span className="px-2 py-0.5 rounded-md bg-[#FFF8ED] border border-[#E8D9BD] text-[#E6392F]">
              🍦 {cream.name}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
