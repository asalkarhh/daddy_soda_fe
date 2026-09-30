import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const VIBES = [
  {
    id: 'fruity',
    title: 'BERRY BLISS',
    mood: 'Sweet & Wild',
    emoji: '🍓',
    accentColor: '#FF2E63',
    bgColor: '#FFF0F3',
    borderColor: '#FFD6DF',
    description: 'Strawberries, blackberries, and juicy bursts.',
  },
  {
    id: 'citrus',
    title: 'CITRUS ZAP',
    mood: 'Tart & Electric',
    emoji: '🍋',
    accentColor: '#7CB518',
    bgColor: '#F7FEE7',
    borderColor: '#E2F7B0',
    description: 'Fresh Persian limes, lemons, and sparkling soda.',
  },
  {
    id: 'fruity',
    title: 'TROPICAL PUNCH',
    mood: 'Sunny & Exotic',
    emoji: '🥭',
    accentColor: '#FFAA00',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    description: 'Alphonso mangoes, passion fruit & popping boba.',
  },
  {
    id: 'classic',
    title: 'WILD CHERRY',
    mood: 'Bold & Rebellious',
    emoji: '🍒',
    accentColor: '#D90429',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    description: 'Craft colas spiked with rich dark cherry extract.',
  },
  {
    id: 'creamy',
    title: 'CREAM CLOUD',
    mood: 'Velvety & Dirty',
    emoji: '🍦',
    accentColor: '#B08968',
    bgColor: '#FDFBF7',
    borderColor: '#E8D9BD',
    description: 'Cold foams, coconut creams, and marble swirls.',
  },
];

export default function VibeFilter() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF2E2] border-y border-[#E8D9BD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E6392F]">
              FIND YOUR FLAVOR PROFILE
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-black text-[#171717] tracking-tight mt-1">
              WHAT&apos;S YOUR MOOD?
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 font-display text-lg text-[#171717] hover:text-[#E6392F] transition-colors group"
          >
            <span>VIEW ALL 18+ DRINKS</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Vibe Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {VIBES.map((vibe) => (
            <Link
              key={vibe.title}
              to={`/menu?cat=${vibe.id}`}
              className="group relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border flex flex-col justify-between overflow-hidden cursor-pointer"
              style={{
                backgroundColor: vibe.bgColor,
                borderColor: vibe.borderColor,
              }}
            >
              {/* Top Accent Pill */}
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase text-[#7A6B56]">
                  {vibe.mood}
                </span>
                <span className="w-7 h-7 rounded-full bg-white/80 border border-[#E8D9BD] flex items-center justify-center text-[#171717] group-hover:bg-[#171717] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Big Animated Emoji */}
              <div className="py-6 text-center">
                <span className="inline-block text-5xl sm:text-6xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 filter drop-shadow-sm">
                  {vibe.emoji}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="font-display text-2xl font-black text-[#171717] tracking-tight leading-tight">
                  {vibe.title}
                </h3>
                <p className="text-xs text-[#7A6B56] line-clamp-2">
                  {vibe.description}
                </p>
              </div>

              {/* Hover bottom color bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: vibe.accentColor }}
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
