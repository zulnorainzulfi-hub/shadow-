import React from 'react';
import { Server, Shield, Terminal, Zap, Lock, Unlock, Volume2, VolumeX } from 'lucide-react';
import { getAudioMuted, setAudioMuted } from '../lib/audio';

interface HeaderProps {
  activeView: 'storefront' | 'console' | 'shadow' | 'stego';
  setActiveView: (view: 'storefront' | 'console' | 'shadow' | 'stego') => void;
  isPortalUnlocked: boolean;
  onOpenDeploy: () => void;
  onPanicBurn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  isPortalUnlocked,
  onOpenDeploy,
  onPanicBurn,
}) => {
  const [muted, setMuted] = React.useState(getAudioMuted());

  const toggleMute = () => {
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Element, Display Typography) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('storefront')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            title="Shadow Minecraft Hosting & Operations"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 via-indigo-900 to-black border border-purple-500/40 flex items-center justify-center shadow-sm group-hover:border-purple-400/60 transition-colors">
              <span className="text-purple-300 font-mono font-extrabold text-sm">S</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                Shadow
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                FREE
              </span>
            </div>
          </button>
          <span className="hidden sm:inline-block text-xs text-slate-500 font-mono">
            MC 1.21.4
          </span>
        </div>

        {/* Zone 2: 4-5 Clean Single-Line Text Links (Whitespace-Nowrap) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView('storefront')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeView === 'storefront' ? 'text-white font-semibold' : ''
            }`}
          >
            Free Hosting
          </button>
          <button
            onClick={() => setActiveView('console')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 ${
              activeView === 'console' ? 'text-white font-semibold' : ''
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>RCON Terminal</span>
          </button>
          <button
            onClick={() => setActiveView('stego')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 ${
              activeView === 'stego' ? 'text-white font-semibold' : ''
            }`}
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Stegano-Masking</span>
          </button>
          <button
            onClick={() => setActiveView('shadow')}
            className={`whitespace-nowrap transition-colors hover:text-white flex items-center gap-1.5 ${
              activeView === 'shadow'
                ? 'text-purple-300 font-semibold'
                : 'text-slate-400 hover:text-purple-300'
            }`}
            title="Encrypted Team Operations Portal (Ctrl+Shift+S)"
          >
            {isPortalUnlocked ? (
              <Unlock className="w-4 h-4 text-purple-400" />
            ) : (
              <Lock className="w-4 h-4 text-slate-500" />
            )}
            <span>Shadow Portal</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Tactical Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mute button */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title={muted ? 'Unmute tactical audio' : 'Mute tactical audio'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* If in shadow portal and unlocked, provide quick Panic Scramble */}
          {activeView === 'shadow' && onPanicBurn && (
            <button
              onClick={onPanicBurn}
              className="px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              title="Immediate emergency cryptographic purge and snapshot jump to vanilla dashboard"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>Panic Burn</span>
            </button>
          )}

          {/* Primary Action Button: Claim Free Server */}
          <button
            onClick={onOpenDeploy}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Deploy Free Server</span>
          </button>
        </div>
      </div>
    </header>
  );
};
