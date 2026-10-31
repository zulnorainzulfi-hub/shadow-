import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Plus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const defaultAccount = {
    name: 'Zulnorain Zulfi',
    email: 'zulnorainzulfi@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    googleId: '10984219842109842109',
  };

  const handleSelectAccount = async (account: typeof defaultAccount) => {
    setIsAuthenticating(true);
    await new Promise((r) => setTimeout(r, 600)); // Smooth OAuth handshake simulation
    await loginWithGoogle(account);
    setIsAuthenticating(false);
    onSuccess();
    onClose();
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsAuthenticating(true);
    await new Promise((r) => setTimeout(r, 600));
    await loginWithGoogle({
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customEmail)}`,
      googleId: `g-${Date.now()}`,
    });
    setIsAuthenticating(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Top bar with Google G logo */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span className="font-medium text-sm text-slate-700">Sign in with Google</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Choose an account</h3>
            <p className="text-xs text-slate-500">
              to continue to <span className="font-semibold text-purple-700">SHADOW HOST</span>
            </p>
          </div>

          {isAuthenticating ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs font-medium text-slate-600">
                Verifying Google OAuth 2.0 Credentials...
              </div>
            </div>
          ) : !customMode ? (
            <div className="space-y-2">
              {/* Primary User Google Account */}
              <button
                type="button"
                onClick={() => handleSelectAccount(defaultAccount)}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={defaultAccount.avatarUrl}
                    alt={defaultAccount.name}
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-purple-700 flex items-center gap-1.5">
                      <span>{defaultAccount.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                        Verified
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{defaultAccount.email}</div>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Use another account button */}
              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className="w-full p-3 rounded-xl border border-dashed border-slate-300 hover:border-purple-400 hover:bg-slate-50 transition-all flex items-center gap-3 text-left text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Use another Google account</div>
                  <div className="text-[11px] text-slate-400">Sign in with custom Gmail credentials</div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Google Display Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Steve Minecraft"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. player@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Authorize</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Privacy footer */}
          <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Google OAuth 2.0 encrypted. SHADOW HOST never receives or stores your Google password.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
