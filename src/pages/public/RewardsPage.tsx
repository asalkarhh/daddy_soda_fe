import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import { useRewards } from '@/contexts/RewardsContext';

export const RewardsPage: React.FC = () => {
  const { points, targetPoints, tier } = useRewards();

  return (
    <div className="min-h-screen bg-[#FFF8ED] pt-12 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E2] border border-[#E8D9BD] text-xs font-bold text-[#E6392F]">
          <Gift className="w-4 h-4" />
          <span className="tracking-widest uppercase">Daddy SODA REWARDS CLUB</span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-black text-[#171717] tracking-tight leading-none">
          SIP SODA. EARN PERKS.
        </h1>

        <div className="p-8 bg-white rounded-3xl border border-[#E8D9BD] shadow-lg max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#7A6B56]">Your Status</span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E6392F] text-white">
              {tier}
            </span>
          </div>

          <div className="py-4">
            <span className="font-display text-6xl font-black text-[#E6392F] block">
              {points}
            </span>
            <span className="text-xs font-bold text-[#A8987E] uppercase tracking-wider">
              REWARD POINTS AVAILABLE
            </span>
          </div>

          <div className="w-full bg-[#FAF2E2] h-3 rounded-full overflow-hidden">
            <div
              className="bg-[#E6392F] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (points / targetPoints) * 100)}%` }}
            />
          </div>

          <p className="text-xs text-[#7A6B56]">
            {points >= targetPoints
              ? '🎉 You have unlocked a FREE draft soda reward!'
              : `${targetPoints - points} more points to your next FREE draft soda!`}
          </p>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              to="/menu"
              className="w-full py-3.5 rounded-xl bg-[#E6392F] text-white font-display text-lg tracking-wider hover:bg-[#171717] transition-all flex items-center justify-center gap-2"
            >
              <span>EXPLORE MENU & EARN</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/franchise"
              className="w-full py-3 rounded-xl border border-[#E8D9BD] text-[#171717] font-display text-base tracking-wider hover:bg-[#FAF2E2] transition-all"
            >
              FRANCHISE PARTNERSHIP INQUIRY
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
