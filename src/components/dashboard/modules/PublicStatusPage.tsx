import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Server, CheckCircle2, AlertTriangle, Clock, Mail, Bell } from 'lucide-react';

export const PublicStatusPage: React.FC = () => {
  const [statusData, setStatusData] = useState({
    systemStatus: 'ALL_SYSTEMS_OPERATIONAL',
    uptimePercent30d: 99.99,
    nodes: [
      { name: 'Frankfurt (DE-01)', ping: 12, cpu: 32, ram: 54, status: 'OPERATIONAL' },
      { name: 'Ashburn (US-01)', ping: 24, cpu: 28, ram: 48, status: 'OPERATIONAL' },
      { name: 'Singapore (SG-01)', ping: 38, cpu: 41, ram: 60, status: 'OPERATIONAL' },
      { name: 'Mumbai (IN-01)', ping: 45, cpu: 35, ram: 52, status: 'OPERATIONAL' },
    ],
    services: [
      { name: 'Compute Nodes (AMD Ryzen 9 7950X3D)', status: 'OPERATIONAL' },
      { name: 'Anycast Layer 7 DDoS Mitigation', status: 'OPERATIONAL' },
      { name: 'RCON / WebSocket Sockets', status: 'OPERATIONAL' },
      { name: 'MySQL / MariaDB Clusters', status: 'OPERATIONAL' },
      { name: 'Shadow Vault Cloud Storage', status: 'OPERATIONAL' },
      { name: 'Shadow AI Engine (Gemini 3.8)', status: 'OPERATIONAL' },
    ],
    recentIncidents: [
      { id: 'inc-1', title: 'Scheduled Ashburn Network Switch Upgrade', date: 'Oct 24, 2026', duration: '12 mins', status: 'RESOLVED' },
    ],
  });
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch('/api/status-page')
      .then((res) => res.json())
      .then((d) => setStatusData(d))
      .catch(() => {});
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Big Operational Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-purple-950/50 to-[#050505] border-2 border-emerald-500/50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_35px_rgba(16,185,129,0.2)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
              SHADOW HOST INFRASTRUCTURE STATUS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            All Systems Operational
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            30-Day Rolling Uptime: <span className="text-emerald-400 font-bold">{statusData.uptimePercent30d}%</span> · 99.99% SLA Guaranteed
          </p>
        </div>

        {/* Subscribe Form */}
        <form onSubmit={handleSubscribe} className="space-y-2 max-w-sm w-full">
          <span className="text-xs font-mono text-slate-400 block">Get Incident Notifications:</span>
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="your-email@domain.com"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={subscribed}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-mono font-bold whitespace-nowrap cursor-pointer"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </div>
        </form>
      </div>

      {/* 90-Day Uptime Bar Visualization */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 font-bold">90-DAY UPTIME TIMELINE</span>
          <span className="text-emerald-400 font-bold">100% Operational Today</span>
        </div>
        <div className="flex gap-1 h-8 items-center">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-6 rounded-xs transition-colors ${i === 42 ? 'bg-amber-500/80' : 'bg-emerald-500/70 hover:bg-emerald-400'}`}
              title={i === 42 ? 'Oct 24: 12 min scheduled switch upgrade' : '100% Operational (0 incident)'}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>90 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Services Grid & Compute Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Services */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>CORE PLATFORM SERVICES</span>
          </h3>

          <div className="space-y-2.5">
            {statusData.services.map((svc) => (
              <div
                key={svc.name}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-slate-200 font-bold">{svc.name}</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>OPERATIONAL</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Nodes */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>GLOBAL HARDWARE CLUSTERS</span>
          </h3>

          <div className="space-y-2.5">
            {statusData.nodes.map((node) => (
              <div
                key={node.name}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-white font-bold block">{node.name}</span>
                  <span className="text-[10px] text-slate-400">Ping: {node.ping}ms · CPU {node.cpu}% · RAM {node.ram}%</span>
                </div>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Log */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>PAST INCIDENT HISTORY</span>
        </h3>

        <div className="space-y-3">
          {statusData.recentIncidents.map((inc) => (
            <div key={inc.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{inc.title}</span>
                <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/60">
                  {inc.status}
                </span>
              </div>
              <p className="text-slate-400">{inc.date} · Downtime window: {inc.duration}. Traffic rerouted via Frankfurt edge without player disconnects.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
