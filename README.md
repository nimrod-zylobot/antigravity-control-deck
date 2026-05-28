# Antigravity Control Deck Dashboard

A gorgeous, local, single-page web application dashboard for managing and monitoring the Google DeepMind Antigravity AI coding environment.

This project connects to your local directories dynamically and displays active Model Context Protocol (MCP) tool schemas, custom procedural skills, and integrated plugins, and includes a live background log terminal.

## 🌌 Key Features

1. **📊 Control Deck Home:** Summary dashboard tracking system diagnostics, memory footprint, connected tool metrics, and general statistics.
2. **🔌 MCP Servers & Tool Explorer:** Drill down into active MCP integrations (e.g. Google Workspace, GitHub, StitchMCP, Composio). Click any tool to view its description, parameter types, and required inputs.
3. **🛠️ Tool Playground:** Interactive schema form composer. Fill out inputs visually and it auto-generates copy-ready JSON tool calls for your agent prompt instructions.
4. **📖 Skills & Protocol Reader:** Browses standalone skills and plugin skills. Extracts YAML metadata, tags, and category info, rendering markdown protocol guidelines in a clean document view.
5. **📝 Custom Skill Creator Form:** Save new custom guidelines directly to disk with structural tag forms.
6. **⚡ Live Task Log Monitor:** Inspect running background operation logs from active sessions inside a simulated terminal console.
7. **🔍 Global Search:** Instantly query terms across all tools, skills, and plugins with deep-link navigation.

## 🛠️ Stack

- **Backend:** Node.js + Express.js
- **Frontend:** React + Vite
- **Styling:** Custom Vanilla CSS Design System (dark-mode-first glassmorphic layouts, Outfit & JetBrains Mono typography)

## 🚀 Getting Started

### 1. Installation
Clone the repository, navigate to the folder, and install package dependencies:
```bash
npm install
```

### 2. Launch Development Mode
Run the Express backend (port `3001`) and the Vite dev server (port `5173`) concurrently:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Production Build & Serve
To build the React application for production and serve it using Express:
```bash
npm run build
node server.js
```
Open **[http://localhost:3001](http://localhost:3001)** in your browser.

## 🔒 Configuration

By default, the server resolves paths relative to your local operating system home directory:
- **MCP Directory:** `~/.gemini/antigravity/mcp`
- **Skills Directory:** `~/.gemini/antigravity/skills`
- **Plugins Directory:** `~/.gemini/config/plugins`

To override these default directories, you can define custom environment variables in a `.env` file or export them before running the server:
- `MCP_DIR`
- `SKILLS_DIR`
- `PLUGINS_DIR`
- `PROJECTS_DIR`
- `SCRATCH_DIR`
- `BRAIN_DIR`
