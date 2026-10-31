import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MinecraftServer,
  HostingPlan,
  HostingNode,
  PluginItem,
  ServerFile,
  BackupItem,
  SupportTicket,
  AdminAnnouncement,
  PterodactylConfig,
  ServerStatus,
  ServerSoftware,
} from '../types';
import {
  INITIAL_SERVERS,
  INITIAL_PLANS,
  INITIAL_NODES,
  INITIAL_PLUGINS,
  INITIAL_FILES,
  INITIAL_BACKUPS,
  INITIAL_TICKETS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/initialData';

interface CreateServerParams {
  name: string;
  software: ServerSoftware;
  version: string;
  planId: string;
  region: string;
  regionFlag: string;
  ownerId: string;
}

interface ServerContextType {
  servers: MinecraftServer[];
  selectedServerId: string;
  selectedServer: MinecraftServer | undefined;
  setSelectedServerId: (id: string) => void;
  plans: HostingPlan[];
  nodes: HostingNode[];
  plugins: PluginItem[];
  files: Record<string, ServerFile[]>;
  backups: BackupItem[];
  tickets: SupportTicket[];
  announcements: AdminAnnouncement[];
  pterodactylConfig: PterodactylConfig;
  isDemoMode: boolean;
  
  // Server Power Controls
  startServer: (id: string) => void;
  stopServer: (id: string) => void;
  restartServer: (id: string) => void;
  killServer: (id: string) => void;
  createServer: (params: CreateServerParams) => Promise<MinecraftServer>;
  deleteServer: (id: string) => void;
  updateServer: (id: string, updates: Partial<MinecraftServer>) => void;

  // File Manager
  getFileContent: (serverId: string, path: string) => string | undefined;
  saveFileContent: (serverId: string, path: string, content: string) => void;
  createFileOrFolder: (serverId: string, name: string, isDirectory: boolean) => void;
  deleteFile: (serverId: string, fileId: string) => void;

  // Plugin Manager
  togglePlugin: (pluginId: string) => void;
  installPlugin: (pluginId: string) => void;
  uninstallPlugin: (pluginId: string) => void;
  uploadPluginMock: (name: string, sizeMb: number) => void;

  // Backup Manager
  createBackup: (serverId: string, name: string) => void;
  restoreBackup: (backupId: string) => void;
  deleteBackup: (backupId: string) => void;

  // Tickets
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'replies'>) => void;
  replyToTicket: (ticketId: string, authorName: string, role: 'user' | 'admin' | 'support', message: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Admin Controls
  updatePlan: (planId: string, updates: Partial<HostingPlan>) => void;
  createAnnouncement: (title: string, message: string, type: AdminAnnouncement['type']) => void;
  deleteAnnouncement: (id: string) => void;

  // Pterodactyl Config
  updatePterodactylConfig: (config: PterodactylConfig) => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<MinecraftServer[]>(() => {
    try {
      const s = localStorage.getItem('shadowhost_servers');
      if (s) return JSON.parse(s);
    } catch {}
    return INITIAL_SERVERS;
  });

  const [selectedServerId, setSelectedServerId] = useState<string>(() => {
    return servers[0]?.id || 'srv-shadow-smp';
  });

  const [plans, setPlans] = useState<HostingPlan[]>(() => {
    try {
      const p = localStorage.getItem('shadowhost_plans');
      if (p) return JSON.parse(p);
    } catch {}
    return INITIAL_PLANS;
  });

  const [nodes, setNodes] = useState<HostingNode[]>(INITIAL_NODES);

  const [plugins, setPlugins] = useState<PluginItem[]>(() => {
    try {
      const pl = localStorage.getItem('shadowhost_plugins');
      if (pl) return JSON.parse(pl);
    } catch {}
    return INITIAL_PLUGINS;
  });

  const [files, setFiles] = useState<Record<string, ServerFile[]>>(() => {
    try {
      const f = localStorage.getItem('shadowhost_files');
      if (f) return JSON.parse(f);
    } catch {}
    return INITIAL_FILES;
  });

  const [backups, setBackups] = useState<BackupItem[]>(() => {
    try {
      const b = localStorage.getItem('shadowhost_backups');
      if (b) return JSON.parse(b);
    } catch {}
    return INITIAL_BACKUPS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const t = localStorage.getItem('shadowhost_tickets');
      if (t) return JSON.parse(t);
    } catch {}
    return INITIAL_TICKETS;
  });

  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(() => {
    try {
      const a = localStorage.getItem('shadowhost_announcements');
      if (a) return JSON.parse(a);
    } catch {}
    return INITIAL_ANNOUNCEMENTS;
  });

  const [pterodactylConfig, setPterodactylConfig] = useState<PterodactylConfig>(() => {
    try {
      const c = localStorage.getItem('shadowhost_pterodactyl');
      if (c) return JSON.parse(c);
    } catch {}
    return {
      isConnected: false,
      panelUrl: '',
      apiKey: '',
    };
  });

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('shadowhost_servers', JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
    localStorage.setItem('shadowhost_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('shadowhost_plugins', JSON.stringify(plugins));
  }, [plugins]);

  useEffect(() => {
    localStorage.setItem('shadowhost_backups', JSON.stringify(backups));
  }, [backups]);

  useEffect(() => {
    localStorage.setItem('shadowhost_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('shadowhost_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('shadowhost_pterodactyl', JSON.stringify(pterodactylConfig));
  }, [pterodactylConfig]);

  const selectedServer = servers.find((s) => s.id === selectedServerId) || servers[0];

  // Power actions
  const setServerStatus = (id: string, status: ServerStatus) => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          status,
          playersOnline: status === 'online' ? s.playersOnline : 0,
          ramUsageMb: status === 'online' ? s.ramUsageMb : 0,
          cpuUsagePercent: status === 'online' ? s.cpuUsagePercent : 0,
        };
      })
    );
  };

  const startServer = (id: string) => {
    setServerStatus(id, 'starting');
    setTimeout(() => {
      setServerStatus(id, 'online');
    }, 1800);
  };

  const stopServer = (id: string) => {
    setServerStatus(id, 'stopping');
    setTimeout(() => {
      setServerStatus(id, 'offline');
    }, 1200);
  };

  const restartServer = (id: string) => {
    setServerStatus(id, 'stopping');
    setTimeout(() => {
      setServerStatus(id, 'starting');
      setTimeout(() => {
        setServerStatus(id, 'online');
      }, 1500);
    }, 1200);
  };

  const killServer = (id: string) => {
    setServerStatus(id, 'offline');
  };

  const createServer = async (params: CreateServerParams): Promise<MinecraftServer> => {
    const plan = plans.find((p) => p.id === params.planId) || plans[0];
    const ramMb = plan.ramGb * 1024;
    const diskGb = plan.storageGb;
    const maxSlots = plan.playerSlots;
    const cleanSubdomain = params.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'myserver';

    const newServer: MinecraftServer = {
      id: `srv-${Date.now()}`,
      name: params.name,
      ownerId: params.ownerId,
      planId: params.planId,
      software: params.software,
      version: params.version,
      status: 'online',
      ip: `${cleanSubdomain}.shadow.host`,
      port: 25565,
      region: params.region,
      regionFlag: params.regionFlag,
      ramUsageMb: Math.round(ramMb * 0.35),
      ramAllocationMb: ramMb,
      cpuUsagePercent: 18,
      diskUsageGb: 3.4,
      diskAllocationGb: diskGb,
      playersOnline: 1,
      maxPlayers: maxSlots,
      uptime: 'Just started',
      motd: `§d§l[${params.name}] §fPowered by SHADOW HOST §7[${params.version}]`,
      autoBackup: true,
      createdAt: new Date().toISOString().split('T')[0],
      players: [
        {
          uuid: 'p-owner',
          username: 'ServerAdmin',
          pingMs: 16,
          joinedAt: 'Just now',
        },
      ],
    };

    // Populate default files for new server
    setFiles((prev) => ({
      ...prev,
      [newServer.id]: INITIAL_FILES['srv-shadow-smp'].map((f) => ({
        ...f,
        id: `f-${Date.now()}-${f.name}`,
      })),
    }));

    setServers((prev) => [newServer, ...prev]);
    setSelectedServerId(newServer.id);
    return newServer;
  };

  const deleteServer = (id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
    if (selectedServerId === id) {
      const remaining = servers.filter((s) => s.id !== id);
      if (remaining[0]) setSelectedServerId(remaining[0].id);
    }
  };

  const updateServer = (id: string, updates: Partial<MinecraftServer>) => {
    setServers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // File Manager actions
  const getFileContent = (serverId: string, path: string): string | undefined => {
    const list = files[serverId] || INITIAL_FILES['srv-shadow-smp'];
    const file = list.find((f) => f.path === path);
    return file?.content;
  };

  const saveFileContent = (serverId: string, path: string, content: string) => {
    setFiles((prev) => {
      const currentList = prev[serverId] || INITIAL_FILES['srv-shadow-smp'];
      const updated = currentList.map((f) => (f.path === path ? { ...f, content, updatedAt: 'Just now' } : f));
      return { ...prev, [serverId]: updated };
    });
  };

  const createFileOrFolder = (serverId: string, name: string, isDirectory: boolean) => {
    const newFile: ServerFile = {
      id: `file-${Date.now()}`,
      name,
      path: `/${name}`,
      isDirectory,
      sizeBytes: isDirectory ? 4096 : 120,
      updatedAt: 'Just now',
      content: isDirectory ? undefined : '# New configuration file\n',
    };
    setFiles((prev) => ({
      ...prev,
      [serverId]: [...(prev[serverId] || []), newFile],
    }));
  };

  const deleteFile = (serverId: string, fileId: string) => {
    setFiles((prev) => ({
      ...prev,
      [serverId]: (prev[serverId] || []).filter((f) => f.id !== fileId),
    }));
  };

  // Plugin Manager actions
  const togglePlugin = (pluginId: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === pluginId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const installPlugin = (pluginId: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === pluginId ? { ...p, installed: true, enabled: true } : p))
    );
  };

  const uninstallPlugin = (pluginId: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === pluginId ? { ...p, installed: false, enabled: false } : p))
    );
  };

  const uploadPluginMock = (name: string, sizeMb: number) => {
    const newPlugin: PluginItem = {
      id: `pl-custom-${Date.now()}`,
      name: name.replace('.jar', ''),
      description: 'Custom user-uploaded plugin JAR file.',
      author: 'Custom Upload',
      version: '1.0.0',
      category: 'Gameplay',
      installed: true,
      enabled: true,
      downloads: '1',
      jarSizeMb: sizeMb,
    };
    setPlugins((prev) => [newPlugin, ...prev]);
  };

  // Backup Manager actions
  const createBackup = (serverId: string, name: string) => {
    const newBackup: BackupItem = {
      id: `bk-${Date.now()}`,
      serverId,
      name: `${name}.tar.zst`,
      sizeMb: Math.round(1200 + Math.random() * 400),
      createdAt: 'Just now',
      isAutomatic: false,
      checksum: `sha256:${Math.random().toString(36).substring(2, 12)}...`,
    };
    setBackups((prev) => [newBackup, ...prev]);
  };

  const restoreBackup = (backupId: string) => {
    console.log(`Restoring backup ${backupId}`);
  };

  const deleteBackup = (backupId: string) => {
    setBackups((prev) => prev.filter((b) => b.id !== backupId));
  };

  // Tickets
  const createTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'replies'>) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now,
      updatedAt: now,
      replies: [
        {
          id: `rep-${Date.now()}`,
          authorId: ticketData.userId,
          authorName: ticketData.userName,
          authorRole: 'user',
          message: ticketData.subject,
          timestamp: now,
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const replyToTicket = (
    ticketId: string,
    authorName: string,
    authorRole: 'user' | 'admin' | 'support',
    message: string
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newReply = {
      id: `rep-${Date.now()}`,
      authorId: authorRole === 'user' ? 'usr-demo-01' : 'staff-admin',
      authorName,
      authorRole,
      message,
      timestamp: now,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              updatedAt: now,
              replies: [...t.replies, newReply],
            }
          : t
      )
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: 'Just now' } : t))
    );
  };

  // Admin Controls
  const updatePlan = (planId: string, updates: Partial<HostingPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, ...updates } : p)));
  };

  const createAnnouncement = (title: string, message: string, type: AdminAnnouncement['type']) => {
    const newAnn: AdminAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      message,
      type,
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const updatePterodactylConfig = (config: PterodactylConfig) => {
    setPterodactylConfig(config);
  };

  return (
    <ServerContext.Provider
      value={{
        servers,
        selectedServerId,
        selectedServer,
        setSelectedServerId,
        plans,
        nodes,
        plugins,
        files,
        backups,
        tickets,
        announcements,
        pterodactylConfig,
        isDemoMode: !pterodactylConfig.isConnected,
        startServer,
        stopServer,
        restartServer,
        killServer,
        createServer,
        deleteServer,
        updateServer,
        getFileContent,
        saveFileContent,
        createFileOrFolder,
        deleteFile,
        togglePlugin,
        installPlugin,
        uninstallPlugin,
        uploadPluginMock,
        createBackup,
        restoreBackup,
        deleteBackup,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        updatePlan,
        createAnnouncement,
        deleteAnnouncement,
        updatePterodactylConfig,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};
