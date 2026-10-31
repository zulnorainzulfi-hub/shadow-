import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCw,
  Square,
  Skull,
  Terminal,
  Send,
  Copy,
  Check,
  Cpu,
  HardDrive,
  Users,
  Activity,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';

export const ServerConsolePage: React.FC = () => {
  const {
    selectedServer,
    startServer,
    stopServer,
    restartServer,
    killServer,
  } = useServer();

  const [commandInput, setCommandInput] = useState('');
  const [copiedIp, setCopiedIp] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: string; time: string; level: string; msg: string }>>([
    { id: '1', time: '05:12:00', level: 'INFO', msg: `[ShadowEngine] Booting JVM on AMD Ryzen 9 7950X3D hardware slice...` },
    { id: '2', time: '05:12:01', level: 'INFO', msg: `[Paper] Loading properties from ./server.properties` },
    { id: '3', time: '05:12:02', level: 'INFO', msg: `[Paper] Default game type: SURVIVAL` },
    { id: '4', time: '05:12:03', level: 'INFO', msg: `[Paper] Generating keypair for online-mode authentication` },
    { id: '5', time: '05:12:04', level: 'INFO', msg: `[Paper] Starting Minecraft server on *:25565` },
    { id: '6', time: '05:12:06', level: 'INFO', msg: `[Geyser-Spigot] Loaded Bedrock-Java protocol translator v2.4.2` },
    { id: '7', time: '05:12:07', level: 'INFO', msg: `[Spark] Spark profiler v1.10.53 registered hook on Paper tick loop` },
    { id: '8', time: '05:12:08', level: 'INFO', msg: `[Paper] Preparing start region for dimension minecraft:overworld` },
    { id: '9', time: '05:12:09', level: 'INFO', msg: `[Paper] Done (1.894s)! For help, type "help"` },
    { id: '10', time: '05:14:22', level: 'INFO', msg: `[Server] Krypton7[/141.95.12.99:54201] logged in with entity id 104` },
    { id: '11', time: '05:16:10', level: 'INFO', msg: `[Server] VoxelGhost[/198.51.100.41:51940] logged in with entity id 105` },
  ]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  if (!selectedServer) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 font-mono">
        No active server selected. Please create or choose a server from the top bar.
      </div>
    );
  }

  const handleCopyIp = () => {
    navigator.clipboard.writeText(`${selectedServer.ip}:${selectedServer.port}`);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const handleSendCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    const now = new Date().toTimeString().split(' ')[0];

    const newLogs = [
      ...terminalLogs,
      { id: `cmd-${Date.now()}`, time: now, level: 'INPUT', msg: `> ${cmd}` },
    ];

    const lower = cmd.toLowerCase();
    if (lower === '/help' || lower === '?') {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: now,
        level: 'INFO',
        msg: `--- Available Server Commands ---
/tps - Display current tick rates (1m, 5m, 15m) and MSPT
/spark - JVM performance & memory profiler report
/say <text> - Broadcast message to all connected players
/whitelist <add|remove|list> - Manage whitelisted players
/op <player> - Grant operator permissions
/kick <player> - Disconnect a player
/gamemode <survival|creative|spectator> [player] - Switch gamemodes`,
      });
    } else if (lower === '/tps') {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: now,
        level: 'INFO',
        msg: `[Paper] TPS from last 1m, 5m, 15m: 20.0, 20.0, 20.0. Current MSPT: 10.8ms (Nominal 20.00 TPS)`,
      });
    } else if (lower === '/spark') {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: now,
        level: 'INFO',
        msg: `[Spark] CPU: 24.2% | Heap: ${(selectedServer.ramUsageMb / 1024).toFixed(1)} / ${(selectedServer.ramAllocationMb / 1024).toFixed(1)} GB | Garbage Collector: ZGC (0.4ms avg pause)`,
      });
    } else if (lower.startsWith('/say ')) {
      const msg = cmd.slice(5);
      newLogs.push({
        id: `res-${Date.now()}`,
        time: now,
        level: 'INFO',
        msg: `[Server] [BROADCAST]: ${msg}`,
      });
    } else if (lower.startsWith('/whitelist add ')) {
      const p = cmd.split(' ')[2];
      newLogs.push({
        id: `res-${Date.now()}`,
        time: now,
        level: 'INFO',
        msg: `[Server] Added ${p} to the whitelist.`,
      });
    } else {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: now,
        level: 'INFO',
        msg: `[Server] Executed: ${cmd}`,
      });
    }

    setTerminalLogs(newLogs);
    setCommandInput('');
  };

  const isOnline = selectedServer.status === 'online';
  const isStarting = selectedServer.status === 'starting';
  const isStopping = selectedServer.status === 'stopping';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Server Control Strip */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">{selectedServer.name}</h1>
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                isOnline
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400'
                  : isStarting || isStopping
                  ? 'bg-amber-950/80 border-amber-600 text-amber-400'
                  : 'bg-rose-950/80 border-rose-600 text-rose-400'
              }`}
            >
              {selectedServer.status.toUpperCase()}
            </span>
          </div>

          {/* IP and Port */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
            <button
              onClick={handleCopyIp}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              <span>
                {selectedServer.ip}:{selectedServer.port}
              </span>
              {copiedIp ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <span>·</span>
            <span>{selectedServer.region}</span>
            <span>·</span>
            <span>{selectedServer.software} {selectedServer.version}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-purple-400" />
              <span>Uptime: {isOnline ? selectedServer.uptime : '0m'}</span>
            </span>
          </div>
        </div>

        {/* 4 Power Controls from Prompt: Start, Stop, Restart, Kill */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => startServer(selectedServer.id)}
            disabled={isOnline || isStarting}
            className="px-4 py-2 text-xs font-bold font-mono rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950"
          >
            <Play className="w-3.5 h-3.5" />
            <span>START</span>
          </button>

          <button
            onClick={() => restartServer(selectedServer.id)}
            disabled={!isOnline || isStarting || isStopping}
            className="px-4 py-2 text-xs font-bold font-mono rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-amber-950"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isStarting || isStopping ? 'animate-spin' : ''}`} />
            <span>RESTART</span>
          </button>

          <button
            onClick={() => stopServer(selectedServer.id)}
            disabled={!isOnline || isStopping}
            className="px-4 py-2 text-xs font-bold font-mono rounded-xl bg-rose-700 hover:bg-rose-600 disabled:opacity-40 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-rose-950"
          >
            <Square className="w-3.5 h-3.5" />
            <span>STOP</span>
          </button>

          <button
            onClick={() => killServer(selectedServer.id)}
            disabled={!isOnline}
            className="px-3.5 py-2 text-xs font-bold font-mono rounded-xl bg-slate-900 hover:bg-rose-950 text-rose-400 border border-rose-900/60 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Force terminate PID immediately"
          >
            <Skull className="w-3.5 h-3.5" />
            <span>KILL</span>
          </button>
        </div>
      </div>

      {/* Real-time Hardware Telemetry Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric: Players */}
        <div className="p-4 rounded-xl glass-panel space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ONLINE PLAYERS</span>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {isOnline ? selectedServer.playersOnline : 0} / {selectedServer.maxPlayers}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {selectedServer.maxPlayers - (isOnline ? selectedServer.playersOnline : 0)} slots available
          </div>
        </div>

        {/* Metric: RAM */}
        <div className="p-4 rounded-xl glass-panel space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>RAM ALLOCATION</span>
            <span className="text-cyan-400 tabular-nums">
              {isOnline
                ? `${Math.round((selectedServer.ramUsageMb / selectedServer.ramAllocationMb) * 100)}%`
                : '0%'}
            </span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {isOnline ? (selectedServer.ramUsageMb / 1024).toFixed(1) : 0} /{' '}
            {(selectedServer.ramAllocationMb / 1024).toFixed(0)} GB
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all"
              style={{
                width: isOnline
                  ? `${(selectedServer.ramUsageMb / selectedServer.ramAllocationMb) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>

        {/* Metric: CPU */}
        <div className="p-4 rounded-xl glass-panel space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CPU UTILIZATION</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {isOnline ? `${selectedServer.cpuUsagePercent}%` : '0%'}
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all"
              style={{ width: isOnline ? `${selectedServer.cpuUsagePercent}%` : '0%' }}
            />
          </div>
        </div>

        {/* Metric: Disk */}
        <div className="p-4 rounded-xl glass-panel space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>STORAGE USAGE</span>
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {selectedServer.diskUsageGb} / {selectedServer.diskAllocationGb} GB
          </div>
          <div className="text-[11px] text-slate-500 font-mono">NVMe ZFS Gen4</div>
        </div>
      </div>

      {/* Live Interactive Terminal */}
      <div className="space-y-3">
        <div className="bg-[#05060a] border border-purple-900/40 rounded-2xl p-4 font-mono text-xs h-[450px] overflow-y-auto space-y-1.5 shadow-inner">
          <div className="text-slate-600 border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
            <span>SHADOW HOST Web RCON Terminal — PID #4819</span>
            <span className="text-purple-400">Type &quot;/help&quot; for server commands</span>
          </div>

          {terminalLogs.map((log) => (
            <div key={log.id} className="leading-relaxed flex items-start gap-2">
              <span className="text-slate-600 shrink-0 tabular-nums">[{log.time}]</span>
              <span
                className={`font-semibold shrink-0 ${
                  log.level === 'WARN'
                    ? 'text-amber-400'
                    : log.level === 'ERROR'
                    ? 'text-rose-400'
                    : log.level === 'INPUT'
                    ? 'text-cyan-400 font-bold'
                    : 'text-purple-400'
                }`}
              >
                [{log.level}]
              </span>
              <span
                className={`${
                  log.level === 'INPUT'
                    ? 'text-cyan-300 font-bold'
                    : log.level === 'WARN'
                    ? 'text-amber-200'
                    : 'text-slate-300'
                }`}
              >
                {log.msg}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Form */}
        <form onSubmit={handleSendCommand} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-xs">
              &gt;
            </span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder='Type a command (e.g. "/tps", "/say Welcome to ShadowSMP!", "/spark", "/whitelist add Notch")...'
              className="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer glow-purple"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Command</span>
          </button>
        </form>

        {/* Command shortcut chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Quick Commands:</span>
          {['/tps', '/spark', '/say Server backup in 5 minutes', '/whitelist list', '/stop'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setCommandInput(cmd);
                setTimeout(() => handleSendCommand(), 50);
              }}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
