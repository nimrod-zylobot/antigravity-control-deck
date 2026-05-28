import React, { useState, useEffect, useRef } from 'react';
import { Users, Bot, RefreshCw, Cpu, Activity, Clock, Terminal, HelpCircle } from 'lucide-react';

export default function SubagentsMonitor() {
  const [subagents, setSubagents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const pollIntervalRef = useRef(null);

  const fetchSubagents = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/subagents');
      if (res.ok) {
        const data = await res.json();
        setSubagents(data);
      }
    } catch (e) {
      console.error('Failed to fetch subagents:', e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubagents();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      pollIntervalRef.current = setInterval(() => {
        fetchSubagents(true);
      }, 3000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'running': return 'badge-green';
      case 'completed/waiting': return 'badge-yellow';
      case 'pending': return 'badge-cyan';
      default: return 'badge-cyan';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      
      {/* Title bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Active Subagents Monitor</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Observe spawned parallel LLM processes thinking and executing tasks in real-time.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              checked={autoRefresh}
              onChange={e => setAutoRefresh(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Live Streaming (3s)</span>
          </label>
          <button 
            onClick={() => fetchSubagents()}
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
            <span>Scan Subagents</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Scanning active thread logs...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {subagents.map(agent => (
            <div 
              key={agent.id}
              className="glass-card"
              style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr',
                gap: '2rem',
                padding: '2rem'
              }}
            >
              {/* Sidebar: Status & Type details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--border-color)', paddingRight: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--accent-glow)', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="#7928ca" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{agent.role}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{agent.typeName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                  <span className={`badge ${getStatusColor(agent.status)}`} style={{ alignSelf: 'flex-start' }}>
                    {agent.status}
                  </span>
                  
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Cpu size={12} />
                    <span>Steps Taken: {agent.stepsCount}</span>
                  </span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    <span>Active: {new Date(agent.lastActive).toLocaleTimeString()}</span>
                  </span>
                </div>
              </div>

              {/* Main content: original prompt and last step */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                    Spawned Conversation ID
                  </span>
                  <code style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    {agent.id}
                  </code>
                </div>

                {agent.prompt && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
                      Assigned Prompt Task
                    </span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', background: 'rgba(0,0,0,0.15)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', whiteSpace: 'pre-wrap' }}>
                      {agent.prompt}
                    </p>
                  </div>
                )}

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>
                    Current Activity / Last Execution
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f2fe', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    <Terminal size={14} />
                    <span>{agent.lastStep}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}

          {subagents.length === 0 && (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Users size={40} style={{ opacity: 0.2 }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>No Subagents Currently Active</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '500px', margin: '0.25rem auto 0' }}>
                  Parallel agents are spawned when executing codebase search tasks, long refactoring, or running background tests. Once active, their logs will stream here.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Decorative pulse styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
