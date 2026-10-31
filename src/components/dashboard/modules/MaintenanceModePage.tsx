import React, { useState, useEffect } from 'react';
import { AlertOctagon, Power, Clock, CheckCircle2, Shield, Users, Save } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { MaintenanceConfig } from '../../../types';

export const MaintenanceModePage: React.FC = () => {
  const { selectedServer } = useServer();
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>({
    enabled: false,
    motdText: '§4§lMAINTENANCE §7» §cServer undergoing scheduled maintenance. Back soon!',
    kickReason: 'Server is currently in Maintenance Mode for infrastructure tuning. Please check Discord.',
    countdownMinutes: 0,
    countdownActive: false,
    whitelistedStaff: ['Zulnorain', 'Alex_Mercer', 'Admin_Jordan'],
  });
  const [newStaff, setNewStaff] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/maintenance`)
      .then((res) => res.json())
      .then((data) => setMaintenance(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleSave = async (updated: MaintenanceConfig) => {
    if (!selectedServer) return;
    setMaintenance(updated);
    await fetch(`/api/servers/${selectedServer.id}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setFeedback(`Maintenance configuration updated. Status: ${updated.enabled ? 'ACTIVE' : 'STANDBY'}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const addStaff = () => {
    if (!newStaff.trim()) return;
    const updated = {
      ...maintenance,
      whitelistedStaff: [...maintenance.whitelistedStaff, newStaff.trim()],
    };
    handleSave(updated);
    setNewStaff('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${maintenance.enabled ? 'bg-rose-400 animate-ping' : 'bg-slate-500'}`} />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Maintenance Mode Controller</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                maintenance.enabled
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                {maintenance.enabled ? 'MAINTENANCE ENGAGED' : 'PUBLIC ACCESS OPEN'}
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Lock server down for emergency bug fixes, disconnect non-staff players with custom kick notices, and bypass trusted operators
          </p>
        </div>

        <button
          onClick={() => handleSave({ ...maintenance, enabled: !maintenance.enabled })}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-2 ${
            maintenance.enabled
              ? 'bg-rose-700 hover:bg-rose-600 text-white shadow-lg shadow-rose-950'
              : 'bg-emerald-950/80 border-emerald-500 text-emerald-300 hover:bg-emerald-900'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{maintenance.enabled ? 'DEACTIVATE MAINTENANCE' : 'ACTIVATE MAINTENANCE NOW'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages & Settings */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>MAINTENANCE DISPLAY MESSAGES</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                MAINTENANCE CLIENT MOTD (SHOWN IN SERVER LIST)
              </label>
              <textarea
                rows={2}
                value={maintenance.motdText}
                onChange={(e) => setMaintenance({ ...maintenance, motdText: e.target.value })}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-rose-300 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                DISCONNECT SCREEN KICK REASON
              </label>
              <textarea
                rows={2}
                value={maintenance.kickReason}
                onChange={(e) => setMaintenance({ ...maintenance, kickReason: e.target.value })}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={() => handleSave(maintenance)}
              className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Messages</span>
            </button>
          </div>
        </div>

        {/* Whitelisted Staff Bypass */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>BYPASS OPERATOR LIST ({maintenance.whitelistedStaff.length})</span>
          </h3>

          <p className="text-xs text-slate-400 font-sans">
            These usernames can connect and play normally even while maintenance lockout is active.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Staff username..."
              value={newStaff}
              onChange={(e) => setNewStaff(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={addStaff}
              className="px-4 py-2 bg-purple-950 hover:bg-purple-900 border border-purple-700 rounded-xl text-xs font-mono text-purple-300 font-bold"
            >
              Add Staff
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {maintenance.whitelistedStaff.map((staff, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-xs font-mono text-purple-200 flex items-center gap-2"
              >
                <span>{staff}</span>
                <button
                  onClick={() =>
                    handleSave({
                      ...maintenance,
                      whitelistedStaff: maintenance.whitelistedStaff.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-slate-500 hover:text-rose-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
