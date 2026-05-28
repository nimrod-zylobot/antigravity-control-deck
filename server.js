import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const homeDir = os.homedir();
const MCP_DIR = process.env.MCP_DIR || path.join(homeDir, '.gemini', 'antigravity', 'mcp');
const SKILLS_DIR = process.env.SKILLS_DIR || path.join(homeDir, '.gemini', 'antigravity', 'skills');
const PLUGINS_DIR = process.env.PLUGINS_DIR || path.join(homeDir, '.gemini', 'config', 'plugins');
const PROJECTS_DIR = process.env.PROJECTS_DIR || path.join(homeDir, '.gemini', 'config', 'projects');
const SCRATCH_DIR = process.env.SCRATCH_DIR || path.join(homeDir, '.gemini', 'antigravity', 'scratch');
const BRAIN_DIR = process.env.BRAIN_DIR || path.join(homeDir, '.gemini', 'antigravity', 'brain');

// Helper to parse simple YAML frontmatter without external yaml library dependency issues
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return { metadata: {}, content };
  
  const yamlText = match[1];
  const metadata = {};
  
  yamlText.split(/\r?\n/).forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      
      // Clean up array format like: [frontend, design]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
      } else {
        value = value.replace(/^['"]|['"]$/g, '');
      }
      
      if (key) {
        metadata[key] = value;
      }
    }
  });
  
  const body = content.slice(match[0].length).trim();
  return { metadata, content: body };
}

// Endpoint 1: Fetch MCP Servers & Tool Schemas
app.get('/api/mcp', async (req, res) => {
  try {
    const mcpServers = [];
    const servers = await fs.readdir(MCP_DIR);
    
    for (const server of servers) {
      const serverPath = path.join(MCP_DIR, server);
      const stat = await fs.stat(serverPath);
      
      if (stat.isDirectory()) {
        const toolFiles = await fs.readdir(serverPath);
        const tools = [];
        
        for (const file of toolFiles) {
          if (file.endsWith('.json')) {
            const filePath = path.join(serverPath, file);
            try {
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const toolData = JSON.parse(fileContent);
              tools.push(toolData);
            } catch (err) {
              console.error(`Failed to parse tool JSON: ${filePath}`, err);
            }
          }
        }
        
        mcpServers.push({
          name: server,
          toolsCount: tools.length,
          tools: tools
        });
      }
    }
    
    res.json(mcpServers);
  } catch (err) {
    console.error('Error reading MCP directory:', err);
    res.status(500).json({ error: 'Failed to read MCP directory', details: err.message });
  }
});

// Endpoint 2: Fetch Skills (Includes standalone skills & plugin-specific skills)
app.get('/api/skills', async (req, res) => {
  try {
    const allSkills = [];

    // 1. Read standalone skills
    try {
      const skillDirs = await fs.readdir(SKILLS_DIR);
      for (const dir of skillDirs) {
        const skillPath = path.join(SKILLS_DIR, dir);
        const stat = await fs.stat(skillPath);
        
        if (stat.isDirectory()) {
          const mdPath = path.join(skillPath, 'SKILL.md');
          try {
            const content = await fs.readFile(mdPath, 'utf-8');
            const { metadata, content: bodyContent } = parseFrontmatter(content);
            allSkills.push({
              id: `standalone-${dir}`,
              dirName: dir,
              name: metadata.name || dir,
              description: metadata.description || '',
              category: metadata.category || 'general',
              tags: metadata.tags || [],
              author: metadata.author || 'system',
              dateAdded: metadata.date_added || '',
              risk: metadata.risk || 'safe',
              source: metadata.source || 'local',
              sourceRepo: metadata.source_repo || '',
              sourceType: 'standalone',
              rawMarkdown: content,
              bodyMarkdown: bodyContent,
              path: mdPath
            });
          } catch (e) {
            // SKILL.md might not exist
          }
        }
      }
    } catch (err) {
      console.warn('Skipping standalone skills read:', err.message);
    }

    // 2. Read plugin-specific skills
    try {
      const pluginDirs = await fs.readdir(PLUGINS_DIR);
      for (const plugin of pluginDirs) {
        const pluginSkillsPath = path.join(PLUGINS_DIR, plugin, 'skills');
        try {
          const pluginSkillsDirStat = await fs.stat(pluginSkillsPath);
          if (pluginSkillsDirStat.isDirectory()) {
            const files = await fs.readdir(pluginSkillsPath);
            for (const file of files) {
              if (file.endsWith('.md')) {
                const mdPath = path.join(pluginSkillsPath, file);
                try {
                  const content = await fs.readFile(mdPath, 'utf-8');
                  const { metadata, content: bodyContent } = parseFrontmatter(content);
                  
                  allSkills.push({
                    id: `plugin-${plugin}-${file.replace('.md', '')}`,
                    dirName: file.replace('.md', ''),
                    name: metadata.name || `${plugin} - ${file.replace('.md', '')}`,
                    description: metadata.description || `Skill from plugin ${plugin}`,
                    category: metadata.category || 'plugin',
                    tags: metadata.tags || [plugin],
                    author: metadata.author || 'plugin-author',
                    dateAdded: metadata.date_added || '',
                    risk: metadata.risk || 'safe',
                    source: metadata.source || 'plugin',
                    sourceRepo: metadata.source_repo || '',
                    sourceType: `plugin:${plugin}`,
                    rawMarkdown: content,
                    bodyMarkdown: bodyContent,
                    path: mdPath
                  });
                } catch (e) {
                  // Failed to read specific markdown file
                }
              }
            }
          }
        } catch (e) {
          // skills directory might not exist in plugin
        }
      }
    } catch (err) {
      console.warn('Skipping plugin skills read:', err.message);
    }

    res.json(allSkills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Failed to fetch skills', details: err.message });
  }
});

// Endpoint 3: Fetch Plugins
app.get('/api/plugins', async (req, res) => {
  try {
    const plugins = [];
    const dirs = await fs.readdir(PLUGINS_DIR);
    
    for (const dir of dirs) {
      const pluginPath = path.join(PLUGINS_DIR, dir);
      const stat = await fs.stat(pluginPath);
      
      if (stat.isDirectory()) {
        const jsonPath = path.join(pluginPath, 'plugin.json');
        let config = {};
        
        try {
          const fileContent = await fs.readFile(jsonPath, 'utf-8');
          config = JSON.parse(fileContent);
        } catch (e) {
          // plugin.json might not exist or be invalid
        }
        
        // Count skills in plugin skills folder
        let skillsCount = 0;
        try {
          const skillsDir = path.join(pluginPath, 'skills');
          const skillsStat = await fs.stat(skillsDir);
          if (skillsStat.isDirectory()) {
            const files = await fs.readdir(skillsDir);
            skillsCount = files.filter(f => f.endsWith('.md')).length;
          }
        } catch (e) {}

        plugins.push({
          id: dir,
          name: config.name || dir,
          version: config.version || '1.0.0',
          description: config.description || 'No description provided.',
          author: config.author?.name || config.author || 'Unknown',
          license: config.license || 'N/A',
          keywords: config.keywords || [],
          skillsCount: skillsCount,
          path: pluginPath
        });
      }
    }
    
    res.json(plugins);
  } catch (err) {
    console.error('Error reading plugins directory:', err);
    res.status(500).json({ error: 'Failed to read plugins directory', details: err.message });
  }
});

// Endpoint 4: Diagnostics and System info
app.get('/api/system', async (req, res) => {
  try {
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    
    const diagnostics = {
      os: {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
        hostname: os.hostname(),
        uptime: os.uptime()
      },
      nodeVersion: process.version,
      username: (() => { try { return os.userInfo().username; } catch { return 'User'; } })(),
      memory: {
        free: Math.round(freeMem / (1024 * 1024)) + ' MB',
        total: Math.round(totalMem / (1024 * 1024)) + ' MB',
        usage: Math.round(((totalMem - freeMem) / totalMem) * 100) + '%'
      },
      paths: {
        mcp: MCP_DIR,
        skills: SKILLS_DIR,
        plugins: PLUGINS_DIR,
        cwd: process.cwd()
      },
      time: new Date().toISOString()
    };
    
    res.json(diagnostics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diagnostics', details: err.message });
  }
});

// Endpoint 5: Save Custom Skill
app.post('/api/skills/create', async (req, res) => {
  const { name, description, category, risk, author, tags, bodyMarkdown } = req.body;
  if (!name || !bodyMarkdown) {
    return res.status(400).json({ error: 'Name and bodyMarkdown are required' });
  }
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const skillFolderPath = path.join(SKILLS_DIR, slug);
  const skillFilePath = path.join(skillFolderPath, 'SKILL.md');
  
  const tagsFormatted = Array.isArray(tags) ? `[${tags.join(', ')}]` : '[]';
  const yamlContent = `---
name: ${name}
description: "${description.replace(/"/g, '\\"')}"
category: ${category || 'general'}
risk: ${risk || 'safe'}
source: local
date_added: "${new Date().toISOString().split('T')[0]}"
author: ${author || 'user'}
tags: ${tagsFormatted}
---
# Protocol: ${name}

${bodyMarkdown}
`;

  try {
    await fs.mkdir(skillFolderPath, { recursive: true });
    await fs.writeFile(skillFilePath, yamlContent, 'utf-8');
    res.json({ success: true, path: skillFilePath });
  } catch (err) {
    console.error('Failed to create skill:', err);
    res.status(500).json({ error: 'Failed to save skill file', details: err.message });
  }
});

// Endpoint 6: Scan Workspaces
app.get('/api/workspaces', async (req, res) => {
  const workspaces = [];
  
  async function scanDir(dirPath, groupName) {
    try {
      const items = await fs.readdir(dirPath);
      for (const item of items) {
        if (item === '.system_generated' || item === 'brain') continue;
        const fullPath = path.join(dirPath, item);
        try {
          const stat = await fs.stat(fullPath);
          if (stat.isDirectory()) {
            workspaces.push({
              name: item,
              path: fullPath,
              group: groupName,
              mtime: stat.mtime
            });
          }
        } catch (e) {}
      }
    } catch (e) {
      console.warn(`Dir ${dirPath} not readable:`, e.message);
    }
  }

  await scanDir(PROJECTS_DIR, 'config-projects');
  await scanDir(SCRATCH_DIR, 'scratch-workspace');
  res.json(workspaces);
});



// Helper: Find the latest active conversation folder in the brain directory
async function getLatestConversationFolder() {
  try {
    const conversations = await fs.readdir(BRAIN_DIR);
    let latestTime = 0;
    let latestFolder = '';
    let latestConvId = '';
    
    for (const conv of conversations) {
      const convPath = path.join(BRAIN_DIR, conv);
      try {
        const stat = await fs.stat(convPath);
        if (stat.isDirectory() && stat.mtimeMs > latestTime) {
          const transcriptPath = path.join(convPath, '.system_generated', 'logs', 'transcript.jsonl');
          try {
            await fs.access(transcriptPath);
            latestTime = stat.mtimeMs;
            latestFolder = convPath;
            latestConvId = conv;
          } catch (e) {}
        }
      } catch (e) {}
    }
    return { folder: latestFolder, id: latestConvId };
  } catch (err) {
    console.error('Error finding latest conversation folder:', err);
    return null;
  }
}

// Endpoint 8: Get Subagents list for the active conversation
app.get('/api/subagents', async (req, res) => {
  try {
    const activeConv = await getLatestConversationFolder();
    if (!activeConv) {
      return res.json([]);
    }
    
    // Read parent conversation transcript
    const parentTranscriptPath = path.join(activeConv.folder, '.system_generated', 'logs', 'transcript.jsonl');
    let parentContent = '';
    try {
      parentContent = await fs.readFile(parentTranscriptPath, 'utf-8');
    } catch (e) {
      return res.json([]);
    }
    
    // Extract UUIDs representing other spawned conversations (subagents)
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    const matches = parentContent.match(uuidRegex) || [];
    const uniqueIds = [...new Set(matches)].filter(id => id.toLowerCase() !== activeConv.id.toLowerCase());
    
    const subagents = [];
    
    for (const id of uniqueIds) {
      const subagentFolder = path.join(BRAIN_DIR, id);
      try {
        const stat = await fs.stat(subagentFolder);
        if (stat.isDirectory()) {
          const subagentTranscriptPath = path.join(subagentFolder, '.system_generated', 'logs', 'transcript.jsonl');
          let subagentContent = '';
          try {
            subagentContent = await fs.readFile(subagentTranscriptPath, 'utf-8');
          } catch (e) {}
          
          const lines = subagentContent.trim().split('\n').filter(Boolean);
          const stepsCount = lines.length;
          
          let lastStepName = 'Initialized';
          let lastActivityTime = stat.mtime;
          let role = 'Subagent';
          let typeName = 'self';
          let prompt = '';
          
          // Trace metadata from parent transcript
          const parentLines = parentContent.trim().split('\n').filter(Boolean);
          for (const line of parentLines) {
            if (line.includes(id) && line.includes('invoke_subagent')) {
              try {
                const parsed = JSON.parse(line);
                const calls = parsed.tool_calls || [];
                for (const call of calls) {
                  if (call.name === 'invoke_subagent') {
                    const args = call.arguments || {};
                    const subs = args.Subagents || [];
                    if (subs.length > 0) {
                      role = subs[0].Role || role;
                      typeName = subs[0].TypeName || typeName;
                      prompt = subs[0].Prompt || prompt;
                    }
                  }
                }
              } catch (e) {}
            }
          }
          
          if (lines.length > 0) {
            try {
              const lastLine = JSON.parse(lines[lines.length - 1]);
              lastStepName = lastLine.type || 'Thinking';
              if (lastLine.tool_calls && lastLine.tool_calls.length > 0) {
                lastStepName = `Running tool: ${lastLine.tool_calls[0].name}`;
              }
              lastActivityTime = lastLine.timestamp || lastActivityTime;
            } catch (e) {}
          }
          
          subagents.push({
            id: id,
            role: role,
            typeName: typeName,
            prompt: prompt,
            stepsCount: stepsCount,
            lastStep: lastStepName,
            lastActive: lastActivityTime,
            status: stepsCount > 0 ? (lastStepName === 'USER_INPUT' ? 'Completed/Waiting' : 'Running') : 'Pending'
          });
        }
      } catch (e) {}
    }
    
    res.json(subagents);
  } catch (err) {
    console.error('Error fetching subagents:', err);
    res.status(500).json({ error: 'Failed to fetch subagents', details: err.message });
  }
});

// Serve static frontend files in production if dist exists
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other routes to index.html for SPA routing
app.get('*', async (req, res, next) => {
  try {
    await fs.access(path.join(__dirname, 'dist', 'index.html'));
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } catch {
    res.status(404).send('API endpoint not found and client build is missing.');
  }
});

app.listen(port, () => {
  console.log(`Control Deck server listening at http://localhost:${port}`);
});
