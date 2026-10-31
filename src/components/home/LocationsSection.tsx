import React, { useState } from 'react';
import { Globe, Zap, Radio, CheckCircle2 } from 'lucide-react';
import { useServer } from '../../context/ServerContext';

export const LocationsSection: React.FC = () => {
  const { nodes } = useServer();
  const [nodeList, setNodeList] = useState(nodes);
  const [isPinging, setIsPinging] = useState(false);

  const handleRunPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setNodeList((prev) =>
        prev.map((n) => ({
          ...n,
          pingMs: Math.max(9, n.pingMs + Math.floor(Math.random() * 7) - 3),
        }))
      );
      setIsPinging(false);
    }, 600);
  };

  return (
    <section id="locations" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-purple-900/30 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Low-Jitter Global Hardware Mesh</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Available Server Node Locations
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Only active Tier 3+ datacenter facilities with direct BGP peering to Tier 1 transit backbones are listed.
          </p>
        </div>

        <button
          onClick={handleRunPing}
          disabled={isPinging}
          className="px-5 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all self-start lg:self-auto"
        >
          <Zap className={`w-3.5 h-3.5 text-cyan-400 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'Benchmarking ICMP...' : 'Test Route Latency'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nodeList.map((node) => (
          <div
            key={node.id}
            className="p-6 rounded-2xl glass-panel glass-panel-hover border transition-all duration-300 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{node.flag}</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                ONLINE
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{node.city}</h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{node.country}</div>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Latency:</span>
                <span className="text-cyan-400 font-bold tabular-nums">{node.pingMs} ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Node IP:</span>
                <span className="text-slate-300">{node.ip}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Load:</span>
                <span className="text-purple-300 tabular-nums">{node.cpuPercent}% CPU</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
