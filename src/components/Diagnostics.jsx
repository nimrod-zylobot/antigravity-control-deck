import React from 'react';
import { Activity, Cpu, Database, RefreshCw, Server, Shield, Clipboard, Check } from 'lucide-react';

export default function Diagnostics({ systemData, refreshData }) {
  const [copiedKey, setCopiedKey] = React.useState(null);

  if (!systemData) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>System statistics loading or unavailable.</p>
      </div>
    );
  }

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const pathList = [
    { label: 'MCP Configurations', path: systemData.paths.mcp, key: 'mcp' },
    { label: 'Active Skills Directory', path: systemData.paths.skills, key: 'skills' },
    { label: 'Installed Plugins Directory', path: systemData.paths.plugins, key: 'plugins' },
    { label: 'Current Process Directory', path: systemData.paths.cwd, key: 'cwd' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Overview Cards */}
      <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {/* OS info */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <Cpu size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Host System</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{systemData.os.hostname}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            {systemData.os.type} ({systemData.os.arch})
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Release {systemData.os.release}</span>
        </div>

        {/* Node version */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <Server size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Runtime</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Node.js {systemData.nodeVersion}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Memory footprint: {systemData.memory.free} Free / {systemData.memory.total} Total
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Process using {systemData.memory.usage} of memory</span>
        </div>

        {/* Uptime */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <Activity size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>System Status</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Uptime: {formatUptime(systemData.os.uptime)}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Active connections monitored live.
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last synced: {new Date(systemData.time).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Directory configuration paths */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
            <Database size={20} color="#4facfe" />
            <span>Path Settings & Boundaries</span>
          </h3>
          
          <button 
            onClick={refreshData}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Scan</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pathList.map(({ label, path, key }) => (
            <div 
              key={key} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem', 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '10px' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                <button
                  onClick={() => copyToClipboard(path, key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem'
                  }}
                >
                  {copiedKey === key ? (
                    <>
                      <Check size={12} color="#2ecc71" />
                      <span style={{ color: '#2ecc71' }}>Copied</span>
                    </>
                  ) : (
                    <>
                      <Clipboard size={12} />
                      <span>Copy Path</span>
                    </>
                  )}
                </button>
              </div>
              <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {path}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Security boundary note */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', borderLeft: '4px solid #7928ca' }}>
        <Shield size={22} color="#7928ca" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Access Policy Notice</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
            This local dashboard operates inside a sandboxed environment. File writes are restricted to directory <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>antigravity/scratch/</code>. Reading configuration files outside standard settings paths requires explicit user authorization prompts to preserve system-level protection integrity.
          </p>
        </div>
      </div>

    </div>
  );
}
