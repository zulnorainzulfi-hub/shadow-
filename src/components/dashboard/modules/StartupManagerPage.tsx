import React, { useState, useEffect } from 'react';
import { Terminal, Save, CheckCircle2, Moon, RefreshCw, Key, Plus, Trash2, Cpu } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { StartupConfig } from '../../../types';

export const StartupManagerPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [config, setConfig] = useState<StartupConfig>({
    startupCommand: 'java -Xms{{SERVER_MEMORY}}M -Xmx{{SERVER_MEMORY}}M -XX:+UseG1GC -jar {{SERVER_JARFILE}} nogui',
    serverJarFile: 'paper-1.21.4.jar',
    idleSleepMode: true,
    sleepIdleMinutes: 30,
    autoRebootOnCrash: true,
    envVariables: [
      { key: 'SERVER_MEMORY', value: '8192' },
      { key: 'SERVER_JARFILE', value: 'paper-1.21.4.jar' },
      { key: 'TZ', value: 'UTC' },
    ],
  });
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/startup`)
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    await fetch(`/api/servers/${selectedServer.id}/startup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    setFeedback('Startup parameters updated and committed to container runtime.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const addEnv = () => {
    if (!newKey.trim()) return;
    setConfig((prev) => ({
      ...prev,
      envVariables: [...prev.envVariables, { key: newKey.trim(), value: newVal.trim() }],
    }));
    setNewKey('');
    setNewVal('');
  };

  const removeEnv = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      envVariables: prev.envVariables.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Startup Manager</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                BOOT ARGS
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure container initialization commands, server jar binding, idle sleep hibernation, and runtime environment variables
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Startup Command Zone */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>PRIMARY BOOT COMMAND LINE</span>
          </h3>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">RAW STARTUP STRING</label>
            <textarea
              rows={3}
              value={config.startupCommand}
              onChange={(e) => setConfig({ ...config, startupCommand: e.target.value })}
              className="w-full p-3.5 bg-black/60 border border-slate-700 rounded-xl font-mono text-xs text-cyan-300 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">DEFAULT JAR FILE</label>
              <input
                type="text"
                value={config.serverJarFile}
                onChange={(e) => setConfig({ ...config, serverJarFile: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">HIBERNATION SLEEP (MINS)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={config.sleepIdleMinutes}
                onChange={(e) => setConfig({ ...config, sleepIdleMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Hibernation Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>Zero-Resource Idle Hibernation</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Puts container in standby when 0 players are connected. Wakes up instantly on TCP handshake.
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.idleSleepMode}
              onChange={(e) => setConfig({ ...config, idleSleepMode: e.target.checked })}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Startup Parameters</span>
          </button>
        </div>

        {/* Environment Variables Zone */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>CONTAINER ENVIRONMENT VARIABLES</span>
          </h3>

          <div className="space-y-2">
            {config.envVariables.map((env, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-purple-300 font-bold">{env.key}</span>
                  <span className="text-slate-500 mx-1">=</span>
                  <span className="text-slate-200">{env.value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeEnv(i)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-xs font-mono text-slate-400">Add Variable:</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="KEY"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="VALUE"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
                className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={addEnv}
                className="p-2 bg-purple-950 hover:bg-purple-900 border border-purple-700 rounded-lg text-purple-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
