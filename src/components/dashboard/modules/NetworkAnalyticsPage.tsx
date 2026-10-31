import React, { useState, useEffect } from 'react';
import { Wifi, ShieldAlert, Globe, Activity, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';

export const NetworkAnalyticsPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [data, setData] = useState({
    status: 'PROTECTED',
    anycastScrubbing: 'ACTIVE (Frankfurt Edge Scrubbing)',
    currentBandwidthMbps: 18.4,
    peakBandwidth24hMbps: 184.2,
    packetsPerSecond: 2840,
    attacksMitigated24h: 3,
    recentAttacks: [
      { type: 'UDP Amplification (NTP)', sizeGbps: 18.2, durationSeconds: 42, timestamp: '6 hours ago', status: 'Blocked (Zero Packet Drop)' },
      { type: 'Minecraft NullPing Flooder', sizeGbps: 2.4, durationSeconds: 120, timestamp: '14 hours ago', status: 'Blocked by Layer 7 Filter' },
    ],
    popLatencies: [
      { location: 'Frankfurt', pingMs: 8 },
      { location: 'London', pingMs: 14 },
      { location: 'Ashburn (US-East)', pingMs: 78 },
      { location: 'Singapore', pingMs: 142 },
    ],
  });

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/network`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, [selectedServer]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Network Analytics & Anti-DDoS</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300">
                ANYCAST BGP SCRUBBING
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time traffic throughput, mitigation event history, Anycast routing nodes, and global edge pop latencies
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>DDOS SCRUBBING: ACTIVE</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">CURRENT THROUGHPUT</span>
          <div className="text-3xl font-black text-white flex items-center gap-2">
            <span>{data.currentBandwidthMbps}</span>
            <span className="text-xs font-mono text-cyan-400">Mbit/s</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Packets: {data.packetsPerSecond.toLocaleString()}/s</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">24H PEAK BANDWIDTH</span>
          <div className="text-3xl font-black text-white flex items-center gap-2">
            <span>{data.peakBandwidth24hMbps}</span>
            <span className="text-xs font-mono text-purple-400">Mbit/s</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">10 Gbps Uplink Headroom</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">ATTACKS SCRUBBED (24H)</span>
          <div className="text-3xl font-black text-white">{data.attacksMitigated24h}</div>
          <span className="text-[10px] text-emerald-400 font-mono">0ms Game Interruption</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">BGP ROUTE STATUS</span>
          <div className="text-xl font-bold text-white font-mono mt-1">Tier-1 Transit</div>
          <span className="text-[10px] text-slate-400 font-mono">Arelion, Lumen, NTT</span>
        </div>
      </div>

      {/* Attack Scrubbing History & Edge Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attacks */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>RECENT MITIGATED ATTACK VECTORS</span>
          </h3>

          <div className="space-y-3">
            {data.recentAttacks.map((att, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-rose-400">{att.type}</span>
                  <span className="text-slate-500">{att.timestamp}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span>Attack Volume: {att.sizeGbps} Gbps · Duration: {att.durationSeconds}s</span>
                  <span className="text-emerald-400">{att.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Latencies */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>GLOBAL EDGE POP LATENCY</span>
          </h3>

          <div className="space-y-3">
            {data.popLatencies.map((pop) => (
              <div
                key={pop.location}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-white font-bold">{pop.location}</span>
                <span className={`font-bold ${pop.pingMs < 30 ? 'text-emerald-400' : pop.pingMs < 100 ? 'text-cyan-300' : 'text-amber-400'}`}>
                  {pop.pingMs} ms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
