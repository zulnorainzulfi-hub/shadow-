import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertTriangle, Key, Plus, Trash2, CheckCircle2, ShieldAlert, FileText, Ban } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { SecuritySettings } from '../../../types';

export const ShadowShieldPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [security, setSecurity] = useState<SecuritySettings>({
    shieldProtectionActive: true,
    log4jExploitFilter: true,
    nullPingScrubbing: true,
    antiBotRateLimit: true,
    rconIpWhitelistEnabled: false,
    rconAllowedIps: ['127.0.0.1', '192.168.1.0/24'],
    enforceTwoFactorStaff: true,
    auditLogs: [
      { id: 'log-1', timestamp: '12m ago', event: 'Staff login from Frankfurt IP', severity: 'INFO', ip: '82.165.197.1', user: 'Zulnorain' },
      { id: 'log-2', timestamp: '1h ago', event: 'Blocked Malformed Log4j JNDI packet payload', severity: 'BLOCKED', ip: '45.142.122.9', user: 'External Attacker' },
      { id: 'log-3', timestamp: '3h ago', event: 'RCON password verification passed', severity: 'INFO', ip: '192.168.1.5', user: 'Console Script' },
    ],
  });
  const [newIp, setNewIp] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/security`)
      .then((res) => res.json())
      .then((data) => setSecurity(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleUpdate = async (updated: SecuritySettings) => {
    if (!selectedServer) return;
    setSecurity(updated);
    await fetch(`/api/servers/${selectedServer.id}/security`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setFeedback('Security policies synced to edge firewall.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const addIp = () => {
    if (!newIp.trim()) return;
    const updated = {
      ...security,
      rconAllowedIps: [...security.rconAllowedIps, newIp.trim()],
    };
    handleUpdate(updated);
    setNewIp('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Shadow Shield Security Engine</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                ACTIVE DEFENSE
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-day exploit filtering, Log4j deep-packet inspection, RCON IP whitelist boundaries, and real-time security audit trails
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/60 text-purple-200 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>SHIELD STATUS: ENGAGED</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Security Policies Toggle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            key: 'log4jExploitFilter',
            title: 'Log4Shell & JNDI Exploit Filter',
            desc: 'Drops malformed chat strings and NBT payloads attempting remote code execution.',
            val: security.log4jExploitFilter,
          },
          {
            key: 'nullPingScrubbing',
            title: 'Minecraft NullPing & BadPacket Filter',
            desc: 'Blocks broken handshake frames designed to exhaust server socket buffers.',
            val: security.nullPingScrubbing,
          },
          {
            key: 'antiBotRateLimit',
            title: 'Anti-Bot Handshake Throttler',
            desc: 'Limits rapid reconnect floods to 5 connections/sec per unique source IP.',
            val: security.antiBotRateLimit,
          },
          {
            key: 'enforceTwoFactorStaff',
            title: 'Enforce 2FA for Staff / Subusers',
            desc: 'Requires TOTP authentication before modifying files or executing console commands.',
            val: security.enforceTwoFactorStaff,
          },
        ].map((pol) => (
          <div
            key={pol.key}
            className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-white block">{pol.title}</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{pol.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={pol.val}
              onChange={(e) =>
                handleUpdate({ ...security, [pol.key]: e.target.checked } as any)
              }
              className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* RCON IP Whitelist & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RCON IP Whitelist */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>RCON IP WHITELIST</span>
            </h3>
            <input
              type="checkbox"
              checked={security.rconIpWhitelistEnabled}
              onChange={(e) =>
                handleUpdate({ ...security, rconIpWhitelistEnabled: e.target.checked })
              }
              className="w-4 h-4 accent-purple-600 rounded"
              title="Toggle RCON IP restriction"
            />
          </div>

          <p className="text-xs text-slate-400 font-sans">
            When enabled, remote RCON console packets are strictly dropped unless originated from an approved IP.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 192.168.1.100 or CIDR"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={addIp}
              className="px-3.5 py-2 bg-purple-950 hover:bg-purple-900 border border-purple-700 rounded-xl text-xs font-mono text-purple-300"
            >
              Add IP
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {security.rconAllowedIps.map((ip, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <span className="text-cyan-300">{ip}</span>
                <button
                  onClick={() =>
                    handleUpdate({
                      ...security,
                      rconAllowedIps: security.rconAllowedIps.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Trail */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>SECURITY AUDIT TRAIL</span>
          </h3>

          <div className="space-y-2.5">
            {security.auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{log.event}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        log.severity === 'BLOCKED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Source: {log.ip} · Initiator: {log.user}
                  </div>
                </div>
                <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
