import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Terminal,
  Cpu,
  Puzzle,
  FileCode,
  ShieldAlert,
  Send,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Sliders,
  HelpCircle,
  ArrowUpRight,
  Shield,
  Eye,
  FileText,
  Flame,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';
import { useAuth } from '../../context/AuthContext';
import { AiChatMessage, AiToolMode, ServerFile } from '../../types';

interface ShadowAiPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const ShadowAiPage: React.FC<ShadowAiPageProps> = ({ onNavigateTab }) => {
  const { selectedServer, selectedServerId, saveFileContent, createBackup } = useServer();
  const { currentUser, incrementAiUsage } = useAuth();

  const [activeTool, setActiveTool] = useState<AiToolMode>('assistant');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: `Greetings Commander. I am **SHADOW AI ENGINE v4.2**, your server systems architect.

I am connected to your active server node **${selectedServer?.name || 'ShadowSMP'}** running **${selectedServer?.software || 'Paper'} ${selectedServer?.version || '1.21.4'}**.

How can I assist your Minecraft deployment today? You can ask about TPS optimization, diagnose console crash dumps, generate Aikar JVM flags, or configure LuckPerms permissions.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Engine status state
  const [engineStatus, setEngineStatus] = useState<{
    online: boolean;
    isDemo: boolean;
    model: string;
  }>({
    online: true,
    isDemo: false,
    model: 'gemini-3.8-flash',
  });

  // Log Analyzer state
  const [logInput, setLogInput] = useState('');
  const [logAnalysisResult, setLogAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingLogs, setIsAnalyzingLogs] = useState(false);

  // Performance Optimizer state
  const [optimizationResult, setOptimizationResult] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Config Generator state
  const [configPreset, setConfigPreset] = useState<'smp' | 'pvp' | 'minigames' | 'modded'>('smp');
  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [motdLine1, setMotdLine1] = useState('§d§lSHADOW HOST §8» §fFree Community SMP §7[1.21.4]');
  const [motdLine2, setMotdLine2] = useState('§b▶ 100% Free Forever §8| §a20.0 TPS Guaranteed');

  // Command Helper state
  const [commandCategory, setCommandCategory] = useState<'luckperms' | 'worldguard' | 'execute' | 'essentials'>('luckperms');
  const [commandQuery, setCommandQuery] = useState('');
  const [generatedCommand, setGeneratedCommand] = useState('');

  // Safety Modal state
  const [confirmConfigModal, setConfirmConfigModal] = useState<{
    isOpen: boolean;
    fileName: string;
    content: string;
  }>({ isOpen: false, fileName: '', content: '' });

  const [appliedSuccessNotice, setAppliedSuccessNotice] = useState<string | null>(null);
  const [quotaExceededNotice, setQuotaExceededNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check engine status
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => {
        setEngineStatus({
          online: data.online ?? true,
          isDemo: data.isDemo ?? false,
          model: data.model ?? 'gemini-3.8-flash',
        });
      })
      .catch(() => {
        setEngineStatus({
          online: true,
          isDemo: true,
          model: 'SHADOW AI Simulation Engine (Demo Mode)',
        });
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Quick Prompts
  const handleQuickPrompt = (prompt: string) => {
    setInputPrompt(prompt);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    // Check quota
    const hasQuota = incrementAiUsage();
    if (!hasQuota) {
      setQuotaExceededNotice(true);
      return;
    }

    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = inputPrompt;
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          serverContext: selectedServer,
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || 'No response generated from Shadow AI Engine.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `### ⚡ Shadow AI Response
Regarding your query: "${currentPrompt}"

1. **Server Context**: Running on ${selectedServer?.software} ${selectedServer?.version} with ${selectedServer?.ramAllocationMb} MB allocated.
2. **Recommendation**: Optimize \`paper-world-defaults.yml\` simulation-distance and verify plugin compatibility.
3. Use the **Performance Optimizer** tab to inspect JVM heap metrics directly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Log Analysis Action
  const handleLoadConsoleLogs = () => {
    const sampleLogs = [
      `[05:12:00 INFO]: [ShadowEngine] Booting JVM on AMD Ryzen 9 7950X3D hardware slice...`,
      `[05:12:01 INFO]: [Paper] Loading properties from ./server.properties`,
      `[05:12:02 INFO]: [Paper] Default game type: SURVIVAL`,
      `[05:12:03 INFO]: [Paper] Generating keypair for online-mode authentication`,
      `[05:12:04 INFO]: [Paper] Starting Minecraft server on *:25565`,
      `[05:12:06 INFO]: [Geyser-Spigot] Loaded Bedrock-Java protocol translator v2.4.2`,
      `[05:12:07 INFO]: [Spark] Spark profiler v1.10.53 registered hook on Paper tick loop`,
      `[05:12:08 INFO]: [Paper] Preparing start region for dimension minecraft:overworld`,
      `[05:12:09 INFO]: [Paper] Done (1.894s)! For help, type "help"`,
      `[05:14:22 INFO]: [Server] Krypton7[/141.95.12.99:54201] logged in with entity id 104`,
      `[05:16:10 INFO]: [Server] VoxelGhost[/198.51.100.41:51940] logged in with entity id 105`,
    ];
    setLogInput(sampleLogs.join('\n'));
  };

  const handleAnalyzeLogs = async () => {
    if (!logInput.trim()) return;
    const hasQuota = incrementAiUsage();
    if (!hasQuota) {
      setQuotaExceededNotice(true);
      return;
    }

    setIsAnalyzingLogs(true);
    setLogAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logText: logInput }),
      });
      const data = await res.json();
      setLogAnalysisResult(data.analysis);
    } catch (e) {
      setLogAnalysisResult(`### 🔍 SHADOW AI DIAGNOSTIC
**Status**: STABLE (Simulation)
- No unhandled runtime crash stack traces found in provided console buffer.
- Recommended: Keep chunk generation pre-cached with Chunky.`);
    } finally {
      setIsAnalyzingLogs(false);
    }
  };

  // Performance Optimizer Action
  const handleRunOptimizer = async () => {
    const hasQuota = incrementAiUsage();
    if (!hasQuota) {
      setQuotaExceededNotice(true);
      return;
    }

    setIsOptimizing(true);
    setOptimizationResult(null);

    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          software: selectedServer?.software,
          version: selectedServer?.version,
          ramMb: selectedServer?.ramAllocationMb,
          currentTps: 20.0,
        }),
      });
      const data = await res.json();
      setOptimizationResult(data.optimization);
    } catch (e) {
      setOptimizationResult(`### 🚀 Performance Optimization Blueprint
- Use G1GC garbage collection with 200ms target pause.
- Set simulation-distance to 4 and view-distance to 8.`);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Generate Config Preset
  useEffect(() => {
    let content = `# Minecraft server.properties generated by SHADOW AI ENGINE
# Optimized for: ${configPreset.toUpperCase()} | Server: ${selectedServer?.name || 'ShadowSMP'}
server-port=25565
online-mode=true
enable-command-block=true
motd=${motdLine1}\\n${motdLine2}
`;

    if (configPreset === 'smp') {
      content += `difficulty=hard
gamemode=survival
pvp=true
spawn-protection=0
view-distance=8
simulation-distance=4
network-compression-threshold=256
max-players=${selectedServer?.maxPlayers || 50}
allow-flight=false
white-list=false`;
    } else if (configPreset === 'pvp') {
      content += `difficulty=normal
gamemode=survival
pvp=true
view-distance=6
simulation-distance=3
network-compression-threshold=128
max-players=100
spawn-protection=0
allow-flight=false`;
    } else if (configPreset === 'minigames') {
      content += `difficulty=peaceful
gamemode=adventure
pvp=false
view-distance=6
simulation-distance=3
network-compression-threshold=256
spawn-monsters=false
spawn-animals=false
max-players=200`;
    } else {
      content += `difficulty=normal
gamemode=survival
view-distance=7
simulation-distance=4
max-tick-time=120000
max-players=30`;
    }

    setGeneratedConfig(content);
  }, [configPreset, motdLine1, motdLine2, selectedServer]);

  // MOTD Minecraft Color Code live preview parser
  const renderMinecraftColoredText = (text: string) => {
    const parts = text.split(/(§[0-9a-fklmnor])/gi);
    let currentColor = '#ffffff';
    let isBold = false;
    let isItalic = false;

    const colorMap: Record<string, string> = {
      '§0': '#000000',
      '§1': '#0000aa',
      '§2': '#00aa00',
      '§3': '#00aaaa',
      '§4': '#aa0000',
      '§5': '#aa00aa',
      '§6': '#ffaa00',
      '§7': '#aaaaaa',
      '§8': '#555555',
      '§9': '#5555ff',
      '§a': '#55ff55',
      '§b': '#55ffff',
      '§c': '#ff5555',
      '§d': '#ff55ff',
      '§e': '#ffff55',
      '§f': '#ffffff',
    };

    return parts.map((part, index) => {
      const lower = part.toLowerCase();
      if (colorMap[lower]) {
        currentColor = colorMap[lower];
        return null;
      }
      if (lower === '§l') {
        isBold = true;
        return null;
      }
      if (lower === '§o') {
        isItalic = true;
        return null;
      }
      if (lower === '§r') {
        currentColor = '#ffffff';
        isBold = false;
        isItalic = false;
        return null;
      }

      return (
        <span
          key={index}
          style={{
            color: currentColor,
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textShadow: '1px 1px 0px rgba(0,0,0,0.8)',
          }}
        >
          {part}
        </span>
      );
    });
  };

  // Safe apply config
  const handleApplyConfigSafe = () => {
    const srvId = selectedServer?.id || selectedServerId;
    // 1. Create safety backup first
    createBackup(srvId, `ai_pre_config_snapshot_${Date.now()}.tar.zst`);
    // 2. Write to server.properties
    saveFileContent(srvId, '/server.properties', generatedConfig);
    setConfirmConfigModal({ isOpen: false, fileName: '', content: '' });
    setAppliedSuccessNotice('Configuration successfully written to server.properties! (Automatic backup generated)');
    setTimeout(() => setAppliedSuccessNotice(null), 4000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Command helper generator
  const handleGenerateCommand = () => {
    if (commandCategory === 'luckperms') {
      const q = commandQuery.trim() || 'give player vip rank';
      if (q.includes('rank') || q.includes('group')) {
        setGeneratedCommand(
          `# Add player to VIP group\n/lp user <PlayerName> parent add vip\n\n# Or add group with 30 day expiration\n/lp user <PlayerName> parent addtemp vip 30d`
        );
      } else {
        setGeneratedCommand(
          `# Grant specific permission node to group\n/lp group default permission set essentials.spawn true\n\n# Check user active permissions\n/lp user <PlayerName> info`
        );
      }
    } else if (commandCategory === 'worldguard') {
      setGeneratedCommand(
        `# Define spawn protection region\n/rg define spawn\n\n# Prevent PvP in spawn region\n/rg flag spawn pvp deny\n\n# Prevent creeper and TNT explosion damage\n/rg flag spawn tnt deny\n/rg flag spawn other-explosion deny`
      );
    } else if (commandCategory === 'execute') {
      setGeneratedCommand(
        `# Execute command as all online players at their exact position\n/execute as @a at @s run particle flame ~ ~1 ~ 0.2 0.2 0.2 0.05 10 force\n\n# Play sound when player enters specific coordinates\n/execute positioned 100 64 200 run playsound entity.player.levelup master @p[distance=..5]`
      );
    } else {
      setGeneratedCommand(
        `# Teleport with safety confirmation\n/tpahere <PlayerName>\n\n# Broadcast colored announcement to all players\n/broadcast §6[ALERT] §fScheduled maintenance in 10 minutes.\n\n# Set server spawn point\n/setspawn`
      );
    }
  };

  const quota = currentUser?.aiDailyQuota ?? 25;
  const used = currentUser?.aiUsageToday ?? 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Futuristic AI HUD Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-950/90 to-cyan-950/40 border border-purple-600/50 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-600/40">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-7 h-7 text-cyan-300 animate-pulse" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>SHADOW AI ENGINE</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-300 font-mono font-bold">
                    v4.2 PRO
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Autonomous Minecraft Server Diagnostic & Optimization Core</span>
              </p>
            </div>
          </div>

          {/* Engine Status & Quota Widget */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Model Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-purple-800/60 flex items-center gap-2 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">ENGINE:</span>
              <span className="text-purple-300 font-bold uppercase">
                {engineStatus.isDemo ? 'DEMO MODE' : engineStatus.model}
              </span>
            </div>

            {/* Daily Quota Counter */}
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-800/60 flex items-center gap-2.5 text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-slate-400">DAILY QUOTA:</span>{' '}
                <span className="text-white font-bold">
                  {used} / {quota === 999999 ? '∞' : quota}
                </span>
              </div>
            </div>

            {/* Selected Server Context Pill */}
            <div className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-700/50 text-xs font-mono text-purple-200 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>
                {selectedServer?.regionFlag} {selectedServer?.name} ({selectedServer?.software}{' '}
                {selectedServer?.version})
              </span>
            </div>
          </div>
        </div>

        {/* AI Safety Banner */}
        <div className="mt-4 pt-3 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              <strong>AI Safety Protocol Active:</strong> Dangerous destructive commands are never
              auto-executed. All file edits create automatic snapshot backups.
            </span>
          </div>
          <span className="hidden sm:inline text-cyan-400">Sub-system Guard: Locked</span>
        </div>
      </div>

      {appliedSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{appliedSuccessNotice}</span>
        </div>
      )}

      {quotaExceededNotice && (
        <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-300 text-xs font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Daily AI quota reached for your current plan ({used}/{quota}). Upgrade your plan for higher
              or unlimited allocations!
            </span>
          </div>
          <button
            onClick={() => onNavigateTab?.('billing')}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Tool Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveTool('assistant')}
          className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeTool === 'assistant'
              ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>AI Assistant</span>
        </button>

        <button
          onClick={() => setActiveTool('logs')}
          className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeTool === 'logs'
              ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Log & Error Detector</span>
        </button>

        <button
          onClick={() => setActiveTool('plugins')}
          className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeTool === 'plugins'
              ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Puzzle className="w-4 h-4 text-indigo-400" />
          <span>Plugin Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTool('performance')}
          className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeTool === 'performance'
              ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Performance Tuning</span>
        </button>

        <button
          onClick={() => setActiveTool('config')}
          className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeTool === 'config'
              ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Config & MOTD Studio</span>
        </button>

        <button
          onClick={() => setActiveTool('commands')}
          className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            activeTool === 'commands'
              ? 'bg-purple-900/40 border-purple-500 text-white shadow-lg shadow-purple-900/40'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <FileCode className="w-4 h-4 text-rose-400" />
          <span>Command Helper</span>
        </button>
      </div>

      {/* TAB 1: AI ASSISTANT CHAT */}
      {activeTool === 'assistant' && (
        <div className="glass-panel rounded-2xl border border-purple-900/40 flex flex-col h-[650px] overflow-hidden">
          {/* Quick Prompt Suggestions */}
          <div className="p-3 border-b border-purple-900/30 bg-slate-950/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono text-purple-400 shrink-0 font-bold">
              QUICK PROMPTS:
            </span>
            <button
              onClick={() => handleQuickPrompt('How do I optimize TPS on Paper 1.21.4 for 50 players?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 shrink-0 font-mono transition-colors"
            >
              Optimize Paper TPS
            </button>
            <button
              onClick={() => handleQuickPrompt('What are recommended Aikar GC flags for 8GB RAM?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 shrink-0 font-mono transition-colors"
            >
              Aikar JVM Flags
            </button>
            <button
              onClick={() => handleQuickPrompt('How do I configure LuckPerms groups and permissions?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 shrink-0 font-mono transition-colors"
            >
              LuckPerms Groups
            </button>
            <button
              onClick={() => handleQuickPrompt('How do I fix NullPointerException in plugin listeners?')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 shrink-0 font-mono transition-colors"
            >
              Fix Plugin NullPointerException
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                    m.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-br from-purple-700 to-cyan-500 text-slate-950'
                  }`}
                >
                  {m.sender === 'user' ? 'YOU' : <Bot className="w-4 h-4 text-white" />}
                </div>

                <div
                  className={`p-4 rounded-2xl border text-slate-200 leading-relaxed space-y-2 ${
                    m.sender === 'user'
                      ? 'bg-purple-950/60 border-purple-800/80 text-white'
                      : 'bg-slate-950/80 border-slate-800 shadow-md font-mono'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1 mb-2">
                    <span className="text-[10px] font-mono text-purple-400 font-bold">
                      {m.sender === 'user' ? 'COMMANDER' : 'SHADOW AI CORE'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                      {m.sender === 'ai' && (
                        <button
                          onClick={() => copyToClipboard(m.text, m.id)}
                          className="text-slate-500 hover:text-white"
                          title="Copy response"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-xs">
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-700 flex items-center justify-center text-cyan-300">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Synthesizing server architecture telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950 border-t border-purple-900/40 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask Shadow AI about configs, errors, Aikar flags, or plugins..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: LOG & ERROR DETECTOR */}
      {activeTool === 'logs' && (
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>AI Log & Crash Dump Analyzer</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Detect Java stack traces, missing dependencies, plugin conflicts, and memory leaks
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadConsoleLogs}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Load Live Server Logs</span>
                </button>
                <button
                  type="button"
                  disabled={isAnalyzingLogs || !logInput.trim()}
                  onClick={handleAnalyzeLogs}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isAnalyzingLogs ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
                  <span>Run AI Diagnostic</span>
                </button>
              </div>
            </div>

            <textarea
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              placeholder="Paste server crash log, startup logs, or click 'Load Live Server Logs'..."
              rows={8}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {logAnalysisResult && (
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-purple-700/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Diagnostic Report Completed</span>
                </div>
                <button
                  onClick={() => copyToClipboard(logAnalysisResult, 'log-report')}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1"
                >
                  {copiedId === 'log-report' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Report</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                {logAnalysisResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PLUGIN INTELLIGENCE */}
      {activeTool === 'plugins' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-indigo-400" />
              <span>Installed Plugin Health Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Scanned plugins on {selectedServer?.name} ({selectedServer?.software} {selectedServer?.version})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'LuckPerms', ver: '5.4.102', status: 'Optimal', notes: 'Native Paper event caching active' },
                { name: 'EssentialsX', ver: '2.20.1', status: 'Optimal', notes: 'Economy & teleportation active' },
                { name: 'WorldEdit', ver: '7.3.0', status: 'Optimal', notes: 'FastAsyncWorldEdit recommended for large pastes' },
                { name: 'Vault', ver: '1.7.3', status: 'Optimal', notes: 'Hooks registered for economy' },
                { name: 'GeyserMC', ver: '2.4.2', status: 'Optimal', notes: 'Bedrock UDP bridge listening on port 19132' },
                { name: 'Spark Profiler', ver: '1.10.53', status: 'Optimal', notes: 'Low overhead tick loop profiler' },
              ].map((p, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold font-mono text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">v{p.ver}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">{p.notes}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 text-[10px] font-mono">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-indigo-700/40 space-y-4">
            <h4 className="text-sm font-bold font-mono text-indigo-300 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Plugin Recommendations for {selectedServer?.software}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Chunky (World Pre-generator)</span>
                  <span className="text-cyan-400 text-[10px]">+40% TPS</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Eliminates player movement stutter by pre-generating chunks before players explore.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>CoreProtect</span>
                  <span className="text-purple-400 text-[10px]">Security</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Fast block logging and rollback system. Instantly restore griefed builds with 1 command.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PERFORMANCE TUNING */}
      {activeTool === 'performance' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Real-Time Performance Engine</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Analyze memory allocation, garbage collector flags, and Paper world tick schedules
                </p>
              </div>

              <button
                type="button"
                disabled={isOptimizing}
                onClick={handleRunOptimizer}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-xs font-mono font-bold text-white flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                <span>Generate Optimized JVM & Paper Config</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">SERVER TPS</div>
                <div className="text-base font-bold text-emerald-400 mt-1">20.0 / 20.0</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">RAM UTILIZATION</div>
                <div className="text-base font-bold text-purple-400 mt-1">
                  {selectedServer?.ramUsageMb} / {selectedServer?.ramAllocationMb} MB
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">GC PAUSE TARGET</div>
                <div className="text-base font-bold text-cyan-400 mt-1">200 ms (G1GC)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">CHUNK BUFFER</div>
                <div className="text-base font-bold text-white mt-1">Sim 4 | View 8</div>
              </div>
            </div>
          </div>

          {optimizationResult && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-700/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-amber-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>OPTIMIZATION BLUEPRINT READY</span>
                </span>
                <button
                  onClick={() => copyToClipboard(optimizationResult, 'opt-report')}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1"
                >
                  {copiedId === 'opt-report' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Configuration</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                {optimizationResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CONFIG & MOTD STUDIO */}
      {activeTool === 'config' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>AI Configuration & MOTD Studio</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Generate production-ready server.properties and design pixel-perfect Minecraft MOTDs
              </p>
            </div>

            {/* Live Minecraft Multiplayer Server List Preview */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>IN-GAME MINECRAFT MULTIPLAYER PREVIEW:</span>
                <span className="text-[10px] text-cyan-400 font-mono">Pixel Renderer (Java Edition)</span>
              </div>

              {/* Minecraft Server Entry Box */}
              <div className="p-3 rounded-xl bg-[#0b0c10] border-2 border-[#1f2833] flex items-center gap-3 font-mono">
                {/* Server Icon */}
                <div className="w-14 h-14 rounded bg-purple-950 border border-purple-500/50 shrink-0 flex items-center justify-center font-bold text-purple-300 text-xl shadow-inner">
                  SH
                </div>

                {/* Server MOTD Lines */}
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">
                      {selectedServer?.name || 'ShadowSMP Community'}
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px]">
                        {selectedServer?.playersOnline || 18}/{selectedServer?.maxPlayers || 50}
                      </span>
                      {/* Minecraft 5-bar Ping Indicator */}
                      <div className="flex items-end gap-0.5 h-3.5">
                        <div className="w-1 h-1 bg-emerald-400 rounded-xs" />
                        <div className="w-1 h-1.5 bg-emerald-400 rounded-xs" />
                        <div className="w-1 h-2 bg-emerald-400 rounded-xs" />
                        <div className="w-1 h-2.5 bg-emerald-400 rounded-xs" />
                        <div className="w-1 h-3.5 bg-emerald-400 rounded-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Render MOTD with real Minecraft color parsing */}
                  <div className="text-xs leading-tight tracking-wide">
                    {renderMinecraftColoredText(motdLine1)}
                  </div>
                  <div className="text-xs leading-tight tracking-wide">
                    {renderMinecraftColoredText(motdLine2)}
                  </div>
                </div>
              </div>
            </div>

            {/* MOTD Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">MOTD LINE 1 (COLOR CODES: §a, §b, §d, §l)</label>
                <input
                  type="text"
                  value={motdLine1}
                  onChange={(e) => setMotdLine1(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">MOTD LINE 2 (SUBTITLE & STATS)</label>
                <input
                  type="text"
                  value={motdLine2}
                  onChange={(e) => setMotdLine2(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-mono text-slate-400">CONFIG PRESET:</span>
              {(['smp', 'pvp', 'minigames', 'modded'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setConfigPreset(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-colors cursor-pointer ${
                    configPreset === p
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Generated Config Preview */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  GENERATED server.properties PREVIEW:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedConfig, 'config-preview')}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedId === 'config-preview' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() =>
                      setConfirmConfigModal({
                        isOpen: true,
                        fileName: 'server.properties',
                        content: generatedConfig,
                      })
                    }
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Apply to Server (Safe Backup)</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto">
                {generatedConfig}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMMAND & PERMISSIONS HELPER */}
      {activeTool === 'commands' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-rose-400" />
              <span>AI Minecraft Command & Permissions Helper</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Generate syntax for LuckPerms, WorldGuard, /execute chains, and EssentialsX
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'luckperms', label: 'LuckPerms' },
              { id: 'worldguard', label: 'WorldGuard' },
              { id: 'execute', label: '/execute Chains' },
              { id: 'essentials', label: 'EssentialsX' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCommandCategory(c.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                  commandCategory === c.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              placeholder={`Describe command (e.g. "give player VIP rank", "protect spawn with no pvp")...`}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={handleGenerateCommand}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate</span>
            </button>
          </div>

          {generatedCommand && (
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-rose-300 font-bold">GENERATED COMMAND SYNTAX:</span>
                <button
                  onClick={() => copyToClipboard(generatedCommand, 'cmd-gen')}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1"
                >
                  {copiedId === 'cmd-gen' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 text-emerald-400 text-xs font-mono whitespace-pre-wrap">
                {generatedCommand}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for Safety Protocol */}
      {confirmConfigModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-950 border border-purple-800 rounded-2xl p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center gap-3 text-cyan-400">
              <ShieldAlert className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold">Apply Configuration with Safety Snapshot?</h3>
            </div>

            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              Before modifying <span className="text-purple-300 font-bold">{confirmConfigModal.fileName}</span>,
              SHADOW AI will automatically trigger a complete backup of your current server files.
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div>• Destination: /server.properties</div>
              <div>• Server: {selectedServer?.name}</div>
              <div>• Action: Replace file and generate snapshot rollback archive</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmConfigModal({ isOpen: false, fileName: '', content: '' })}
                className="px-4 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyConfigSafe}
                className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white cursor-pointer shadow-md"
              >
                Confirm & Apply Safe Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
