import {
  HostingPlan,
  HostingNode,
  MinecraftServer,
  PluginItem,
  ServerFile,
  BackupItem,
  SupportTicket,
  User,
  AdminAnnouncement,
} from '../types';

export const INITIAL_PLANS: HostingPlan[] = [
  {
    id: 'plan-free',
    name: 'FREE PLAN',
    priceMonthly: 0,
    ramGb: 8,
    playerSlots: 50,
    storageGb: 20,
    cpu: 'Shared AMD Ryzen 9 7950X3D',
    isFree: true,
    badge: '100% FREE FOREVER',
    features: [
      '8 GB High-Speed DDR5 RAM',
      '50 Guaranteed Player Slots',
      '20 GB NVMe Gen4 Storage',
      'Minecraft Java Support',
      'Paper, Purpur, Spigot & Vanilla',
      'Full Plugin & Mod Support',
      'Real-Time Web Server Console',
      'Full Web File Manager & Editor',
      'Basic Automated Backups',
      'No Credit Card Required',
    ],
  },
  {
    id: 'plan-pro',
    name: 'PRO PLAN',
    priceMonthly: 3.99,
    ramGb: 12,
    playerSlots: 100,
    storageGb: 40,
    cpu: 'Dedicated 3 vCPU @ 5.7 GHz',
    badge: 'MOST POPULAR',
    features: [
      '12 GB High-Speed DDR5 RAM',
      '100 Player Slots Capacity',
      '40 GB NVMe Gen4 Storage',
      'Better Dedicated CPU Allocation',
      'Priority 24/7 Support Queue',
      'Advanced Daily Backups',
      'Plugin & Forge / Fabric Mod Support',
      'DDoS Scrubbing by CosmicGuard',
      'Custom Subdomain (*.shadow.host)',
      'Sub-User Permissions Manager',
    ],
  },
  {
    id: 'plan-premium',
    name: 'PREMIUM PLAN',
    priceMonthly: 7.99,
    ramGb: 16,
    playerSlots: 200,
    storageGb: 80,
    cpu: 'High Performance 5 vCPU',
    badge: 'COMMUNITY CHOICE',
    features: [
      '16 GB High-Speed DDR5 RAM',
      '200 Player Slots Capacity',
      '80 GB Enterprise NVMe Storage',
      'High-Performance CPU Allocation',
      'Advanced Server Management & RCON',
      'Hourly Automated Cloud Snapshots',
      'Priority Discord & Ticket Support',
      'Bedrock Crossplay (GeyserMC Pre-tuned)',
      'MySQL / MariaDB Free Database',
      'Unlimited Dynmap & World Rendering',
    ],
  },
  {
    id: 'plan-ultimate',
    name: 'ULTIMATE PLAN',
    priceMonthly: 14.99,
    ramGb: 24,
    playerSlots: 500,
    storageGb: 120,
    cpu: 'Premium 8 vCPU Core Pool',
    badge: 'ENTERPRISE POWER',
    features: [
      '24 GB High-Speed DDR5 RAM',
      '500 Maximum Player Capacity',
      '120 GB Enterprise NVMe Gen4',
      'Premium Extreme CPU Priority',
      'Instant VIP Support Dispatch',
      'Multi-Region Hot Failover',
      'Advanced 3.2 Tbps DDoS Armor',
      'Full Root Access via SFTP & RCON',
      'Custom Dedicated IP Address Included',
      'Maximum Management Features',
    ],
  },
];

export const INITIAL_NODES: HostingNode[] = [
  {
    id: 'node-de-01',
    name: 'Frankfurt-Alpha (DE-01)',
    city: 'Frankfurt',
    country: 'Germany',
    flag: '🇩🇪',
    ip: '141.95.120.4',
    pingMs: 14,
    cpuPercent: 28,
    ramPercent: 42,
    diskPercent: 35,
    activeServers: 412,
    status: 'online',
  },
  {
    id: 'node-us-01',
    name: 'Ashburn-Core (US-01)',
    city: 'Ashburn, VA',
    country: 'United States',
    flag: '🇺🇸',
    ip: '198.51.100.22',
    pingMs: 24,
    cpuPercent: 34,
    ramPercent: 51,
    diskPercent: 40,
    activeServers: 680,
    status: 'online',
  },
  {
    id: 'node-sg-01',
    name: 'Singapore-Nexus (SG-01)',
    city: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    ip: '103.253.14.88',
    pingMs: 38,
    cpuPercent: 22,
    ramPercent: 38,
    diskPercent: 29,
    activeServers: 295,
    status: 'online',
  },
  {
    id: 'node-in-01',
    name: 'Mumbai-Gateway (IN-01)',
    city: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    ip: '115.240.90.12',
    pingMs: 31,
    cpuPercent: 25,
    ramPercent: 39,
    diskPercent: 32,
    activeServers: 340,
    status: 'online',
  },
];

export const DEMO_USER: User = {
  id: 'usr-demo-01',
  name: 'Alex Mercer',
  email: 'alex@shadowhost.io',
  role: 'user', // Can be toggled to 'admin' in UI
  createdAt: '2026-01-15',
  planId: 'plan-free',
  authProvider: 'email',
  aiUsageToday: 3,
  aiDailyQuota: 25,
};

export const INITIAL_SERVERS: MinecraftServer[] = [
  {
    id: 'srv-shadow-smp',
    name: 'ShadowSMP Community',
    ownerId: 'usr-demo-01',
    planId: 'plan-free',
    software: 'Paper',
    version: '1.21.4',
    status: 'online',
    ip: 'shadowsmp.shadow.host',
    port: 25565,
    region: 'Frankfurt, Germany',
    regionFlag: '🇩🇪',
    ramUsageMb: 3420,
    ramAllocationMb: 8192,
    cpuUsagePercent: 24,
    diskUsageGb: 6.8,
    diskAllocationGb: 20,
    playersOnline: 18,
    maxPlayers: 50,
    uptime: '14d 06h 41m',
    motd: '§d§lSHADOW HOST §8» §fFree Community SMP §7[1.21.4]',
    autoBackup: true,
    createdAt: '2026-02-01',
    players: [
      { uuid: 'p1', username: 'Krypton7', pingMs: 14, joinedAt: '1h 12m ago' },
      { uuid: 'p2', username: 'VoxelGhost', pingMs: 19, joinedAt: '43m ago' },
      { uuid: 'p3', username: 'RedstoneMech', pingMs: 24, joinedAt: '2h 05m ago' },
      { uuid: 'p4', username: 'NetherWalker_99', pingMs: 27, joinedAt: '15m ago' },
      { uuid: 'p5', username: 'AetherKnight', pingMs: 31, joinedAt: '3h 40m ago' },
    ],
  },
  {
    id: 'srv-forge-bunker',
    name: 'Redstone Warfare Lab',
    ownerId: 'usr-demo-01',
    planId: 'plan-pro',
    software: 'Purpur',
    version: '1.21.1',
    status: 'online',
    ip: 'warfare.shadow.host',
    port: 25577,
    region: 'Ashburn, VA, United States',
    regionFlag: '🇺🇸',
    ramUsageMb: 4610,
    ramAllocationMb: 12288,
    cpuUsagePercent: 19,
    diskUsageGb: 12.4,
    diskAllocationGb: 40,
    playersOnline: 8,
    maxPlayers: 100,
    uptime: '6d 18h 12m',
    motd: '§3High-Tech Automation & Cannon Testing Ground',
    autoBackup: true,
    createdAt: '2026-02-14',
    players: [
      { uuid: 'p6', username: 'CipherTech', pingMs: 18, joinedAt: '5h 11m ago' },
      { uuid: 'p7', username: 'ObsidianBaron', pingMs: 22, joinedAt: '1h 50m ago' },
    ],
  },
];

export const INITIAL_FILES: Record<string, ServerFile[]> = {
  'srv-shadow-smp': [
    {
      id: 'f-1',
      name: 'server.properties',
      path: '/server.properties',
      isDirectory: false,
      sizeBytes: 1240,
      updatedAt: 'Today at 04:12',
      content: `#Minecraft server properties
#Generated by SHADOW HOST Engine
enable-jmx-monitoring=false
rcon.port=25575
level-seed=4892184918239012481
gamemode=survival
enable-command-block=false
enable-query=true
generator-settings=
level-name=world
motd=\\u00a7d\\u00a7lSHADOW HOST \\u00a78\\u00bb \\u00a7fFree Community SMP \\u00a77[1.21.4]
query.port=25565
pvp=true
generate-structures=true
difficulty=hard
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false
max-players=50
use-native-transport=true
online-mode=true
enable-status=true
allow-flight=false
broadcast-rcon-to-ops=false
view-distance=10
server-ip=
resource-pack-prompt=
allow-nether=true
server-port=25565
enable-rcon=true
sync-chunk-writes=true
op-permission-level=4
prevent-proxy-connections=false
simulation-distance=8
rcon.password=ShadowSecureRcon2026
player-idle-timeout=0
force-gamemode=false
rate-limit=0`,
    },
    {
      id: 'f-2',
      name: 'bukkit.yml',
      path: '/bukkit.yml',
      isDirectory: false,
      sizeBytes: 2840,
      updatedAt: 'Yesterday at 20:01',
      content: `# Bukkit configuration file
settings:
  allow-end: true
  warn-on-overload: true
  permissions-file: permissions.yml
  update-folder: update
  plugin-profiling: false
  connection-throttle: 4000
  query-plugins: true
spawn-limits:
  monsters: 70
  animals: 10
  water-animals: 5
  ambient: 15
chunk-gc:
  period-in-ticks: 600`,
    },
    {
      id: 'f-3',
      name: 'spigot.yml',
      path: '/spigot.yml',
      isDirectory: false,
      sizeBytes: 3120,
      updatedAt: '3 days ago',
      content: `# Spigot configuration
config-version: 12
settings:
  save-user-cache-on-stop-only: false
  bungeecord: false
  sample-count: 12
  user-cache-size: 1000
messages:
  whitelist: You are not whitelisted on this server!
  unknown-command: Unknown command. Type "/help" for help.
  restart: Server is restarting`,
    },
    {
      id: 'f-4',
      name: 'paper-global.yml',
      path: '/paper-global.yml',
      isDirectory: false,
      sizeBytes: 4500,
      updatedAt: '4 days ago',
      content: `# Paper Global Configuration
proxies:
  velocity:
    enabled: false
    online-mode: true
    secret: ''
timings:
  enabled: true
  verbose: true
  server-name: ShadowSMP`,
    },
    {
      id: 'f-5',
      name: 'eula.txt',
      path: '/eula.txt',
      isDirectory: false,
      sizeBytes: 180,
      updatedAt: '2026-02-01',
      content: `#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).
eula=true`,
    },
    {
      id: 'f-folder-plugins',
      name: 'plugins',
      path: '/plugins',
      isDirectory: true,
      sizeBytes: 4096,
      updatedAt: 'Today at 05:00',
    },
    {
      id: 'f-folder-world',
      name: 'world',
      path: '/world',
      isDirectory: true,
      sizeBytes: 4096,
      updatedAt: '10m ago',
    },
    {
      id: 'f-folder-logs',
      name: 'logs',
      path: '/logs',
      isDirectory: true,
      sizeBytes: 4096,
      updatedAt: '1m ago',
    },
  ],
};

export const INITIAL_PLUGINS: PluginItem[] = [
  {
    id: 'pl-luckperms',
    name: 'LuckPerms',
    description: 'An advanced permissions plugin for Minecraft servers with web editor and fast caching.',
    author: 'Luck',
    version: '5.4.102',
    category: 'Administration',
    installed: true,
    enabled: true,
    downloads: '18.4M',
    jarSizeMb: 4.8,
  },
  {
    id: 'pl-essentialsx',
    name: 'EssentialsX',
    description: 'The essential plugin suite providing teleportation, homes, warps, kits, and 100+ admin commands.',
    author: 'EssentialsX Team',
    version: '2.20.1',
    category: 'Administration',
    installed: true,
    enabled: true,
    downloads: '26.1M',
    jarSizeMb: 5.2,
  },
  {
    id: 'pl-worldedit',
    name: 'WorldEdit',
    description: 'In-game Minecraft map editor and fast voxel building utility.',
    author: 'EngineHub',
    version: '7.3.0',
    category: 'World',
    installed: true,
    enabled: true,
    downloads: '32.9M',
    jarSizeMb: 7.1,
  },
  {
    id: 'pl-vault',
    name: 'Vault',
    description: 'Permission, chat, and economy API to bridge multiple plugins cleanly.',
    author: 'Sleakes',
    version: '1.7.3',
    category: 'Economy',
    installed: true,
    enabled: true,
    downloads: '29.3M',
    jarSizeMb: 0.4,
  },
  {
    id: 'pl-dynmap',
    name: 'Dynmap',
    description: 'Real-time Google Maps style live web browser map of your Minecraft worlds.',
    author: 'mikeprimm',
    version: '3.7-beta-6',
    category: 'World',
    installed: false,
    enabled: false,
    downloads: '14.2M',
    jarSizeMb: 18.5,
  },
  {
    id: 'pl-geysermc',
    name: 'GeyserMC',
    description: 'A bridge/proxy enabling Minecraft Bedrock edition players to join Java Edition servers seamlessly.',
    author: 'GeyserMC Team',
    version: '2.4.2',
    category: 'Gameplay',
    installed: true,
    enabled: true,
    downloads: '9.8M',
    jarSizeMb: 12.1,
  },
  {
    id: 'pl-spark',
    name: 'Spark Profiler',
    description: 'Next-gen performance profiler for paper/spigot tick loop, CPU, and heap analysis.',
    author: 'lucko',
    version: '1.10.53',
    category: 'Performance',
    installed: true,
    enabled: true,
    downloads: '6.4M',
    jarSizeMb: 3.1,
  },
  {
    id: 'pl-viaversion',
    name: 'ViaVersion',
    description: 'Allows newer Minecraft client versions to connect to older server versions seamlessly.',
    author: 'Myles',
    version: '5.0.1',
    category: 'Gameplay',
    installed: false,
    enabled: false,
    downloads: '19.7M',
    jarSizeMb: 4.2,
  },
  {
    id: 'pl-chunky',
    name: 'Chunky',
    description: 'High-performance world pre-generation tool to eliminate player movement stutter and lag spikes.',
    author: 'pop4959',
    version: '1.4.16',
    category: 'Performance',
    installed: false,
    enabled: false,
    downloads: '3.8M',
    jarSizeMb: 0.8,
  },
  {
    id: 'pl-griefprevention',
    name: 'GriefPrevention',
    description: 'Self-service land claims with a golden shovel. Zero database setup needed.',
    author: 'RoboMWM',
    version: '16.18.2',
    category: 'Security',
    installed: false,
    enabled: false,
    downloads: '11.5M',
    jarSizeMb: 1.1,
  },
];

export const INITIAL_BACKUPS: BackupItem[] = [
  {
    id: 'bk-01',
    serverId: 'srv-shadow-smp',
    name: 'world_auto_snapshot_20261031.tar.zst',
    sizeMb: 1420.5,
    createdAt: 'Today at 04:00',
    isAutomatic: true,
    checksum: 'sha256:7f83b1657ff10982aa41',
  },
  {
    id: 'bk-02',
    serverId: 'srv-shadow-smp',
    name: 'pre_plugin_upgrade_backup.tar.zst',
    sizeMb: 1395.2,
    createdAt: 'Yesterday at 18:30',
    isAutomatic: false,
    checksum: 'sha256:32d184a92bc491fa02e1',
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-1042',
    userId: 'usr-demo-01',
    userName: 'Alex Mercer',
    userEmail: 'alex@shadowhost.io',
    subject: 'Port allocation for Bedrock Geyser UDP mapping',
    category: 'Technical',
    priority: 'Medium',
    status: 'Resolved',
    createdAt: '2026-02-18 14:22',
    updatedAt: '2026-02-18 15:40',
    replies: [
      {
        id: 'rep-1',
        authorId: 'usr-demo-01',
        authorName: 'Alex Mercer',
        authorRole: 'user',
        message: 'Hello, I enabled the GeyserMC plugin. Does the Bedrock UDP port automatically map to 19132 or should I specify a custom port in config.yml?',
        timestamp: '2026-02-18 14:22',
      },
      {
        id: 'rep-2',
        authorId: 'staff-01',
        authorName: 'Shadow Host Support (Mark)',
        authorRole: 'support',
        message: 'Hi Alex! On our nodes, port 19132 is reserved for Bedrock. You can set clone-remote-port: true in Geyser config.yml, and your Bedrock players can join using your standard server IP with default port 19132.',
        timestamp: '2026-02-18 15:40',
      },
    ],
  },
  {
    id: 'tkt-1055',
    userId: 'usr-demo-01',
    userName: 'Alex Mercer',
    userEmail: 'alex@shadowhost.io',
    subject: 'Java 21 GC optimization recommendation for Paper',
    category: 'Technical',
    priority: 'Low',
    status: 'Open',
    createdAt: '2026-02-28 09:15',
    updatedAt: '2026-02-28 09:15',
    replies: [
      {
        id: 'rep-3',
        authorId: 'usr-demo-01',
        authorName: 'Alex Mercer',
        authorRole: 'user',
        message: 'Are Aikar flags pre-applied by default on the Paper 1.21.4 container?',
        timestamp: '2026-02-28 09:15',
      },
    ],
  },
];

export const DEMO_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Marcus V.',
    role: 'Server Owner, VoxelCraft Network',
    quote: 'The 8 GB Free Plan is ridiculously good. We migrated 40 players from a paid host and the tick rate is literally pinned at 20.0 TPS with zero lag.',
    stars: 5,
    serversRunning: 3,
  },
  {
    id: 'test-2',
    name: 'Elena Rostova',
    role: 'Head Developer, Elysium SMP',
    quote: 'The web console and instant file editor make configuring PaperMC a breeze. Best Minecraft host interface we have used in 7 years of hosting.',
    stars: 5,
    serversRunning: 2,
  },
  {
    id: 'test-3',
    name: 'Devin K.',
    role: 'Modpack Curator, ForgeWorld',
    quote: 'Customer support answered in 12 minutes when we needed custom JVM flags. Upgrading to Ultimate took 2 seconds with zero downtime.',
    stars: 5,
    serversRunning: 6,
  },
];

export const FAQS = [
  {
    q: 'Is the Free Plan truly 100% free forever?',
    a: 'Yes! Our Free Plan provides 8 GB of DDR5 ECC RAM, 50 player slots, 20 GB NVMe storage, and full access to our web console, file manager, and backups with no credit card required and no hidden renewal charges.',
  },
  {
    q: 'Can I install my own plugins and custom modpacks?',
    a: 'Absolutely. You have full access to our 1-click Plugin Manager, as well as SFTP and our Web File Manager to upload custom .jar files, datapacks, mods, and world saves.',
  },
  {
    q: 'How does DDoS protection work on Shadow Host nodes?',
    a: 'All our hardware clusters are fortified by CosmicGuard 3.2 Tbps Anycast scrubbing. Volumetric layer 4 and complex layer 7 attacks targeting Minecraft query or handshake protocols are mitigated automatically with zero latency penalties.',
  },
  {
    q: 'How do I connect my real Pterodactyl Panel API?',
    a: 'Inside your Server Settings or Admin Panel, navigate to Pterodactyl Integration. Enter your Panel URL and Client API key to transition from our Simulated Engine directly into your live physical node cluster.',
  },
  {
    q: 'Which Minecraft server software flavors are supported?',
    a: 'We support Paper, Purpur, Spigot, Vanilla, Fabric, and Forge across all versions from Minecraft 1.8 up to the latest 1.21.4 snapshot builds.',
  },
];

export const INITIAL_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'PaperMC 1.21.4 Build #184 Available',
    message: 'All nodes have been updated with latest Paper 1.21.4 security patches and chunk generation optimizations.',
    type: 'info',
    createdAt: '2026-02-25',
    active: true,
  },
  {
    id: 'ann-2',
    title: 'Free Plan Memory Boost Active',
    message: 'Free community tier is running on 8 GB DDR5 ECC allocations with zero credit card requirements.',
    type: 'success',
    createdAt: '2026-02-01',
    active: true,
  },
];
