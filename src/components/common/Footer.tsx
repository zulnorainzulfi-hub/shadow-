import React, { useState } from 'react';
import { Server, MessageSquare, Shield, Heart, FileText, HelpCircle, ExternalLink, Mail, X, Send } from 'lucide-react';
import { DiscordIcon } from './DiscordIcon';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalPolicy, setModalPolicy] = useState<{ title: string; content: string } | null>(null);

  const showPolicy = (title: string, content: string) => {
    setModalPolicy({ title, content });
  };

  return (
    <footer className="border-t border-purple-900/40 bg-[#030303] text-slate-400 py-16 px-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-purple-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* ========================================================= */}
        {/* OFFICIAL FOOTER CONTACT SECTION (Purple Neon Styled)       */}
        {/* ========================================================= */}
        <div className="relative rounded-2xl p-8 sm:p-10 bg-gradient-to-br from-[#0c051a]/95 via-[#070311]/95 to-[#050505]/95 border-2 border-purple-600/50 shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-xl overflow-hidden">
          {/* Subtle neon accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-cyan-400 shadow-[0_0_15px_#8B5CF6]" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center font-extrabold text-white text-base shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                  SH
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  SHADOW HOST
                </h3>
              </div>
              <p className="text-sm sm:text-base font-semibold text-purple-300 font-mono tracking-wide">
                Your World. Your Server. Your Power.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-1 text-xs sm:text-sm font-mono text-slate-300 justify-center lg:justify-start">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-400">Email:</span>
                  <a
                    href="mailto:zulnorainzulfi@gmail.com"
                    className="text-white hover:text-cyan-300 underline underline-offset-4 decoration-purple-500/60 transition-colors font-medium"
                  >
                    zulnorainzulfi@gmail.com
                  </a>
                </div>
                <div className="hidden sm:block text-purple-700 font-bold">|</div>
                <div className="flex items-center justify-center gap-2">
                  <DiscordIcon className="w-4 h-4 text-[#5865F2] shrink-0" />
                  <span className="text-slate-400">Discord:</span>
                  <a
                    href="https://discord.gg/YC5JZWtc9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-purple-300 underline underline-offset-4 decoration-purple-500/60 transition-colors font-medium"
                  >
                    https://discord.gg/YC5JZWtc9
                  </a>
                </div>
              </div>
            </div>

            {/* Prominent Action Buttons in Purple Neon Styling */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full lg:w-auto">
              <a
                href="mailto:zulnorainzulfi@gmail.com?subject=SHADOW%20HOST%20Support%20Request"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-900/90 to-purple-700 hover:from-purple-800 hover:to-purple-600 border border-purple-400/50 text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-300" />
                <span>CONTACT SUPPORT</span>
              </a>

              <a
                href="https://discord.gg/YC5JZWtc9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/35 border border-[#5865F2]/80 hover:border-[#5865F2] text-white font-mono text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(88,101,242,0.4)] hover:shadow-[0_0_35px_rgba(88,101,242,0.65)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
                <span>JOIN DISCORD</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Navigation & Informational Columns                        */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-4">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-purple-900/50">
                SH
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">SHADOW HOST</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your World. Your Server. Your Power. Next-generation Minecraft game hosting powered by dedicated AMD Ryzen 9 hardware, instant zero-friction deployments, and our free 8GB plan.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://discord.gg/YC5JZWtc9"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-purple-950/70 hover:bg-purple-900/90 border border-purple-600/60 text-purple-200 text-xs font-mono flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              >
                <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
                <span>Join Discord Community</span>
              </a>
              <a
                href="mailto:zulnorainzulfi@gmail.com"
                className="px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>zulnorainzulfi@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Hosting Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">
              Hosting
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard-create')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Create Free Server
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard-overview')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Server Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard-plugins')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  1-Click Plugin Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard-console')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  RCON Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard-files')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Web File Manager
                </button>
              </li>
            </ul>
          </div>

          {/* Software & Nodes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
              Software & Nodes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300">PaperMC 1.21.4</span>
              </li>
              <li>
                <span className="text-slate-300">Purpur 1.21.1</span>
              </li>
              <li>
                <span className="text-slate-300">Fabric & Forge 1.20+</span>
              </li>
              <li>
                <span className="text-slate-300">Frankfurt (DE-01)</span>
              </li>
              <li>
                <span className="text-slate-300">Ashburn (US-01)</span>
              </li>
              <li>
                <span className="text-slate-300">Singapore & Mumbai (IN-01)</span>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="mailto:zulnorainzulfi@gmail.com?subject=Contact%20Support"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>Email Support Desk</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/YC5JZWtc9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <DiscordIcon className="w-3 h-3 text-[#5865F2]" />
                  <span>Discord Community</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() =>
                    showPolicy(
                      'Terms of Service',
                      'SHADOW HOST Terms of Service: Free servers and premium instances are provided with guaranteed 99.99% uptime. Fair use resource policies apply to memory allocation and tick rate optimization. No crypto mining or non-Minecraft workloads allowed.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    showPolicy(
                      'Privacy Policy',
                      'SHADOW HOST Privacy Policy: We do not sell player data or server logs. Client credentials, API keys, and world snapshots are encrypted and retained strictly per user preference.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    showPolicy(
                      'Refund Policy',
                      'SHADOW HOST Refund Policy: All paid plan upgrades include a 72-hour unconditional money-back guarantee if node performance or latency does not satisfy your expectations. Free plan is forever free with zero charges.'
                    )
                  }
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard-support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Support Tickets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('status')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Public Status Page</span>
                </button>
              </li>
            </ul>

          </div>
        </div>

        {/* Bottom copyright strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} SHADOW HOST. All rights reserved. Not an official Minecraft product.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-semibold">Your World. Your Server. Your Power.</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-purple-800/60 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{modalPolicy.title}</h3>
              <button
                onClick={() => setModalPolicy(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {modalPolicy.content}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalPolicy(null)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
