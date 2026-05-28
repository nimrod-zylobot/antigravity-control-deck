import React, { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, Layers, Clock, FileText, CheckCircle, Radio } from 'lucide-react';

export default function TaskMonitor() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [logContent, setLogContent] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingLog, setLoadingLog] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const pollIntervalRef = useRef(null);
  const terminalEndRef = useRef(null);

  const fetchTasks = async (silent = false) => {
    if (!silent) setLoadingList(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        // Default to select first task if none selected
        if (data.length > 0 && !selectedTaskId) {
          setSelectedTaskId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoadingList(false);
    }
  };

  const fetchLogContent = async (taskId, silent = false) => {
    if (!taskId) return;
    if (!silent) setLoadingLog(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/log`);
      if (res.ok) {
        const data = await res.json();
        setLogContent(data.content || 'Log file is empty.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoadingLog(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (selectedTaskId) {
      fetchLogContent(selectedTaskId);
    }
  }, [selectedTaskId]);

  // Polling for Auto Refresh
  useEffect(() => {
    if (autoRefresh && selectedTaskId) {
      pollIntervalRef.current = setInterval(() => {
        fetchTasks(true);
        fetchLogContent(selectedTaskId, true);
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
  }, [autoRefresh, selectedTaskId]);

  // Scroll to bottom of terminal when log content changes
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logContent]);

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', minHeight: '600px' }} className="animate-fade-in">
      
      {/* Task Log Sidebar List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Execution Tasks
            </h3>
            <button 
              onClick={() => fetchTasks()} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {loadingList ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>Loading tasks...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto', flex: 1, maxHeight: '500px' }}>
              {tasks.map(t => {
                const isActive = t.id === selectedTaskId;
                const sizeKb = (t.size / 1024).toFixed(1);
                return (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTaskId(t.id); setAutoRefresh(false); }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: isActive ? 'rgba(0, 242, 254, 0.06)' : 'transparent',
                      border: '1px solid ' + (isActive ? 'rgba(0, 242, 254, 0.2)' : 'transparent'),
                      color: isActive ? '#38e5ff' : 'var(--text-secondary)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                      <Terminal size={14} />
                      <span>{t.id}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={10} />
                        {new Date(t.mtime).toLocaleTimeString()}
                      </span>
                      <span>{sizeKb} KB</span>
                    </div>
                  </button>
                );
              })}
              {tasks.length === 0 && (
                <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No active logs detected in this session.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Terminal View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Terminal Header Info */}
        <div className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem' }}>
              <Radio size={10} style={{ animation: 'pulse 1.5s infinite' }} />
              <span>Log Output stream</span>
            </span>
            <style>{`
              @keyframes pulse {
                0% { opacity: 0.3; }
                50% { opacity: 1; }
                100% { opacity: 0.3; }
              }
            `}</style>
            <h3 style={{ fontSize: '1.1rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
              {selectedTask ? selectedTask.fileName : 'Select a task...'}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Auto refresh checkbox */}
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
              onClick={() => fetchLogContent(selectedTaskId)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              <RefreshCw size={12} />
              <span>Reload Log</span>
            </button>
          </div>
        </div>

        {/* Terminal Window */}
        <div 
          style={{ 
            flex: 1, 
            background: '#040608', 
            border: '1px solid var(--border-color)', 
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          {/* OS Title Bar */}
          <div style={{ background: '#0e1117', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: '1rem' }}>
              bash - antigravity@task-terminal
            </span>
          </div>

          {/* Console Text area */}
          <div 
            style={{ 
              flex: 1, 
              padding: '1.5rem', 
              overflowY: 'auto', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.85rem', 
              color: '#a9b1d6', 
              lineHeight: '1.6',
              maxHeight: '450px'
            }}
          >
            {loadingLog ? (
              <p style={{ color: 'var(--text-muted)' }}>Retrieving log stream...</p>
            ) : (
              <>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{logContent}</pre>
                <div ref={terminalEndRef} />
              </>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
