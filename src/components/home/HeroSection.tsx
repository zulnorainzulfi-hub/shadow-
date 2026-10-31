import React, { useState } from 'react';
import { Server, ArrowRight, Zap, Shield, Sparkles, CheckCircle2, Play } from 'lucide-react';
import heroNodeImg from '../../assets/images/hero_minecraft_node_1793449319119.jpg';

interface HeroSectionProps {
  onGetStartedFree: () => void;
  onViewPlans: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedFree, onViewPlans }) => {
  const [quickServerName, setQuickServerName] = useState('My-Shadow-World');

  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-6">
      {/* Dynamic Purple & Neon Blue Light Flares */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-mono font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>100% FREE TIER AVAILABLE</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-300 font-bold">8 GB DDR5 RAM INCLUDED</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                POWER YOUR <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">MINECRAFT WORLD</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed">
                Premium Minecraft Hosting. Powerful Performance. Affordable Plans.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Experience ultra-smooth 20.0 TPS gameplay powered by dedicated AMD Ryzen 9 7950X3D processors and Gen4 NVMe arrays. Start free forever or scale to massive 500-player communities.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onGetStartedFree}
                className="px-7 py-3.5 text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2.5 cursor-pointer glow-purple-lg"
              >
                <Zap className="w-4 h-4 text-cyan-200" />
                <span>GET STARTED FREE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewPlans}
                className="px-6 py-3.5 text-sm font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-purple-800/50 hover:border-purple-500 rounded-xl transition-all flex items-center gap-2 cursor-pointer glass-panel"
              >
                <span>VIEW PLANS</span>
              </button>
            </div>

            {/* Trust bullet markers */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Instant ~2.8s Provisioning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>CosmicGuard 3.2 Tbps DDoS Shield</span>
              </div>
            </div>
          </div>

          {/* Right Hero Frame: Glass Card with Live Server Node Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-slate-950 shadow-2xl shadow-purple-950/30 group">
              <img
                src={heroNodeImg}
                alt="Shadow Host enterprise hardware rack"
                className="w-full h-[380px] object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />

              {/* Floating Live Telemetry Badge */}
              <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/75 border border-purple-500/40 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold">NODE DE-01 (Frankfurt)</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-300">
                  Fixed 20.00 TPS · 14ms latency
                </div>
              </div>

              {/* Floating Free Tier Badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-purple-900/80 border border-purple-400/60 backdrop-blur-md text-xs font-mono font-bold text-white shadow-lg">
                8 GB FREE FOREVER
              </div>

              {/* Bottom Interactive Spec Bar */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#080B14]/90 border border-purple-500/30 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">HARDWARE CORE</span>
                  <span className="text-cyan-400 font-bold">AMD Ryzen 9 7950X3D (5.7 GHz)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">MEMORY</div>
                    <div className="text-white font-bold">DDR5 ECC</div>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">STORAGE</div>
                    <div className="text-white font-bold">Gen4 NVMe</div>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">NETWORK</div>
                    <div className="text-white font-bold">10 Gbps Port</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Hosting Statistics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-5 rounded-xl glass-panel text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400 tabular-nums">
              18,400+
            </div>
            <div className="text-xs text-slate-400 font-mono">ACTIVE MINECRAFT SERVERS</div>
          </div>

          <div className="p-5 rounded-xl glass-panel text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
              99.99%
            </div>
            <div className="text-xs text-slate-400 font-mono">GUARANTEED HARDWARE SLA</div>
          </div>

          <div className="p-5 rounded-xl glass-panel text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
              20.00
            </div>
            <div className="text-xs text-slate-400 font-mono">LOCKED TICK RATE (TPS)</div>
          </div>

          <div className="p-5 rounded-xl glass-panel text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400 tabular-nums">
              4 REGIONS
            </div>
            <div className="text-xs text-slate-400 font-mono">GLOBAL LOW-LATENCY NODES</div>
          </div>
        </div>
      </div>
    </section>
  );
};
