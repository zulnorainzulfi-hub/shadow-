import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2, Bell, Zap, Play, FileText, Bug } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { CrashRecoverySettings } from '../../../types';

export const CrashRecoveryPage: React.FC = () => {
  const { selectedServer, restartServer } = useServer();
  const [settings, setSettings] = useState<CrashRecoverySettings>({
    autoRestartEnabled: true,
    watchdogTimeoutSeconds: 60,
    crashLoopThreshold: 3,
    crashLoopWindowMinutes: 10,
    safeBootMode: false,
    notifyDiscordWebhook: true,
    webhookUrl: 'https://discord.com/api/webhooks/demo-shadow-crash-alerts',
    recentCrashes: [
      {
        id: 'crash-991',
        timestamp: 'Yesterday at 14:22 UTC',
        culprit: 'ProtocolLib-v5.1 (Outdated Reflection)',
        summary: 'Watchdog thread freeze: Server hung for 62 seconds during chunk batch update.',
        recoveryAction: 'Auto-restarted container in Safe Mode (Isolated culprit plugin)',
        resolved: true,
      },
    ],
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/crash-recovery`)
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleSave = async (newSettings: CrashRecoverySettings) => {
    if (!selectedServer) return;
    setSaving(true);
    setSettings(newSettings);
    try {
      await fetch(`/api/servers/${selectedServer.id}/crash-recovery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Automatic Crash Recovery</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 border border-rose-700/60 text-rose-300">
                WATCHDOG GUARDIAN
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Detect JVM hangs, OOM crash loops, isolate faulty plugins, and auto-restore server uptime in &lt; 8 seconds
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings synced to daemon!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Toggles & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>AUTOMATED RECOVERY CONTROLS</span>
            </h3>

            <div className="space-y-4">
              {/* Auto Restart Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold font-mono text-white">Auto-Restart Upon JVM Exit</div>
                  <div className="text-[11px] text-slate-400">
                    Immediately spins up container if Java process dies with non-zero exit code or SIGKILL.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoRestartEnabled}
                  onChange={(e) =>
                    handleSave({ ...settings, autoRestartEnabled: e.target.checked })
                  }
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Safe Boot Mode */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                    <span>Safe-Boot Fallback</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                      RECOMMENDED
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    If crash is caused by a corrupt plugin, rename it to \`.disabled\` and boot cleanly.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.safeBootMode}
                  onChange={(e) =>
                    handleSave({ ...settings, safeBootMode: e.target.checked })
                  }
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Discord Webhook alerts */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold font-mono text-white">Discord Webhook Incident Alerts</div>
                  <div className="text-[11px] text-slate-400">
                    Dispatches crash stack traces and auto-recovery status straight to your staff channel.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyDiscordWebhook}
                  onChange={(e) =>
                    handleSave({ ...settings, notifyDiscordWebhook: e.target.checked })
                  }
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Threshold Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Watchdog Timeout:</span>
                  <span className="text-white font-bold">{settings.watchdogTimeoutSeconds}s</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  step="10"
                  value={settings.watchdogTimeoutSeconds}
                  onChange={(e) =>
                    handleSave({ ...settings, watchdogTimeoutSeconds: Number(e.target.value) })
                  }
                  className="w-full accent-purple-500"
                />
                <span className="text-[10px] text-slate-500 block">Kills process if main thread ticks exceed this window</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Crash Loop Threshold:</span>
                  <span className="text-white font-bold">{settings.crashLoopThreshold} in {settings.crashLoopWindowMinutes}m</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={settings.crashLoopThreshold}
                  onChange={(e) =>
                    handleSave({ ...settings, crashLoopThreshold: Number(e.target.value) })
                  }
                  className="w-full accent-purple-500"
                />
                <span className="text-[10px] text-slate-500 block">Halts auto-restart if loop threshold breached to protect files</span>
              </div>
            </div>
          </div>

          {/* Crash Incident Log */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>RECENT CRASH INCIDENT LOGS</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">{settings.recentCrashes.length} Recorded</span>
            </h3>

            <div className="space-y-3">
              {settings.recentCrashes.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1.5">
                      <Bug className="w-3.5 h-3.5" />
                      {c.culprit}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">{c.summary}</p>
                  <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-slate-800/80">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {c.recoveryAction}
                    </span>
                    <button
                      onClick={() => restartServer(selectedServer?.id || '')}
                      className="text-purple-300 hover:text-white underline underline-offset-2"
                    >
                      Trigger Test Reboot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Health Status & Manual Emergency Action */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>DAEMON HEALTH STATUS</span>
            </h3>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/50 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Watchdog Thread:</span>
                <span className="text-emerald-400 font-bold">ALIVE (Heartbeat 4s)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">OOM Killer Guard:</span>
                <span className="text-emerald-400 font-bold">ACTIVE (8192 MB)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Last Cold Reboot:</span>
                <span className="text-white">Clean Exit</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  if (confirm('Simulate crash watchdog test? This will trigger an immediate recovery reboot.')) {
                    restartServer(selectedServer?.id || '');
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulate Watchdog Ping Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
