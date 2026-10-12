import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CinematicSection() {
  return (
    <section className="relative h-[480px] sm:h-[560px] overflow-hidden flex items-center justify-center border-b border-[#E8D9BD]">
      {/* Background Cinematic Visual */}
      <img
        src="/images/photography/soda-pour-banner.jpg"
        alt="Daddy Soda Pour Mix Shake Sip Cinematic"
        className="w-full h-full object-cover scale-105 transition-transform duration-1000 ease-out absolute inset-0"
      />

      {/* Dark Film Grain & Amber Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/75" />

      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="bubble" style={{ left: '15%', bottom: '10%', animationDelay: '0.4s', width: '14px', height: '14px' }} />
        <div className="bubble" style={{ left: '40%', bottom: '20%', animationDelay: '1.2s', width: '10px', height: '10px' }} />
        <div className="bubble" style={{ left: '65%', bottom: '15%', animationDelay: '0.8s', width: '12px', height: '12px' }} />
        <div className="bubble" style={{ left: '85%', bottom: '25%', animationDelay: '2.0s', width: '16px', height: '16px' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-[#FFB000]">
          <Sparkles className="w-4 h-4" />
          <span>CRAFT PROCESS • REVOLUTIONARY FIZZ</span>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-wider leading-none text-white drop-shadow-lg">
          POUR • MIX • SHAKE • SIP
        </h2>

        <p className="font-display text-lg sm:text-2xl text-[#FAF2E2] tracking-wide max-w-xl mx-auto drop-shadow-md">
          Pure mountain carbonation collided with rich cane sugars, velvety dairy-free foams, and wild fruit bursts.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/story"
            className="px-6 py-3 rounded-xl bg-white text-[#171717] font-display text-lg tracking-wider hover:bg-[#E6392F] hover:text-white transition-all shadow-lg hover:-translate-y-0.5"
          >
            50+ YR LEGACY
          </Link>
          <Link
            to="/franchise"
            className="px-6 py-3 rounded-xl bg-[#E6392F] text-white font-display text-lg tracking-wider hover:bg-white hover:text-[#171717] transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 border border-[#E6A15C]/30"
          >
            <span>FRANCHISE INQUIRY</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
