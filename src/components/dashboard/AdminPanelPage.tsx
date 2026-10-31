import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Server,
  Layers,
  HardDrive,
  Cpu,
  LifeBuoy,
  Bell,
  Trash2,
  Edit2,
  Check,
  Plus,
  Play,
  Square,
  Lock,
  Unlock,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';
import { HostingPlan, AdminAnnouncement } from '../../types';

export const AdminPanelPage: React.FC = () => {
  const {
    servers,
    plans,
    nodes,
    tickets,
    announcements,
    updatePlan,
    createAnnouncement,
    deleteAnnouncement,
    stopServer,
    startServer,
    deleteServer,
    updateTicketStatus,
  } = useServer();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'nodes' | 'servers' | 'plans' | 'users' | 'announcements'>('nodes');
  const [editingPlan, setEditingPlan] = useState<HostingPlan | null>(null);

  // New announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annType, setAnnType] = useState<'info' | 'warning' | 'alert' | 'success'>('info');

  const mockUsers = [
    { id: 'usr-demo-01', name: 'Alex Mercer', email: 'alex@shadowhost.io', role: 'admin', servers: 2, status: 'Active' },
    { id: 'usr-02', name: 'Krypton7', email: 'krypton@voxel.net', role: 'user', servers: 1, status: 'Active' },
    { id: 'usr-03', name: 'Elena Rostova', email: 'elena@elysium.gg', role: 'user', servers: 3, status: 'Active' },
    { id: 'usr-04', name: 'Marcus Vance', email: 'marcus@craft.io', role: 'user', servers: 1, status: 'Suspended' },
  ];

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    createAnnouncement(annTitle.trim(), annMessage.trim(), annType);
    setAnnTitle('');
    setAnnMessage('');
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    updatePlan(editingPlan.id, editingPlan);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-rose-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h1 className="text-2xl font-extrabold text-white">Administrator Fleet Console</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold">
              ROOT ACCESS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Global infrastructure management, hardware telemetry, tier pricing, and platform broadcast engine
          </p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'nodes', label: 'Hardware Nodes', icon: HardDrive },
          { id: 'servers', label: 'All Servers', icon: Server, count: servers.length },
          { id: 'plans', label: 'Plan Configurator', icon: Layers, count: plans.length },
          { id: 'users', label: 'User Accounts', icon: Users, count: mockUsers.length },
          { id: 'announcements', label: 'Announcements', icon: Bell, count: announcements.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id as unknown as 'nodes' | 'servers' | 'plans' | 'users' | 'announcements')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-purple-950/80 border border-purple-500 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* View 1: Hardware Nodes Monitor */}
      {activeAdminSubTab === 'nodes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nodes.map((n) => (
              <div key={n.id} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{n.flag}</span>
                    <div>
                      <h3 className="text-base font-bold text-white font-mono">{n.name}</h3>
                      <div className="text-[11px] text-slate-500 font-mono">{n.city}, {n.country}</div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>CPU LOAD:</span>
                      <span className="text-white font-bold">{n.cpuPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${n.cpuPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>RAM POOL:</span>
                      <span className="text-cyan-400 font-bold">{n.ramPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${n.ramPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>NVMe ZFS:</span>
                      <span className="text-emerald-400 font-bold">{n.diskPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${n.diskPercent}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-500 text-[11px]">
                    <span>Active Containers:</span>
                    <span className="text-white font-bold">{n.activeServers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: All Servers Management */}
      {activeAdminSubTab === 'servers' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>PLATFORM SERVER DIRECTORY</span>
            <span>{servers.length} Instances</span>
          </div>

          <div className="divide-y divide-slate-800">
            {servers.map((s) => (
              <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{s.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                      s.status === 'online' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    ID: {s.id} · {s.ip}:{s.port} · {s.software} {s.version} · {s.region}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {s.status === 'online' ? (
                    <button
                      onClick={() => stopServer(s.id)}
                      className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-lg flex items-center gap-1"
                    >
                      <Square className="w-3 h-3" />
                      <span>Suspend</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => startServer(s.id)}
                      className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded-lg flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Resume</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Admin action: Force delete ${s.name}?`)) {
                        deleteServer(s.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                    title="Delete Server Instance"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Plan Configurator */}
      {activeAdminSubTab === 'plans' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-mono text-slate-400">
            Administrators can adjust RAM allocations, maximum player slot limits, storage sizes, and monthly pricing across all subscription tiers in real time.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-mono">{p.name}</h3>
                  <button
                    onClick={() => setEditingPlan(p)}
                    className="p-1 text-slate-400 hover:text-cyan-400 rounded"
                    title="Edit Plan Limits"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-2xl font-extrabold font-mono text-white">
                  {p.priceMonthly === 0 ? '$0 Free' : `$${p.priceMonthly.toFixed(2)}/mo`}
                </div>

                <div className="space-y-1.5 font-mono text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div>RAM: <span className="text-cyan-400 font-bold">{p.ramGb} GB</span></div>
                  <div>Player Slots: <span className="text-purple-300 font-bold">{p.playerSlots} Slots</span></div>
                  <div>Storage: <span className="text-white font-bold">{p.storageGb} GB NVMe</span></div>
                  <div>CPU: <span className="text-slate-400 text-[11px] truncate">{p.cpu}</span></div>
                </div>

                <button
                  onClick={() => setEditingPlan(p)}
                  className="w-full py-2 text-xs font-mono font-bold bg-slate-900 hover:bg-purple-950/80 border border-slate-700 hover:border-purple-500 rounded-xl text-slate-200 transition-colors"
                >
                  Configure Limits
                </button>
              </div>
            ))}
          </div>

          {/* Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-slate-950 border border-purple-800/60 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white font-mono">
                  CONFIGURE PLAN: {editingPlan.name}
                </h3>

                <form onSubmit={handleSavePlan} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">MONTHLY PRICE ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingPlan.priceMonthly}
                      onChange={(e) => setEditingPlan({ ...editingPlan, priceMonthly: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">RAM ALLOCATION (GB)</label>
                    <input
                      type="number"
                      value={editingPlan.ramGb}
                      onChange={(e) => setEditingPlan({ ...editingPlan, ramGb: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">PLAYER SLOTS CAPACITY</label>
                    <input
                      type="number"
                      value={editingPlan.playerSlots}
                      onChange={(e) => setEditingPlan({ ...editingPlan, playerSlots: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">STORAGE ALLOCATION (GB)</label>
                    <input
                      type="number"
                      value={editingPlan.storageGb}
                      onChange={(e) => setEditingPlan({ ...editingPlan, storageGb: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-lg"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View 4: User Accounts */}
      {activeAdminSubTab === 'users' && (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>REGISTERED USER ACCOUNTS</span>
            <span>{mockUsers.length} Users</span>
          </div>

          <div className="divide-y divide-slate-800">
            {mockUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{u.name}</span>
                    <span className="text-slate-500">({u.email})</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                      u.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-700' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ID: {u.id} · {u.servers} Active Servers
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    u.status === 'Active' ? 'text-emerald-400 bg-emerald-950/80' : 'text-rose-400 bg-rose-950/80'
                  }`}>
                    {u.status}
                  </span>
                  <button
                    onClick={() => alert(`User status for ${u.name} toggled.`)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                    title="Toggle Suspension"
                  >
                    {u.status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 5: Platform Announcements */}
      {activeAdminSubTab === 'announcements' && (
        <div className="space-y-6">
          {/* Create announcement */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Broadcast New Announcement</span>
            </h3>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">HEADLINE TITLE</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Scheduled Network Maintenance (DE-01)"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">SEVERITY TYPE</label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as AdminAnnouncement['type'])}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="info">Info (Cyan)</option>
                    <option value="success">Success (Emerald)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="alert">Alert (Rose)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">ANNOUNCEMENT TEXT</label>
                <textarea
                  rows={2}
                  required
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                  placeholder="Details shown to all logged in users on the dashboard..."
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-xl shadow-md"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>

          {/* Announcements list */}
          <div className="rounded-2xl glass-panel border border-slate-800 divide-y divide-slate-800">
            {announcements.map((a) => (
              <div key={a.id} className="p-4 flex items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{a.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                      {a.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-400 font-sans text-xs mt-1">{a.message}</p>
                  <div className="text-[10px] text-slate-500 mt-1">Published: {a.createdAt}</div>
                </div>

                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
