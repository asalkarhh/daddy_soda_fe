import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

const HERO_VIDEOS = [
  { id: 1, src: '/video/video1.mp4', title: 'THE CRAFT POUR', step: '01' },
  { id: 2, src: '/video/video2.mp4', title: 'THE DIRTY MIX', step: '02' },
  { id: 3, src: '/video/video3.mp4', title: 'THE FIRST SIP', step: '03' },
];

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parallax tilt on mouse move for the product animation below
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      try {
        videoRef.current.load?.();
        const playPromise = videoRef.current.play?.();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } catch {
        // Safe catch for headless / test environments
      }
    }
  }, [currentVideoIndex]);

  // Sequential progression: Video 1 -> Video 2 -> Video 3 -> loop back to 1
  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
  };

  const currentVideo = HERO_VIDEOS[currentVideoIndex];

  return (
    <div className="w-full bg-[#FFF8ED]">
      
      {/* ─────────────────────────────────────────────────────────────
          1. FIRST ANIMATION: FULL-SCREEN CINEMATIC SEQUENTIAL VIDEO HERO
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[94vh] flex flex-col justify-between overflow-hidden bg-[#171717] text-white">
        
        {/* Full-bleed Background Video - Crystal Clear & Vibrant */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            key={currentVideo.src}
            src={currentVideo.src}
            autoPlay
            playsInline
            muted
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover brightness-[1.08] contrast-[1.05] saturate-[1.08]"
          />
          {/* Very Light Subtle Tint to keep video crisp and colors clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
        </div>

        {/* Center Headline & Call to Action Overlay */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto py-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#701A1A] text-white text-xs font-bold tracking-widest uppercase shadow-lg border border-[#E6A15C]/40">
            <Flame className="w-4 h-4 fill-white" />
            <span>FRANCHISE OPPORTUNITY • HIMMAT BEVERAGES PVT. LTD.</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-black tracking-tight leading-[0.9] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
            Daddy SODA <span className="text-[#F8E71C]">HOUSE</span>
          </h1>

          <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#FAF2E2] tracking-wide uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Refreshing Taste. Consistent Quality. Profitable Partnership.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/franchise"
              className="px-8 py-4 rounded-2xl bg-[#701A1A] text-white font-display text-2xl tracking-wider hover:bg-[#E6392F] transition-all shadow-2xl hover:shadow-red-500/50 hover:-translate-y-1 flex items-center gap-2 group cursor-pointer border border-[#E6A15C]/30"
            >
              <span>EXPLORE FRANCHISE</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/menu"
              className="px-8 py-4 rounded-2xl bg-black/60 backdrop-blur-md border-2 border-white/30 text-white font-display text-2xl tracking-wider hover:bg-white hover:text-[#171717] transition-all shadow-lg hover:-translate-y-1"
            >
              VIEW PRODUCT RANGE
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SECOND ANIMATION (BELOW THE VIDEO):
             ICONIC FLOATING SODA CUP + 4 INGREDIENT CHIPS + RECIPE TICKER
          ───────────────────────────────────────────────────────────── */}
      <section id="product-reveal" className="relative py-20 sm:py-28 overflow-hidden bg-[#FFF8ED] border-b border-[#E8D9BD]">
        
        {/* Soft Background Radial Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#F5E9D0]/70 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FFB000]/10 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Section Heading */}
          <div className="max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F] shadow-xs">
              <Sparkles className="w-4 h-4" />
              <span className="tracking-widest uppercase">THE SIGNATURE MASTERPIECE</span>
            </div>

            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-[#171717] tracking-tight leading-none">
              SIP THE <span className="text-[#E6392F]">REBELLION</span>
            </h2>

            <p className="font-display text-xl sm:text-2xl text-[#7A6B56] uppercase tracking-wide">
              HANDCRAFTED DIRTY SODA WITH VELVETY COLD FOAM & FRESH BOTANICALS
            </p>
          </div>

          {/* Floating Product Cup with 4 Ingredient Callout Chips */}
          <div className="relative max-w-lg mx-auto my-8">
            
            {/* Subtle floating wrapper with mouse parallax */}
            <div
              className="relative transition-transform duration-200 ease-out"
              style={{
                transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
              }}
            >
              {/* Central Soda Cup */}
              <div className="animate-float-subtle relative z-10 mx-auto w-72 sm:w-92 h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/95 bg-white">
                <img
                  src="/images/products/hero-soda.jpg"
                  alt="Daddy Soda Signature Custom Mix"
                  className="w-full h-full object-cover"
                />

                {/* Inner Carbonation Bubbles */}
                <div className="bubble" style={{ left: '20%', bottom: '15%', animationDelay: '0.2s', width: '12px', height: '12px' }} />
                <div className="bubble" style={{ left: '45%', bottom: '25%', animationDelay: '1.1s', width: '8px', height: '8px' }} />
                <div className="bubble" style={{ left: '70%', bottom: '20%', animationDelay: '0.7s', width: '10px', height: '10px' }} />
                <div className="bubble" style={{ left: '35%', bottom: '35%', animationDelay: '1.8s', width: '14px', height: '14px' }} />
                <div className="bubble" style={{ left: '60%', bottom: '40%', animationDelay: '2.3s', width: '9px', height: '9px' }} />
              </div>

              {/* 4 Floating Ingredient Cards */}

              {/* TOP LEFT: STRAWBERRY */}
              <div
                className="absolute -top-6 -left-4 sm:-left-14 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-[#E8D9BD] flex items-center gap-2.5 animate-bobbing"
                style={{ animationDelay: '0.3s' }}
              >
                <span className="text-3xl">🍓</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-[#A8987E]">Wild Puree</p>
                  <p className="font-display text-sm font-bold text-[#171717]">STRAWBERRY</p>
                </div>
              </div>

              {/* TOP RIGHT: PERSIAN LIME */}
              <div
                className="absolute top-1/4 -right-4 sm:-right-14 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-[#E8D9BD] flex items-center gap-2.5 animate-bobbing"
                style={{ animationDelay: '1.1s' }}
              >
                <span className="text-3xl">🍋</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-[#A8987E]">Fresh Squeeze</p>
                  <p className="font-display text-sm font-bold text-[#171717]">PERSIAN LIME</p>
                </div>
              </div>

              {/* BOTTOM LEFT: VANILLA FOAM */}
              <div
                className="absolute bottom-12 -left-6 sm:-left-16 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-[#E8D9BD] flex items-center gap-2.5 animate-bobbing"
                style={{ animationDelay: '1.8s' }}
              >
                <span className="text-3xl">🍦</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-[#A8987E]">Velvety Float</p>
                  <p className="font-display text-sm font-bold text-[#171717]">VANILLA FOAM</p>
                </div>
              </div>

              {/* BOTTOM RIGHT: CRUSHED ICE */}
              <div
                className="absolute bottom-4 -right-4 sm:-right-12 z-20 bg-[#171717] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#333333] flex items-center gap-2.5 animate-bobbing"
                style={{ animationDelay: '1.4s' }}
              >
                <span className="text-3xl">🧊</span>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-[#FFB000]">Extra Chill</p>
                  <p className="font-display text-sm font-bold text-[#FFF8ED]">CRUSHED ICE</p>
                </div>
              </div>

            </div>
          </div>

          {/* Flavor Ingredients Ticker */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-[#7A6B56]">
            <span className="px-3.5 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD]">
              🍓 STRAWBERRY
            </span>
            <span className="text-[#A8987E]">•</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD]">
              🍒 WILD CHERRY
            </span>
            <span className="text-[#A8987E]">•</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD]">
              🍋 TART LIME
            </span>
            <span className="text-[#A8987E]">•</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD]">
              🍦 SWEET VANILLA COLD FOAM
            </span>
            <span className="text-[#A8987E]">•</span>
            <span className="px-3.5 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD]">
              💥 POPPING BOBA
            </span>
          </div>

          {/* Direct CTA under product */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/menu"
              className="px-8 py-3.5 rounded-2xl bg-[#701A1A] hover:bg-[#E6392F] text-white font-display text-xl tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>EXPLORE ALL SIGNATURE FLAVORS</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/franchise"
              className="px-8 py-3.5 rounded-2xl bg-white border border-[#E8D9BD] hover:border-[#171717] text-[#171717] font-display text-xl tracking-wider transition-all shadow-sm hover:-translate-y-0.5"
            >
              <span>FRANCHISE INQUIRY</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
