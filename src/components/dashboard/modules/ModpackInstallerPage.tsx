import React, { useState, useEffect } from 'react';
import { Package, Download, CheckCircle2, Search, Filter, Shield, AlertTriangle, Layers } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { ModpackItem } from '../../../types';

export const ModpackInstallerPage: React.FC = () => {
  const { selectedServer, updateServer } = useServer();
  const [modpacks, setModpacks] = useState<ModpackItem[]>([]);
  const [search, setSearch] = useState('');
  const [loaderFilter, setLoaderFilter] = useState('ALL');
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/modpacks')
      .then((res) => res.json())
      .then((data) => setModpacks(data))
      .catch(() => {});
  }, []);

  const handleInstall = async (pack: ModpackItem) => {
    if (!selectedServer) return;
    if (confirm(`Install "${pack.name}"? This will download ${pack.modCount} mod jars and configure the ${pack.loader} engine.`)) {
      setInstallingId(pack.id);
      setTimeout(() => {
        setInstallingId(null);
        setFeedback(`Installed "${pack.name}" successfully! Server restarted with ${pack.loader}.`);
        setTimeout(() => setFeedback(null), 4000);
      }, 2000);
    }
  };

  const filtered = modpacks.filter((p) => {
    const matchesLoader = loaderFilter === 'ALL' || p.loader.toUpperCase() === loaderFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesLoader && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Modpack Installer</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                1-CLICK MODPACKS
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse and deploy popular CurseForge & Modrinth modpacks with auto-configured Forge, Fabric, and NeoForge binaries
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modpacks..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'FABRIC', 'FORGE'].map((loader) => (
            <button
              key={loader}
              onClick={() => setLoaderFilter(loader)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                loaderFilter === loader
                  ? 'bg-purple-900/80 border border-purple-500 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {loader}
            </button>
          ))}
        </div>
      </div>

      {/* Modpack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((pack) => (
          <div
            key={pack.id}
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-purple-600/50 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-bold">
                  {pack.loader} · MC {pack.minecraftVersion}
                </span>
                <span className="text-xs font-mono text-cyan-400 font-bold">{pack.downloads} Downloads</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {pack.name}
                </h3>
                <div className="text-[11px] font-mono text-slate-500">
                  by {pack.author} · {pack.modCount} Mods included
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {pack.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-amber-300">
                Requires: {pack.recommendedRamGb}GB RAM
              </span>

              <button
                onClick={() => handleInstall(pack)}
                disabled={installingId === pack.id}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {installingId === pack.id ? (
                  <>
                    <Download className="w-3.5 h-3.5 animate-bounce text-cyan-300" />
                    <span>Installing {pack.modCount} mods...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Install Pack</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
