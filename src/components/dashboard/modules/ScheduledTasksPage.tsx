import React, { useState, useEffect } from 'react';
import { Calendar, Clock, PlusCircle, Play, CheckCircle2, Trash2, Power, Terminal, Archive, Sparkles } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { ScheduledTask } from '../../../types';

export const ScheduledTasksPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [action, setAction] = useState<ScheduledTask['action']>('RESTART');
  const [cron, setCron] = useState('0 4 * * *');
  const [payload, setPayload] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/schedules`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    try {
      const res = await fetch(`/api/servers/${selectedServer.id}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Scheduled Automation',
          action,
          cronExpression: cron,
          commandPayload: payload,
        }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks((prev) => [...prev, data.task]);
        setIsModalOpen(false);
        setName('');
        setPayload('');
        setFeedback(`Task "${data.task.name}" registered in cron daemon!`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {}
  };

  const handleToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleRunNow = (taskName: string) => {
    setFeedback(`Executed "${taskName}" immediately in background.`);
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
              <span>Scheduled Tasks (Cron Automation)</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                CRON ENGINE
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automate nightly clean restarts, automated off-site backups, chat announcements, and lag cleaner routines
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
        >
          <PlusCircle className="w-4 h-4 text-cyan-300" />
          <span>Create Task</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Task List */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
          <span>CRON DAEMON QUEUE ({tasks.length})</span>
          <span className="text-xs text-slate-500 font-mono">Timezone: UTC (00:00)</span>
        </h3>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono">{task.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-700/60 text-purple-300 font-bold">
                    {task.action}
                  </span>
                  <code className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {task.cronExpression}
                  </code>
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                  <span>Last run: {task.lastRun || 'Never'}</span>
                  <span>·</span>
                  <span>Next run: {task.nextRun}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleRunNow(task.name)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Run Now</span>
                </button>

                <input
                  type="checkbox"
                  checked={task.enabled}
                  onChange={() => handleToggle(task.id)}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  title="Toggle task active state"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-purple-800/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">NEW SCHEDULED CRON TASK</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">TASK NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Daily Auto-Restart"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">ACTION</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="RESTART">Restart Container cleanly</option>
                  <option value="BACKUP">Trigger Snapshot Backup</option>
                  <option value="COMMAND">Execute Custom RCON Command</option>
                  <option value="CLEAR_LAG">Clear Loose Ground Entities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">CRON SCHEDULE (5 FIELDS)</label>
                <input
                  type="text"
                  required
                  value={cron}
                  onChange={(e) => setCron(e.target.value)}
                  placeholder="0 4 * * *"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">Default 0 4 * * * runs at 04:00 AM daily</span>
              </div>

              {action === 'COMMAND' && (
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">COMMAND PAYLOAD</label>
                  <input
                    type="text"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder="say Daily rewards active!"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-mono text-white bg-purple-700 hover:bg-purple-600 rounded-xl shadow-md"
                >
                  Register Cron
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
