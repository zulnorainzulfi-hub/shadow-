import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { DEMO_TESTIMONIALS } from '../../data/initialData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-medium">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Feedback (Demo Content for Platform Preview)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Loved by Admins, Modders, and SMP Creators
        </h2>
        <p className="text-xs text-slate-500 font-mono">
          *Testimonials are illustrated demo content representing intended performance benchmarks until public reviews are collected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl glass-panel space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
              </div>
              <div className="text-[10px] font-mono text-purple-400">
                {t.serversRunning} Servers Hosted
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
