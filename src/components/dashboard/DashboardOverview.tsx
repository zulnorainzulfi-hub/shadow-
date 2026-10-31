import React from 'react';
import {
  Server,
  Activity,
  Users,
  HardDrive,
  Cpu,
  PlusCircle,
  Terminal,
  FolderOpen,
  ArrowRight,
  Play,
  Square,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';

interface DashboardOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateTab }) => {
  const {
    servers,
    startServer,
    stopServer,
    restartServer,
    setSelectedServerId,
  } = useServer();

  // Calculate aggregate metrics
  const totalServers = servers.length;
  const onlineServers = servers.filter((s) => s.status === 'online').length;
  const offlineServers = totalServers - onlineServers;

  const totalRamUsageMb = servers.reduce((acc, s) => acc + s.ramUsageMb, 0);
  const totalRamAllocMb = servers.reduce((acc, s) => acc + s.ramAllocationMb, 0);
  const ramUsageGb = (totalRamUsageMb / 1024).toFixed(1);
  const ramAllocGb = (totalRamAllocMb / 1024).toFixed(1);
  const ramPercent = totalRamAllocMb > 0 ? Math.round((totalRamUsageMb / totalRamAllocMb) * 100) : 0;

  const avgCpuUsage = servers.length > 0 ? Math.round(servers.reduce((acc, s) => acc + s.cpuUsagePercent, 0) / servers.length) : 0;

  const totalDiskUsageGb = servers.reduce((acc, s) => acc + s.diskUsageGb, 0).toFixed(1);
  const totalDiskAllocGb = servers.reduce((acc, s) => acc + s.diskAllocationGb, 0);

  const currentOnlinePlayers = servers.reduce((acc, s) => acc + s.playersOnline, 0);
  const maxPlayerSlots = servers.reduce((acc, s) => acc + s.maxPlayers, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-800/40">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 font-mono">
            High-performance telemetry across all your provisioned Minecraft hardware slices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('ai')}
            className="px-4 py-2.5 text-xs font-mono font-bold text-cyan-300 bg-gradient-to-r from-purple-950/80 to-slate-900 border border-purple-500/60 hover:border-cyan-400 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Launch SHADOW AI</span>
          </button>
          <button
            onClick={() => onNavigateTab('create')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
          >
            <PlusCircle className="w-4 h-4 text-cyan-300" />
            <span>Create New Server</span>
          </button>
        </div>
      </div>

      {/* 8 Metric Cards from Prompt Requirements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 & 2 & 3: Total, Online, Offline */}
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL SERVERS</span>
            <Server className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {totalServers}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="text-emerald-400">{onlineServers} Online</span>
            <span className="text-slate-600">·</span>
            <span className="text-rose-400">{offlineServers} Offline</span>
          </div>
        </div>

        {/* Metric 4: RAM Usage */}
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RAM USAGE</span>
            <span className="text-cyan-400 tabular-nums">{ramPercent}%</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {ramUsageGb} / {ramAllocGb} GB
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${ramPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 5: CPU Usage */}
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CPU WORKLOAD</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {avgCpuUsage}% Average
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: `${avgCpuUsage}%` }}
            />
          </div>
        </div>

        {/* Metric 6: Storage Usage */}
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>STORAGE USAGE</span>
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {totalDiskUsageGb} / {totalDiskAllocGb} GB
          </div>
          <div className="text-[11px] text-slate-500 font-mono">NVMe PCIe 4.0 ZFS</div>
        </div>

        {/* Metric 7 & 8: Current Players & Max Slots */}
        <div className="p-4 rounded-xl glass-panel space-y-2 col-span-2 md:col-span-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>GLOBAL PLAYER CAPACITY & SLOTS ALLOCATION</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {currentOnlinePlayers} / {maxPlayerSlots} Active Players
            </div>
            <div className="text-xs font-mono text-emerald-400">
              {maxPlayerSlots - currentOnlinePlayers} Available Slots Across Your Fleet
            </div>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{
                width: `${maxPlayerSlots > 0 ? (currentOnlinePlayers / maxPlayerSlots) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Your Servers List with Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Minecraft Servers</h2>
          <button
            onClick={() => onNavigateTab('servers')}
            className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
          >
            <span>View All ({servers.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.map((server) => (
            <div
              key={server.id}
              className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/50 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{server.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        server.status === 'online'
                          ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-400'
                          : server.status === 'starting'
                          ? 'bg-amber-950/80 border border-amber-700 text-amber-400'
                          : 'bg-rose-950/80 border border-rose-700 text-rose-400'
                      }`}
                    >
                      {server.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {server.ip}:{server.port} · {server.software} {server.version}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {server.status === 'online' ? (
                    <>
                      <button
                        onClick={() => restartServer(server.id)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-colors"
                        title="Restart Server"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => stopServer(server.id)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 transition-colors"
                        title="Stop Server"
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startServer(server.id)}
                      className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 transition-colors"
                      title="Start Server"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Specs & Slots */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">PLAYERS</div>
                  <div className="text-white font-bold tabular-nums">
                    {server.playersOnline} / {server.maxPlayers}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">MEMORY</div>
                  <div className="text-cyan-400 font-bold tabular-nums">
                    {(server.ramUsageMb / 1024).toFixed(1)} GB
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">CPU LOAD</div>
                  <div className="text-purple-300 font-bold tabular-nums">
                    {server.cpuUsagePercent}%
                  </div>
                </div>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedServerId(server.id);
                    onNavigateTab('console');
                  }}
                  className="flex-1 py-2 text-xs font-mono font-bold text-white bg-slate-800 hover:bg-purple-900/60 border border-slate-700 hover:border-purple-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Console</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedServerId(server.id);
                    onNavigateTab('files');
                  }}
                  className="flex-1 py-2 text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>File Manager</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 25 ADVANCED FEATURE EXPANSIONS QUICK LAUNCHER            */}
      {/* ======================================================== */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-xl font-black text-white font-mono tracking-tight">
                SHADOW ADVANCED SUITE (25 MODULES)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Enterprise game server capabilities, real-time telemetry, zero-trust security, and automated cloud systems
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950 border border-purple-600/60 text-purple-300 font-bold w-fit">
            25 / 25 MODULES ONLINE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[
            { id: 'live-monitor', label: '1. Live Monitor', desc: 'Real-time TPS, MSPT & heap' },
            { id: 'ai-builder', label: '2. AI Builder', desc: 'Custom datapacks & scripts' },
            { id: 'crash-recovery', label: '3. Crash Recovery', desc: 'Watchdog auto-reboot' },
            { id: 'cloud-backup', label: '4. Cloud Backup', desc: 'Encrypted S3 snapshots' },
            { id: 'marketplace', label: '5. Marketplace', desc: '1-click maps & plugins' },
            { id: 'mobile', label: '6. Mobile Control', desc: 'QR smartphone pairing' },
            { id: 'subusers', label: '7. Subusers (RBAC)', desc: 'Granular staff permissions' },
            { id: 'startup', label: '8. Startup Manager', desc: 'Boot args & idle sleep' },
            { id: 'version-switcher', label: '9. Version Switcher', desc: 'Paper, Purpur, Fabric' },
            { id: 'worlds', label: '10. World Manager', desc: 'Gamerules & seeds' },
            { id: 'database', label: '11. MySQL Databases', desc: 'Dedicated MariaDB' },
            { id: 'schedules', label: '12. Scheduled Tasks', desc: 'Visual Cron automation' },
            { id: 'player-analytics', label: '13. Player Analytics', desc: 'Retention & curves' },
            { id: 'access-control', label: '14. Whitelist & Bans', desc: 'UUID & IP moderation' },
            { id: 'java-version', label: '15. Java Selector', desc: 'JDK 21, 17 & GraalVM' },
            { id: 'modpacks', label: '16. Modpack Installer', desc: 'CurseForge & Modrinth' },
            { id: 'clone', label: '17. Server Cloning', desc: '1-click container clone' },
            { id: 'jvm', label: '18. Custom JVM Flags', desc: 'Aikar & GC tuning' },
            { id: 'network', label: '19. Network Analytics', desc: 'DDoS mitigation graphs' },
            { id: 'migration', label: '20. Server Migration', desc: 'Remote SFTP import' },
            { id: 'announcements', label: '21. Announcement Center', desc: 'Live MOTD & title alerts' },
            { id: 'referrals', label: '22. Referral Rewards', desc: '25% earnings & free RAM' },
            { id: 'maintenance', label: '23. Maintenance Mode', desc: 'Lockdown & kick notices' },
            { id: 'status', label: '24. Public Status', desc: '99.99% uptime tracker' },
            { id: 'shield', label: '25. Shadow Shield', desc: 'Log4j & NullPing filter' },
          ].map((mod) => (
            <button
              key={mod.id}
              onClick={() => onNavigateTab(mod.id)}
              className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-600/70 text-left transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold font-mono text-white group-hover:text-cyan-300 transition-colors block truncate">
                  {mod.label}
                </span>
                <span className="text-[10px] text-slate-500 font-sans mt-0.5 line-clamp-1 block">
                  {mod.desc}
                </span>
              </div>
              <div className="pt-2 flex justify-end">
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

