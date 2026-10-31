import React, { useState } from 'react';
import {
  LifeBuoy,
  PlusCircle,
  MessageSquare,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  X,
  Mail,
} from 'lucide-react';
import { DiscordIcon } from '../common/DiscordIcon';
import { useServer } from '../../context/ServerContext';
import { useAuth } from '../../context/AuthContext';
import { SupportTicket, TicketReply } from '../../types';

export const SupportPage: React.FC = () => {
  const { tickets, createTicket, replyToTicket, updateTicketStatus } = useServer();
  const { currentUser } = useAuth();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Technical');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Medium');
  const [initialMessage, setInitialMessage] = useState('');

  const activeTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;

    createTicket({
      userId: currentUser?.id || 'usr-demo-01',
      userName: currentUser?.name || 'Alex Mercer',
      userEmail: currentUser?.email || 'alex@shadowhost.io',
      subject: subject.trim(),
      category,
      priority,
      status: 'Open',
    });

    setSubject('');
    setInitialMessage('');
    setIsNewModalOpen(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;

    replyToTicket(
      activeTicket.id,
      currentUser?.name || 'Alex Mercer',
      currentUser?.role === 'admin' ? 'admin' : 'user',
      replyMessage.trim()
    );

    setReplyMessage('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-800/40">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Support Helpdesk & Tickets</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            24/7 technical assistance for server crashes, plugin errors, and port mappings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://discord.gg/YC5JZWtc9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-xs font-mono font-bold rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/40 border border-[#5865F2]/60 text-white flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(88,101,242,0.3)]"
          >
            <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
            <span>Join Discord Support</span>
          </a>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-5 py-2.5 text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
          >
            <PlusCircle className="w-4 h-4 text-cyan-300" />
            <span>Open Ticket</span>
          </button>
        </div>
      </div>

      {/* Official Direct Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email Direct Desk */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-800/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Official Email Support</div>
              <a
                href="mailto:zulnorainzulfi@gmail.com"
                className="text-sm font-mono text-white font-bold hover:text-cyan-300 transition-colors"
              >
                zulnorainzulfi@gmail.com
              </a>
            </div>
          </div>
          <a
            href="mailto:zulnorainzulfi@gmail.com?subject=SHADOW%20HOST%20Support%20Request"
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-mono font-bold tracking-wider shrink-0 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>CONTACT</span>
          </a>
        </div>

        {/* Discord Live Desk */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 to-[#5865F2]/10 border border-purple-800/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/50 flex items-center justify-center text-[#5865F2] shrink-0">
              <DiscordIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">Official Discord Server</div>
              <a
                href="https://discord.gg/YC5JZWtc9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-mono text-white font-bold hover:text-purple-300 transition-colors truncate max-w-[200px] block"
              >
                discord.gg/YC5JZWtc9
              </a>
            </div>
          </div>
          <a
            href="https://discord.gg/YC5JZWtc9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-mono font-bold tracking-wider shrink-0 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(88,101,242,0.4)]"
          >
            <DiscordIcon className="w-3.5 h-3.5" />
            <span>JOIN</span>
          </a>
        </div>
      </div>


      {/* Ticket Details View or Tickets Table View */}
      {activeTicket ? (
        <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTicketId(null)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-purple-400">{activeTicket.id}</span>
                  <span className="text-base font-bold text-white">{activeTicket.subject}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">
                  Category: {activeTicket.category} · Priority: {activeTicket.priority} · Opened {activeTicket.createdAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeTicket.status}
                onChange={(e) =>
                  updateTicketStatus(activeTicket.id, e.target.value as SupportTicket['status'])
                }
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {activeTicket.replies.map((reply: TicketReply) => {
              const isStaff = reply.authorRole === 'support' || reply.authorRole === 'admin';
              return (
                <div
                  key={reply.id}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isStaff
                      ? 'bg-purple-950/40 border-purple-800/60 ml-4'
                      : 'bg-slate-900/60 border-slate-800 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{reply.authorName}</span>
                      {isStaff && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900 text-purple-200 border border-purple-600">
                          SHADOW STAFF
                        </span>
                      )}
                    </div>
                    <span className="text-slate-500">{reply.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{reply.message}</p>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your response to support staff..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden space-y-0">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between font-mono text-xs text-slate-400">
            <span>TICKET HISTORY</span>
            <span>{tickets.length} Total</span>
          </div>

          <div className="divide-y divide-slate-800">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">{t.id}</span>
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {t.subject}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    Category: {t.category} · Priority: {t.priority} · Updated {t.updatedAt}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono px-2.5 py-0.5 rounded border ${
                      t.status === 'Resolved'
                        ? 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
                        : t.status === 'In Progress'
                        ? 'bg-purple-950/80 border-purple-700 text-purple-300'
                        : t.status === 'Closed'
                        ? 'bg-slate-900 border-slate-800 text-slate-500'
                        : 'bg-cyan-950/80 border-cyan-700 text-cyan-300'
                    }`}
                  >
                    {t.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-purple-800/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono">
                SUBMIT NEW SUPPORT TICKET
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">SUBJECT</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Server crash on Paper 1.21.4 startup"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Server Crash">Server Crash</option>
                    <option value="Plugins">Plugins & Mods</option>
                    <option value="Billing">Billing</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">PRIORITY</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  DETAILED MESSAGE & LOG SNIPPET
                </label>
                <textarea
                  rows={4}
                  required
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Describe what occurred, any error messages, and steps to reproduce..."
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold font-mono text-white bg-purple-700 hover:bg-purple-600 rounded-xl shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
