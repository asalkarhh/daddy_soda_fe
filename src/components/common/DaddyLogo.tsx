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
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6392F]/10 border border-[#E6392F]/20 text-[#E6392F] ${className}`}>
        <HimmatEmblem className="w-4 h-4" />
        <span className="text-xs font-black tracking-wider uppercase">Himmat Group • Est. 1973</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {/* Brand Logo Image from /logo.png */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]}`}>
        <img
          src="/logo.png"
          alt="Daddy Soda House"
          className="h-full w-auto object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-105"
        />
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6392F] mt-0.5">
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
