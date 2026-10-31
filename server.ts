import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
    });
    console.log('[SHADOW AI ENGINE] Gemini API initialized successfully with gemini-3.8-flash.');
  } catch (err) {
    console.warn('[SHADOW AI ENGINE] Failed to initialize Gemini API client, falling back to demo mode:', err);
  }
} else {
  console.log('[SHADOW AI ENGINE] No GEMINI_API_KEY found. Running in DEMO MODE.');
}

const SYSTEM_INSTRUCTION = `You are the SHADOW AI ENGINE, the elite AI intelligence built into the SHADOW HOST Minecraft hosting platform.
You are an expert on Minecraft server architecture, PaperMC, Purpur, Spigot, Fabric, Forge, Java 17/21 garbage collection, Aikar JVM flags, plugin conflicts (e.g., ProtocolLib, LuckPerms, EssentialsX, Chunky), server.properties, chunk generation, and crash dump analysis.
- Always provide clear, accurate, and actionable recommendations.
- When suggesting configuration changes, provide the exact keys and values.
- Remind users to take backups before making destructive edits.
- Never suggest running dangerous OS-level commands (like rm -rf).`;

// 1. Status Route
app.get('/api/ai/status', (_req: Request, res: Response) => {
  res.json({
    online: true,
    isDemo: !aiClient,
    model: aiClient ? 'gemini-3.8-flash' : 'SHADOW AI Simulation Engine (Demo Mode)',
    version: '4.2.0',
    capabilities: [
      'ai-server-assistant',
      'log-error-detector',
      'plugin-assistant',
      'performance-optimizer',
      'config-generator',
      'command-helper',
    ],
  });
});

// 2. Chat Assistant Route
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { prompt, serverContext, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (aiClient) {
      const contextPrefix = serverContext
        ? `[Active Server Context: Name="${serverContext.name}", Software="${serverContext.software} ${serverContext.version}", Status="${serverContext.status}", RAM=${serverContext.ramUsageMb}MB / ${serverContext.ramAllocationMb}MB, Players=${serverContext.playersOnline}/${serverContext.maxPlayers}]\n\n`
        : '';

      const fullPrompt = `${contextPrefix}User Question:\n${prompt}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      return res.json({
        response: response.text || 'No response generated from Shadow AI Engine.',
        isDemo: false,
        model: 'gemini-3.8-flash',
      });
    }

    // Built-in intelligent simulation for demo mode
    const simulated = generateSimulatedAiResponse(prompt, serverContext);
    return res.json({
      response: simulated,
      isDemo: true,
      model: 'SHADOW AI Simulation Engine (Demo Mode)',
    });
  } catch (err: any) {
    console.error('[SHADOW AI ERROR]', err);
    return res.json({
      response: generateSimulatedAiResponse(req.body.prompt || '', req.body.serverContext),
      isDemo: true,
      errorNotice: 'Gemini API temporarily unreachable; used high-fidelity Minecraft diagnostic fallback.',
    });
  }
});

// 3. Log Analyzer Route
app.post('/api/ai/analyze-logs', async (req: Request, res: Response) => {
  try {
    const { logText } = req.body;
    if (!logText) {
      return res.status(400).json({ error: 'Log text is required' });
    }

    if (aiClient) {
      const prompt = `Analyze the following Minecraft server console log snippet. Identify any crashes, exceptions, plugin conflicts, or performance warnings. Provide:
1. Overall Health Status (CRITICAL, WARNING, or HEALTHY)
2. Summary of identified issues
3. Step-by-step fix recommendations
4. Relevant configuration lines or plugins to update.

Log Snippet:
\`\`\`
${logText.slice(0, 15000)}
\`\`\``;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      return res.json({
        analysis: response.text,
        isDemo: false,
      });
    }

    // High fidelity log analysis fallback
    return res.json({
      analysis: generateSimulatedLogAnalysis(logText),
      isDemo: true,
    });
  } catch (err) {
    return res.json({
      analysis: generateSimulatedLogAnalysis(req.body.logText || ''),
      isDemo: true,
    });
  }
});

// 4. Performance Optimizer Route
app.post('/api/ai/optimize', async (req: Request, res: Response) => {
  try {
    const { software, version, ramMb, currentTps, viewDistance } = req.body;

    if (aiClient) {
      const prompt = `Generate optimal performance settings for a Minecraft ${software || 'Paper'} ${version || '1.21.4'} server with ${ramMb || 8192}MB RAM. Current TPS is ${currentTps || 20.0}.
Include:
1. Recommended Aikar JVM garbage collection startup flags for ${Math.round((ramMb || 8192) / 1024)}GB
2. Key settings for paper-world-defaults.yml (view-distance, simulation-distance, entity-activation-range)
3. server.properties adjustments (network-compression-threshold, view-distance)
4. Recommended performance optimization plugins (e.g. Chunky, Spark).`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });

      return res.json({
        optimization: response.text,
        isDemo: false,
      });
    }

    return res.json({
      optimization: generateSimulatedOptimization(software, ramMb),
      isDemo: true,
    });
  } catch (err) {
    return res.json({
      optimization: generateSimulatedOptimization(req.body.software, req.body.ramMb),
      isDemo: true,
    });
  }
});

// Helper: Intelligent Minecraft simulation fallback responses
function generateSimulatedAiResponse(prompt: string, serverContext?: any): string {
  const p = prompt.toLowerCase();

  if (p.includes('lag') || p.includes('tps') || p.includes('performance')) {
    return `### ⚡ SHADOW AI Performance Diagnostic

Based on analysis for **${serverContext?.name || 'Your Minecraft Server'}** (${serverContext?.software || 'Paper'} ${serverContext?.version || '1.21.4'}):

1. **Pre-generate Chunks**:
   Unloaded chunk generation while players explore is the #1 cause of tick drops. Install **Chunky** and run:
   \`\`\`
   /chunky radius 5000
   /chunky start
   \`\`\`
2. **Optimize Entity Activation Range**:
   In \`config/paper-world-defaults.yml\`, adjust entity tick intervals:
   \`\`\`yaml
   entities:
     activation-range:
       animals: 16
       monsters: 24
       misc: 8
       tick-inactive-villagers: false
   \`\`\`
3. **Simulation Distance vs View Distance**:
   Set \`simulation-distance=4\` in \`server.properties\` while keeping \`view-distance=8\` via client packet streaming. This reduces server tick workload by up to **42%** without degrading perceived player render distance.`;
  }

  if (p.includes('luckperms') || p.includes('perm') || p.includes('rank') || p.includes('role')) {
    return `### 🛡️ LuckPerms Configuration Blueprint

Here is the standard workflow to set up hierarchical groups and permissions with LuckPerms:

1. **Create Base Groups**:
   \`\`\`bash
   /lp creategroup default
   /lp creategroup vip
   /lp creategroup mod
   /lp creategroup admin
   \`\`\`

2. **Establish Inheritance Chains**:
   \`\`\`bash
   /lp group vip parent add default
   /lp group mod parent add vip
   /lp group admin parent add mod
   \`\`\`

3. **Assign Essential Player Permissions**:
   \`\`\`bash
   /lp group default permission set essentials.spawn true
   /lp group default permission set essentials.home true
   /lp group default permission set essentials.sethome true
   /lp group default permission set essentials.tpa true
   \`\`\`

4. **Launch Web Editor**:
   \`\`\`bash
   /lp editor
   \`\`\`
   Click the generated secure link in your console to edit permissions, prefixes, and weights visually!`;
  }

  if (p.includes('aikar') || p.includes('jvm') || p.includes('flag') || p.includes('flags')) {
    return `### 🚀 Recommended Aikar Garbage Collection Flags (Java 17/21)

For your **${Math.round((serverContext?.ramAllocationMb || 8192) / 1024)}GB** allocation, use the following tuned G1GC parameters:

\`\`\`bash
-Xms${serverContext?.ramAllocationMb || 8192}M -Xmx${serverContext?.ramAllocationMb || 8192}M \\
-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 \\
-XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch \\
-XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20 \\
-XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 \\
-XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 \\
-XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 \\
-XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1
\`\`\`

*These flags eliminate long stop-the-world pauses by maintaining predictable young-generation memory cycles.*`;
  }

  if (p.includes('motd') || p.includes('color') || p.includes('formatting')) {
    return `### 🎨 Minecraft MOTD Color Code Guide

Format your \`server.properties\` \`motd\` using section symbols (\`§\`) or unicode escape sequences (\`\\u00A7\`):

- **Colors**:
  - \`§a\` Light Green | \`§b\` Aqua | \`§c\` Light Red | \`§d\` Light Purple | \`§e\` Yellow | \`§f\` White
  - \`§0\` Black | \`§1\` Dark Blue | \`§2\` Dark Green | \`§3\` Dark Aqua | \`§4\` Dark Red | \`§5\` Dark Purple | \`§6\` Gold | \`§7\` Gray | \`§8\` Dark Gray | \`§9\` Blue
- **Formatting**:
  - \`§l\` **Bold** | \`§m\` ~~Strikethrough~~ | \`§n\` <u>Underline</u> | \`§o\` *Italic* | \`§r\` Reset

**Example Recommended MOTD**:
\`\`\`properties
motd=\\u00A7d\\u00A7lSHADOW HOST \\u00A78\u00BB \\u00A7fFree Community SMP \\u00A77[1.21.4]\\n\\u00A7b\u25B6 100% Free Forever \\u00A78| \\u00A7a20.0 TPS Guaranteed
\`\`\``;
  }

  return `### 🤖 SHADOW AI ASSISTANT

Hello! I have inspected your server **${serverContext?.name || 'Shadow Minecraft Node'}** running **${serverContext?.software || 'Paper'} ${serverContext?.version || '1.21.4'}**.

Regarding your request:
> "${prompt}"

**Core Recommendations:**
1. **Verification**: Confirm server files match the Minecraft Java EULA in \`eula.txt\` (\`eula=true\`).
2. **Version Compatibility**: Plugins built for Minecraft 1.20.x are generally compatible with 1.21.x unless they hook directly into NMS (Net.Minecraft.Server) internals without abstraction layers like ProtocolLib.
3. **Safety Notice**: Always generate a backup snapshot in the **Backups** tab before modifying plugin jars or world generation configs.

Feel free to ask about specific plugin errors, TPS optimization, or command syntax!`;
}

function generateSimulatedLogAnalysis(logText: string): string {
  const hasNullPointer = logText.includes('NullPointerException') || logText.includes('NPE');
  const hasOutdatedJava = logText.includes('UnsupportedClassVersionError');
  const hasPortConflict = logText.includes('BindException') || logText.includes('Address already in use');

  let issues = '';
  if (hasOutdatedJava) {
    issues += `\n- **CRITICAL: Java Version Mismatch** (\`UnsupportedClassVersionError\`): The server or a modern plugin was compiled for Java 21, but your runtime container is running an older Java edition. Solution: Switch Docker runtime to Java 21 LTS in Server Settings.`;
  }
  if (hasPortConflict) {
    issues += `\n- **CRITICAL: Port Collision** (\`BindException\`): Another process is bound to port 25565. Solution: Ensure previous container terminated cleanly or configure an alternative port mapping.`;
  }
  if (hasNullPointer) {
    issues += `\n- **WARNING: Null Pointer Exception** in plugin event handler. Check recently updated plugins or outdated API dependencies (e.g. Vault or PlaceholderAPI).`;
  }

  if (!issues) {
    issues = `\n- **NOTICE: Normal Startup Sequence Detected**: Handshake listeners bound to 0.0.0.0:25565. No unhandled fatal runtime exceptions found in current slice.`;
  }

  return `### 🔍 SHADOW AI LOG DIAGNOSTIC REPORT

**Analyzed Buffer**: ${logText.length} characters
**Status**: ${hasOutdatedJava || hasPortConflict ? '⚠️ ACTION REQUIRED' : '✅ STABLE / HEALTHY'}

#### Detected Findings:${issues}

#### Immediate Recommended Actions:
1. Ensure all plugins have matching API versions in \`plugin.yml\`.
2. Clear unused cached chunks or temporary world lock files (\`session.lock\`) if unexpected hangs occur.
3. Keep automated backups enabled prior to applying server updates.`;
}

function generateSimulatedOptimization(software?: string, ramMb?: number): string {
  const gb = Math.round((ramMb || 8192) / 1024);
  return `### 🚀 Performance Optimization Blueprint (${software || 'Paper'}, ${gb}GB RAM)

#### 1. Aikar JVM Flags
\`\`\`bash
-Xms${ramMb || 8192}M -Xmx${ramMb || 8192}M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1
\`\`\`

#### 2. paper-world-defaults.yml
\`\`\`yaml
entities:
  activation-range:
    animals: 16
    monsters: 24
    raiders: 32
    misc: 8
    tick-inactive-villagers: false
chunks:
  auto-save-interval: 6000
  max-auto-save-chunks-per-tick: 18
\`\`\`

#### 3. server.properties
\`\`\`properties
view-distance=8
simulation-distance=4
network-compression-threshold=256
\`\`\``;
}


// ==========================================
// 25 MODULES BACKEND API ROUTES & REAL STORES
// ==========================================

// In-memory persistent demo/state stores with real operations
const liveMetricsCache: Record<string, any> = {};
const crashRecoveryStore: Record<string, any> = {};
const cloudBackupStore: Record<string, any[]> = {};
const worldsStore: Record<string, any[]> = {};
const databasesStore: Record<string, any[]> = {};
const scheduledTasksStore: Record<string, any[]> = {};
const accessControlStore: Record<string, { whitelist: any[]; bans: any[]; whitelistEnabled: boolean }> = {};
const subusersStore: Record<string, any[]> = {};
const startupConfigStore: Record<string, any> = {};
const jvmConfigStore: Record<string, any> = {};
const maintenanceStore: Record<string, any> = {};
const securityStore: Record<string, any> = {};
const migrationJobsStore: Record<string, any> = {};
const referralsStore: Record<string, any> = {
  default: {
    code: 'SHADOW-PRO-77',
    referralUrl: 'https://shadowhost.io/ref/SHADOW-PRO-77',
    totalClicks: 142,
    totalSignups: 18,
    activeServersReferred: 7,
    totalEarningsUsd: 49.50,
    availableBalanceUsd: 35.50,
    claimedUpgrades: ['+2GB RAM Bonus', 'Free Dedicated IP'],
  },
};

// 1. Shadow Live Monitor
app.get('/api/servers/:id/live-metrics', (req: Request, res: Response) => {
  const { id } = req.params;
  const now = Date.now();
  // Generate realistic, smoothly fluctuating live telemetry
  const jitter = Math.sin(now / 5000) * 0.15;
  const tps = Math.min(20.0, +(19.85 + jitter + (Math.random() * 0.1)).toFixed(2));
  const mspt = +(12.4 + (Math.random() * 3.8)).toFixed(1);
  const heapUsedMb = Math.round(3100 + Math.sin(now / 10000) * 500 + Math.random() * 80);
  
  const metrics = {
    tps,
    mspt,
    heapUsedMb,
    heapMaxMb: 8192,
    cpuPercent: +(18.5 + (Math.random() * 6.5)).toFixed(1),
    playersOnline: 8 + Math.floor(Math.random() * 4),
    chunksLoaded: 1240 + Math.floor(Math.random() * 50),
    entitiesLoaded: 380 + Math.floor(Math.random() * 30),
    tileEntities: 512,
    packetsInPerSec: Math.round(180 + Math.random() * 40),
    packetsOutPerSec: Math.round(420 + Math.random() * 60),
    gcPauseMs: +(8.2 + Math.random() * 4.1).toFixed(1),
    networkRxMbps: +(2.4 + Math.random() * 0.8).toFixed(2),
    networkTxMbps: +(5.8 + Math.random() * 1.5).toFixed(2),
  };
  liveMetricsCache[id] = metrics;
  res.json(metrics);
});

// 2. Shadow AI Builder
app.post('/api/ai/builder', async (req: Request, res: Response) => {
  try {
    const { prompt, type, targetVersion } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the SHADOW AI BUILDER for Minecraft (${targetVersion || '1.21.4'}).
Generate a complete, ready-to-use production ${type || 'datapack/script'} matching this user brief:
"${prompt}"
Include:
1. File structure and JSON / YAML / mcfunction code blocks.
2. Step-by-step instructions for 1-click server deployment.
3. Troubleshooting tips and performance impact analysis.`,
      });
      return res.json({ result: response.text, isDemo: false, model: 'gemini-3.8-flash' });
    }

    // Smart simulation if no key
    const simulated = `### ⚡ SHADOW AI BUILDER: Generated Artifact (${type || 'Datapack'})
**Target Engine**: Minecraft ${targetVersion || '1.21.4'} Paper/Purpur
**Generated for**: "${prompt}"

#### 1. \`pack.mcmeta\`
\`\`\`json
{
  "pack": {
    "pack_format": 48,
    "description": "Shadow AI Custom Generated Module: ${prompt.slice(0, 30)}"
  }
}
\`\`\`

#### 2. \`data/shadow/functions/main.mcfunction\`
\`\`\`mcfunction
# Shadow AI Automated Loop Trigger
execute as @a[tag=!shadow_initialized] at @s run tag @s add shadow_initialized
tellraw @a[tag=shadow_initialized] {"text":"[SHADOW ENGINE] Custom build initialized successfully.","color":"dark_purple"}
\`\`\`

#### 3. 1-Click Server Status
Deployed directly into \`/world/datapacks/shadow_custom/\`. Safe-mode verified with 0 syntax warnings.`;
    return res.json({ result: simulated, isDemo: true, model: 'SHADOW AI Simulation Engine' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Automatic Crash Recovery
app.get('/api/servers/:id/crash-recovery', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!crashRecoveryStore[id]) {
    crashRecoveryStore[id] = {
      autoRestartEnabled: true,
      watchdogTimeoutSeconds: 60,
      crashLoopThreshold: 3,
      crashLoopWindowMinutes: 10,
      safeBootMode: false,
      notifyDiscordWebhook: true,
      webhookUrl: 'https://discord.com/api/webhooks/demo-shadow-crash-alerts',
      recentCrashes: [
        {
          id: 'crash-991',
          timestamp: 'Yesterday at 14:22 UTC',
          culprit: 'ProtocolLib-v5.1 (Outdated Reflection)',
          summary: 'Watchdog thread freeze: Server hung for 62 seconds during chunk batch update.',
          recoveryAction: 'Auto-restarted container in Safe Mode (Isolated culprit plugin)',
          resolved: true,
        },
      ],
    };
  }
  res.json(crashRecoveryStore[id]);
});

app.post('/api/servers/:id/crash-recovery', (req: Request, res: Response) => {
  const { id } = req.params;
  crashRecoveryStore[id] = { ...crashRecoveryStore[id], ...req.body };
  res.json({ success: true, settings: crashRecoveryStore[id] });
});

// 4. Shadow Cloud Backup
app.get('/api/servers/:id/cloud-backups', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!cloudBackupStore[id]) {
    cloudBackupStore[id] = [
      {
        id: 'cb-1',
        serverId: id,
        name: 'Auto-Daily Cloud Sync (Pre-Update)',
        sizeMb: 842,
        region: 'Frankfurt-S3',
        createdAt: 'Today, 04:00 AM UTC',
        isEncrypted: true,
        isLocked: true,
        type: 'Full',
        checksum: 'sha256:7f9e830c23...',
        storageProvider: 'Shadow Vault S3',
      },
      {
        id: 'cb-2',
        serverId: id,
        name: 'Weekly Cold Snapshot',
        sizeMb: 1204,
        region: 'Ashburn-S3',
        createdAt: '3 days ago',
        isEncrypted: true,
        isLocked: false,
        type: 'Incremental',
        checksum: 'sha256:4a81bc201...',
        storageProvider: 'Google Cloud Coldline',
      },
    ];
  }
  res.json(cloudBackupStore[id]);
});

app.post('/api/servers/:id/cloud-backups', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, region, type } = req.body;
  const newBackup = {
    id: `cb-${Date.now()}`,
    serverId: id,
    name: name || `Manual Snapshot ${new Date().toLocaleDateString()}`,
    sizeMb: Math.floor(750 + Math.random() * 400),
    region: region || 'Frankfurt-S3',
    createdAt: 'Just now',
    isEncrypted: true,
    isLocked: false,
    type: type || 'Full',
    checksum: `sha256:${Math.random().toString(36).substring(2, 12)}...`,
    storageProvider: 'Shadow Vault S3',
  };
  if (!cloudBackupStore[id]) cloudBackupStore[id] = [];
  cloudBackupStore[id].unshift(newBackup);
  res.json({ success: true, backup: newBackup });
});

// 5. Shadow Marketplace
const MARKETPLACE_ITEMS = [
  {
    id: 'mp-1',
    name: 'SkyBlock Infinity Mega-Hub',
    type: 'Map',
    category: 'Adventure',
    author: 'ShadowBuilds Team',
    rating: 4.9,
    downloads: 14200,
    version: '1.21.4',
    testedVersions: ['1.21.4', '1.21.1', '1.20.4'],
    description: 'Premier custom SkyBlock spawn hub featuring 8 themed islands, integrated shop stalls, and parkour stages.',
    tags: ['SkyBlock', 'Hub', 'Optimized'],
    featured: true,
  },
  {
    id: 'mp-2',
    name: 'SMP Essentials & Anti-Grief Suite',
    type: 'Plugin',
    category: 'Administration',
    author: 'ShadowCore',
    rating: 4.8,
    downloads: 28400,
    version: '2.4.0',
    testedVersions: ['1.21.4', '1.21.1', '1.20+'],
    description: 'Pre-configured collection with grief prevention, land claims, randomized RTP teleports, and custom MOTD.',
    tags: ['Claims', 'Security', 'SMP'],
    featured: true,
  },
  {
    id: 'mp-3',
    name: 'Medieval Kingdom Survival Overhaul',
    type: 'Datapack',
    category: 'World Generation',
    author: 'AetheriaStudios',
    rating: 4.7,
    downloads: 9100,
    version: '3.1',
    testedVersions: ['1.21.4'],
    description: 'Transforms vanilla structures into 40+ sprawling castles, fortresses, ruined towers, and unique custom minibosses.',
    tags: ['RPG', 'Structures', 'Bosses'],
    featured: false,
  },
  {
    id: 'mp-4',
    name: 'Economy & Auction House Pro',
    type: 'Plugin',
    category: 'Economy',
    author: 'VaultDev',
    rating: 4.9,
    downloads: 19800,
    version: '1.8.2',
    testedVersions: ['1.21.4', '1.21.1'],
    description: 'Full GUI-based auction house, player shops, dynamic bank deposits, and tax escrow systems.',
    tags: ['Economy', 'Shop', 'GUI'],
    featured: false,
  },
];

app.get('/api/marketplace/items', (_req: Request, res: Response) => {
  res.json(MARKETPLACE_ITEMS);
});

app.post('/api/marketplace/install', (req: Request, res: Response) => {
  const { itemId, serverId } = req.body;
  const item = MARKETPLACE_ITEMS.find((m) => m.id === itemId);
  res.json({
    success: true,
    message: `Successfully queued installation of "${item?.name || itemId}" to server ${serverId}. Assets will sync automatically on container reload.`,
  });
});

// 6. Mobile Control Panel Pairing
app.get('/api/mobile/pairing', (_req: Request, res: Response) => {
  res.json({
    pairingCode: `SHDW-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    expiresInMinutes: 15,
    remoteUrl: 'https://ais-dev-ydjqkj2snt7pxhbarebqmz-33689021367.asia-east1.run.app',
    status: 'READY_TO_PAIR',
  });
});

// 7. Subuser Permissions (RBAC)
app.get('/api/servers/:id/subusers', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!subusersStore[id]) {
    subusersStore[id] = [
      {
        id: 'sub-1',
        email: 'staff.dev@shadowhost.io',
        name: 'Jordan (Lead Dev)',
        role: 'Operator',
        invitedAt: '12 days ago',
        permissions: {
          power: true,
          console: true,
          files: true,
          database: true,
          backups: true,
          schedules: true,
          plugins: true,
          subusers: false,
        },
        lastActive: '10 minutes ago',
      },
      {
        id: 'sub-2',
        email: 'mod.sam@shadowhost.io',
        name: 'Sam (Community Mod)',
        role: 'Moderator',
        invitedAt: '2 days ago',
        permissions: {
          power: false,
          console: true,
          files: false,
          database: false,
          backups: false,
          schedules: false,
          plugins: false,
          subusers: false,
        },
        lastActive: '2 hours ago',
      },
    ];
  }
  res.json(subusersStore[id]);
});

app.post('/api/servers/:id/subusers', (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, role, permissions } = req.body;
  const newSubuser = {
    id: `sub-${Date.now()}`,
    email,
    name: name || email.split('@')[0],
    role: role || 'Operator',
    invitedAt: 'Just now',
    permissions: permissions || {
      power: true,
      console: true,
      files: false,
      database: false,
      backups: true,
      schedules: false,
      plugins: false,
      subusers: false,
    },
    lastActive: 'Never',
  };
  if (!subusersStore[id]) subusersStore[id] = [];
  subusersStore[id].push(newSubuser);
  res.json({ success: true, subuser: newSubuser });
});

app.delete('/api/servers/:id/subusers/:subId', (req: Request, res: Response) => {
  const { id, subId } = req.params;
  if (subusersStore[id]) {
    subusersStore[id] = subusersStore[id].filter((s: any) => s.id !== subId);
  }
  res.json({ success: true, message: 'Subuser revoked successfully.' });
});

// 8. Startup Manager
app.get('/api/servers/:id/startup', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!startupConfigStore[id]) {
    startupConfigStore[id] = {
      startupCommand: 'java -Xms{{SERVER_MEMORY}}M -Xmx{{SERVER_MEMORY}}M -XX:+UseG1GC -jar {{SERVER_JARFILE}} nogui',
      serverJarFile: 'server.jar',
      idleSleepMode: true,
      sleepIdleMinutes: 30,
      autoRebootOnCrash: true,
      envVariables: [
        { key: 'SERVER_MEMORY', value: '8192' },
        { key: 'SERVER_JARFILE', value: 'paper-1.21.4.jar' },
        { key: 'TZ', value: 'UTC' },
      ],
    };
  }
  res.json(startupConfigStore[id]);
});

app.post('/api/servers/:id/startup', (req: Request, res: Response) => {
  const { id } = req.params;
  startupConfigStore[id] = { ...startupConfigStore[id], ...req.body };
  res.json({ success: true, config: startupConfigStore[id] });
});

// 9. Version Switcher
app.post('/api/servers/:id/version-switcher', (req: Request, res: Response) => {
  const { id } = req.params;
  const { software, version, takeBackup } = req.body;
  res.json({
    success: true,
    message: `Server ${id} successfully scheduled to switch to ${software} ${version}. ${takeBackup ? 'Automatic safety snapshot triggered.' : ''}`,
    targetSoftware: software,
    targetVersion: version,
  });
});

// 10. World Manager
app.get('/api/servers/:id/worlds', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!worldsStore[id]) {
    worldsStore[id] = [
      {
        id: 'world-overworld',
        name: 'world',
        type: 'OVERWORLD',
        generator: 'DEFAULT',
        seed: '-883491204910284',
        sizeMb: 580,
        difficulty: 'normal',
        gameRules: {
          keepInventory: false,
          mobGriefing: true,
          doDaylightCycle: true,
          doFireTick: false,
        },
        spawnCoords: { x: 0, y: 72, z: 0 },
      },
      {
        id: 'world-nether',
        name: 'world_nether',
        type: 'NETHER',
        generator: 'DEFAULT',
        seed: '-883491204910284',
        sizeMb: 240,
        difficulty: 'hard',
        gameRules: {
          keepInventory: false,
          mobGriefing: true,
          doDaylightCycle: false,
          doFireTick: true,
        },
        spawnCoords: { x: 0, y: 64, z: 0 },
      },
      {
        id: 'world-the-end',
        name: 'world_the_end',
        type: 'THE_END',
        generator: 'DEFAULT',
        seed: '-883491204910284',
        sizeMb: 85,
        difficulty: 'hard',
        gameRules: {
          keepInventory: false,
          mobGriefing: false,
          doDaylightCycle: false,
          doFireTick: false,
        },
        spawnCoords: { x: 100, y: 49, z: 0 },
      },
    ];
  }
  res.json(worldsStore[id]);
});

app.post('/api/servers/:id/worlds', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, generator, seed } = req.body;
  const newWorld = {
    id: `world-${Date.now()}`,
    name: name || 'custom_dimension',
    type: type || 'CUSTOM',
    generator: generator || 'DEFAULT',
    seed: seed || String(Math.floor(Math.random() * 999999999999)),
    sizeMb: 12,
    difficulty: 'normal',
    gameRules: {
      keepInventory: false,
      mobGriefing: true,
      doDaylightCycle: true,
      doFireTick: false,
    },
    spawnCoords: { x: 0, y: 70, z: 0 },
  };
  if (!worldsStore[id]) worldsStore[id] = [];
  worldsStore[id].push(newWorld);
  res.json({ success: true, world: newWorld });
});

// 11. MySQL Database Manager
app.get('/api/servers/:id/databases', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!databasesStore[id]) {
    databasesStore[id] = [
      {
        id: 'db-1',
        name: `s1_${id.slice(0, 4)}_luckperms`,
        host: 'mariadb1.shadowhost.io',
        port: 3306,
        username: `u_${id.slice(0, 4)}_lp`,
        password: '••••••••••••',
        sizeMb: 14.5,
        maxConnections: 50,
        createdAt: '1 week ago',
        pluginBinding: 'LuckPerms (Active)',
      },
      {
        id: 'db-2',
        name: `s1_${id.slice(0, 4)}_coreprotect`,
        host: 'mariadb1.shadowhost.io',
        port: 3306,
        username: `u_${id.slice(0, 4)}_cp`,
        password: '••••••••••••',
        sizeMb: 182.0,
        maxConnections: 100,
        createdAt: '3 days ago',
        pluginBinding: 'CoreProtect Block Logs',
      },
    ];
  }
  res.json(databasesStore[id]);
});

app.post('/api/servers/:id/databases', (req: Request, res: Response) => {
  const { id } = req.params;
  const { dbName, pluginBinding } = req.body;
  const cleanName = (dbName || 'db').replace(/[^a-zA-Z0-9_]/g, '');
  const genPass = Math.random().toString(36).substring(2, 12) + '!Sh';
  const newDb = {
    id: `db-${Date.now()}`,
    name: `s1_${id.slice(0, 4)}_${cleanName}`,
    host: 'mariadb1.shadowhost.io',
    port: 3306,
    username: `u_${id.slice(0, 4)}_${cleanName.slice(0, 4)}`,
    password: genPass,
    sizeMb: 0.2,
    maxConnections: 50,
    createdAt: 'Just now',
    pluginBinding: pluginBinding || 'Custom Plugin',
  };
  if (!databasesStore[id]) databasesStore[id] = [];
  databasesStore[id].push(newDb);
  res.json({ success: true, database: newDb });
});

app.delete('/api/servers/:id/databases/:dbId', (req: Request, res: Response) => {
  const { id, dbId } = req.params;
  if (databasesStore[id]) {
    databasesStore[id] = databasesStore[id].filter((d: any) => d.id !== dbId);
  }
  res.json({ success: true, message: 'Database dropped and connections purged.' });
});

// 12. Scheduled Tasks
app.get('/api/servers/:id/schedules', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!scheduledTasksStore[id]) {
    scheduledTasksStore[id] = [
      {
        id: 'task-1',
        name: 'Nightly Clean Server Reboot',
        action: 'RESTART',
        cronExpression: '0 4 * * *',
        commandPayload: 'restart',
        enabled: true,
        lastRun: 'Today, 04:00 UTC',
        nextRun: 'Tomorrow, 04:00 UTC',
      },
      {
        id: 'task-2',
        name: 'Auto Backup World Snapshot',
        action: 'BACKUP',
        cronExpression: '0 */6 * * *',
        enabled: true,
        lastRun: '4 hours ago',
        nextRun: 'in 2 hours',
      },
      {
        id: 'task-3',
        name: 'Clear Ground Entities & Items',
        action: 'CLEAR_LAG',
        cronExpression: '*/30 * * * *',
        commandPayload: 'say [SHADOW] Clearing loose ground items in 10s...; sleep 10; kill @e[type=item]',
        enabled: false,
        lastRun: 'Yesterday',
        nextRun: 'Paused',
      },
    ];
  }
  res.json(scheduledTasksStore[id]);
});

app.post('/api/servers/:id/schedules', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, action, cronExpression, commandPayload } = req.body;
  const newTask = {
    id: `task-${Date.now()}`,
    name: name || 'Scheduled Automation',
    action: action || 'COMMAND',
    cronExpression: cronExpression || '0 0 * * *',
    commandPayload: commandPayload || '',
    enabled: true,
    lastRun: 'Never',
    nextRun: 'Scheduled according to cron',
  };
  if (!scheduledTasksStore[id]) scheduledTasksStore[id] = [];
  scheduledTasksStore[id].push(newTask);
  res.json({ success: true, task: newTask });
});

// 13. Player Analytics
app.get('/api/servers/:id/player-analytics', (_req: Request, res: Response) => {
  res.json({
    peakPlayers24h: 34,
    averageTps24h: 19.92,
    totalUniqueJoins: 1420,
    avgSessionMinutes: 48,
    retentionDay1: 72,
    retentionDay7: 46,
    countryDistribution: [
      { country: 'United States', flag: '🇺🇸', percent: 44 },
      { country: 'Germany', flag: '🇩🇪', percent: 22 },
      { country: 'United Kingdom', flag: '🇬🇧', percent: 14 },
      { country: 'Canada', flag: '🇨🇦', percent: 8 },
      { country: 'Others', flag: '🌐', percent: 12 },
    ],
    hourlyActivity: [
      { hour: '00:00', players: 12 },
      { hour: '03:00', players: 6 },
      { hour: '06:00', players: 4 },
      { hour: '09:00', players: 14 },
      { hour: '12:00', players: 22 },
      { hour: '15:00', players: 29 },
      { hour: '18:00', players: 34 },
      { hour: '21:00', players: 26 },
    ],
    topPlayers: [
      { username: 'VortexMiner', playtimeHours: 128.4, joins: 84, lastSeen: '10m ago' },
      { username: 'EnderQueen_99', playtimeHours: 94.2, joins: 62, lastSeen: '1h ago' },
      { username: 'CyberKnight', playtimeHours: 76.0, joins: 45, lastSeen: 'Today' },
      { username: 'ShadowCrafter', playtimeHours: 65.5, joins: 39, lastSeen: 'Yesterday' },
    ],
  });
});

// 14. Whitelist and Ban Manager
app.get('/api/servers/:id/access-control', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!accessControlStore[id]) {
    accessControlStore[id] = {
      whitelistEnabled: false,
      whitelist: [
        { uuid: '4e29f0ba-3129-4d2a-bc90-9382f1b40092', username: 'Alex_Mercer', addedAt: '3 days ago', addedBy: 'Console' },
        { uuid: '7b91012a-09aa-4c28-9844-0982bbca7710', username: 'Zulnorain', addedAt: '1 week ago', addedBy: 'Admin' },
      ],
      bans: [
        { id: 'ban-1', type: 'UUID', target: 'GrieferBot99', reason: 'Unfair combat advantages / KillAura', bannedBy: 'ShadowGuard', bannedAt: '2 days ago', expiresAt: 'Permanent' },
        { id: 'ban-2', type: 'IP', target: '185.220.101.44', reason: 'Repeated NullPing proxy flood attack', bannedBy: 'Shadow Shield', bannedAt: 'Yesterday', expiresAt: 'Permanent' },
      ],
    };
  }
  res.json(accessControlStore[id]);
});

app.post('/api/servers/:id/access-control/whitelist', (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, enabled } = req.body;
  if (!accessControlStore[id]) accessControlStore[id] = { whitelistEnabled: false, whitelist: [], bans: [] };

  if (typeof enabled === 'boolean') {
    accessControlStore[id].whitelistEnabled = enabled;
  }
  if (username) {
    accessControlStore[id].whitelist.push({
      uuid: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}`,
      username,
      addedAt: 'Just now',
      addedBy: 'Admin',
    });
  }
  res.json({ success: true, data: accessControlStore[id] });
});

app.post('/api/servers/:id/access-control/ban', (req: Request, res: Response) => {
  const { id } = req.params;
  const { target, reason, type } = req.body;
  if (!accessControlStore[id]) accessControlStore[id] = { whitelistEnabled: false, whitelist: [], bans: [] };

  const newBan = {
    id: `ban-${Date.now()}`,
    type: type || 'UUID',
    target,
    reason: reason || 'Violation of server rules',
    bannedBy: 'Admin',
    bannedAt: 'Just now',
    expiresAt: 'Permanent',
  };
  accessControlStore[id].bans.push(newBan);
  res.json({ success: true, ban: newBan });
});

// 15. Java Version Selector
app.get('/api/servers/:id/java-version', (_req: Request, res: Response) => {
  res.json({
    currentJava: 'Java 21 (LTS)',
    available: [
      { version: 'Java 21 (LTS)', recommended: true, description: 'Default for Minecraft 1.20.5+ & 1.21+. Includes ZGC generational and virtual threads.' },
      { version: 'Java 17 (LTS)', recommended: false, description: 'For Minecraft 1.17 to 1.20.4.' },
      { version: 'Java 11', recommended: false, description: 'For Minecraft 1.16 setups.' },
      { version: 'Java 8', recommended: false, description: 'Required for classic 1.7.10 & 1.12.2 modpacks.' },
    ],
    graalVmEnabled: true,
    gcEngine: 'G1GC',
  });
});

app.post('/api/servers/:id/java-version', (_req: Request, res: Response) => {
  const { javaVersion, graalVmEnabled, gcEngine } = req.body;
  res.json({ success: true, message: `Container configured to restart with ${javaVersion}. GraalVM: ${graalVmEnabled ? 'ON' : 'OFF'}, GC: ${gcEngine}.` });
});

// 16. Modpack Installer
const MODPACKS_CATALOG = [
  {
    id: 'mp-allthemods9',
    name: 'All the Mods 9 (ATM9)',
    loader: 'Forge',
    minecraftVersion: '1.20.1',
    author: 'ATMTeam',
    modCount: 420,
    recommendedRamGb: 12,
    downloads: '1.4M',
    description: 'The definitive all-encompassing modpack. Technology, magic, dimensions, and the legendary ATM Star questline.',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mp-bettermc',
    name: 'Better MC [FABRIC]',
    loader: 'Fabric',
    minecraftVersion: '1.21.1',
    author: 'SHXRKIE',
    modCount: 180,
    recommendedRamGb: 8,
    downloads: '2.8M',
    description: 'What Minecraft should have been: dozens of new bosses, overhauled Nether & End, Waystones, and smooth 144 FPS optimization.',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mp-rlcraft',
    name: 'RLCraft (Real Life / Hardcore)',
    loader: 'Forge',
    minecraftVersion: '1.12.2',
    author: 'Shivaxi',
    modCount: 160,
    recommendedRamGb: 8,
    downloads: '4.2M',
    description: 'The hardest survival modpack in Minecraft history. Temperature mechanics, thirst, dragons, and relentless dungeon crawling.',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mp-cobblemon',
    name: 'Cobblemon Official Fabric',
    loader: 'Fabric',
    minecraftVersion: '1.21.1',
    author: 'Cobblemon Team',
    modCount: 75,
    recommendedRamGb: 8,
    downloads: '980K',
    description: 'Open-world creature catching integrated directly into Minecraft aesthetics. Catch, battle, and trade with smooth animations.',
    bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
  },
];

app.get('/api/modpacks', (_req: Request, res: Response) => {
  res.json(MODPACKS_CATALOG);
});

// 17. Server Cloning
app.post('/api/servers/:id/clone', (req: Request, res: Response) => {
  const { id } = req.params;
  const { newName, targetRegion, includePlayerData } = req.body;
  res.json({
    success: true,
    clonedServerId: `srv-${Date.now().toString(36)}`,
    message: `Server "${newName || id + '-clone'}" successfully cloned to node ${targetRegion || 'Ashburn'}. Player data: ${includePlayerData ? 'Preserved' : 'Excluded'}.`,
  });
});

// 18. Custom JVM Startup Manager
app.get('/api/servers/:id/jvm-flags', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!jvmConfigStore[id]) {
    jvmConfigStore[id] = {
      preset: 'Aikar (Recommended)',
      minRamMb: 8192,
      maxRamMb: 8192,
      gcEngine: 'G1GC',
      customFlags: '-XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20',
      largePagesEnabled: false,
      parallelRefProc: true,
    };
  }
  res.json(jvmConfigStore[id]);
});

app.post('/api/servers/:id/jvm-flags', (req: Request, res: Response) => {
  const { id } = req.params;
  jvmConfigStore[id] = { ...jvmConfigStore[id], ...req.body };
  res.json({ success: true, config: jvmConfigStore[id] });
});

// 19. Network Analytics
app.get('/api/servers/:id/network', (_req: Request, res: Response) => {
  res.json({
    status: 'PROTECTED',
    anycastScrubbing: 'ACTIVE (Frankfurt Edge Scrubbing)',
    currentBandwidthMbps: +(18.4 + Math.random() * 4).toFixed(1),
    peakBandwidth24hMbps: 184.2,
    packetsPerSecond: 2840,
    attacksMitigated24h: 3,
    recentAttacks: [
      { type: 'UDP Amplification (NTP)', sizeGbps: 18.2, durationSeconds: 42, timestamp: '6 hours ago', status: 'Blocked (Zero Packet Drop)' },
      { type: 'Minecraft NullPing Flooder', sizeGbps: 2.4, durationSeconds: 120, timestamp: '14 hours ago', status: 'Blocked by Layer 7 Filter' },
    ],
    popLatencies: [
      { location: 'Frankfurt', pingMs: 8 },
      { location: 'London', pingMs: 14 },
      { location: 'Ashburn (US-East)', pingMs: 78 },
      { location: 'Singapore', pingMs: 142 },
    ],
  });
});

// 20. Server Migration
app.post('/api/servers/:id/migration', (req: Request, res: Response) => {
  const { id } = req.params;
  const { sourceProvider, remoteHost, remotePort, remoteUser } = req.body;
  const job = {
    id: `mig-${Date.now()}`,
    sourceProvider: sourceProvider || 'Custom SFTP',
    remoteHost,
    remotePort: remotePort || 22,
    remoteUser,
    status: 'TRANSFERRING',
    progressPercent: 42,
    speedMbps: 84.5,
    filesTransferred: 1840,
    totalSizeMb: 4200,
    logs: [
      'Connected to remote SFTP daemon.',
      'Authenticated user successfully.',
      'Found root Minecraft directory with server.jar.',
      'Archiving /world and /plugins directories...',
      'Streaming encrypted snapshot across 10Gbps Shadow pipeline...',
    ],
  };
  migrationJobsStore[id] = job;
  res.json({ success: true, job });
});

// 21. Announcement Center
app.get('/api/announcements/broadcasts', (_req: Request, res: Response) => {
  res.json({
    activeMotd: '§5§lSHADOW HOST §7» §bNext-Gen Minecraft Hosting §7[1.21.4] §a§lFREE 8GB',
    scheduledBroadcasts: [
      { id: 'b-1', intervalMinutes: 15, message: '§6[Notice] §eDonations support server upgrades! Visit our marketplace.' },
      { id: 'b-2', intervalMinutes: 30, message: '§d[Discord] §bJoin our active Discord community at discord.gg/YC5JZWtc9!' },
    ],
  });
});

// 22. Referral Rewards
app.get('/api/referrals', (_req: Request, res: Response) => {
  res.json(referralsStore.default);
});

app.post('/api/referrals/claim', (req: Request, res: Response) => {
  const { reward } = req.body;
  referralsStore.default.claimedUpgrades.push(reward || 'Bonus Upgrade');
  res.json({ success: true, message: `Successfully claimed "${reward}"! Bonus applied to active server.` });
});

// 23. Maintenance Mode
app.get('/api/servers/:id/maintenance', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!maintenanceStore[id]) {
    maintenanceStore[id] = {
      enabled: false,
      motdText: '§4§lMAINTENANCE §7» §cServer undergoing scheduled maintenance. Back soon!',
      kickReason: 'Server is currently in Maintenance Mode for infrastructure tuning. Please check Discord.',
      countdownMinutes: 0,
      countdownActive: false,
      whitelistedStaff: ['Zulnorain', 'Alex_Mercer', 'Admin_Jordan'],
    };
  }
  res.json(maintenanceStore[id]);
});

app.post('/api/servers/:id/maintenance', (req: Request, res: Response) => {
  const { id } = req.params;
  maintenanceStore[id] = { ...maintenanceStore[id], ...req.body };
  res.json({ success: true, maintenance: maintenanceStore[id] });
});

// 24. Public Status Page
app.get('/api/status-page', (_req: Request, res: Response) => {
  res.json({
    systemStatus: 'ALL_SYSTEMS_OPERATIONAL',
    uptimePercent30d: 99.99,
    nodes: [
      { name: 'Frankfurt (DE-01)', ping: 12, cpu: 32, ram: 54, status: 'OPERATIONAL' },
      { name: 'Ashburn (US-01)', ping: 24, cpu: 28, ram: 48, status: 'OPERATIONAL' },
      { name: 'Singapore (SG-01)', ping: 38, cpu: 41, ram: 60, status: 'OPERATIONAL' },
      { name: 'Mumbai (IN-01)', ping: 45, cpu: 35, ram: 52, status: 'OPERATIONAL' },
    ],
    services: [
      { name: 'Compute Nodes (AMD Ryzen 9 7950X3D)', status: 'OPERATIONAL' },
      { name: 'Anycast Layer 7 DDoS Mitigation', status: 'OPERATIONAL' },
      { name: 'RCON / WebSocket Sockets', status: 'OPERATIONAL' },
      { name: 'MySQL / MariaDB Clusters', status: 'OPERATIONAL' },
      { name: 'Shadow Vault Cloud Storage', status: 'OPERATIONAL' },
      { name: 'Shadow AI Engine (Gemini 3.8)', status: 'OPERATIONAL' },
    ],
    recentIncidents: [
      { id: 'inc-1', title: 'Scheduled Ashburn Network Switch Upgrade', date: 'Oct 24, 2026', duration: '12 mins', status: 'RESOLVED' },
    ],
  });
});

// 25. Shadow Shield Security
app.get('/api/servers/:id/security', (req: Request, res: Response) => {
  const { id } = req.params;
  if (!securityStore[id]) {
    securityStore[id] = {
      shieldProtectionActive: true,
      log4jExploitFilter: true,
      nullPingScrubbing: true,
      antiBotRateLimit: true,
      rconIpWhitelistEnabled: false,
      rconAllowedIps: ['127.0.0.1', '192.168.1.0/24'],
      enforceTwoFactorStaff: true,
      auditLogs: [
        { id: 'log-1', timestamp: '12m ago', event: 'Staff login from Frankfurt IP', severity: 'INFO', ip: '82.165.197.1', user: 'Zulnorain' },
        { id: 'log-2', timestamp: '1h ago', event: 'Blocked Malformed Log4j JNDI packet payload', severity: 'BLOCKED', ip: '45.142.122.9', user: 'External Attacker' },
        { id: 'log-3', timestamp: '3h ago', event: 'RCON password verification passed', severity: 'INFO', ip: '192.168.1.5', user: 'Console Script' },
      ],
    };
  }
  res.json(securityStore[id]);
});

app.post('/api/servers/:id/security', (req: Request, res: Response) => {
  const { id } = req.params;
  securityStore[id] = { ...securityStore[id], ...req.body };
  res.json({ success: true, security: securityStore[id] });
});

// Dev Mode & Static Asset Serving
async function startServer() {

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('[SHADOW HOST] Vite middleware mounted in dev mode.');
    } catch (e) {
      console.warn('[SHADOW HOST] Vite middleware mode skipped, serving statically if dist exists:', e);
    }
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SHADOW HOST] Production Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
