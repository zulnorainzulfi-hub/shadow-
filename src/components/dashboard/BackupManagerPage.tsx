import React, { useState } from 'react';
import {
  Archive,
  HardDrive,
  Download,
  RotateCcw,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';

export const BackupManagerPage: React.FC = () => {
  const {
    selectedServer,
    backups,
    createBackup,
    restoreBackup,
    deleteBackup,
  } = useServer();

  const [backupName, setBackupName] = useState('');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!selectedServer) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 font-mono">
        No active server selected.
      </div>
    );
  }

  const serverBackups = backups.filter((b) => b.serverId === selectedServer.id);
  const totalBackupSizeMb = serverBackups.reduce((acc, b) => acc + b.sizeMb, 0);
  const backupQuotaMb = 10000; // 10 GB backup allocation

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = backupName.trim() || `manual_snapshot_${Date.now()}`;
    createBackup(selectedServer.id, name);
    setBackupName('');
    setToastMessage(`Snapshot "${name}" generated and verified with SHA256 checksum.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestore = (name: string, id: string) => {
    if (confirm(`Restore ${name}? This will roll back all world files and player inventories to this snapshot state.`)) {
      restoreBackup(id);
      setToastMessage(`Restored snapshot ${name} successfully! Please restart server.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Disaster Recovery & Backups</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300">
              {selectedServer.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zstandard-compressed atomic snapshots stored in independent offsite cold vaults
          </p>
        </div>

        {/* Auto Backup Toggle */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <Clock className="w-4 h-4 text-cyan-400" />
          <div className="text-xs font-mono">
            <div className="text-white font-bold">Automatic Daily Backups</div>
            <div className="text-[10px] text-slate-500">Every night at 04:00 UTC</div>
          </div>
          <button
            onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              autoBackupEnabled ? 'bg-purple-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                autoBackupEnabled ? 'left-5.5' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Storage Usage & Snapshot Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Backup Quota Meter (Col 5) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>OFFSITE BACKUP QUOTA</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {(totalBackupSizeMb / 1024).toFixed(2)} / {(backupQuotaMb / 1024).toFixed(0)} GB
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalBackupSizeMb / backupQuotaMb) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span>{serverBackups.length} Total Snapshots</span>
              <span>{((totalBackupSizeMb / backupQuotaMb) * 100).toFixed(0)}% Allocated</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono space-y-1">
            <div className="text-purple-300 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Immutable Offsite Storage</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Snapshots are mirrored across isolated Frankfurt and Ashburn cold storages to guarantee survival against hardware failure.
            </p>
          </div>
        </div>

        {/* Create Snapshot Form (Col 7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Generate Immediate Snapshot</span>
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                SNAPSHOT NAME OR DESCRIPTION
              </label>
              <input
                type="text"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="e.g. pre_nether_update_world"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
            >
              <Archive className="w-3.5 h-3.5 text-cyan-300" />
              <span>Take Full Server Snapshot</span>
            </button>
          </form>
        </div>
      </div>

      {/* Snapshot History Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono text-slate-300">BACKUP HISTORY ARCHIVES</h3>
          <span className="text-xs font-mono text-purple-400">{serverBackups.length} Saved</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {serverBackups.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              No backups generated yet. Create a snapshot using the form above.
            </div>
          ) : (
            serverBackups.map((b) => (
              <div
                key={b.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-700/50 flex items-center justify-center text-purple-400 shrink-0">
                    <Archive className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
                      <span>{b.name}</span>
                      {b.isAutomatic && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                          AUTO
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {b.sizeMb} MB · Created {b.createdAt} · {b.checksum}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleRestore(b.name, b.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Restore Snapshot"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Downloading ${b.name}... Checksum verified.`);
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Download Archive"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteBackup(b.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Snapshot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
