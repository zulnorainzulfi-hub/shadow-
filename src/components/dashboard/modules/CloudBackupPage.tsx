import React, { useState, useEffect } from 'react';
import { Cloud, Lock, Unlock, Download, RefreshCw, PlusCircle, CheckCircle2, Shield, HardDrive, Trash2 } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { CloudBackupItem } from '../../../types';

export const CloudBackupPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [backups, setBackups] = useState<CloudBackupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [backupName, setBackupName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'Frankfurt-S3' | 'Ashburn-S3' | 'Singapore-S3'>('Frankfurt-S3');
  const [backupType, setBackupType] = useState<'Full' | 'Incremental'>('Full');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    setLoading(true);
    fetch(`/api/servers/${selectedServer.id}/cloud-backups`)
      .then((res) => res.json())
      .then((data) => setBackups(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedServer]);

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    setCreating(true);
    try {
      const res = await fetch(`/api/servers/${selectedServer.id}/cloud-backups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: backupName.trim() || `Manual Snapshot ${new Date().toLocaleTimeString()}`,
          region: selectedRegion,
          type: backupType,
        }),
      });
      const data = await res.json();
      if (data.backup) {
        setBackups((prev) => [data.backup, ...prev]);
        setBackupName('');
        setActionMessage(`Encrypted snapshot "${data.backup.name}" synced to ${selectedRegion}.`);
        setTimeout(() => setActionMessage(null), 3000);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleToggleLock = (id: string) => {
    setBackups((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isLocked: !b.isLocked } : b))
    );
  };

  const handleRestore = (name: string) => {
    if (confirm(`Restore server from cloud snapshot "${name}"? Existing files will be preserved in a local rollback snapshot.`)) {
      setActionMessage(`Restoration initiated from cloud for "${name}". Server reloading...`);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Shadow Cloud Backup</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300">
                S3 REPLICATION
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Off-site AES-256 encrypted multi-region snapshots stored in isolated Shadow Vault & Google Coldline
          </p>
        </div>

        {actionMessage && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Snapshot Form */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-purple-400" />
            <span>DISPATCH CLOUD SNAPSHOT</span>
          </h3>

          <form onSubmit={handleCreateSnapshot} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">SNAPSHOT LABEL</label>
              <input
                type="text"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="e.g. Pre-EnderDragon Fight"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">TARGET CLOUD REGION</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Frankfurt-S3">Frankfurt Vault S3 (EU-Central)</option>
                <option value="Ashburn-S3">Ashburn Vault S3 (US-East)</option>
                <option value="Singapore-S3">Singapore Vault S3 (AP-South)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">SNAPSHOT METHOD</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBackupType('Full')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono border text-center transition-all ${
                    backupType === 'Full'
                      ? 'bg-purple-900/60 border-purple-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Full Archive
                </button>
                <button
                  type="button"
                  onClick={() => setBackupType('Incremental')}
                  className={`py-2 px-3 rounded-xl text-xs font-mono border text-center transition-all ${
                    backupType === 'Incremental'
                      ? 'bg-purple-900/60 border-purple-500 text-white font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Incremental Diff
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-300">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero Downtime Live VSS Snapshot</span>
              </div>
              <p>World files are mirrored without stopping the server process.</p>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer glow-purple"
            >
              {creating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Streaming Snapshot to S3...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  <span>Create Cloud Snapshot</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Cloud Backups Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>OFF-SITE ARCHIVES ({backups.length})</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">AES-256 Encrypted</span>
          </div>

          <div className="space-y-3">
            {backups.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-white">{b.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/60">
                      {b.type}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {b.region}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                    <span>{b.sizeMb} MB</span>
                    <span>·</span>
                    <span>{b.storageProvider}</span>
                    <span>·</span>
                    <span>{b.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLock(b.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title={b.isLocked ? 'Locked (Exempt from auto-purge)' : 'Unlocked'}
                  >
                    {b.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleRestore(b.name)}
                    className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-600/60 text-purple-200 text-xs font-mono font-bold transition-colors"
                  >
                    Restore
                  </button>

                  <button
                    onClick={() => alert(`Downloading archive payload from ${b.storageProvider}...\nChecksum: ${b.checksum}`)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Download Archive"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
