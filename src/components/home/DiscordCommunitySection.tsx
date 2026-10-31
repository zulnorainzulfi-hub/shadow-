import React from 'react';
import { Mail, MessageSquare, Headphones, ShieldCheck, ArrowRight, Zap, CheckCircle2, Clock, Users } from 'lucide-react';
import { DiscordIcon } from '../common/DiscordIcon';

export const DiscordCommunitySection: React.FC = () => {
  return (
    <section id="community" className="py-20 px-6 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-purple-700/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            OFFICIAL SHADOW CHANNELS & SUPPORT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Connect With Our Community & Support
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Get instant help from our team, talk with other Minecraft server admins, troubleshoot plugins, or reach out to our official email support anytime.
          </p>
        </div>

        {/* 2 Main Feature Cards: Discord Community & Email Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. DISCORD COMMUNITY CARD */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-[#0e0724]/90 via-[#070314]/90 to-[#04020a]/90 border-2 border-purple-600/40 hover:border-purple-500/70 transition-all duration-300 shadow-[0_0_35px_rgba(139,92,246,0.2)] hover:shadow-[0_0_45px_rgba(139,92,246,0.35)] flex flex-col justify-between group overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5865F2] via-purple-500 to-cyan-400" />
            
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/50 flex items-center justify-center text-[#5865F2] shadow-[0_0_20px_rgba(88,101,242,0.4)] group-hover:scale-105 transition-transform">
                  <DiscordIcon className="w-8 h-8 text-[#5865F2]" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>1,420+ Online</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Official Discord Community
                </h3>
                <p className="text-xs font-mono text-purple-300 mt-1">
                  https://discord.gg/YC5JZWtc9
                </p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Join the official SHADOW HOST Discord. Hang out with server owners, get live plugin assistance, participate in giveaways, and receive real-time node uptime updates.
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>24/7 Community Help</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Plugin Config Tips</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Staff Ticket Bots</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Server Showcases</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="https://discord.gg/YC5JZWtc9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(88,101,242,0.45)] hover:shadow-[0_0_30px_rgba(88,101,242,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <DiscordIcon className="w-4 h-4 text-white" />
                <span>JOIN OUR DISCORD</span>
              </a>

              <a
                href="https://discord.gg/YC5JZWtc9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-600/60 text-purple-200 font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:text-white cursor-pointer"
              >
                <Headphones className="w-4 h-4 text-cyan-400" />
                <span>DISCORD SUPPORT</span>
              </a>
            </div>
          </div>

          {/* 2. EMAIL SUPPORT CONTACT CARD */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-[#080d24]/90 via-[#05091a]/90 to-[#04020a]/90 border-2 border-cyan-500/40 hover:border-cyan-400/70 transition-all duration-300 shadow-[0_0_35px_rgba(0,212,255,0.15)] hover:shadow-[0_0_45px_rgba(0,212,255,0.3)] flex flex-col justify-between group overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600" />

            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,212,255,0.35)] group-hover:scale-105 transition-transform">
                  <Mail className="w-7 h-7 text-cyan-300" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Avg Response: &lt; 1 Hour</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Official Email Support
                </h3>
                <a
                  href="mailto:zulnorainzulfi@gmail.com"
                  className="text-xs sm:text-sm font-mono text-cyan-300 hover:text-cyan-200 underline underline-offset-4 decoration-cyan-500/60 transition-colors inline-block mt-1 font-semibold"
                >
                  zulnorainzulfi@gmail.com
                </a>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Need help with custom server setups, enterprise inquiries, domain DNS mappings, or account recovery? Reach out to our technical desk via email for direct engineer resolution.
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Direct Team Inbox</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Billing & Hardware Help</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Custom Node Quotes</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>72h Money-Back Desk</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="mailto:zulnorainzulfi@gmail.com?subject=SHADOW%20HOST%20Support%20Request"
                className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(0,212,255,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-200" />
                <span>CONTACT SUPPORT</span>
              </a>

              <a
                href="mailto:zulnorainzulfi@gmail.com"
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:text-white cursor-pointer"
              >
                <span>EMAIL SUPPORT LINK</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
