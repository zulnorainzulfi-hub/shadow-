import React, { useState } from 'react';
import {
  Settings,
  Users,
  Sliders,
  CheckCircle2,
  Key,
  Shield,
  Zap,
  Save,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';

export const ServerSettingsPage: React.FC = () => {
  const {
    selectedServer,
    updateServer,
    pterodactylConfig,
    updatePterodactylConfig,
  } = useServer();

  if (!selectedServer) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 font-mono">
        No active server selected.
      </div>
    );
  }

  const [serverName, setServerName] = useState(selectedServer.name);
  const [motd, setMotd] = useState(selectedServer.motd);
  const [maxPlayers, setMaxPlayers] = useState(selectedServer.maxPlayers);
  const [pvp, setPvp] = useState(true);
  const [difficulty, setDifficulty] = useState<'peaceful' | 'easy' | 'normal' | 'hard'>('hard');
  const [panelUrl, setPanelUrl] = useState(pterodactylConfig.panelUrl || '');
  const [apiKey, setApiKey] = useState(pterodactylConfig.apiKey || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateServer(selectedServer.id, {
      name: serverName,
      motd,
      maxPlayers: Number(maxPlayers),
    });

    if (panelUrl || apiKey) {
      updatePterodactylConfig({
        isConnected: !!apiKey,
        panelUrl,
        apiKey,
        lastSync: 'Just now',
      });
    }

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white">Server Configuration</h1>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300">
            {selectedServer.name}
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Manage player slot limits, JVM flags, gameplay mechanics, and Pterodactyl node links
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Server properties updated and synchronized to disk!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Player Slots System Card (Section 11) */}
        <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Player Capacity & Slots Allocation</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Tier Limit: {selectedServer.planId === 'plan-free' ? '50 Max' : 'Up to 500'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-center font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-500">CURRENT PLAYERS</div>
              <div className="text-2xl font-extrabold text-white tabular-nums">
                {selectedServer.playersOnline}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">MAXIMUM SLOTS</div>
              <div className="text-2xl font-extrabold text-cyan-400 tabular-nums">
                {maxPlayers}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">AVAILABLE SLOTS</div>
              <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                {Math.max(0, maxPlayers - selectedServer.playersOnline)}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <label className="text-slate-300">CONFIGURE PLAYER LIMIT</label>
              <span className="text-cyan-400 font-bold">{maxPlayers} Slots</span>
            </div>
            <input
              type="range"
              min={5}
              max={selectedServer.planId === 'plan-free' ? 50 : 500}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>5 Players</span>
              <span>
                {selectedServer.planId === 'plan-free' ? '50 Players (Free Cap)' : '500 Players'}
              </span>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>General Properties</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                SERVER DISPLAY NAME
              </label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                GAME DIFFICULTY
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as unknown as 'peaceful' | 'easy' | 'normal' | 'hard')}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              >
                <option value="peaceful">Peaceful</option>
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard (Recommended)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              SERVER MOTD (MESSAGE OF THE DAY)
            </label>
            <input
              type="text"
              value={motd}
              onChange={(e) => setMotd(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="pvp-toggle"
              checked={pvp}
              onChange={(e) => setPvp(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="pvp-toggle" className="text-xs text-slate-300 font-mono cursor-pointer">
              Enable Player-vs-Player (PVP) Combat
            </label>
          </div>
        </div>

        {/* Pterodactyl Integration Card (Section 16) */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-800/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Pterodactyl Panel Integration</span>
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                pterodactylConfig.isConnected
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-amber-950 text-amber-300 border border-amber-700'
              }`}
            >
              {pterodactylConfig.isConnected ? 'CONNECTED' : 'DEMO ENGINE ACTIVE'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Connect an external Pterodactyl daemon API to bind this dashboard to live physical server hardware.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                PANEL BASE URL
              </label>
              <input
                type="text"
                value={panelUrl}
                onChange={(e) => setPanelUrl(e.target.value)}
                placeholder="https://panel.example.com"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                API CLIENT KEY
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ptlc_xxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Server Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
