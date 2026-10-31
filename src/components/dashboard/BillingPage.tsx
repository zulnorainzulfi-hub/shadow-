import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Shield,
  Download,
  Receipt,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';
import { useAuth } from '../../context/AuthContext';

export const BillingPage: React.FC = () => {
  const { plans, selectedServer, updateServer } = useServer();
  const { currentUser } = useAuth();
  const [upgradedNotice, setUpgradedNotice] = useState<string | null>(null);

  const currentPlan = plans.find((p) => p.id === selectedServer?.planId) || plans[0];

  const handleUpgrade = (planId: string, planName: string) => {
    if (selectedServer) {
      updateServer(selectedServer.id, { planId });
      setUpgradedNotice(`Upgraded ${selectedServer.name} to ${planName}! Hardware slice scaled.`);
      setTimeout(() => setUpgradedNotice(null), 3500);
    }
  };

  const invoices = [
    { id: 'INV-2026-001', date: '2026-02-01', amount: '$0.00', status: 'PAID', plan: 'Shadow Free Tier' },
    { id: 'INV-2026-002', date: '2026-01-01', amount: '$0.00', status: 'PAID', plan: 'Shadow Free Tier' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-800/40">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Billing & Resource Scaling</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage your hardware subscription, upgrade memory slices, and view invoice archives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-700 text-purple-300 font-bold">
            CURRENT: {currentPlan.name}
          </span>
        </div>
      </div>

      {upgradedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{upgradedNotice}</span>
        </div>
      )}

      {/* Available Tier Upgrades */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-mono text-white uppercase tracking-wider">
          Available Subscription Tiers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrent = p.id === currentPlan.id;
            const isFree = p.priceMonthly === 0;

            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl glass-panel border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent
                    ? 'border-cyan-500/70 shadow-lg shadow-cyan-950/20'
                    : 'border-slate-800 hover:border-purple-500/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-mono text-white tabular-nums">
                      {isFree ? '$0' : `$${p.priceMonthly.toFixed(2)}`}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {isFree ? 'Forever' : '/mo'}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs text-slate-300 pt-1 border-t border-slate-800">
                    <div>{p.ramGb} GB DDR5 RAM</div>
                    <div>{p.playerSlots} Slots</div>
                    <div>{p.storageGb} GB NVMe</div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpgrade(p.id, p.name)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-default'
                      : 'bg-purple-700 hover:bg-purple-600 text-white shadow-md'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : isFree ? 'Switch to Free Tier' : 'Upgrade to Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono text-slate-300 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-cyan-400" />
            <span>INVOICE ARCHIVE & RECEIPTS</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Auto-billed monthly</span>
        </div>

        <div className="divide-y divide-slate-800">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 flex items-center justify-between font-mono text-xs">
              <div>
                <div className="text-white font-bold">{inv.id}</div>
                <div className="text-slate-500 text-[11px]">{inv.plan} · {inv.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-bold">{inv.amount}</span>
                <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                  {inv.status}
                </span>
                <button
                  onClick={() => alert(`Downloaded receipt ${inv.id}`)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
