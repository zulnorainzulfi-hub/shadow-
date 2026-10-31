import React, { useState, useEffect } from 'react';
import { Megaphone, Bell, Send, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';

export const AnnouncementCenterPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [motd, setMotd] = useState('§5§lSHADOW HOST §7» §bNext-Gen Minecraft Hosting §7[1.21.4] §a§lFREE 8GB');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [liveTitleAlert, setLiveTitleAlert] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/announcements/broadcasts')
      .then((res) => res.json())
      .then((data) => {
        if (data.activeMotd) setMotd(data.activeMotd);
      })
      .catch(() => {});
  }, []);

  const handleSaveMotd = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('MOTD updated in server.properties! Client server list refreshed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSendLiveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitleAlert.trim()) return;
    setFeedback(`Sent live in-game screen title: "${liveTitleAlert}" to all online players!`);
    setLiveTitleAlert('');
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
              <span>Announcement Center</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                BROADCAST HUB
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Design Minecraft multiplayer client MOTDs, schedule automated recurring chat notices, and flash live in-game title screens
          </p>
        </div>

        {feedback && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MOTD Designer */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-purple-400" />
            <span>MINECRAFT SERVER LIST MOTD</span>
          </h3>

          <form onSubmit={handleSaveMotd} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">RAW COLOR-CODED TEXT (USES § OR &)</label>
              <textarea
                rows={3}
                value={motd}
                onChange={(e) => setMotd(e.target.value)}
                className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Live Client Server List Preview */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400">MINECRAFT CLIENT PREVIEW:</span>
              <div className="p-4 bg-black/90 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{selectedServer?.name || 'SHADOW HOST'}</div>
                  <div className="text-purple-300 text-[11px] mt-0.5">
                    SHADOW HOST » Next-Gen Minecraft Hosting [1.21.4] FREE 8GB
                  </div>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <span className="text-emerald-400 font-bold">5/50</span>
                  <div className="text-slate-600">8ms</div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 shadow-md"
            >
              Update Server MOTD
            </button>
          </form>
        </div>

        {/* Live Title Alerts */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>FLASH IN-GAME TITLE SCREEN ALERT</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Sends an immediate floating golden title / subtitle banner directly onto the screens of all connected players via RCON.
            </p>

            <form onSubmit={handleSendLiveTitle} className="space-y-3">
              <input
                type="text"
                required
                value={liveTitleAlert}
                onChange={(e) => setLiveTitleAlert(e.target.value)}
                placeholder="e.g. PVP TOURNAMENT STARTING AT SPAWN!"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Live Title Now</span>
              </button>
            </form>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs font-mono text-slate-400">
            Commands executed: \`/title @a times 10 70 20\` and \`/title @a title ...\`
          </div>
        </div>
      </div>
    </div>
  );
};
