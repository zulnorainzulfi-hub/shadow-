import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Shield, Layers, AlertTriangle, ArrowRight, Download } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { ServerSoftware } from '../../../types';

export const VersionSwitcherPage: React.FC = () => {
  const { selectedServer, updateServer, restartServer } = useServer();
  const [targetSoftware, setTargetSoftware] = useState<ServerSoftware>(selectedServer?.software || 'Paper');
  const [targetVersion, setTargetVersion] = useState<string>(selectedServer?.version || '1.21.4');
  const [takeBackup, setTakeBackup] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const SOFTWARES: { name: ServerSoftware; badge: string; desc: string }[] = [
    { name: 'Paper', badge: 'RECOMMENDED', desc: 'High-performance Spigot fork with async chunk loading and anti-xray.' },
    { name: 'Purpur', badge: 'EXTREME PERFORMANCE', desc: 'Paper fork with customizable creature settings, ridables, and tick rate optimization.' },
    { name: 'Fabric', badge: 'MODDED 1.21+', desc: 'Lightweight, modular modding toolchain with instant snapshot updates.' },
    { name: 'Forge', badge: 'HEAVY MODS', desc: 'Classic mod loader supporting complex tech and magic modpacks.' },
    { name: 'Spigot', badge: 'CLASSIC', desc: 'Legacy plugin engine supporting Bukkit ecosystem.' },
    { name: 'Vanilla', badge: 'MOJANG OFFICIAL', desc: 'Official unmodified server binary from Mojang Studios.' },
  ];

  const VERSIONS = ['1.21.4', '1.21.1', '1.20.6', '1.20.4', '1.19.4', '1.18.2', '1.16.5', '1.12.2', '1.8.9'];

  const handleSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    setSwitching(true);
    try {
      const res = await fetch(`/api/servers/${selectedServer.id}/version-switcher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          software: targetSoftware,
          version: targetVersion,
          takeBackup,
        }),
      });
      const data = await res.json();
      updateServer(selectedServer.id, { software: targetSoftware, version: targetVersion });
      setFeedback(data.message || `Switched to ${targetSoftware} ${targetVersion}!`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Minecraft Version Switcher</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                1-CLICK ENGINE
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Swap server jar distributions between Paper, Purpur, Fabric, and Forge across 1.8.9 through 1.21.4
          </p>
        </div>

        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs font-mono text-slate-300">
          Current: <span className="text-cyan-400 font-bold">{selectedServer?.software} {selectedServer?.version}</span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSwitch} className="space-y-6">
        {/* Software Selection Grid */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>1. SELECT SERVER SOFTWARE ENGINE</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOFTWARES.map((sw) => {
              const selected = targetSoftware === sw.name;
              return (
                <div
                  key={sw.name}
                  onClick={() => setTargetSoftware(sw.name)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    selected
                      ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-950'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-white font-mono">{sw.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {sw.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{sw.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Version Selection Pills */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-400" />
            <span>2. SELECT MINECRAFT RELEASE VERSION</span>
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {VERSIONS.map((v) => {
              const isCurrent = targetVersion === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTargetVersion(v)}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950'
                      : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
                  }`}
                >
                  {v} {v === '1.21.4' && '★ LATEST'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety & Confirmation */}
        <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={takeBackup}
              onChange={(e) => setTakeBackup(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-white block">Automatic Safety Snapshot</span>
              <span className="text-[11px] text-slate-400">
                Backs up existing world and plugins before swapping jar binary
              </span>
            </div>
          </label>

          <button
            type="submit"
            disabled={switching}
            className="px-6 py-3 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer glow-purple"
          >
            {switching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Downloading Engine & Syncing...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Switch to {targetSoftware} {targetVersion}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
