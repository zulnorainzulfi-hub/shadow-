import React from 'react';
import {
  Cpu,
  HardDrive,
  ShieldCheck,
  Zap,
  Terminal,
  FolderOpen,
  Puzzle,
  Archive,
  Layers,
  Radio,
  Sparkles,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Cpu,
      color: 'text-purple-400',
      title: 'Dedicated Ryzen 9 7950X3D',
      desc: 'Massive 3D V-Cache and 5.7 GHz boost clock eliminates micro-stuttering and handles complex redstone contraptions effortlessly.',
    },
    {
      icon: HardDrive,
      color: 'text-cyan-400',
      title: 'Enterprise PCIe 4.0 NVMe',
      desc: 'Blazing fast 7,000 MB/s read/write speeds ensure instant chunk loading, world generation, and zero IOPS bottlenecks.',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      title: 'CosmicGuard 3.2 Tbps DDoS Shield',
      desc: 'Multi-layered Anycast packet filtering protects against volumetric Layer 4 attacks and specialized Minecraft Layer 7 query floods.',
    },
    {
      icon: Zap,
      color: 'text-amber-400',
      title: 'Instant 1-Click Setup',
      desc: 'Your Minecraft server is provisioned, bootstrapped, and assigned a dedicated port in less than 3 seconds after selection.',
    },
    {
      icon: Terminal,
      color: 'text-indigo-400',
      title: 'Interactive Web RCON Console',
      desc: 'Real-time terminal with ANSI color support, instant command execution, live player disconnects, and JVM telemetry.',
    },
    {
      icon: FolderOpen,
      color: 'text-purple-400',
      title: 'Full Web File Manager & Editor',
      desc: 'Edit server.properties, spigot.yml, and plugin configs directly in your browser with instant auto-save and syntax highlighting.',
    },
    {
      icon: Puzzle,
      color: 'text-cyan-400',
      title: '1-Click Plugin Hub',
      desc: 'Browse and install 100+ vetted plugins including LuckPerms, EssentialsX, WorldEdit, GeyserMC, and Dynmap in a single tap.',
    },
    {
      icon: Archive,
      color: 'text-emerald-400',
      title: 'Automated Snapshot Backups',
      desc: 'Offsite compressed Zstandard backups with 1-click restore. Never lose player inventory, world builds, or custom terrain data.',
    },
    {
      icon: Sparkles,
      color: 'text-cyan-400',
      title: 'SHADOW AI Engine v4.2',
      desc: 'Integrated Gemini-powered intelligence for automated crash dump analysis, PaperMC TPS tuning, Aikar flags, and MOTD design.',
    },
  ];

  return (
    <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
          <Radio className="w-3.5 h-3.5" />
          <span>Engineered For Maximum Performance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Why Competitive Communities Choose Shadow Host
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          From friend groups playing vanilla survival to massive faction networks with custom datapacks, our hardware infrastructure never throttles your tick loop.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel glass-panel-hover transition-all duration-300 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
