import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '../../types/public.types';

interface FaqAccordionProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || '']);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={`border rounded-xl transition-all ${
              isOpen
                ? 'bg-teal-50/40 border-teal-200/80 shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-teal-200'
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
              className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
            >
              <span className="text-sm sm:text-base">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-teal-700 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-teal-100/60">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
