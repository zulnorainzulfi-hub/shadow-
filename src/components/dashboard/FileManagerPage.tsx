import React, { useState } from 'react';
import {
  FolderOpen,
  FileText,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit3,
  Save,
  Check,
  X,
  FolderPlus,
  FilePlus,
  ArrowLeft,
} from 'lucide-react';
import { useServer } from '../../context/ServerContext';
import { ServerFile } from '../../types';

export const FileManagerPage: React.FC = () => {
  const {
    selectedServer,
    files,
    saveFileContent,
    createFileOrFolder,
    deleteFile,
  } = useServer();

  const [currentFolder, setCurrentFolder] = useState('/');
  const [editingFile, setEditingFile] = useState<ServerFile | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isFolderType, setIsFolderType] = useState(false);

  if (!selectedServer) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 font-mono">
        No active server selected.
      </div>
    );
  }

  const serverFiles = files[selectedServer.id] || [];

  const handleOpenFile = (file: ServerFile) => {
    if (file.isDirectory) {
      setCurrentFolder(file.path);
    } else {
      setEditingFile(file);
      setEditorContent(file.content || `# ${file.name}\n`);
    }
  };

  const handleSaveFile = () => {
    if (!editingFile) return;
    saveFileContent(selectedServer.id, editingFile.path, editorContent);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    createFileOrFolder(selectedServer.id, newItemName.trim(), isFolderType);
    setNewItemName('');
    setIsNewModalOpen(false);
  };

  const handleSimulateUpload = () => {
    const mockFileName = `custom_config_${Math.floor(Math.random() * 900 + 100)}.yml`;
    createFileOrFolder(selectedServer.id, mockFileName, false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">File Manager</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-700 text-purple-300">
              {selectedServer.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse, upload, and configure server properties, plugins, and world datasets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFolderType(false);
              setIsNewModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-mono font-bold text-white bg-slate-900 hover:bg-slate-800 border border-purple-700/60 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New File</span>
          </button>

          <button
            onClick={() => {
              setIsFolderType(true);
              setIsNewModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-mono font-bold text-white bg-slate-900 hover:bg-slate-800 border border-purple-700/60 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
            <span>New Folder</span>
          </button>

          <button
            onClick={handleSimulateUpload}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer glow-purple"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Editor View or File Browser View */}
      {editingFile ? (
        <div className="p-6 rounded-2xl glass-panel border border-purple-800/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingFile(null)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>{editingFile.path}</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Editing server configuration
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {savedNotice && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" /> Saved to disk!
                </span>
              )}
              <button
                onClick={handleSaveFile}
                className="px-5 py-2 text-xs font-bold font-mono text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save File</span>
              </button>
            </div>
          </div>

          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            rows={18}
            className="w-full p-4 bg-[#05060b] border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed shadow-inner"
          />
        </div>
      ) : (
        <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
          {/* Path Breadcrumbs */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-purple-400" />
              <span>/home/container{currentFolder !== '/' && currentFolder}</span>
            </div>
            {currentFolder !== '/' && (
              <button
                onClick={() => setCurrentFolder('/')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Back to Root
              </button>
            )}
          </div>

          {/* Files List */}
          <div className="divide-y divide-slate-800/80">
            {serverFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => handleOpenFile(file)}
                className="p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {file.isDirectory ? (
                    <FolderOpen className="w-5 h-5 text-purple-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-cyan-400" />
                  )}
                  <div>
                    <div className="text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {file.name}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {file.isDirectory ? 'Directory' : `${(file.sizeBytes / 1024).toFixed(1)} KB`} · Modified {file.updatedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {!file.isDirectory && (
                    <>
                      <button
                        onClick={() => handleOpenFile(file)}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit File"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([file.content || ''], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = file.name;
                          a.click();
                        }}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Download File"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteFile(selectedServer.id, file.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New File / Folder Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-purple-800/60 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono">
                {isFolderType ? 'CREATE NEW DIRECTORY' : 'CREATE NEW FILE'}
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  {isFolderType ? 'DIRECTORY NAME' : 'FILE NAME WITH EXTENSION'}
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={isFolderType ? 'datapacks' : 'permissions.yml'}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-mono text-white bg-purple-700 hover:bg-purple-600 rounded-xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
