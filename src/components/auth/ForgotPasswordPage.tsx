import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordPageProps {
  onNavigate: (view: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-slate-950/90 border border-purple-800/50 rounded-2xl shadow-2xl p-8 space-y-6 relative z-10 glass-panel">
        <button
          onClick={() => onNavigate('login')}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400 font-mono">
            Enter your account email to receive recovery instructions
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password Reset Link Dispatched</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              If an account exists for <strong className="text-white font-mono">{email}</strong>, a recovery link has been sent. Please check your spam folder if it doesn&apos;t arrive within 2 minutes.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors mt-2"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer glow-purple"
            >
              <span>{loading ? 'Sending Instructions...' : 'Send Recovery Link'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
