import React from 'react';
import { 
  Terminal, 
  BookOpen, 
  Layers, 
  Cpu, 
  ArrowRight,
  Sparkles,
  Command,
  HelpCircle
} from 'lucide-react';

export default function DashboardHome({ mcpData, skillsData, pluginsData, systemData, setActiveTab }) {
  // Safe default lengths
  const mcpCount = mcpData?.length || 0;
  const skillsCount = skillsData?.length || 0;
  const pluginsCount = pluginsData?.length || 0;
  const osType = systemData?.os?.type || 'Windows';
  const nodeVer = systemData?.nodeVersion || 'N/A';
  const memUsage = systemData?.memory?.usage || 'N/A';

  // Compute total tools
  const toolsCount = mcpData?.reduce((acc, curr) => acc + (curr.tools?.length || 0), 0) || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome Banner */}
      <div 
        className="glass-card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(22, 28, 38, 0.4), rgba(79, 172, 254, 0.08))',
          padding: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <div style={{ zIndex: 1, maxWidth: '65%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="#4facfe" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#4facfe' }}>Antigravity Ecosystem Active</span>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', lineHeight: '1.2' }}>
            Supercharge your development flow with <span className="text-gradient">Agentic Intelligence</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Antigravity is connected to your local filesystem and custom model APIs. Use this control deck to manage tools, read protocol instructions, and troubleshoot integration hooks.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={() => setActiveTab('skills')}>
              <span>View Skills & Guides</span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => setActiveTab('mcp')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Terminal size={16} />
              <span>Explore MCP Tools</span>
            </button>
          </div>
        </div>
        
        {/* Large Decorative Orb */}
        <div 
          style={{
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(121, 40, 202, 0.1) 50%, rgba(0, 0, 0, 0) 100%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            position: 'absolute',
            right: '-30px',
            top: '-30px',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Bento Grid Analytics */}
      <div className="bento-grid">
        
        {/* MCP Box */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('mcp')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(0, 242, 254, 0.1)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
              <Terminal size={24} color="#00f2fe" />
            </div>
            <span className="badge badge-cyan">{toolsCount} Tools</span>
          </div>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{mcpCount}</h3>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Model Context Protocols</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>External API integrations connecting tools like Google Workspace, GitHub, and Composio.</p>
        </div>

        {/* Skills Box */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('skills')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(121, 40, 202, 0.1)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(121, 40, 202, 0.2)' }}>
              <BookOpen size={24} color="#7928ca" />
            </div>
            <span className="badge badge-violet">Active</span>
          </div>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{skillsCount}</h3>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Procedural Skills</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Injected prompt blueprints for specific tasks like Android CLI, UI guidelines, and sheet parsing.</p>
        </div>

        {/* Plugins Box */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('plugins')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 0, 128, 0.1)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 0, 128, 0.2)' }}>
              <Layers size={24} color="#ff0080" />
            </div>
            <span className="badge badge-pink">Installed</span>
          </div>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{pluginsCount}</h3>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Extension Plugins</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>System customizations grouping multiple subagents, tools, and hooks together.</p>
        </div>

        {/* System Diagnostics Box */}
        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('diagnostics')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <Cpu size={24} color="var(--text-secondary)" />
            </div>
            <span className="badge badge-green">Healthy</span>
          </div>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{osType}</h3>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Node {nodeVer}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Memory usage at {memUsage}. Running inside sandboxed environment with strict boundaries.</p>
        </div>

      </div>

      {/* Pro Tips / Dashboard Guide */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={20} color="#4facfe" />
          <span>Quick Interaction Reference</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
              <Command size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>How do I trigger a Skill?</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Skills are activated when your prompt touches a related topic. For instance, creating an Android layout triggers the <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>android-cli</code> skill.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
              <Command size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Where are MCP configurations?</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Model Context Protocols define the external APIs available to the model. Their schemas are stored inside <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>antigravity/mcp/</code> directory.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
              <Command size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Slash Commands Shortcut</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Type <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>/goal</code> to request long-running, autonomous actions or <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>/browser</code> for web tasks.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
