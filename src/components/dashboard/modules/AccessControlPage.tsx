import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, UserX, PlusCircle, Trash2, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { WhitelistEntry, BanEntry } from '../../../types';

export const AccessControlPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [bans, setBans] = useState<BanEntry[]>([]);
  const [newWhitelistedUser, setNewWhitelistedUser] = useState('');
  const [banTarget, setBanTarget] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banType, setBanType] = useState<'UUID' | 'IP'>('UUID');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/access-control`)
      .then((res) => res.json())
      .then((data) => {
        setWhitelistEnabled(data.whitelistEnabled || false);
        setWhitelist(data.whitelist || []);
        setBans(data.bans || []);
      })
      .catch(() => {});
  }, [selectedServer]);

  const toggleWhitelist = async () => {
    if (!selectedServer) return;
    const next = !whitelistEnabled;
    setWhitelistEnabled(next);
    await fetch(`/api/servers/${selectedServer.id}/access-control/whitelist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: next }),
    });
    setFeedback(`Whitelist ${next ? 'ENABLED' : 'DISABLED'}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer || !newWhitelistedUser.trim()) return;

    const res = await fetch(`/api/servers/${selectedServer.id}/access-control/whitelist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newWhitelistedUser.trim() }),
    });
    const data = await res.json();
    if (data.data?.whitelist) {
      setWhitelist(data.data.whitelist);
      setNewWhitelistedUser('');
      setFeedback('Player added to whitelist.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleAddBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer || !banTarget.trim()) return;

    const res = await fetch(`/api/servers/${selectedServer.id}/access-control/ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: banTarget.trim(),
        reason: banReason.trim() || 'Rule violation',
        type: banType,
      }),
    });
    const data = await res.json();
    if (data.ban) {
      setBans((prev) => [data.ban, ...prev]);
      setBanTarget('');
      setBanReason('');
      setFeedback(`Banned ${banType}: ${data.ban.target}`);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleUnban = (id: string, target: string) => {
    setBans((prev) => prev.filter((b) => b.id !== id));
    setFeedback(`Unbanned ${target}.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Whitelist & Ban Manager</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                ACCESS CONTROL
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Enforce private server access, manage Minecraft UUID whitelists, and inspect active IP / player ban records
          </p>
        </div>

        <button
          onClick={toggleWhitelist}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold border flex items-center gap-2 transition-all ${
            whitelistEnabled
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          {whitelistEnabled ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          <span>WHITELIST: {whitelistEnabled ? 'ACTIVE (ENFORCED)' : 'DISABLED (PUBLIC)'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Whitelist Panel */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>WHITELISTED PLAYERS ({whitelist.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Auto-resolves UUID</span>
          </div>

          <form onSubmit={handleAddWhitelist} className="flex gap-2">
            <input
              type="text"
              required
              value={newWhitelistedUser}
              onChange={(e) => setNewWhitelistedUser(e.target.value)}
              placeholder="Username e.g. Notch, Jeb_"
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-mono font-bold"
            >
              Add User
            </button>
          </form>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {whitelist.map((w, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-white block">{w.username}</span>
                  <span className="text-[10px] text-slate-500">{w.uuid}</span>
                </div>
                <button
                  onClick={() => setWhitelist((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ban Manager Panel */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-400" />
              <span>ACTIVE BANS ({bans.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">IP & UUID Moderation</span>
          </div>

          <form onSubmit={handleAddBan} className="space-y-2">
            <div className="flex gap-2">
              <select
                value={banType}
                onChange={(e) => setBanType(e.target.value as any)}
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              >
                <option value="UUID">Player UUID / Name</option>
                <option value="IP">IP Address</option>
              </select>
              <input
                type="text"
                required
                value={banTarget}
                onChange={(e) => setBanTarget(e.target.value)}
                placeholder="Target username or IP..."
                className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason (e.g. Griefing, Combat Hacks)"
                className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-mono font-bold"
              >
                Ban
              </button>
            </div>
          </form>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {bans.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-400">{b.target}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {b.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">{b.reason}</span>
                  <span className="text-[10px] text-slate-600">By {b.bannedBy} · {b.bannedAt}</span>
                </div>
                <button
                  onClick={() => handleUnban(b.id, b.target)}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Unban
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
