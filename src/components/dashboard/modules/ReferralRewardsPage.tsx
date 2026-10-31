import React, { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle2, DollarSign, Users, Award, ExternalLink, Zap } from 'lucide-react';
import { ReferralSummary } from '../../../types';

export const ReferralRewardsPage: React.FC = () => {
  const [data, setData] = useState<ReferralSummary>({
    code: 'SHADOW-PRO-77',
    referralUrl: 'https://shadowhost.io/ref/SHADOW-PRO-77',
    totalClicks: 142,
    totalSignups: 18,
    activeServersReferred: 7,
    totalEarningsUsd: 49.50,
    availableBalanceUsd: 35.50,
    claimedUpgrades: ['+2GB RAM Bonus', 'Free Dedicated IP'],
  });
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/referrals')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = async (reward: string) => {
    const res = await fetch('/api/referrals/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reward }),
    });
    const d = await res.json();
    setData((prev) => ({
      ...prev,
      claimedUpgrades: [...prev.claimedUpgrades, reward],
    }));
    setFeedback(d.message || `Claimed ${reward}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Referral Rewards & Affiliates</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                25% COMMISSION & UPGRADES
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Share your unique invite link with friends and server creators to unlock permanent free RAM upgrades and cash rewards
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Referral Link Bar */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 to-cyan-950/30">
        <div>
          <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">YOUR UNIQUE INVITE LINK</span>
          <code className="text-sm font-mono font-bold text-white bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
            {data.referralUrl}
          </code>
        </div>

        <button
          onClick={handleCopyLink}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-cyan-600 hover:bg-cyan-500 text-black flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.4)]"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Link Copied!' : 'Copy Referral Link'}</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">TOTAL CLICKS</span>
          <div className="text-3xl font-black text-white">{data.totalClicks}</div>
          <span className="text-[10px] text-cyan-400 font-mono">12.6% Conversion Rate</span>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">USERS REGISTERED</span>
          <div className="text-3xl font-black text-white">{data.totalSignups}</div>
          <span className="text-[10px] text-emerald-400 font-mono">{data.activeServersReferred} Servers Running</span>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">TOTAL EARNINGS</span>
          <div className="text-3xl font-black text-white">${data.totalEarningsUsd.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-400 font-mono">25% Recurring</span>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">AVAILABLE BALANCE</span>
          <div className="text-3xl font-black text-white">${data.availableBalanceUsd.toFixed(2)}</div>
          <span className="text-[10px] text-purple-400 font-mono">Ready for Payout</span>
        </div>
      </div>

      {/* Reward Tiers Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>UNLOCKED MILESTONE REWARD TIERS</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: '+2GB Permanent RAM Upgrade', required: '1 Referral', claimed: true },
            { name: 'Free Dedicated IPv4 Address', required: '3 Referrals', claimed: true },
            { name: '1-Month Free PRO Upgrade', required: '5 Referrals', claimed: false },
            { name: 'Enterprise Diamond VIP Badge', required: '10 Referrals', claimed: false },
          ].map((tier, i) => {
            const isClaimed = data.claimedUpgrades.some((c) => c.includes(tier.name.slice(0, 5))) || tier.claimed;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-bold block w-fit mb-2">
                    {tier.required}
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono">{tier.name}</h4>
                </div>

                <button
                  onClick={() => handleClaim(tier.name)}
                  disabled={isClaimed}
                  className={`w-full py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    isClaimed
                      ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-400'
                      : 'bg-purple-700 hover:bg-purple-600 text-white cursor-pointer'
                  }`}
                >
                  {isClaimed ? 'Claimed & Active' : 'Claim Reward'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
