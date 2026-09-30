import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Sliders, GlassWater, Droplets, Layers, CircleDot } from 'lucide-react';

export default function BuilderTeaser() {
  const steps = [
    { num: '01', title: 'CHOOSE BASE', desc: 'Cola, Lemon-Lime, Root Beer, Energy, Pure Soda', icon: GlassWater },
    { num: '02', title: 'INFUSE FLAVOR', desc: 'Cherry, Mango, Blue Raspberry, Lime Squeeze', icon: Droplets },
    { num: '03', title: 'MAKE IT CREAMY', desc: 'Vanilla Cold Foam, Whipped Coconut Cloud', icon: Layers },
    { num: '04', title: 'ADD EXTRAS', desc: 'Popping Boba, Jelly Cubes, Fizzy Crackle', icon: CircleDot },
    { num: '05', title: 'CHILL & SIZE', desc: 'Light, Regular, Extra Ice • 350ml to 750ml Tub', icon: Sliders },
  ];

  return (
    <section className="relative bg-[#171717] text-[#FFF8ED] py-20 sm:py-28 overflow-hidden border-y-4 border-[#E6392F]">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E6392F]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFB000]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtitle */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#242424] border border-[#3A3A3A] text-xs font-bold text-[#FFB000] mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="tracking-widest uppercase">THE SIGNATURE SODA STUDIO</span>
        </div>

        {/* Heading */}
        <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mb-4">
          BUILD IT <span className="text-[#E6392F]">YOUR WAY</span>
        </h2>
        <p className="font-display text-2xl sm:text-3xl text-[#C4B79D] tracking-wide uppercase max-w-2xl mx-auto mb-12">
          DON&apos;T DRINK ORDINARY. BECOME YOUR OWN SODA MIXOLOGIST.
        </p>

        {/* Interactive Step Timeline Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14 text-left">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#242424]/80 backdrop-blur-xs p-5 rounded-2xl border border-[#3A3A3A] hover:border-[#E6392F] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-xs text-[#FFB000] tracking-widest">
                    STEP {step.num}
                  </span>
                  <Icon className="w-5 h-5 text-[#C4B79D] group-hover:text-[#E6392F] transition-colors" />
                </div>
                <h3 className="font-display text-xl font-bold text-white tracking-wide mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-[#8C806A] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Central CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/build"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-[#E6392F] text-white font-display text-2xl tracking-wider hover:bg-white hover:text-[#171717] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 group"
          >
            <span>BUILD MY SODA NOW</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-xs font-bold text-[#8C806A] uppercase tracking-wider">
            Starting from ₹69 • Real-Time Visual Cup Preview
          </span>
        </div>

      </div>
    </section>
  );
}
