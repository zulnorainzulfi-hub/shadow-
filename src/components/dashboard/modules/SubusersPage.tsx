import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, CheckCircle2, Lock, Terminal, FolderOpen, Database, Archive, Clock } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { SubuserEntry } from '../../../types';

export const SubusersPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [subusers, setSubusers] = useState<SubuserEntry[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SubuserEntry['role']>('Operator');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/subusers`)
      .then((res) => res.json())
      .then((data) => setSubusers(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer || !email.trim()) return;

    try {
      const res = await fetch(`/api/servers/${selectedServer.id}/subusers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          role,
        }),
      });
      const data = await res.json();
      if (data.subuser) {
        setSubusers((prev) => [...prev, data.subuser]);
        setEmail('');
        setIsModalOpen(false);
        setFeedback(`Subuser invite sent to ${data.subuser.email}!`);
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {}
  };

  const handleRevoke = async (subId: string) => {
    if (!selectedServer) return;
    if (confirm('Revoke staff subuser access immediately?')) {
      await fetch(`/api/servers/${selectedServer.id}/subusers/${subId}`, { method: 'DELETE' });
      setSubusers((prev) => prev.filter((s) => s.id !== subId));
      setFeedback('Subuser access revoked.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Subuser Permissions (RBAC)</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                ROLE-BASED ACCESS
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Delegate server operations to moderators, co-owners, and plugin developers with strict granular permissions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
        >
          <UserPlus className="w-4 h-4 text-cyan-300" />
          <span>Invite Subuser</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Subusers Table */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
          <span>ACTIVE TEAM MEMBERS ({subusers.length})</span>
          <span className="text-xs text-slate-500 font-mono">Real-time SFTP & API isolation</span>
        </h3>

        <div className="space-y-3">
          {subusers.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center font-mono font-bold text-white text-sm">
                  {sub.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{sub.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-bold">
                      {sub.role}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {sub.email} · Last active: {sub.lastActive || 'Recently'}
                  </div>
                </div>
              </div>

              {/* Permission Badges */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                {sub.permissions.power && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-900/40">Power</span>
                )}
                {sub.permissions.console && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-purple-900/40">Console</span>
                )}
                {sub.permissions.files && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-900/40">File Manager</span>
                )}
                {sub.permissions.database && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-indigo-900/40">Database</span>
                )}
                {sub.permissions.backups && (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-900/40">Backups</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRevoke(sub.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Revoke Subuser"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-purple-800/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">INVITE NEW SUBUSER</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">ASSIGN ROLE PRESET</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Operator">Operator (Power, Console, Plugins)</option>
                  <option value="Co-Owner">Co-Owner (Full access except billing)</option>
                  <option value="Moderator">Moderator (Console & Kick/Ban)</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-mono text-white bg-purple-700 hover:bg-purple-600 rounded-xl shadow-md"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
