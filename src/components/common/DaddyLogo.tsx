interface DaddyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'logo-only' | 'full' | 'badge';
  dark?: boolean;
}

export default function DaddyLogo({
  className = '',
  size = 'lg',
  variant = 'logo-only',
  dark = false,
}: DaddyLogoProps) {
  const sizeClasses = {
    sm: 'h-12 sm:h-14 w-auto',
    md: 'h-16 sm:h-18 w-auto',
    lg: 'h-20 sm:h-24 md:h-26 w-auto',
    xl: 'h-28 sm:h-32 md:h-36 w-auto',
    '2xl': 'h-36 sm:h-44 md:h-52 w-auto',
  };

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#701A1A]/10 border border-[#701A1A]/20 text-[#701A1A] ${className}`}>
        <HimmatEmblem className="w-4 h-4" />
        <span className="text-xs font-black tracking-wider uppercase">Himmat Group • Est. 1973</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* High-Fidelity Brand Logo Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]}`}>
        <svg
          viewBox="18 -18 214 150"
          className="h-full w-auto drop-shadow-md overflow-visible transition-transform duration-200 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c8b3" />
              <stop offset="50%" stopColor="#009688" />
              <stop offset="100%" stopColor="#005b52" />
            </linearGradient>
            <linearGradient id="sodaBanner" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="50%" stopColor="#F8E71C" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="45%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2D4B7" />
            </linearGradient>
            <filter id="shadow" x="-15%" y="-15%" width="135%" height="135%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Liquid Splash */}
          <g filter="url(#shadow)">
            <path
              d="M 45 75 C 28 48, 55 15, 88 22 C 115 8, 155 12, 180 38 C 215 22, 235 58, 218 85 C 228 112, 195 136, 155 128 C 122 140, 72 132, 50 106 C 32 98, 28 84, 45 75 Z"
              fill="url(#splashGrad)"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
            {/* Droplets & Sparkles */}
            <circle cx="34" cy="36" r="6" fill="#00c8b3" stroke="#FFF" strokeWidth="2" />
            <circle cx="225" cy="30" r="5" fill="#00c8b3" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="236" cy="70" r="4.5" fill="#F8E71C" stroke="#FFF" strokeWidth="1" />
            <circle cx="214" cy="118" r="7" fill="#00c8b3" stroke="#FFF" strokeWidth="2" />
            <circle cx="30" cy="95" r="4" fill="#E6392F" stroke="#FFF" strokeWidth="1" />
            <polygon points="78,14 80,20 86,21 81,25 83,30 78,27 73,30 75,25 70,21 76,20" fill="#F8E71C" />
            <polygon points="196,24 198,29 204,30 200,33 202,39 196,36 190,39 192,33 188,30 194,29" fill="#F8E71C" />
          </g>

          {/* Pop Bottle popping out */}
          <g transform="translate(118, 8) rotate(12)">
            <rect x="0" y="0" width="13" height="20" rx="2.5" fill="#005b52" stroke="#FFF" strokeWidth="1.5" />
            <rect x="-1" y="-3" width="15" height="5" rx="1.5" fill="#E6392F" stroke="#FFF" strokeWidth="1.5" />
            <path d="M 6.5 -3 L 6.5 -18 L 15 -26" fill="none" stroke="#E6392F" strokeWidth="4" strokeLinecap="round" />
            <path d="M 6.5 -3 L 6.5 -18 L 15 -26" fill="none" stroke="#FFF" strokeWidth="4" strokeDasharray="4,4" strokeLinecap="round" />
            <path d="M -3 20 L 16 20 L 22 58 L -9 58 Z" fill="#008374" stroke="#FFF" strokeWidth="1.5" />
            <circle cx="6.5" cy="32" r="2.5" fill="#FFF" opacity="0.85" />
            <circle cx="2" cy="46" r="2" fill="#FFF" opacity="0.85" />
            <circle cx="11" cy="42" r="2" fill="#FFF" opacity="0.85" />
          </g>

          {/* 3D Bold Script "Daddy" text */}
          <g filter="url(#shadow)">
            <text
              x="126"
              y="90"
              textAnchor="middle"
              fontFamily="Impact, 'Arial Black', sans-serif"
              fontSize="58"
              fontStyle="italic"
              fontWeight="900"
              fill="#701A1A"
              letterSpacing="0.5"
            >
              Daddy
            </text>
            <text
              x="124"
              y="88"
              textAnchor="middle"
              fontFamily="Impact, 'Arial Black', sans-serif"
              fontSize="58"
              fontStyle="italic"
              fontWeight="900"
              fill="#C8232C"
              letterSpacing="0.5"
            >
              Daddy
            </text>
            <text
              x="122"
              y="85"
              textAnchor="middle"
              fontFamily="Impact, 'Arial Black', sans-serif"
              fontSize="58"
              fontStyle="italic"
              fontWeight="900"
              fill="url(#textGrad)"
              stroke="#6b0d0d"
              strokeWidth="4.5"
              paintOrder="stroke fill"
              letterSpacing="0.5"
            >
              Daddy
            </text>
          </g>

          {/* "TM" */}
          <circle cx="218" cy="46" r="9" fill="#171717" stroke="#FFF" strokeWidth="1.5" />
          <text x="218" y="50" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFF">TM</text>

          {/* SODA HOUSE Golden Ribbon */}
          <g transform="translate(36, 102)">
            <polygon points="0,14 -12,0 -12,28" fill="#B76E00" />
            <polygon points="180,14 192,0 192,28" fill="#B76E00" />
            <path
              d="M -4 4 Q 90 -7 184 4 L 180 27 Q 90 17 -4 27 Z"
              fill="url(#sodaBanner)"
              stroke="#6b0d0d"
              strokeWidth="2.5"
            />
            <text
              x="90"
              y="18"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
              fontSize="14"
              fontWeight="900"
              letterSpacing="3.5"
              fill="#4A0E0E"
            >
              SODA HOUSE
            </text>
          </g>
        </svg>
      </div>

      {/* Optional Brand Text (if variant is full) */}
      {variant === 'full' && (
        <div className="flex flex-col justify-center ml-2.5">
          <div className="flex items-center gap-1">
            <span
              className={`font-display text-xl sm:text-2xl font-black tracking-tight leading-none ${
                dark ? 'text-white' : 'text-[#171717]'
              }`}
            >
              Daddy SODA HOUSE
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#701A1A] mt-0.5">
            HIMMAT BEVERAGES PVT. LTD.
          </span>
          <span className={`text-[9px] font-medium ${dark ? 'text-[#C4B79D]' : 'text-[#7A6B56]'}`}>
            A Venture of Himmat Group • Est. 1973
          </span>
        </div>
      )}
    </div>
  );
}

export function HimmatEmblem({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
        <polygon points="50,6 92,28 92,72 50,94 8,72 8,28" fill="#6B240C" stroke="#E69542" strokeWidth="6" />
        <path d="M33,32 L33,68 M67,32 L67,68 M33,50 L67,50" stroke="#FFF8ED" strokeWidth="12" strokeLinecap="round" />
      </svg>
    </div>
  );
}
