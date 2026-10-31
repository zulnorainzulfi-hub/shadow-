import React, { useState } from 'react';
import {
  Puzzle,
  Search,
  Upload,
  Check,
  Power,
  Trash2,
  Download,
  Filter,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';
import { PluginItem } from '../../types';

export const PluginManagerPage: React.FC = () => {
  const {
    plugins,
    togglePlugin,
    installPlugin,
    uninstallPlugin,
    uploadPluginMock,
    selectedServer,
  } = useServer();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [installedNotice, setInstalledNotice] = useState<string | null>(null);

  const categories = ['All', 'Administration', 'Economy', 'World', 'Performance', 'Gameplay', 'Security'];

  const filteredPlugins = plugins.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (p: PluginItem) => {
    installPlugin(p.id);
    setInstalledNotice(`Installed ${p.name} v${p.version}! Reload or restart your server to load.`);
    setTimeout(() => setInstalledNotice(null), 3000);
  };

  const handleUploadJAR = () => {
    const customName = prompt('Enter plugin JAR name (e.g. MyCustomCore.jar):', 'CustomCombat.jar');
    if (customName) {
      uploadPluginMock(customName, 2.4);
      setInstalledNotice(`Uploaded ${customName} directly to /plugins directory.`);
      setTimeout(() => setInstalledNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Plugin Manager</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
              1-Click Hub
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse, install, toggle, and upload plugins to your Paper/Spigot/Purpur server instance
          </p>
        </div>

        <button
          onClick={handleUploadJAR}
          className="px-5 py-2.5 text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Custom JAR</span>
        </button>
      </div>

      {installedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{installedNotice}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins by name or keyword (e.g. LuckPerms, Geyser, WorldEdit)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-purple-900/80 border border-purple-500 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`p-6 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between space-y-4 ${
              plugin.installed
                ? 'border-purple-500/60 shadow-lg shadow-purple-950/20'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center font-mono font-bold text-xs text-purple-300">
                    {plugin.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{plugin.name}</h3>
                    <div className="text-[11px] font-mono text-slate-400">
                      v{plugin.version} · by {plugin.author}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {plugin.category}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                {plugin.description}
              </p>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
                <span>Downloads: {plugin.downloads}</span>
                <span>Size: {plugin.jarSizeMb} MB</span>
              </div>
            </div>

            {/* Plugin Controls */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              {plugin.installed ? (
                <>
                  <button
                    onClick={() => togglePlugin(plugin.id)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      plugin.enabled
                        ? 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300'
                        : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{plugin.enabled ? 'Enabled' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => uninstallPlugin(plugin.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Uninstall Plugin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleInstall(plugin)}
                  className="w-full py-2.5 text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Install Plugin</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
