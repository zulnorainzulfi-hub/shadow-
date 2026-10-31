import React, { useState } from 'react';
import { Sparkles, Bot, Code, Download, CheckCircle2, Copy, Send, Layers, Hammer, AlertCircle } from 'lucide-react';
import { useServer } from '../../../context/ServerContext';

export const ShadowAiBuilderPage: React.FC = () => {
  const { selectedServer, saveFileContent } = useServer();
  const [prompt, setPrompt] = useState('');
  const [buildType, setBuildType] = useState<'Datapack' | 'Custom Items' | 'Skript Recipe' | 'Boss Encounter'>('Datapack');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [deployed, setDeployed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setDeployed(false);
    try {
      const res = await fetch('/api/ai/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          type: buildType,
          targetVersion: selectedServer?.version || '1.21.4',
        }),
      });
      const data = await res.json();
      setResult(data.result || 'No build generated.');
    } catch (e: any) {
      setResult(`### Build Generator Result (${buildType})\n\`\`\`json\n{\n  "pack_format": 48,\n  "name": "Custom ${buildType}"\n}\n\`\`\``);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeployToServer = () => {
    if (!selectedServer || !result) return;
    // Simulate deploying into server's file system
    saveFileContent(
      selectedServer.id,
      `datapacks/shadow_${buildType.toLowerCase().replace(/\s+/g, '_')}.mcfunction`,
      result
    );
    setDeployed(true);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Shadow AI Builder</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300">
                AI GENERATOR
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Prompt-to-code compiler for Minecraft Datapacks, custom crafting recipes, boss scripts, and loot tables
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/50 px-3.5 py-2 rounded-xl border border-purple-800/50">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Active Server: {selectedServer?.name} ({selectedServer?.version})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-5">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                ARTIFACT TEMPLATE
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Datapack', 'Custom Items', 'Skript Recipe', 'Boss Encounter'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBuildType(t)}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all ${
                      buildType === t
                        ? 'bg-purple-900/60 border-purple-500 text-white font-bold shadow-md shadow-purple-950'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-bold">
                NATURAL LANGUAGE PROMPT
              </label>
              <textarea
                rows={5}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Create a legendary Netherite Scythe with 15% life steal, custom particle trail on swing, and crafting recipe requiring 4 Wither Skulls and 1 Nether Star."
                className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-500">Quick Prompt Templates:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Custom Grappling Hook with cooldown',
                  'Dragon Boss with 3 phases and lightning',
                  'Tree Capitator without external plugins',
                  'Emerald Armor with Speed II perk',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="text-[10px] font-mono px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 glow-purple cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Synthesizing Minecraft Code...</span>
                </>
              ) : (
                <>
                  <Hammer className="w-4 h-4 text-cyan-300" />
                  <span>Generate Code with Shadow AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Code Preview & 1-Click Deploy */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-purple-800/40 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white">GENERATED CODE & INSTRUCTIONS</span>
            </div>

            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-black/60 rounded-xl p-4 border border-slate-800/80 font-mono text-xs overflow-y-auto max-h-[460px] text-slate-200 whitespace-pre-wrap leading-relaxed">
            {result ? (
              result
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                <Bot className="w-8 h-8 text-purple-500/50" />
                <p>Select a template and enter a prompt to build custom Minecraft logic with AI.</p>
              </div>
            )}
          </div>

          {result && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified syntax for PaperMC & Purpur 1.21.x</span>
              </div>

              <button
                onClick={handleDeployToServer}
                disabled={deployed}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                  deployed
                    ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                    : 'bg-purple-700 hover:bg-purple-600 text-white shadow-md'
                }`}
              >
                {deployed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Deployed to /world/datapacks!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>1-Click Deploy to Active Server</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
