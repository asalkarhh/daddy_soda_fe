import React from 'react';
import { Sparkles, GlassWater } from 'lucide-react';
import { FlavourItem } from '../../types/public.types';

interface FlavourCardProps {
  flavour: FlavourItem;
}

export const FlavourCard: React.FC<FlavourCardProps> = ({ flavour }) => {
  return (
    <div
      className={`rounded-2xl border ${flavour.colorScheme.border} ${flavour.colorScheme.bg} p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden`}
    >
      {/* Decorative background accent circle */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/40 blur-xl pointer-events-none" />

      <div>
        {/* Top bar with Category and Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {flavour.category}
          </span>
          {flavour.badge && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${flavour.colorScheme.badgeBg} ${flavour.colorScheme.badgeText}`}
            >
              <Sparkles className="w-3 h-3" />
              {flavour.badge}
            </span>
          )}
        </div>

        {/* Visual Drink Icon / Graphic */}
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center mb-4 text-teal-800 group-hover:scale-105 transition-transform">
          <GlassWater className="w-7 h-7" />
        </div>

        {/* Name and Tagline */}
        <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-teal-900 transition-colors">
          {flavour.name}
        </h4>
        <p className="text-xs font-semibold text-teal-800 mt-0.5 mb-2">
          {flavour.tagline}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {flavour.description}
        </p>
      </div>

      {/* Card bottom indicator */}
      <div className="pt-5 mt-4 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium">100% Food-Grade Formulation</span>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
};

export default FlavourCard;
