import React, { useState, useEffect } from 'react';
import { Cpu, Zap, CheckCircle2, Sliders, RefreshCw, AlertCircle, Save } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { JvmConfig } from '../../../types';

export const JvmManagerPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [jvmConfig, setJvmConfig] = useState<JvmConfig>({
    preset: 'Aikar (Recommended)',
    minRamMb: 8192,
    maxRamMb: 8192,
    gcEngine: 'G1GC',
    customFlags: '-XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20',
    largePagesEnabled: false,
    parallelRefProc: true,
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/jvm-flags`)
      .then((res) => res.json())
      .then((data) => setJvmConfig(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleApplyPreset = (presetName: JvmConfig['preset']) => {
    let flags = jvmConfig.customFlags;
    let gc = jvmConfig.gcEngine;

    if (presetName === 'Aikar (Recommended)') {
      gc = 'G1GC';
      flags = '-XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20';
    } else if (presetName === 'Extreme TPS (Paper/Purpur)') {
      gc = 'G1GC';
      flags = '-XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+ParallelRefProcEnabled -XX:+PerfDisableSharedMem -XX:+UnlockExperimentalVMOptions -XX:G1HeapRegionSize=8M -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15';
    } else if (presetName === 'Low Memory (ZGC)') {
      gc = 'ZGC (Ultra Low Latency)';
      flags = '-XX:+UseZGC -XX:+ZGenerational -XX:+UnlockExperimentalVMOptions';
    }

    setJvmConfig((prev) => ({
      ...prev,
      preset: presetName,
      gcEngine: gc,
      customFlags: flags,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    await fetch(`/api/servers/${selectedServer.id}/jvm-flags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jvmConfig),
    });
    setFeedback('JVM compilation flags saved to container startup profile.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Custom JVM Startup Manager</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                GARBAGE COLLECTOR & FLAGS
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Fine-tune Java virtual machine heap generation boundaries, Aikar optimization flags, and garbage collection pauses
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Preset Selector */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>1. COMMUNITY OPTIMIZED PRESET</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['Aikar (Recommended)', 'Extreme TPS (Paper/Purpur)', 'Velocity / Bungee', 'Low Memory (ZGC)'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-3.5 rounded-xl border text-left text-xs font-mono transition-all ${
                  jvmConfig.preset === p
                    ? 'bg-purple-900/60 border-purple-500 text-white font-bold shadow-md shadow-purple-950'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-white mb-1">{p}</div>
                <div className="text-[10px] text-slate-500">
                  {p.includes('Aikar') ? 'Paper standard' : p.includes('ZGC') ? 'Sub-ms pauses' : 'Tuned profile'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Memory Sliders */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>2. HEAP BOUNDARIES (-Xms & -Xmx)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Initial Heap (-Xms):</span>
                <span className="text-cyan-400 font-bold">{jvmConfig.minRamMb} MB</span>
              </div>
              <input
                type="range"
                min="2048"
                max={selectedServer?.ramAllocationMb || 8192}
                step="512"
                value={jvmConfig.minRamMb}
                onChange={(e) => setJvmConfig({ ...jvmConfig, minRamMb: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <span className="text-[10px] text-slate-500 font-mono block">Setting equal to -Xmx avoids heap resizing overhead</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Maximum Heap (-Xmx):</span>
                <span className="text-purple-400 font-bold">{jvmConfig.maxRamMb} MB</span>
              </div>
              <input
                type="range"
                min="2048"
                max={selectedServer?.ramAllocationMb || 8192}
                step="512"
                value={jvmConfig.maxRamMb}
                onChange={(e) => setJvmConfig({ ...jvmConfig, maxRamMb: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <span className="text-[10px] text-slate-500 font-mono block">Bounded by plan allocation limit ({selectedServer?.ramAllocationMb} MB)</span>
            </div>
          </div>
        </div>

        {/* Raw Custom Flags */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>3. ACTIVE JVM ARGUMENTS</span>
            </span>
            <span className="text-xs font-mono text-emerald-400">GC: {jvmConfig.gcEngine}</span>
          </h3>

          <textarea
            rows={4}
            value={jvmConfig.customFlags}
            onChange={(e) => setJvmConfig({ ...jvmConfig, customFlags: e.target.value })}
            className="w-full p-4 bg-black/60 border border-slate-700 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={jvmConfig.largePagesEnabled}
                onChange={(e) => setJvmConfig({ ...jvmConfig, largePagesEnabled: e.target.checked })}
                className="w-4 h-4 accent-purple-600 rounded"
              />
              <span className="text-xs font-mono text-slate-300">Enable Large Pages (-XX:+UseLargePages)</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save JVM Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
