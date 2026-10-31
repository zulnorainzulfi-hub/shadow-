import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Calendar,
  Server,
  Sparkles,
  Shield,
  CheckCircle2,
  Trash2,
  LogOut,
  Save,
  AlertTriangle,
  Link2,
  Unlink,
} from 'lucide-react';
import { useAuth, getPlanDailyQuota } from '../../context/AuthContext';
import { useServer } from '../../context/ServerContext';
import { GoogleAuthModal } from '../auth/GoogleAuthModal';

interface AccountSettingsPageProps {
  onLogout: () => void;
}

export const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ onLogout }) => {
  const {
    currentUser,
    updateProfile,
    toggleAdminRole,
    isAdmin,
    deleteAccount,
    unlinkGoogleAccount,
  } = useAuth();
  const { servers } = useServer();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const quota = currentUser?.aiDailyQuota ?? getPlanDailyQuota(currentUser?.planId);
  const used = currentUser?.aiUsageToday ?? 0;
  const quotaPercent = Math.min(100, Math.round((used / (quota === 999999 ? 100 : quota)) * 100));

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setPasswordNotice(true);
    setTimeout(() => setPasswordNotice(false), 3000);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirmText !== 'DELETE') return;
    deleteAccount();
    onLogout();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Account Profile & Settings</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Manage your credentials, Google OAuth integration, plan specs, and AI usage quotas
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 text-xs font-mono font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 rounded-xl transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      {passwordNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Password updated successfully!</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-slate-950/80 border border-purple-700/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl border-2 border-purple-500/80 object-cover shadow-lg shadow-purple-900/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center font-bold text-white text-xl border-2 border-purple-400">
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'SH'}
                </div>
              )}
              {currentUser?.authProvider === 'google' && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow"
                  title="Signed in with Google"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{currentUser?.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50 uppercase">
                  {currentUser?.role}
                </span>
                {currentUser?.authProvider === 'google' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                    Google Connected
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser?.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full sm:w-auto">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-center gap-1">
                <Server className="w-3 h-3 text-cyan-400" />
                Servers
              </div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">{servers.length}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                Joined
              </div>
              <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                {currentUser?.createdAt || '2026-01-15'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                Plan
              </div>
              <div className="text-xs font-mono font-bold text-emerald-300 mt-0.5 uppercase">
                {currentUser?.planId?.replace('plan-', '') || 'Free'} Tier
              </div>
            </div>
          </div>
        </div>

        {/* AI Usage Bar in Overview */}
        <div className="mt-5 pt-4 border-t border-purple-900/40">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SHADOW AI ENGINE Daily Quota</span>
            </span>
            <span className="font-bold text-cyan-300">
              {used} / {quota === 999999 ? '∞ Unlimited' : `${quota} requests`}
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1">
            <span>Resets daily at 00:00 UTC</span>
            <span>Free: 25/day • Pro: 100/day • Premium: 500/day • Ultimate: Unlimited</span>
          </div>
        </div>
      </div>

      {/* Google Account Integration Card */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Account Authentication</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Link your Google Account for fast, passwordless 1-click authentication
            </p>
          </div>

          {currentUser?.authProvider === 'google' ? (
            <button
              onClick={unlinkGoogleAccount}
              className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Unlink Google</span>
            </button>
          ) : (
            <button
              onClick={() => setShowGoogleModal(true)}
              className="px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg bg-white hover:bg-slate-100 text-slate-900 flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Link Google Account</span>
            </button>
          )}
        </div>

        {currentUser?.authProvider === 'google' ? (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-900/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                Connected Google ID:{' '}
                <span className="text-purple-300 font-bold">
                  {currentUser.googleId || '10984219842109842109'}
                </span>
              </span>
            </div>
            <span className="text-slate-500 text-[11px]">OAuth 2.0 Token Active</span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs font-mono text-slate-400">
            No Google account linked. You can sign in using your email and password.
          </div>
        )}
      </div>

      {/* Profile Info Form */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-purple-300 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          <span>Profile Information</span>
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">DISPLAY NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset Form */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Security & Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">CURRENT PASSWORD</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">NEW PASSWORD</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-mono font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Role & Permissions Toggle */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-900/40 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-purple-300">ADMINISTRATOR PRIVILEGES</div>
          <p className="text-xs text-slate-400 font-mono">
            Toggle admin role to access node health and system controls in the sidebar.
          </p>
        </div>

        <button
          onClick={toggleAdminRole}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer ${
            isAdmin
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          {isAdmin ? 'ADMIN ACCESS ENABLED' : 'ENABLE ADMIN ROLE'}
        </button>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold font-mono text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Danger Zone — Delete Account</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Permanently delete your SHADOW HOST account, linked servers, backups, and configurations.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-xs font-mono font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Google Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={() => {
          setSavedNotice(true);
          setTimeout(() => setSavedNotice(false), 2500);
        }}
      />

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-rose-800/80 rounded-2xl p-6 space-y-4 text-white">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Permanently Delete Account?</h3>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              This action is irreversible. All of your Minecraft servers ({servers.length}), file
              configurations, backups, and Google credentials will be permanently erased.
            </p>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Type <span className="text-rose-400 font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 bg-slate-900 border border-rose-900 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
                className="px-4 py-2 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmText !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
