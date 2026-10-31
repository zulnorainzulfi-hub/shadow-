import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface FooterProps {
  onOpenShadowPortal: () => void;
  onOpenConsole: () => void;
  onOpenStego: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenShadowPortal,
  onOpenConsole,
  onOpenStego,
}) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070A0F] py-10 px-6 mt-20 text-xs text-slate-500 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & SLA statement */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-300 font-bold font-sans">
            <span className="text-white font-extrabold">Shadow</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">[100% Free Hosting]</span>
            <span className="text-slate-600">·</span>
            <span>Enterprise Minecraft Infrastructure</span>
          </div>
          <p className="text-slate-500">
            Dedicated AMD Ryzen 9 7950X3D compute nodes with anycast scrubbing. Free community tier forever.
          </p>
          <div className="flex items-center gap-3 pt-1 text-slate-400">
            <a href="mailto:zulnorainzulfi@gmail.com" className="hover:text-cyan-400 transition-colors">
              zulnorainzulfi@gmail.com
            </a>
            <span>·</span>
            <a href="https://discord.gg/YC5JZWtc9" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">
              Discord: discord.gg/YC5JZWtc9
            </a>
          </div>
        </div>

        {/* Center: Quiet navigation */}
        <div className="flex items-center gap-6">

          <button
            onClick={onOpenConsole}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            RCON Console
          </button>
          <button
            onClick={onOpenStego}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Steganography Tool
          </button>
          <button
            onClick={onOpenShadowPortal}
            className="hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer text-slate-500"
            title="Access covert encrypted communication portal (Ctrl+Shift+S)"
          >
            <Lock className="w-3 h-3 text-slate-600 hover:text-purple-400" />
            <span>Terminal Gateway</span>
          </button>
        </div>

        {/* Right: Copyright & Key hint */}
        <div className="text-slate-500 text-center md:text-right">
          <div>© {new Date().getFullYear()} Shadow Hosting Systems.</div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">Ctrl+Shift+S</kbd> to toggle covert portal
          </div>
        </div>
      </div>
    </footer>
  );
};
