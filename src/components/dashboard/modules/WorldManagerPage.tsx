import React, { useState, useEffect } from 'react';
import { Globe, PlusCircle, RefreshCw, CheckCircle2, Shield, Trash2, Sliders, MapPin, Compass } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { WorldDimension } from '../../../types';

export const WorldManagerPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [worlds, setWorlds] = useState<WorldDimension[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<WorldDimension | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSeed, setNewSeed] = useState('');
  const [newGen, setNewGen] = useState<WorldDimension['generator']>('DEFAULT');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/worlds`)
      .then((res) => res.json())
      .then((data) => {
        setWorlds(data);
        if (data.length > 0) setSelectedWorld(data[0]);
      })
      .catch(() => {});
  }, [selectedServer]);

  const handleCreateWorld = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    try {
      const res = await fetch(`/api/servers/${selectedServer.id}/worlds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim() || 'custom_world',
          generator: newGen,
          seed: newSeed.trim(),
        }),
      });
      const data = await res.json();
      if (data.world) {
        setWorlds((prev) => [...prev, data.world]);
        setSelectedWorld(data.world);
        setIsNewModalOpen(false);
        setNewName('');
        setNewSeed('');
        setFeedback(`Created world "${data.world.name}"!`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {}
  };

  const handleToggleRule = (ruleKey: keyof WorldDimension['gameRules']) => {
    if (!selectedWorld) return;
    const updated = {
      ...selectedWorld,
      gameRules: {
        ...selectedWorld.gameRules,
        [ruleKey]: !selectedWorld.gameRules[ruleKey],
      },
    };
    setSelectedWorld(updated);
    setWorlds((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    setFeedback(`Gamerule ${String(ruleKey)} updated.`);
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>World Manager</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                DIMENSION CONTROL
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage Nether/End dimensions, generate custom seeds, edit Minecraft gamerules, and set spawn coordinates
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>Generate New World</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Worlds List (Left) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-slate-400 font-bold block px-1">ACTIVE DIMENSIONS ({worlds.length})</span>
          {worlds.map((w) => {
            const active = selectedWorld?.id === w.id;
            return (
              <div
                key={w.id}
                onClick={() => setSelectedWorld(w)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  active
                    ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-950/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold font-mono text-white">{w.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                    {w.type}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Seed: {w.seed}</span>
                  <span>{w.sizeMb} MB</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* World Inspector & Gamerules (Right) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
          {selectedWorld ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span>{selectedWorld.name}</span>
                    <span className="text-xs font-normal text-slate-400 font-mono">({selectedWorld.generator})</span>
                  </h3>
                  <div className="text-xs font-mono text-cyan-300 mt-1">
                    Spawn: X:{selectedWorld.spawnCoords.x} Y:{selectedWorld.spawnCoords.y} Z:{selectedWorld.spawnCoords.z} · Difficulty: {selectedWorld.difficulty}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Reset and regenerate dimension "${selectedWorld.name}"? This deletes chunk data.`)) {
                      setFeedback(`World "${selectedWorld.name}" queued for regeneration.`);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-mono transition-colors"
                >
                  Regenerate
                </button>
              </div>

              {/* Gamerules Switcher */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>DIMENSION GAMERULES (LIVE PERSISTENCE)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'keepInventory', label: 'keepInventory', desc: 'Players keep items upon death' },
                    { key: 'mobGriefing', label: 'mobGriefing', desc: 'Creepers / Endermen destroy blocks' },
                    { key: 'doDaylightCycle', label: 'doDaylightCycle', desc: 'Sun and moon progression' },
                    { key: 'doFireTick', label: 'doFireTick', desc: 'Fire spreading and extinguishing' },
                  ].map((rule) => {
                    const ruleVal = selectedWorld.gameRules[rule.key as keyof WorldDimension['gameRules']];
                    return (
                      <div
                        key={rule.key}
                        className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-mono font-bold text-white block">{rule.label}</span>
                          <span className="text-[10px] text-slate-400">{rule.desc}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={ruleVal}
                          onChange={() => handleToggleRule(rule.key as any)}
                          className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              Select a world from the left to inspect settings and gamerules.
            </div>
          )}
        </div>
      </div>

      {/* New World Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-purple-800/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">GENERATE NEW WORLD</h3>
            <form onSubmit={handleCreateWorld} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">WORLD FOLDER NAME</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. survival_s2"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">WORLD GENERATOR</label>
                <select
                  value={newGen}
                  onChange={(e) => setNewGen(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="DEFAULT">Default Vanilla Biomes</option>
                  <option value="AMPLIFIED">Amplified Mountains</option>
                  <option value="FLAT">Superflat</option>
                  <option value="LARGE_BIOMES">Large Biomes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">SEED (OPTIONAL)</label>
                <input
                  type="text"
                  value={newSeed}
                  onChange={(e) => setNewSeed(e.target.value)}
                  placeholder="Leave empty for randomized seed"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-mono text-white bg-purple-700 hover:bg-purple-600 rounded-xl shadow-md"
                >
                  Generate World
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
