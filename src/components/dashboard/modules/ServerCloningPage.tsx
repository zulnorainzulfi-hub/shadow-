import React, { useState } from 'react';
import { Copy, Layers, CheckCircle2, ArrowRight, RefreshCw, Server, Shield, Globe } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';

export const ServerCloningPage: React.FC = () => {
  const { selectedServer, createServer } = useServer();
  const [cloneName, setCloneName] = useState(`${selectedServer?.name || 'Server'}-Clone`);
  const [targetRegion, setTargetRegion] = useState('Ashburn (US-East)');
  const [targetFlag, setTargetFlag] = useState('🇺🇸');
  const [includePlayerData, setIncludePlayerData] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleClone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    setIsCloning(true);
    setProgress(15);

    try {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 25;
        });
      }, 500);

      const res = await fetch(`/api/servers/${selectedServer.id}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newName: cloneName,
          targetRegion,
          includePlayerData,
        }),
      });
      const data = await res.json();

      // Create cloned server in user context
      await createServer({
        name: cloneName,
        software: selectedServer.software,
        version: selectedServer.version,
        planId: selectedServer.planId,
        region: targetRegion,
        regionFlag: targetFlag,
        ownerId: selectedServer.ownerId,
      });

      setProgress(100);
      setFeedback(data.message || `Successfully created duplicate instance "${cloneName}"!`);
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Server Cloning & Replication</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                1-CLICK REPLICATION
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Instantly spin up identical Staging / Test servers or duplicate your survival world to alternative global edge nodes
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Clone Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Copy className="w-4 h-4 text-purple-400" />
            <span>CONFIGURE CLONED INSTANCE</span>
          </h3>

          <form onSubmit={handleClone} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">CLONE SERVER NAME</label>
              <input
                type="text"
                required
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">DESTINATION NODE REGION</label>
              <select
                value={targetRegion}
                onChange={(e) => {
                  setTargetRegion(e.target.value);
                  setTargetFlag(e.target.value.includes('Frankfurt') ? '🇩🇪' : e.target.value.includes('Singapore') ? '🇸🇬' : '🇺🇸');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Ashburn (US-East)">Ashburn, VA (US-01) 🇺🇸</option>
                <option value="Frankfurt (EU-Central)">Frankfurt (DE-01) 🇩🇪</option>
                <option value="Singapore (AP-South)">Singapore (SG-01) 🇸🇬</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-white block">Include Player Inventory & Stats</span>
                <span className="text-[11px] text-slate-400">
                  Enable if creating a high-availability failover. Disable if creating a clean dev/test server.
                </span>
              </div>
              <input
                type="checkbox"
                checked={includePlayerData}
                onChange={(e) => setIncludePlayerData(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {isCloning && (
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Replicating Container Filesystem...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isCloning}
              className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer glow-purple"
            >
              {isCloning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Cloning Node Filesystem...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Deploy Cloned Instance Now</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Source Summary (Right) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>SOURCE INSTANCE SNAPSHOT</span>
          </h3>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Source Name:</span>
              <span className="text-white font-bold">{selectedServer?.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Software:</span>
              <span className="text-cyan-300 font-bold">{selectedServer?.software} {selectedServer?.version}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>RAM Allocation:</span>
              <span className="text-purple-300 font-bold">{selectedServer?.ramAllocationMb} MB</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Disk Volume:</span>
              <span className="text-slate-200">{selectedServer?.diskUsageGb} GB</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Independent Network Port</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cloned servers are automatically provisioned with a unique port so both can run concurrently on the same network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
