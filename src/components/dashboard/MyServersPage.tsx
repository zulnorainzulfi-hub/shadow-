import React, { useState } from 'react';
import {
  Server,
  PlusCircle,
  Terminal,
  FolderOpen,
  Archive,
  Settings,
  Play,
  Square,
  RotateCw,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';

interface MyServersPageProps {
  onNavigateTab: (tab: string) => void;
}

export const MyServersPage: React.FC<MyServersPageProps> = ({ onNavigateTab }) => {
  const {
    servers,
    setSelectedServerId,
    startServer,
    stopServer,
    restartServer,
    deleteServer,
  } = useServer();

  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredServers = servers.filter((s) => {
    if (filter === 'online') return s.status === 'online';
    if (filter === 'offline') return s.status === 'offline';
    return true;
  });

  const handleCopyIp = (ip: string, port: number, id: string) => {
    navigator.clipboard.writeText(`${ip}:${port}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-800/40">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Minecraft Servers</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage your fleet of game instances, monitor tick rates, and deploy new nodes
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('create')}
          className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
        >
          <PlusCircle className="w-4 h-4 text-cyan-300" />
          <span>Deploy New Server</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-purple-900/60 border border-purple-500 text-white font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Servers ({servers.length})
        </button>
        <button
          onClick={() => setFilter('online')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            filter === 'online'
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Online ({servers.filter((s) => s.status === 'online').length})
        </button>
        <button
          onClick={() => setFilter('offline')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
            filter === 'offline'
              ? 'bg-rose-950/80 border border-rose-500 text-rose-300 font-bold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Offline ({servers.filter((s) => s.status === 'offline').length})
        </button>
      </div>

      {/* Servers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServers.map((server) => {
          const isOnline = server.status === 'online';
          const isStarting = server.status === 'starting';

          return (
            <div
              key={server.id}
              className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-purple-500/50 transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{server.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isOnline
                            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                            : isStarting
                            ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                            : 'bg-rose-950/80 border-rose-700 text-rose-400'
                        }`}
                      >
                        {server.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      {server.regionFlag} {server.region} · {server.software} {server.version}
                    </div>
                  </div>

                  {/* Power toggles */}
                  <div className="flex items-center gap-1.5">
                    {isOnline ? (
                      <>
                        <button
                          onClick={() => restartServer(server.id)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-colors cursor-pointer"
                          title="Restart"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => stopServer(server.id)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                          title="Stop"
                        >
                          <Square className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startServer(server.id)}
                        className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 transition-colors cursor-pointer"
                        title="Start"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* IP Bar */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold truncate">
                    {server.ip}:{server.port}
                  </span>
                  <button
                    onClick={() => handleCopyIp(server.ip, server.port, server.id)}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy IP"
                  >
                    {copiedId === server.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">PLAYERS</div>
                    <div className="text-white font-bold tabular-nums">
                      {isOnline ? server.playersOnline : 0} / {server.maxPlayers}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">MEMORY</div>
                    <div className="text-cyan-400 font-bold tabular-nums">
                      {(server.ramAllocationMb / 1024).toFixed(0)} GB
                    </div>
                  </div>
                  <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">STORAGE</div>
                    <div className="text-purple-300 font-bold tabular-nums">
                      {server.diskAllocationGb} GB
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedServerId(server.id);
                    onNavigateTab('console');
                  }}
                  className="flex-1 py-2 text-xs font-mono font-bold text-white bg-slate-800 hover:bg-purple-900/60 border border-slate-700 hover:border-purple-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Console</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedServerId(server.id);
                    onNavigateTab('files');
                  }}
                  className="flex-1 py-2 text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Files</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedServerId(server.id);
                    onNavigateTab('backups');
                  }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Backups"
                >
                  <Archive className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${server.name}?`)) {
                      deleteServer(server.id);
                    }
                  }}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                  title="Delete Server"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
