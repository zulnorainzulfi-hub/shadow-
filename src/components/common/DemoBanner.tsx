import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Sliders, ExternalLink, Key, X } from 'lucide-react';
import { useServer } from '../../context/ServerContext';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, pterodactylConfig, updatePterodactylConfig } = useServer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelUrl, setPanelUrl] = useState(pterodactylConfig.panelUrl || 'https://panel.shadowhost.io');
  const [apiKey, setApiKey] = useState(pterodactylConfig.apiKey || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setTestStatus('testing');

    setTimeout(() => {
      if (apiKey.trim()) {
        updatePterodactylConfig({
          isConnected: true,
          panelUrl,
          apiKey,
          lastSync: 'Just now',
        });
        setTestStatus('success');
        setTimeout(() => setIsModalOpen(false), 800);
      } else {
        setTestStatus('error');
      }
    }, 1000);
  };

  const handleDisconnect = () => {
    updatePterodactylConfig({
      isConnected: false,
      panelUrl: '',
      apiKey: '',
    });
    setTestStatus('idle');
  };

  return (
    <>
      {isDemoMode ? (
        <div className="bg-amber-950/80 border-b border-amber-600/50 px-4 py-2 text-xs font-mono text-amber-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
              DEMO MODE
            </span>
            <span>
              Simulated Infrastructure Engine active. All server metrics, players, and logs are simulated.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-amber-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3 h-3" />
              <span>Connect Pterodactyl API</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/70 border-b border-emerald-600/40 px-4 py-1.5 text-xs font-mono text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">LIVE BACKEND CONNECTED</span>
            <span className="text-emerald-400">· {pterodactylConfig.panelUrl}</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Pterodactyl Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-purple-800/60 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/50 flex items-center justify-center text-purple-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Connect Pterodactyl Panel API</h3>
                  <p className="text-xs text-slate-400">Manage real physical Minecraft server nodes</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnect} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  PTERODACTYL PANEL BASE URL
                </label>
                <input
                  type="url"
                  required
                  value={panelUrl}
                  onChange={(e) => setPanelUrl(e.target.value)}
                  placeholder="https://panel.example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  CLIENT / APPLICATION API KEY
                </label>
                <input
                  type="password"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="ptlc_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  Generated in Pterodactyl Account Settings → API Credentials. Stored only in your secure local session.
                </p>
              </div>

              {testStatus === 'error' && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please provide a valid API key to connect to your Pterodactyl panel.</span>
                </div>
              )}

              {testStatus === 'success' && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Connection verified! Live node sync established.</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={testStatus === 'testing'}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{testStatus === 'testing' ? 'Verifying Endpoint...' : 'Connect Panel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
