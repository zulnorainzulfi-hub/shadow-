import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Globe, Award, Calendar, BarChart2 } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { PlayerAnalyticsSummary } from '../../../types';

export const PlayerAnalyticsPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [analytics, setAnalytics] = useState<PlayerAnalyticsSummary>({
    peakPlayers24h: 34,
    averageTps24h: 19.92,
    totalUniqueJoins: 1420,
    avgSessionMinutes: 48,
    retentionDay1: 72,
    retentionDay7: 46,
    countryDistribution: [
      { country: 'United States', flag: '🇺🇸', percent: 44 },
      { country: 'Germany', flag: '🇩🇪', percent: 22 },
      { country: 'United Kingdom', flag: '🇬🇧', percent: 14 },
      { country: 'Canada', flag: '🇨🇦', percent: 8 },
      { country: 'Others', flag: '🌐', percent: 12 },
    ],
    hourlyActivity: [
      { hour: '00:00', players: 12 },
      { hour: '03:00', players: 6 },
      { hour: '06:00', players: 4 },
      { hour: '09:00', players: 14 },
      { hour: '12:00', players: 22 },
      { hour: '15:00', players: 29 },
      { hour: '18:00', players: 34 },
      { hour: '21:00', players: 26 },
    ],
    topPlayers: [
      { username: 'VortexMiner', playtimeHours: 128.4, joins: 84, lastSeen: '10m ago' },
      { username: 'EnderQueen_99', playtimeHours: 94.2, joins: 62, lastSeen: '1h ago' },
      { username: 'CyberKnight', playtimeHours: 76.0, joins: 45, lastSeen: 'Today' },
      { username: 'ShadowCrafter', playtimeHours: 65.5, joins: 39, lastSeen: 'Yesterday' },
    ],
  });

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/player-analytics`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(() => {});
  }, [selectedServer]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Player Analytics & Retention</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                TELEMETRY
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Track concurrency peaks, session durations, retention curves, geographic demographics, and community leaders
          </p>
        </div>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">PEAK CONCURRENCY (24H)</span>
          <div className="text-3xl font-black text-white">{analytics.peakPlayers24h} Players</div>
          <span className="text-[10px] text-cyan-400 font-mono">Top at 18:00 UTC</span>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">TOTAL UNIQUE JOINS</span>
          <div className="text-3xl font-black text-white">{analytics.totalUniqueJoins.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-mono">+18 new this week</span>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">DAY 1 RETENTION</span>
          <div className="text-3xl font-black text-white">{analytics.retentionDay1}%</div>
          <span className="text-[10px] text-slate-400 font-mono">D7: {analytics.retentionDay7}%</span>
        </div>
        <div className="p-5 rounded-2xl glass-panel border border-indigo-500/30 space-y-1">
          <span className="text-xs font-mono text-slate-400">AVG SESSION LENGTH</span>
          <div className="text-3xl font-black text-white">{analytics.avgSessionMinutes}m</div>
          <span className="text-[10px] text-purple-400 font-mono">High community engagement</span>
        </div>
      </div>

      {/* Hourly Concurrency Chart */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <span>24-HOUR HOURLY PLAYER CONCURRENCY</span>
        </h3>

        <div className="flex items-end gap-3 h-48 pt-6">
          {analytics.hourlyActivity.map((slot, i) => {
            const pct = Math.round((slot.players / analytics.peakPlayers24h) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {slot.players}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-purple-900/60 to-cyan-500/70 hover:to-cyan-400 rounded-t transition-all"
                  style={{ height: `${Math.max(10, pct)}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500">{slot.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard and Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Players */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>COMMUNITY PLAYTIME LEADERBOARD</span>
          </h3>

          <div className="space-y-2.5">
            {analytics.topPlayers.map((p, i) => (
              <div
                key={p.username}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 font-bold ${i === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                    #{i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white block">{p.username}</span>
                    <span className="text-[10px] text-slate-500">{p.joins} Sessions</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-purple-300 font-bold block">{p.playtimeHours} hrs</span>
                  <span className="text-[10px] text-slate-500">Seen: {p.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>GEOGRAPHIC PLAYER DEMOGRAPHICS</span>
          </h3>

          <div className="space-y-3">
            {analytics.countryDistribution.map((c) => (
              <div key={c.country} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>{c.flag}</span>
                    <span>{c.country}</span>
                  </span>
                  <span className="text-cyan-400 font-bold">{c.percent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-1.5 rounded-full"
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
