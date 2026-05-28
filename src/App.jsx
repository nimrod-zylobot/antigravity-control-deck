import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Terminal, 
  BookOpen, 
  Layers, 
  Activity, 
  Sun, 
  Moon,
  Search,
  CheckCircle,
  AlertCircle,
  Play,
  FolderOpen,
  History,
  Plus,
  Users
} from 'lucide-react';

import DashboardHome from './components/DashboardHome.jsx';
import McpViewer from './components/McpViewer.jsx';
import SkillsViewer from './components/SkillsViewer.jsx';
import PluginsViewer from './components/PluginsViewer.jsx';
import Diagnostics from './components/Diagnostics.jsx';

// Feature Components
import Playground from './components/Playground.jsx';
import Workspaces from './components/Workspaces.jsx';
import TaskMonitor from './components/TaskMonitor.jsx';
import CreateSkill from './components/CreateSkill.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';
import SubagentsMonitor from './components/SubagentsMonitor.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [preSearchTab, setPreSearchTab] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dynamic navigation selection states for global search deep links
  const [selectedMcpServer, setSelectedMcpServer] = useState(null);
  const [selectedMcpTool, setSelectedMcpTool] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Data states
  const [mcpData, setMcpData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [pluginsData, setPluginsData] = useState([]);
  const [systemData, setSystemData] = useState(null);
  
  // System states
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Theme toggle handler
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  // Hook navigation callbacks for search redirect
  useEffect(() => {
    window._mcpNavCallback = (serverName, tool) => {
      setSelectedMcpServer(serverName);
      setSelectedMcpTool(tool);
    };
    window._skillsNavCallback = (skill) => {
      setSelectedSkill(skill);
    };
    return () => {
      delete window._mcpNavCallback;
      delete window._skillsNavCallback;
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mcpRes, skillsRes, pluginsRes, systemRes] = await Promise.all([
        fetch('/api/mcp'),
        fetch('/api/skills'),
        fetch('/api/plugins'),
        fetch('/api/system')
      ]);

      if (mcpRes.ok && skillsRes.ok && pluginsRes.ok && systemRes.ok) {
        const mcp = await mcpRes.json();
        const skills = await skillsRes.json();
        const plugins = await pluginsRes.json();
        const system = await systemRes.json();

        setMcpData(mcp);
        setSkillsData(skills);
        setPluginsData(plugins);
        setSystemData(system);
        setConnected(true);
      } else {
        setConnected(false);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val && activeTab !== 'search') {
      setPreSearchTab(activeTab);
      setActiveTab('search');
    } else if (!val && activeTab === 'search') {
      setActiveTab(preSearchTab);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Gathering Antigravity configuration...</p>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <DashboardHome 
            mcpData={mcpData} 
            skillsData={skillsData} 
            pluginsData={pluginsData} 
            systemData={systemData}
            setActiveTab={setActiveTab}
          />
        );
      case 'mcp':
        return (
          <McpViewer 
            mcpData={mcpData} 
            searchQuery={searchQuery}
            selectedServer={selectedMcpServer}
            setSelectedServer={setSelectedMcpServer}
            selectedTool={selectedMcpTool}
            setSelectedTool={setSelectedMcpTool}
          />
        );
      case 'skills':
        return (
          <SkillsViewer 
            skillsData={skillsData} 
            searchQuery={searchQuery}
            selectedSkill={selectedSkill}
            setSelectedSkill={setSelectedSkill}
          />
        );
      case 'plugins':
        return <PluginsViewer pluginsData={pluginsData} searchQuery={searchQuery} />;
      case 'playground':
        return <Playground mcpData={mcpData} />;
      case 'workspaces':
        return <Workspaces />;
      case 'tasks':
        return <TaskMonitor />;
      case 'subagents':
        return <SubagentsMonitor />;
      case 'create-skill':
        return <CreateSkill refreshData={fetchData} setActiveTab={setActiveTab} />;
      case 'diagnostics':
        return <Diagnostics systemData={systemData} refreshData={fetchData} />;
      case 'search':
        return (
          <GlobalSearch 
            mcpData={mcpData}
            skillsData={skillsData}
            pluginsData={pluginsData}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar" style={{ height: 'auto', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '1.75rem' }}>🌌</span>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Antigravity</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>CONTROL DECK</p>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => { setActiveTab('home'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <Home size={16} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-link ${activeTab === 'mcp' ? 'active' : ''}`}
            onClick={() => { setActiveTab('mcp'); setSearchQuery(''); setSelectedMcpServer(null); setSelectedMcpTool(null); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <Terminal size={16} />
            <span>MCP Servers</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'playground' ? 'active' : ''}`}
            onClick={() => { setActiveTab('playground'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <Play size={16} />
            <span>Tool Playground</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => { setActiveTab('skills'); setSearchQuery(''); setSelectedSkill(null); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <BookOpen size={16} />
            <span>Skills & Protocols</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'create-skill' ? 'active' : ''}`}
            onClick={() => { setActiveTab('create-skill'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <Plus size={16} />
            <span>Create Skill</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'plugins' ? 'active' : ''}`}
            onClick={() => { setActiveTab('plugins'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <Layers size={16} />
            <span>Plugins</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'subagents' ? 'active' : ''}`}
            onClick={() => { setActiveTab('subagents'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <Users size={16} />
            <span>Subagents</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'workspaces' ? 'active' : ''}`}
            onClick={() => { setActiveTab('workspaces'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <FolderOpen size={16} />
            <span>Workspaces</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tasks'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <History size={16} />
            <span>Task Monitor</span>
          </button>

          <button 
            className={`nav-link ${activeTab === 'diagnostics' ? 'active' : ''}`}
            onClick={() => { setActiveTab('diagnostics'); setSearchQuery(''); }}
            style={{ width: '100%', background: 'none', textAlign: 'left' }}
          >
            <Activity size={16} />
            <span>Diagnostics</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <button 
            onClick={toggleTheme}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              padding: '0.5rem'
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContext: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>v1.0.0</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {connected ? (
                <>
                  <CheckCircle size={12} color="#2ecc71" />
                  <span style={{ fontSize: '0.75rem', color: '#2ecc71', fontWeight: 500 }}>Live Link</span>
                </>
              ) : (
                <>
                  <AlertCircle size={12} color="#e74c3c" />
                  <span style={{ fontSize: '0.75rem', color: '#e74c3c', fontWeight: 500 }}>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header toolbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {activeTab === 'home' && `Welcome ${systemData?.username || 'User'}!`}
              {activeTab === 'mcp' && 'Model Context Protocol (MCP) Servers'}
              {activeTab === 'playground' && 'MCP Tool Playground'}
              {activeTab === 'skills' && 'Skills & Protocols'}
              {activeTab === 'create-skill' && 'Create Custom Skill'}
              {activeTab === 'plugins' && 'Installed Plugins'}
              {activeTab === 'subagents' && 'Active Subagents'}
              {activeTab === 'workspaces' && 'Workspace Projects'}
              {activeTab === 'tasks' && 'Live Task Logs'}
              {activeTab === 'diagnostics' && 'System Diagnostics'}
              {activeTab === 'search' && 'Global Search'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {activeTab === 'home' && 'Here is an overview of your connected agent capabilities.'}
              {activeTab === 'mcp' && 'Explore server connections and available LLM tool configurations.'}
              {activeTab === 'playground' && 'Fill in tool parameters visually to construct valid JSON integration calls.'}
              {activeTab === 'skills' && 'Manage and inspect procedural guidelines injected into Antigravity.'}
              {activeTab === 'create-skill' && 'Save markdown protocols dynamically to your active skills library.'}
              {activeTab === 'plugins' && 'View installed plugins adding specific features and workspace hooks.'}
              {activeTab === 'subagents' && 'Observe spawned parallel LLM processes thinking and executing tasks.'}
              {activeTab === 'workspaces' && 'Crawl local workspace directories and copy project navigation commands.'}
              {activeTab === 'tasks' && 'Monitor active task terminals and inspect running operation logs.'}
              {activeTab === 'diagnostics' && 'Troubleshoot configuration, verify file paths, and monitor status.'}
              {activeTab === 'search' && 'Search for terms across all servers, tools, skills, and plugins.'}
            </p>
          </div>

          {activeTab !== 'diagnostics' && (
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          )}
        </header>

        {/* Dynamic page content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
