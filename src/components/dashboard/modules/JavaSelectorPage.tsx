import React, { useState, useEffect } from 'react';
import { Coffee, CheckCircle2, Zap, Shield, Cpu, RefreshCw, Flame } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';

export const JavaSelectorPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [selectedJava, setSelectedJava] = useState('Java 21 (LTS)');
  const [graalVm, setGraalVm] = useState(true);
  const [gcEngine, setGcEngine] = useState('G1GC');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/java-version`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedJava(data.currentJava || 'Java 21 (LTS)');
        setGraalVm(data.graalVmEnabled ?? true);
        setGcEngine(data.gcEngine || 'G1GC');
      })
      .catch(() => {});
  }, [selectedServer]);

  const handleApply = async () => {
    if (!selectedServer) return;
    await fetch(`/api/servers/${selectedServer.id}/java-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        javaVersion: selectedJava,
        graalVmEnabled: graalVm,
        gcEngine,
      }),
    });
    setFeedback(`Container environment updated to ${selectedJava} with ${gcEngine}. Restart to activate.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const JAVA_VERSIONS = [
    {
      name: 'Java 21 (LTS)',
      badge: 'RECOMMENDED (1.20.5+ / 1.21.x)',
      desc: 'Modern LTS release with Generational ZGC, virtual threads, and full PaperMC 1.21 support.',
      speed: '+22% Throughput',
    },
    {
      name: 'Java 17 (LTS)',
      badge: 'STABLE (1.17 - 1.20.4)',
      desc: 'Target runtime for Minecraft 1.17 through 1.20.4 and legacy Fabric mods.',
      speed: 'Baseline',
    },
    {
      name: 'Java 11',
      badge: 'LEGACY (1.16.x)',
      desc: 'For older 1.16 installations requiring legacy class formats.',
      speed: 'Standard',
    },
    {
      name: 'Java 8',
      badge: 'CLASSIC (1.7.10 - 1.12.2)',
      desc: 'Required for classic Forge 1.7.10 and 1.12.2 modpacks like RLCraft and Tekkit.',
      speed: 'Legacy',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Java Version Selector</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                JVM RUNTIME
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Switch container JDK binaries, enable GraalVM Enterprise JIT compilation, and select high-performance garbage collectors
          </p>
        </div>

        <button
          onClick={handleApply}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
        >
          <Coffee className="w-4 h-4 text-cyan-300" />
          <span>Apply Java Runtime</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Java Versions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JAVA_VERSIONS.map((jv) => {
          const selected = selectedJava === jv.name;
          return (
            <div
              key={jv.name}
              onClick={() => setSelectedJava(jv.name)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                selected
                  ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-950/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <Coffee className={`w-4 h-4 ${selected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {jv.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {jv.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{jv.desc}</p>
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                <span className="text-emerald-400 font-bold">{jv.speed}</span>
                <span className="text-slate-500">{selected ? '● ACTIVE CHOICE' : 'Click to select'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compiler & GC Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GraalVM Toggle */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>GRAALVM ENTERPRISE JIT OPTIMIZATION</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Replaces standard HotSpot C2 compiler with GraalVM Ahead-Of-Time/JIT compiler. Improves tick consistency during dense mob spawning.
            </p>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs font-mono text-white font-bold">Enable GraalVM JIT</span>
            <input
              type="checkbox"
              checked={graalVm}
              onChange={(e) => setGraalVm(e.target.checked)}
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Garbage Collector Choice */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>GARBAGE COLLECTION (GC) ENGINE</span>
          </h3>

          <div className="space-y-2">
            {[
              { id: 'G1GC', name: 'G1GC (Standard / Aikar Preset)', note: 'Recommended for 8GB+ RAM' },
              { id: 'ZGC', name: 'ZGC (Generational Ultra-Low Latency)', note: 'Sub-millisecond GC pauses' },
              { id: 'Shenandoah', name: 'Shenandoah GC', note: 'Concurrent ultra-low pause collector' },
            ].map((gc) => (
              <label
                key={gc.id}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  gcEngine === gc.id
                    ? 'bg-purple-950/60 border-purple-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs font-mono font-bold block">{gc.name}</span>
                  <span className="text-[10px] text-slate-500">{gc.note}</span>
                </div>
                <input
                  type="radio"
                  name="gcEngine"
                  checked={gcEngine === gc.id}
                  onChange={() => setGcEngine(gc.id)}
                  className="accent-purple-600"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
