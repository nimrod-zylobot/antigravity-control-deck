import React, { useState, useEffect } from 'react';
import { Folder, Clipboard, Check, RefreshCw, FolderPlus, ArrowRight } from 'lucide-react';

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const copyCommand = (wpath, key) => {
    const cmd = `cd "${wpath}"`;
    navigator.clipboard.writeText(cmd);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading workspaces...</p>
      </div>
    );
  }

  const scratchWorkspaces = workspaces.filter(w => w.group === 'scratch-workspace');
  const configProjects = workspaces.filter(w => w.group === 'config-projects');

  const renderGroup = (list, title, desc) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Folder size={18} color="#4facfe" />
          <span>{title}</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{desc}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {list.map((w, idx) => {
          const key = `${w.group}-${idx}`;
          return (
            <div 
              key={key}
              className="glass-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                gap: '1rem'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{w.name}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {w.path}
                </p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Modified: {new Date(w.mtime).toLocaleDateString()} {new Date(w.mtime).toLocaleTimeString()}
                </span>
              </div>

              <button
                onClick={() => copyCommand(w.path, key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.6rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
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
                    <span>Copy Path CD</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
        {list.length === 0 && (
          <p style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '10px', textAlign: 'center' }}>
            No workspace directories detected.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Active Workspaces & Projects</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Inspect local workspace structures and copy quick navigation command strings.</p>
        </div>
        <button 
          onClick={fetchWorkspaces}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500
          }}
        >
          <RefreshCw size={14} />
          <span>Refresh Lists</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {renderGroup(
          scratchWorkspaces, 
          'Scratch Workspace Folder', 
          'Default folders inside C:/Users/nimro/.gemini/antigravity/scratch/ where user test projects are built.'
        )}
        {renderGroup(
          configProjects, 
          'Config Projects Folder', 
          'Registered config projects tracked inside C:/Users/nimro/.gemini/config/projects/.'
        )}
      </div>
      
    </div>
  );
}
