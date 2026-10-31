import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, Power, Terminal, Bell, Shield, CheckCircle2, RefreshCw, Send, Zap } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';

export const MobileControlPanelPage: React.FC = () => {
  const { selectedServer, startServer, stopServer, restartServer, killServer } = useServer();
  const [pairingData, setPairingData] = useState<{
    pairingCode: string;
    expiresInMinutes: number;
    remoteUrl: string;
    status: string;
  }>({
    pairingCode: 'SHDW-8492-1049',
    expiresInMinutes: 15,
    remoteUrl: window.location.origin,
    status: 'READY_TO_PAIR',
  });
  const [quickCmd, setQuickCmd] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/mobile/pairing')
      .then((res) => res.json())
      .then((data) => setPairingData(data))
      .catch(() => {});
  }, []);

  const triggerQuickBroadcast = (msg: string) => {
    setFeedback(`Sent mobile broadcast: "${msg}" to console.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Mobile Control Panel</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                PWA REMOTE
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Pair your iOS / Android phone or Apple Watch for instant server power commands and push alerts
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-300 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: QR Pairing Zone */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>PAIR SMARTPHONE CLIENT</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Scan this dynamic OTP token with your camera or open the PWA remote app to authenticate securely without typing passwords.
            </p>

            {/* Stylized QR simulation */}
            <div className="p-6 bg-white rounded-2xl max-w-[240px] mx-auto shadow-xl flex flex-col items-center justify-center space-y-2">
              <div className="grid grid-cols-6 gap-1 w-44 h-44 p-2 bg-slate-100 rounded-lg">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      (i * 7) % 3 === 0 || i === 0 || i === 5 || i === 30 || i === 35
                        ? 'bg-black'
                        : 'bg-purple-900/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-black font-bold">SHADOW AUTH OTP</span>
            </div>

            <div className="text-center space-y-1">
              <div className="text-lg font-black font-mono text-cyan-300 tracking-wider">
                {pairingData.pairingCode}
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Expires in {pairingData.expiresInMinutes} mins · Single-use pairing key
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-mono text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>PWA Ready for Add to Home Screen</span>
            </div>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>

        {/* Right: Simulated Mobile Remote View */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-6">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE MOBILE REMOTE TESTER</span>
          </h3>

          {/* Quick Action Touch Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => startServer(selectedServer?.id || '')}
              className="p-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/50 text-emerald-300 text-xs font-mono font-bold flex flex-col items-center gap-2 transition-all"
            >
              <Power className="w-5 h-5 text-emerald-400" />
              <span>START</span>
            </button>
            <button
              onClick={() => restartServer(selectedServer?.id || '')}
              className="p-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-600/50 text-purple-300 text-xs font-mono font-bold flex flex-col items-center gap-2 transition-all"
            >
              <RefreshCw className="w-5 h-5 text-purple-400" />
              <span>RESTART</span>
            </button>
            <button
              onClick={() => stopServer(selectedServer?.id || '')}
              className="p-4 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/50 text-amber-300 text-xs font-mono font-bold flex flex-col items-center gap-2 transition-all"
            >
              <Power className="w-5 h-5 text-amber-400" />
              <span>STOP</span>
            </button>
            <button
              onClick={() => killServer(selectedServer?.id || '')}
              className="p-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-600/50 text-rose-300 text-xs font-mono font-bold flex flex-col items-center gap-2 transition-all"
            >
              <Zap className="w-5 h-5 text-rose-400" />
              <span>KILL</span>
            </button>
          </div>

          {/* 1-Tap Mobile Broadcast Shortcuts */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-400 font-bold block">1-TAP RCON BROADCASTS:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: 'Broadcast: Restart in 5 mins', cmd: 'say [SHADOW] Server restart in 5 minutes!' },
                { label: 'Broadcast: Maintenance Soon', cmd: 'say [SHADOW] Scheduled maintenance starting soon.' },
                { label: 'Clear Ground Items', cmd: 'kill @e[type=item]' },
                { label: 'Weather: Clear Sky', cmd: 'weather clear' },
              ].map((b, i) => (
                <button
                  key={i}
                  onClick={() => triggerQuickBroadcast(b.cmd)}
                  className="p-3 text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>{b.label}</span>
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Push Alert Subscriptions */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>PUSH NOTIFICATIONS TO MOBILE</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-purple-600 rounded" />
                <span>Server Crash / OOM</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-purple-600 rounded" />
                <span>Player Peak Reached</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-purple-600 rounded" />
                <span>Backup Finished</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-purple-600 rounded" />
                <span>DDoS Scrubbing Activated</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
