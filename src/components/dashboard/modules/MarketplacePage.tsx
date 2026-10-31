import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Download, Search, CheckCircle2, Filter, Sparkles, Layers, Box } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { MarketplaceItem } from '../../../types';

export const MarketplacePage: React.FC = () => {
  const { selectedServer } = useServer();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/marketplace/items')
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => {});
  }, []);

  const handleInstall = async (item: MarketplaceItem) => {
    if (!selectedServer) return;
    setInstallingId(item.id);
    try {
      const res = await fetch('/api/marketplace/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, serverId: selectedServer.id }),
      });
      const data = await res.json();
      setInstalledMap((prev) => ({ ...prev, [item.id]: true }));
      setFeedback(data.message || `Successfully installed ${item.name}!`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setInstallingId(null);
    }
  };

  const filtered = items.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type.toUpperCase() === filterType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Shadow Marketplace</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                1-CLICK CONTENT
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Curated adventure maps, pre-tuned plugin suites, datapacks, and spawn hubs tested for 0 TPS degradation
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search maps, plugins, bundles..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'MAP', 'PLUGIN', 'DATAPACK', 'CONFIG TEMPLATE'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                filterType === t
                  ? 'bg-purple-900/80 border border-purple-500 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const isInstalled = installedMap[item.id];
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl glass-panel border border-purple-900/30 hover:border-purple-600/60 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-bold uppercase">
                    {item.type} · {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    by {item.author} · {item.downloads.toLocaleString()} installs
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400">
                  Tested: {item.testedVersions.slice(0, 2).join(', ')}
                </div>

                <button
                  onClick={() => handleInstall(item)}
                  disabled={installingId === item.id || isInstalled}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    isInstalled
                      ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                      : 'bg-purple-700 hover:bg-purple-600 text-white shadow-md cursor-pointer'
                  }`}
                >
                  {installingId === item.id ? (
                    <>
                      <Download className="w-3.5 h-3.5 animate-bounce" />
                      <span>Deploying...</span>
                    </>
                  ) : isInstalled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Installed</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>1-Click Install</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
