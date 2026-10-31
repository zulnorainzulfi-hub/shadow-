import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../../data/initialData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Everything You Need To Know</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-400">
          Got questions about our free tier, server hardware, or connecting Pterodactyl?
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl glass-panel border border-slate-800/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors"
              >
                <span className="text-sm font-bold text-white">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-900/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
