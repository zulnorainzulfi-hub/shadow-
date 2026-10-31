import React from 'react';
import { Check, Sparkles, Zap, ArrowRight, Shield } from 'lucide-react';
import { useServer } from '../../context/ServerContext';
import { HostingPlan } from '../../types';

interface PricingSectionProps {
  onSelectPlan: (plan: HostingPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { plans } = useServer();

  return (
    <section id="plans" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Transparent Pricing · Zero Hidden Fees</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Powerful Minecraft Hosting For Any Scale
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Start 100% free with 8 GB RAM and 50 slots, or unlock enterprise dedicated compute pools as your player base scales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {plans.map((plan) => {
          const isFree = plan.priceMonthly === 0;
          const isPro = plan.id === 'plan-pro';
          const isUltimate = plan.id === 'plan-ultimate';

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                isFree
                  ? 'bg-gradient-to-b from-purple-950/60 via-slate-900/80 to-slate-950 border-2 border-purple-500 shadow-xl shadow-purple-950/40 glow-purple'
                  : isPro
                  ? 'bg-slate-900/70 border border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/50 border border-purple-900/40 hover:border-purple-500/60'
              }`}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-extrabold tracking-wider uppercase shadow-md ${
                    isFree
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                      : 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                      {isFree ? '$0' : `$${plan.priceMonthly.toFixed(2)}`}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {isFree ? 'Forever' : '/month'}
                    </span>
                  </div>
                  {isFree && (
                    <div className="text-[11px] font-mono text-emerald-400 mt-1">
                      No credit card required
                    </div>
                  )}
                </div>

                {/* Key Spec Strip */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">RAM:</span>
                    <span className="text-white font-bold">{plan.ramGb} GB DDR5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Player Slots:</span>
                    <span className="text-cyan-400 font-bold">{plan.playerSlots} Slots</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Storage:</span>
                    <span className="text-white font-bold">{plan.storageGb} GB NVMe</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CPU:</span>
                    <span className="text-purple-300 text-[11px] truncate max-w-[150px]">
                      {plan.cpu}
                    </span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2 text-xs text-slate-300">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-slate-800/60">
                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFree
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50 glow-purple'
                      : 'bg-slate-800 hover:bg-purple-900/60 border border-slate-700 hover:border-purple-500 text-white'
                  }`}
                >
                  <span>{isFree ? 'Claim Free 8GB Server' : 'Deploy This Plan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
