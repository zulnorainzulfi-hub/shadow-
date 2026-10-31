import React, { useState } from 'react';
import {
  Server,
  Zap,
  Globe,
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Cpu,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';
import { useAuth } from '../../context/AuthContext';
import { ServerSoftware } from '../../types';

interface CreateServerPageProps {
  onServerCreated: () => void;
  preSelectedPlanId?: string;
}

export const CreateServerPage: React.FC<CreateServerPageProps> = ({
  onServerCreated,
  preSelectedPlanId,
}) => {
  const { plans, nodes, createServer } = useServer();
  const { currentUser } = useAuth();

  const [serverName, setServerName] = useState('My-Shadow-SMP');
  const [software, setSoftware] = useState<ServerSoftware>('Paper');
  const [version, setVersion] = useState('1.21.4');
  const [selectedPlanId, setSelectedPlanId] = useState(preSelectedPlanId || 'plan-free');
  const [selectedNodeId, setSelectedNodeId] = useState('node-de-01');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;

    setIsDeploying(true);

    const steps = [
      'Allocating dedicated Anycast IPv4 address...',
      'Partitioning NVMe Gen4 ZFS storage slice...',
      `Configuring ${software} ${version} JVM runtime...`,
      'Applying performance Aikar flags and eula.txt agreement...',
      'Finalizing deployment and attaching RCON web terminal...',
    ];

    let current = 0;
    const interval = setInterval(async () => {
      current++;
      setDeployStep(current);
      if (current >= steps.length) {
        clearInterval(interval);
        await createServer({
          name: serverName.trim(),
          software,
          version,
          planId: selectedPlanId,
          region: `${selectedNode.city}, ${selectedNode.country}`,
          regionFlag: selectedNode.flag,
          ownerId: currentUser?.id || 'usr-demo-01',
        });
        setIsDeploying(false);
        onServerCreated();
      }
    }, 600);
  };

  const stepsList = [
    'Allocating dedicated Anycast IPv4 address...',
    'Partitioning NVMe Gen4 ZFS storage slice...',
    `Configuring ${software} ${version} JVM runtime...`,
    'Applying performance Aikar flags and eula.txt agreement...',
    'Finalizing deployment and attaching RCON web terminal...',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSTANT PROVISIONING ENGINE</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Create Minecraft Server</h1>
        <p className="text-xs text-slate-400 font-mono">
          Deploy any Minecraft software flavor with automatic JVM tuning on our dedicated Ryzen 9 clusters
        </p>
      </div>

      {isDeploying ? (
        <div className="p-12 rounded-2xl glass-panel text-center space-y-6">
          <div className="w-16 h-16 rounded-full border-3 border-purple-500 border-t-cyan-400 animate-spin mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold font-mono text-white">
              DEPLOYING YOUR SHADOW NODE
            </h3>
            <p className="text-xs font-mono text-cyan-300">
              {stepsList[deployStep] || 'Finalizing server container...'}
            </p>
          </div>
          <div className="max-w-md mx-auto bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((deployStep + 1) / stepsList.length) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-8">
          {/* Section 1: Server Name */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold font-mono text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" />
              <span>1. Server Identity</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  SERVER NAME
                </label>
                <input
                  type="text"
                  required
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="e.g. ShadowSMP-Survival"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  FREE SUBDOMAIN PREVIEW
                </label>
                <div className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center justify-between">
                  <span>{serverName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'server'}.shadow.host</span>
                  <span className="text-[10px] text-slate-500">:25565</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Software & Version */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>2. Server Software & Version</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(['Paper', 'Purpur', 'Spigot', 'Vanilla', 'Fabric', 'Forge'] as ServerSoftware[]).map(
                (sw) => (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => setSoftware(sw)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      software === sw
                        ? 'bg-purple-950/80 border-purple-500 text-white font-bold glow-purple'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono">{sw}</div>
                  </button>
                )
              )}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-mono text-slate-300 mb-1">
                MINECRAFT VERSION
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              >
                <option value="1.21.4">1.21.4 (Latest Recommended)</option>
                <option value="1.21.1">1.21.1</option>
                <option value="1.20.4">1.20.4</option>
                <option value="1.19.4">1.19.4</option>
                <option value="1.16.5">1.16.5</option>
                <option value="1.12.2">1.12.2 (Legacy Modpack Standard)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Hardware Plan & Capacity */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>3. Hardware Plan & Capacity</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                Current: {selectedPlan.ramGb} GB RAM · {selectedPlan.playerSlots} Slots
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {plans.map((p) => {
                const isFree = p.priceMonthly === 0;
                const isSelected = selectedPlanId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? isFree
                          ? 'bg-gradient-to-b from-purple-950/80 to-slate-900 border-2 border-purple-400 text-white shadow-lg glow-purple'
                          : 'bg-slate-900 border-cyan-500 text-white shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono">{p.name}</span>
                      {isFree && (
                        <span className="text-[10px] font-mono font-bold text-cyan-400">
                          FREE
                        </span>
                      )}
                    </div>
                    <div className="text-base font-extrabold font-mono text-white mt-1">
                      {isFree ? '$0' : `$${p.priceMonthly.toFixed(2)}/mo`}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1 space-y-0.5">
                      <div>{p.ramGb} GB DDR5 RAM</div>
                      <div>{p.playerSlots} Player Slots</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Node Location */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>4. Server Location (Low Latency)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {nodes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNodeId(n.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedNodeId === n.id
                      ? 'bg-purple-950/70 border-purple-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{n.flag}</span>
                    <span className="text-xs font-mono text-cyan-400 tabular-nums">
                      {n.pingMs} ms
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1">{n.city}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{n.country}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Deploy Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer glow-purple-lg"
            >
              <Zap className="w-4 h-4 text-cyan-200" />
              <span>
                {selectedPlan.isFree
                  ? 'Deploy Free Server (No Credit Card Required)'
                  : `Deploy ${selectedPlan.name} Node`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
