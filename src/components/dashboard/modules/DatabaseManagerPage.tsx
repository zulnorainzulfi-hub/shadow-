import React, { useState, useEffect } from 'react';
import { Database, PlusCircle, Copy, CheckCircle2, Terminal, Trash2, Key, RefreshCw, Server } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';
import { ManagedDatabase } from '../../../types';

export const DatabaseManagerPage: React.FC = () => {
  const { selectedServer } = useServer();
  const [databases, setDatabases] = useState<ManagedDatabase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dbName, setDbName] = useState('');
  const [pluginBinding, setPluginBinding] = useState('LuckPerms');
  const [queryInput, setQueryInput] = useState('SHOW TABLES;');
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedServer) return;
    fetch(`/api/servers/${selectedServer.id}/databases`)
      .then((res) => res.json())
      .then((data) => setDatabases(data))
      .catch(() => {});
  }, [selectedServer]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServer) return;

    try {
      const res = await fetch(`/api/servers/${selectedServer.id}/databases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbName, pluginBinding }),
      });
      const data = await res.json();
      if (data.database) {
        setDatabases((prev) => [...prev, data.database]);
        setIsModalOpen(false);
        setDbName('');
        setFeedback(`Database "${data.database.name}" provisioned on MariaDB cluster!`);
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {}
  };

  const handleDelete = async (dbId: string) => {
    if (!selectedServer) return;
    if (confirm('Drop database and delete all table records? This action cannot be reversed.')) {
      await fetch(`/api/servers/${selectedServer.id}/databases/${dbId}`, { method: 'DELETE' });
      setDatabases((prev) => prev.filter((d) => d.id !== dbId));
      setFeedback('Database dropped.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const copyConfigSnippet = (db: ManagedDatabase) => {
    const snippet = `storage-method: MySQL\ndata:\n  address: ${db.host}:${db.port}\n  database: ${db.name}\n  username: ${db.username}\n  password: "${db.password}"`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(db.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryOutput(`Query OK, 4 rows affected (0.002 sec)\n\n+-----------------------+\n| Tables_in_${databases[0]?.name || 'shadow_db'} |\n+-----------------------+\n| luckperms_players     |\n| luckperms_actions     |\n| luckperms_groups      |\n| luckperms_tracks      |\n+-----------------------+`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>MySQL Database Manager</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                MARIADB 10.11 CLUSTER
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Provision zero-friction relational databases with dedicated connections for LuckPerms, CoreProtect, Vault, and Shop plugins
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer glow-purple"
        >
          <PlusCircle className="w-4 h-4 text-cyan-300" />
          <span>New Database</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Database Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {databases.map((db) => (
          <div
            key={db.id}
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-purple-600/50 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-600/40 flex items-center justify-center text-purple-300">
                  <Database className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">{db.name}</h3>
                  <span className="text-xs font-mono text-purple-300">{db.pluginBinding}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyConfigSnippet(db)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors"
                  title="Copy configuration snippet for plugin config.yml"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedId === db.id ? 'Copied YAML!' : 'Copy YAML'}</span>
                </button>
                <button
                  onClick={() => handleDelete(db.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Connection Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-black/40 p-3.5 rounded-xl border border-slate-800/80 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">HOST / PORT:</span>
                <span className="text-white">{db.host}:{db.port}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">USERNAME:</span>
                <span className="text-white">{db.username}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PASSWORD:</span>
                <span className="text-purple-300">{db.password}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DISK USAGE:</span>
                <span className="text-cyan-400">{db.sizeMb} MB ({db.maxConnections} max conn)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Web SQL Terminal Query Console */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>WEB SQL QUERY RUNNER</span>
        </h3>

        <form onSubmit={handleRunQuery} className="flex gap-2">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="e.g. SHOW TABLES; or SELECT COUNT(*) FROM luckperms_players;"
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-mono font-bold text-white bg-purple-700 hover:bg-purple-600 rounded-xl flex items-center gap-1.5"
          >
            <span>Execute SQL</span>
          </button>
        </form>

        {queryOutput && (
          <pre className="p-4 rounded-xl bg-black/80 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
            {queryOutput}
          </pre>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-purple-800/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">PROVISION MANAGED DATABASE</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">DATABASE SUFFIX</label>
                <input
                  type="text"
                  required
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  placeholder="e.g. luckperms, vault, coreprotect"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">TARGET PLUGIN BINDING</label>
                <select
                  value={pluginBinding}
                  onChange={(e) => setPluginBinding(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="LuckPerms">LuckPerms (Permissions)</option>
                  <option value="CoreProtect">CoreProtect (Block Logging)</option>
                  <option value="Vault Economy">Vault Economy / EssentialsX</option>
                  <option value="Custom Database">Custom MySQL Integration</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-mono text-white bg-purple-700 hover:bg-purple-600 rounded-xl shadow-md"
                >
                  Provision MariaDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
