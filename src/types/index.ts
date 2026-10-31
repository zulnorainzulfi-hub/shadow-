export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  planId?: string;
  authProvider?: 'email' | 'google';
  googleId?: string;
  aiUsageToday?: number;
  aiDailyQuota?: number;
}

export type ServerSoftware = 'Paper' | 'Purpur' | 'Spigot' | 'Vanilla' | 'Fabric' | 'Forge';

export type ServerStatus = 'online' | 'starting' | 'stopping' | 'offline' | 'suspended';

export interface HostingPlan {
  id: string;
  name: string;
  priceMonthly: number;
  ramGb: number;
  playerSlots: number;
  storageGb: number;
  cpu: string;
  isFree?: boolean;
  badge?: string;
  features: string[];
}

export interface Player {
  uuid: string;
  username: string;
  pingMs: number;
  joinedAt: string;
  role?: string;
}

export interface MinecraftServer {
  id: string;
  name: string;
  ownerId: string;
  planId: string;
  software: ServerSoftware;
  version: string;
  status: ServerStatus;
  ip: string;
  port: number;
  region: string;
  regionFlag: string;
  ramUsageMb: number;
  ramAllocationMb: number;
  cpuUsagePercent: number;
  diskUsageGb: number;
  diskAllocationGb: number;
  playersOnline: number;
  maxPlayers: number;
  uptime: string;
  motd: string;
  autoBackup: boolean;
  createdAt: string;
  players: Player[];
}

export interface ServerFile {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  sizeBytes: number;
  updatedAt: string;
  content?: string;
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  category: 'Administration' | 'Economy' | 'World' | 'Performance' | 'Gameplay' | 'Security';
  installed: boolean;
  enabled: boolean;
  downloads: string;
  jarSizeMb: number;
}

export interface BackupItem {
  id: string;
  serverId: string;
  name: string;
  sizeMb: number;
  createdAt: string;
  isAutomatic: boolean;
  checksum: string;
}

export interface TicketReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'user' | 'admin' | 'support';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Technical' | 'Billing' | 'Server Crash' | 'Plugins' | 'General';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  replies: TicketReply[];
}

export interface HostingNode {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  ip: string;
  pingMs: number;
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
  activeServers: number;
  status: 'online' | 'maintenance' | 'degraded';
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  createdAt: string;
  active: boolean;
}

export interface PterodactylConfig {
  isConnected: boolean;
  panelUrl: string;
  apiKey: string;
  lastSync?: string;
}

export type AiToolMode = 'assistant' | 'logs' | 'plugins' | 'performance' | 'config' | 'commands';

export interface AiActionProposal {
  id: string;
  type: 'apply_config' | 'fix_properties' | 'install_plugin' | 'jvm_flags';
  title: string;
  description: string;
  targetFile?: string;
  content?: string;
  applied?: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionProposal?: AiActionProposal;
  isError?: boolean;
}

export interface LogAnalysisIssue {
  severity: 'CRITICAL' | 'WARNING' | 'NOTICE';
  title: string;
  description: string;
  culprit?: string;
  solution: string;
  autoFixAvailable?: boolean;
  actionProposal?: AiActionProposal;
}

export interface PerformanceTuning {
  category: 'CPU' | 'RAM' | 'CHUNKS' | 'ENTITIES' | 'NETWORK';
  title: string;
  currentValue: string;
  recommendedValue: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  targetConfig: string;
}

// ==========================================
// 25 ADVANCED EXPANSION MODULE TYPES
// ==========================================

export interface LiveMetrics {
  tps: number;
  mspt: number;
  heapUsedMb: number;
  heapMaxMb: number;
  cpuPercent: number;
  playersOnline: number;
  chunksLoaded: number;
  entitiesLoaded: number;
  tileEntities: number;
  packetsInPerSec: number;
  packetsOutPerSec: number;
  gcPauseMs: number;
  networkRxMbps: number;
  networkTxMbps: number;
}

export interface CrashRecoverySettings {
  autoRestartEnabled: boolean;
  watchdogTimeoutSeconds: number;
  crashLoopThreshold: number;
  crashLoopWindowMinutes: number;
  safeBootMode: boolean;
  notifyDiscordWebhook: boolean;
  webhookUrl?: string;
  recentCrashes: {
    id: string;
    timestamp: string;
    culprit: string;
    summary: string;
    recoveryAction: string;
    resolved: boolean;
  }[];
}

export interface CloudBackupItem {
  id: string;
  serverId: string;
  name: string;
  sizeMb: number;
  region: 'Frankfurt-S3' | 'Ashburn-S3' | 'Singapore-S3';
  createdAt: string;
  isEncrypted: boolean;
  isLocked: boolean;
  type: 'Full' | 'Incremental';
  checksum: string;
  storageProvider: 'Shadow Vault S3' | 'Google Cloud Coldline';
}

export interface MarketplaceItem {
  id: string;
  name: string;
  type: 'Map' | 'Plugin' | 'Datapack' | 'Modpack' | 'Config Template';
  category: string;
  author: string;
  rating: number;
  downloads: number;
  version: string;
  testedVersions: string[];
  description: string;
  iconUrl?: string;
  tags: string[];
  featured?: boolean;
  installed?: boolean;
}

export interface SubuserEntry {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'Co-Owner' | 'Operator' | 'Moderator' | 'Viewer';
  invitedAt: string;
  permissions: {
    power: boolean;
    console: boolean;
    files: boolean;
    database: boolean;
    backups: boolean;
    schedules: boolean;
    plugins: boolean;
    subusers: boolean;
  };
  lastActive?: string;
}

export interface StartupConfig {
  startupCommand: string;
  serverJarFile: string;
  idleSleepMode: boolean;
  sleepIdleMinutes: number;
  autoRebootOnCrash: boolean;
  envVariables: { key: string; value: string; isSecret?: boolean }[];
}

export interface WorldDimension {
  id: string;
  name: string;
  type: 'OVERWORLD' | 'NETHER' | 'THE_END' | 'CUSTOM';
  generator: 'DEFAULT' | 'FLAT' | 'AMPLIFIED' | 'LARGE_BIOMES';
  seed: string;
  sizeMb: number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  gameRules: {
    keepInventory: boolean;
    mobGriefing: boolean;
    doDaylightCycle: boolean;
    doFireTick: boolean;
  };
  spawnCoords: { x: number; y: number; z: number };
}

export interface ManagedDatabase {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  sizeMb: number;
  maxConnections: number;
  createdAt: string;
  pluginBinding?: string;
}

export interface ScheduledTask {
  id: string;
  name: string;
  action: 'RESTART' | 'BACKUP' | 'COMMAND' | 'CLEAR_LAG' | 'ANNOUNCEMENT';
  cronExpression: string;
  commandPayload?: string;
  enabled: boolean;
  lastRun?: string;
  nextRun: string;
}

export interface PlayerAnalyticsSummary {
  peakPlayers24h: number;
  averageTps24h: number;
  totalUniqueJoins: number;
  avgSessionMinutes: number;
  retentionDay1: number;
  retentionDay7: number;
  countryDistribution: { country: string; flag: string; percent: number }[];
  hourlyActivity: { hour: string; players: number }[];
  topPlayers: {
    username: string;
    playtimeHours: number;
    joins: number;
    lastSeen: string;
  }[];
}

export interface WhitelistEntry {
  uuid: string;
  username: string;
  addedAt: string;
  addedBy: string;
}

export interface BanEntry {
  id: string;
  type: 'UUID' | 'IP';
  target: string;
  reason: string;
  bannedBy: string;
  bannedAt: string;
  expiresAt?: string;
}

export interface ModpackItem {
  id: string;
  name: string;
  loader: 'Fabric' | 'Forge' | 'NeoForge' | 'Quilt';
  minecraftVersion: string;
  author: string;
  modCount: number;
  recommendedRamGb: number;
  downloads: string;
  description: string;
  bannerUrl: string;
  installed?: boolean;
}

export interface JvmConfig {
  preset: 'Aikar (Recommended)' | 'Extreme TPS (Paper/Purpur)' | 'Velocity / Bungee' | 'Low Memory (ZGC)';
  minRamMb: number;
  maxRamMb: number;
  gcEngine: 'G1GC' | 'ZGC (Ultra Low Latency)' | 'Shenandoah' | 'Parallel';
  customFlags: string;
  largePagesEnabled: boolean;
  parallelRefProc: boolean;
}

export interface MigrationJob {
  id: string;
  sourceProvider: 'Apex' | 'Shockbyte' | 'Bisect' | 'Pterodactyl' | 'Custom SFTP';
  remoteHost: string;
  remotePort: number;
  remoteUser: string;
  remotePath: string;
  status: 'PENDING' | 'CONNECTING' | 'TRANSFERRING' | 'EXTRACTING' | 'COMPLETED' | 'FAILED';
  progressPercent: number;
  speedMbps: number;
  filesTransferred: number;
  totalSizeMb: number;
  logs: string[];
}

export interface ReferralSummary {
  code: string;
  referralUrl: string;
  totalClicks: number;
  totalSignups: number;
  activeServersReferred: number;
  totalEarningsUsd: number;
  availableBalanceUsd: number;
  claimedUpgrades: string[];
}

export interface MaintenanceConfig {
  enabled: boolean;
  motdText: string;
  kickReason: string;
  countdownMinutes: number;
  countdownActive: boolean;
  whitelistedStaff: string[];
}

export interface SecuritySettings {
  shieldProtectionActive: boolean;
  log4jExploitFilter: boolean;
  nullPingScrubbing: boolean;
  antiBotRateLimit: boolean;
  rconIpWhitelistEnabled: boolean;
  rconAllowedIps: string[];
  enforceTwoFactorStaff: boolean;
  auditLogs: {
    id: string;
    timestamp: string;
    event: string;
    severity: 'INFO' | 'WARN' | 'BLOCKED';
    ip: string;
    user: string;
  }[];
}

