import React from 'react';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface SoftwareSectionProps {
  onSelectSoftware?: (software: string) => void;
}

export const SoftwareSection: React.FC<SoftwareSectionProps> = ({ onSelectSoftware }) => {
  const softwareList = [
    {
      name: 'Paper',
      badge: 'RECOMMENDED',
      desc: 'High-performance Spigot fork with async chunk loading and tick-loop optimizations. The gold standard for modern survival and minigames.',
      versions: '1.21.4 - 1.12.2',
      color: 'border-purple-500/50 text-purple-300',
    },
    {
      name: 'Purpur',
      badge: 'HIGH CUSTOMIZATION',
      desc: 'Drop-in Paper replacement providing hundreds of configurable gameplay tweaks, rideable mobs, and TPS stabilizers.',
      versions: '1.21.4 - 1.16.5',
      color: 'border-indigo-500/50 text-indigo-300',
    },
    {
      name: 'Fabric',
      badge: 'MODERN MODDING',
      desc: 'Lightweight, ultra-fast modular mod loader. Runs Sodium, Lithium, and modern client/server optimization mods seamlessly.',
      versions: '1.21.4 - 1.14',
      color: 'border-cyan-500/50 text-cyan-300',
    },
    {
      name: 'Forge',
      badge: 'HEAVY MODPACKS',
      desc: 'The industry foundation for massive tech, magic, and adventure modpacks. Perfect for All The Mods, Pixelmon, and Create.',
      versions: '1.20.1 - 1.12.2',
      color: 'border-amber-500/50 text-amber-300',
    },
    {
      name: 'Spigot',
      badge: 'CLASSIC PLUGIN ENGINE',
      desc: 'The original foundational Bukkit successor. High backwards compatibility with legacy plugins and mechanics.',
      versions: '1.21.4 - 1.8.8',
      color: 'border-orange-500/50 text-orange-300',
    },
    {
      name: 'Vanilla',
      badge: 'PURE MOJANG',
      desc: 'Official unmodified Minecraft server jar. Ideal for redstone purists and playing the latest experimental weekly snapshots.',
      versions: '1.21.4 - Latest Snapshot',
      color: 'border-emerald-500/50 text-emerald-300',
    },
  ];

  return (
    <section id="software" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Complete Ecosystem Freedom</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Run Any Minecraft Software With 1-Click
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Switch between server jars anytime in your control panel without wiping your world data or player inventories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {softwareList.map((sw) => (
          <div
            key={sw.name}
            className={`p-6 rounded-2xl glass-panel glass-panel-hover border transition-all duration-300 space-y-4 flex flex-col justify-between`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{sw.name}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sw.color}`}>
                  {sw.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{sw.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Versions:</span>
              <span className="text-slate-300 font-bold">{sw.versions}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
