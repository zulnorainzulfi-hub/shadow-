import React from 'react';
import { Server, LayoutDashboard, Shield, User, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DiscordIcon } from './DiscordIcon';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onScrollTo?: (elementId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onScrollTo }) => {
  const { currentUser, isAuthenticated, isAdmin, logout, toggleAdminRole } = useAuth();

  const handleNavClick = (sectionId: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-purple-900/30 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-700 to-black border border-purple-400/40 flex items-center justify-center shadow-lg shadow-purple-900/40 group-hover:border-purple-300 transition-all">
              <span className="text-white font-extrabold text-sm tracking-tighter">SH</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                  SHADOW HOST
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                  8GB FREE
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('plans')}
            className="hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Hosting Plans
          </button>
          <button
            onClick={() => handleNavClick('locations')}
            className="hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Locations
          </button>
          <button
            onClick={() => handleNavClick('software')}
            className="hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            Software
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-purple-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            FAQ
          </button>
          <button
            onClick={() => onNavigate('status')}
            className="hover:text-emerald-400 text-slate-300 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Status</span>
          </button>
        </nav>


        {/* Action Zone */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Discord Icon Button */}
          <a
            href="https://discord.gg/YC5JZWtc9"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono glow-purple"
            title="Join Official SHADOW HOST Discord Community"
          >
            <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
            <span className="hidden sm:inline font-semibold">Discord</span>
          </a>

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              {/* Role Toggle helper so user can test admin and regular user */}
              <button
                onClick={toggleAdminRole}
                className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors flex items-center gap-1 ${
                  isAdmin
                    ? 'bg-purple-950/80 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Click to toggle between Admin and User preview roles"
              >
                <ShieldAlert className="w-3 h-3 text-purple-400" />
                <span>{isAdmin ? 'ROLE: ADMIN' : 'ROLE: USER'}</span>
              </button>

              <button
                onClick={() => onNavigate(isAdmin ? 'dashboard-admin' : 'dashboard-overview')}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-md shadow-purple-900/30 transition-all flex items-center gap-2 cursor-pointer glow-purple"
              >
                {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <LayoutDashboard className="w-3.5 h-3.5" />
                )}
                <span>Dashboard</span>
              </button>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer glow-purple"
              >
                <Server className="w-3.5 h-3.5" />
                <span>Get Started Free</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
