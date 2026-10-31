import React, { useState } from 'react';
import {
  LayoutDashboard,
  Server,
  PlusCircle,
  Terminal,
  FolderOpen,
  Puzzle,
  Archive,
  Settings,
  CreditCard,
  LifeBuoy,
  User,
  ShieldAlert,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Activity,
  Hammer,
  Bug,
  Cloud,
  ShoppingBag,
  Smartphone,
  Users,
  Compass,
  Database,
  Calendar,
  BarChart2,
  Lock,
  Coffee,
  Package,
  Copy,
  Sliders,
  Wifi,
  Megaphone,
  Gift,
  AlertOctagon,
  ShieldCheck,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useServer } from '../../context/ServerContext';
import { DemoBanner } from '../common/DemoBanner';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

interface NavCategory {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isHighlight?: boolean;
    isAiTab?: boolean;
    badge?: string | number;
    tag?: string;
  }[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  children,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { servers, selectedServerId, setSelectedServerId, selectedServer } = useServer();
  const [searchFilter, setSearchFilter] = useState('');

  const categories: NavCategory[] = [
    {
      title: 'CORE OPERATIONS',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'ai', label: 'SHADOW AI', icon: Sparkles, isHighlight: true, isAiTab: true },
        { id: 'servers', label: 'My Servers', icon: Server, badge: servers.length },
        { id: 'create', label: 'Create Server', icon: PlusCircle, isHighlight: true },
        { id: 'live-monitor', label: 'Live Monitor', icon: Activity, tag: 'LIVE' },
        { id: 'status', label: 'Public Status Page', icon: ShieldCheck },
      ],
    },
    {
      title: 'SERVER MANAGEMENT',
      items: [
        { id: 'console', label: 'Server Console', icon: Terminal },
        { id: 'files', label: 'File Manager', icon: FolderOpen },
        { id: 'plugins', label: 'Plugins Hub', icon: Puzzle },
        { id: 'modpacks', label: 'Modpack Installer', icon: Package, tag: 'NEW' },
        { id: 'version-switcher', label: 'Version Switcher', icon: Sliders },
        { id: 'java-version', label: 'Java Runtime Selector', icon: Coffee },
        { id: 'worlds', label: 'World Manager', icon: Compass },
        { id: 'database', label: 'MySQL Databases', icon: Database },
      ],
    },
    {
      title: 'PERFORMANCE & AUTOMATION',
      items: [
        { id: 'startup', label: 'Startup Manager', icon: Terminal },
        { id: 'jvm', label: 'Custom JVM Flags', icon: CpuIcon },
        { id: 'crash-recovery', label: 'Crash Recovery', icon: Bug, tag: 'AUTO' },
        { id: 'schedules', label: 'Scheduled Tasks', icon: Calendar },
        { id: 'maintenance', label: 'Maintenance Mode', icon: AlertOctagon },
        { id: 'settings', label: 'Server Settings', icon: Settings },
      ],
    },
    {
      title: 'SECURITY & NETWORK',
      items: [
        { id: 'shield', label: 'Shadow Shield Security', icon: ShieldCheck, tag: 'ENGAGED' },
        { id: 'network', label: 'Network Analytics', icon: Wifi },
        { id: 'access-control', label: 'Whitelist & Bans', icon: Lock },
        { id: 'subusers', label: 'Subuser Permissions', icon: Users },
      ],
    },
    {
      title: 'BACKUPS & MIGRATION',
      items: [
        { id: 'backups', label: 'Local Backups', icon: Archive },
        { id: 'cloud-backup', label: 'Shadow Cloud Backup', icon: Cloud, tag: 'S3' },
        { id: 'clone', label: 'Server Cloning', icon: Copy },
        { id: 'migration', label: 'Server Migration', icon: ArrowLeft },
      ],
    },
    {
      title: 'GROWTH & COMMUNITY',
      items: [
        { id: 'marketplace', label: 'Shadow Marketplace', icon: ShoppingBag, tag: '1-CLICK' },
        { id: 'ai-builder', label: 'Shadow AI Builder', icon: Hammer, isHighlight: true },
        { id: 'player-analytics', label: 'Player Analytics', icon: BarChart2 },
        { id: 'announcements', label: 'Announcement Center', icon: Megaphone },
        { id: 'referrals', label: 'Referral Rewards', icon: Gift, tag: 'EARN' },
      ],
    },
    {
      title: 'BILLING & ACCOUNT',
      items: [
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
        { id: 'mobile', label: 'Mobile Control Panel', icon: Smartphone, tag: 'PWA' },
        { id: 'support', label: 'Support & Tickets', icon: LifeBuoy },
        { id: 'account', label: 'Account Settings', icon: User },
      ],
    },
  ];

  if (isAdmin) {
    categories[categories.length - 1].items.push({
      id: 'admin',
      label: 'Admin Panel',
      icon: ShieldAlert,
      isHighlight: true,
    });
  }

  // Filter categories by search filter
  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        cat.title.toLowerCase().includes(searchFilter.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col">
      {/* Top Demo status banner */}
      <DemoBanner />

      {/* Main Top Header */}
      <header className="bg-slate-950/80 border-b border-purple-900/30 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateHome}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title="Return to public homepage"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Server Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 hidden md:inline">ACTIVE SERVER:</span>
            <div className="relative">
              <select
                value={selectedServerId}
                onChange={(e) => setSelectedServerId(e.target.value)}
                className="bg-slate-900 border border-purple-800/60 text-xs font-mono font-bold text-white pl-3 pr-8 py-1.5 rounded-lg focus:outline-none focus:border-purple-400 cursor-pointer appearance-none"
              >
                {servers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.regionFlag} {s.name} ({s.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-purple-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* User Profile in Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-xs font-bold text-white font-mono flex items-center justify-end gap-1.5">
                <span>{currentUser?.name}</span>
                {currentUser?.authProvider === 'google' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Google Account" />
                )}
              </div>
              <div className="text-[10px] text-purple-400 font-mono">
                {currentUser?.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : 'COMMUNITY TIER'}
              </div>
            </div>
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg border border-purple-500/80 object-cover shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-bold font-mono text-white shadow-sm">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'SH'}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-72 bg-slate-950/70 border-r border-purple-900/30 flex flex-col justify-between p-3.5 shrink-0 overflow-y-auto">
          <div className="space-y-4">
            {/* Sidebar Brand lockup */}
            <div className="px-2 pt-1 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-purple-900/50">
                  SH
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-tight text-white">SHADOW HOST</div>
                  <div className="text-[10px] font-mono text-slate-500">CONTROL PANEL · 25 EXPANSIONS</div>
                </div>
              </div>
            </div>

            {/* Quick Module Finder / Search */}
            <div className="relative px-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find module (e.g. MySQL, Cron)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Navigation categorized list */}
            <nav className="space-y-5">
              {filteredCategories.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                    {cat.title}
                  </div>

                  <div className="space-y-0.5">
                    {cat.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      const isAi = item.isAiTab;
                      return (
                        <button
                          key={item.id}
                          onClick={() => onSelectTab(item.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? isAi
                                ? 'bg-gradient-to-r from-purple-950/90 to-cyan-950/80 border border-cyan-400/80 text-white font-bold shadow-md shadow-purple-900/40'
                                : 'bg-purple-950/80 border border-purple-500/60 text-white font-bold glow-purple'
                              : isAi
                              ? 'bg-gradient-to-r from-purple-950/40 to-slate-900/80 border border-purple-700/50 text-cyan-300 hover:border-cyan-400'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isAi
                                  ? 'text-cyan-300 animate-pulse'
                                  : isActive
                                  ? 'text-cyan-400'
                                  : 'text-purple-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {item.tag && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                                {item.tag}
                              </span>
                            )}
                            {item.badge !== undefined && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-900/60 text-purple-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom active server summary pill */}
          {selectedServer && (
            <div className="mt-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">SERVER STATUS:</span>
                <span
                  className={`font-bold ${
                    selectedServer.status === 'online'
                      ? 'text-emerald-400'
                      : selectedServer.status === 'starting'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedServer.status.toUpperCase()}
                </span>
              </div>
              <div className="text-slate-300 font-bold truncate">{selectedServer.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{selectedServer.ip}:{selectedServer.port}</div>
            </div>
          )}
        </aside>

        {/* Dashboard Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-gradient-to-b from-[#06070a] to-[#050505]">
          {children}
        </main>
      </div>
    </div>
  );
};

// Quick helper icon for CPU
function CpuIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" />
      <path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
    </svg>
  );
}
