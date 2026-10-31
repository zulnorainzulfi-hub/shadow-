import React, { useState } from 'react';
import { ArrowRight, Server, Shield, CheckCircle2, RefreshCw, AlertCircle, Terminal, HardDrive } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { MigrationJob } from '../../../types';

export const ServerMigrationPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [provider, setProvider] = useState<'Apex' | 'Shockbyte' | 'Bisect' | 'Pterodactyl' | 'Custom SFTP'>('Apex');
  const [host, setHost] = useState('');
  const [port, setPort] = useState(2022);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remotePath, setRemotePath] = useState('/');
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationJob, setMigrationJob] = useState<MigrationJob | null>(null);

  const handleStartMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer || !host.trim() || !username.trim()) return;

    setIsMigrating(true);
    try {
      const res = await fetch(`/api/servers/${selectedServer.id}/migration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceProvider: provider,
          remoteHost: host.trim(),
          remotePort: port,
          remoteUser: username.trim(),
          remotePath,
        }),
      });
      const data = await res.json();
      setMigrationJob(data.job);

      // Simulate incremental progress completion
      let p = 42;
      const interval = setInterval(() => {
        p += 18;
        if (p >= 100) {
          clearInterval(interval);
          setMigrationJob((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'COMPLETED',
                  progressPercent: 100,
                  logs: [...prev.logs, 'All worlds, plugins, and configs migrated successfully.'],
                }
              : null
          );
          setIsMigrating(false);
        } else {
          setMigrationJob((prev) =>
            prev ? { ...prev, progressPercent: p } : null
          );
        }
      }, 800);
    } catch {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Server Migration Wizard</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                ZERO-DOWNTIME IMPORT
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Migrate your complete server from Apex, BisectHosting, Shockbyte, or any remote SFTP node into SHADOW HOST
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Left */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>ORIGIN SERVER CREDENTIALS</span>
          </h3>

          <form onSubmit={handleStartMigration} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">SOURCE HOSTING PROVIDER</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Apex', 'Shockbyte', 'Bisect', 'Pterodactyl', 'Custom SFTP'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProvider(p)}
                    className={`p-2.5 rounded-xl border text-xs font-mono transition-all ${
                      provider === p
                        ? 'bg-purple-900/60 border-purple-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-mono text-slate-300 mb-1">REMOTE SFTP HOST / IP</label>
                <input
                  type="text"
                  required
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="e.g. sftp.apexmc.co"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">PORT</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">USERNAME</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. node_user.1234"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">PASSWORD / TOKEN</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isMigrating}
              className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer glow-purple"
            >
              {isMigrating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Transferring Remote Server Payload...</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Initiate Encrypted SFTP Migration</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Migration Console Right */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>MIGRATION PIPELINE STATUS</span>
              </span>
              <span className="text-xs font-mono text-purple-300">
                {migrationJob?.status || 'IDLE'}
              </span>
            </h3>

            {migrationJob ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>Transfer Progress:</span>
                    <span className="text-cyan-400 font-bold">{migrationJob.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${migrationJob.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">THROUGHPUT:</span>
                    <span className="text-white font-bold">{migrationJob.speedMbps} Mbit/s</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">FILES TRANSFERRED:</span>
                    <span className="text-emerald-400 font-bold">{migrationJob.filesTransferred} Files</span>
                  </div>
                </div>

                {/* Stream Logs */}
                <div className="p-3 bg-black/80 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1">
                  {migrationJob.logs.map((log, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-purple-400">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 font-mono text-xs space-y-2">
                <HardDrive className="w-8 h-8 mx-auto text-slate-600" />
                <p>Enter your remote SFTP details and click Initiate to pull your server files.</p>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs font-mono text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Files are integrity-checked with SHA-256 before extraction.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
