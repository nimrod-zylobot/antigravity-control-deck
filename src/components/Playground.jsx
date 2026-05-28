import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Check, Play, BookOpen, AlertCircle } from 'lucide-react';

export default function Playground({ mcpData }) {
  const [selectedServerName, setSelectedServerName] = useState(mcpData?.[0]?.name || '');
  const [selectedToolName, setSelectedToolName] = useState('');
  const [args, setArgs] = useState({});
  const [copied, setCopied] = useState(false);

  const server = mcpData?.find(s => s.name === selectedServerName) || mcpData?.[0];
  const tools = server?.tools || [];
  const tool = tools.find(t => t.name === selectedToolName) || tools[0];

  useEffect(() => {
    if (server) {
      setSelectedToolName(server.tools?.[0]?.name || '');
    }
  }, [selectedServerName]);

  useEffect(() => {
    // Reset arguments when tool changes
    if (tool) {
      const initialArgs = {};
      const schema = tool.input_schema || tool.schema || {};
      const props = schema.properties || {};
      Object.entries(props).forEach(([key, val]) => {
        if (val.type === 'boolean') {
          initialArgs[key] = false;
        } else {
          initialArgs[key] = '';
        }
      });
      setArgs(initialArgs);
    }
  }, [selectedToolName, selectedServerName]);

  const handleArgChange = (name, value) => {
    setArgs(prev => ({ ...prev, [name]: value }));
  };

  const getCleanArgs = () => {
    const clean = {};
    if (!tool) return clean;
    const schema = tool.input_schema || tool.schema || {};
    const props = schema.properties || {};
    Object.keys(args).forEach(k => {
      // Only include if value is not empty string, or it is a boolean
      if (args[k] !== '' || props[k]?.type === 'boolean') {
        let val = args[k];
        if (props[k]?.type === 'integer' || props[k]?.type === 'number') {
          const num = Number(val);
          if (!isNaN(num)) val = num;
        }
        clean[k] = val;
      }
    });
    return clean;
  };

  const toolCallCode = JSON.stringify({
    ServerName: selectedServerName,
    ToolName: selectedToolName,
    Arguments: getCleanArgs()
  }, null, 2);

  const copyCode = () => {
    navigator.clipboard.writeText(`await call_mcp_tool(${toolCallCode});`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mcpData || mcpData.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No MCP data found. Connect an MCP server to use the playground.</p>
      </div>
    );
  }

  const schema = tool?.input_schema || tool?.schema || {};
  const props = schema.properties || {};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '550px' }} className="animate-fade-in">
      
      {/* Visual Form Builder */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 600 }}>
          <Terminal size={18} color="#00f2fe" />
          <span>Interactive Composer</span>
        </h3>

        {/* Dropdowns */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>MCP SERVER</label>
            <select
              value={selectedServerName}
              onChange={e => setSelectedServerName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              {mcpData.map(s => (
                <option key={s.name} value={s.name} style={{ background: '#1c2430' }}>{s.name}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>SELECT TOOL</label>
            <select
              value={selectedToolName}
              onChange={e => setSelectedToolName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {tools.map(t => (
                <option key={t.name} value={t.name} style={{ background: '#1c2430' }}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {tool?.description && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', padding: '0.75rem', borderRadius: '8px', lineHeight: '1.4' }}>
            {tool.description}
          </p>
        )}

        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: '350px', paddingRight: '0.5rem' }}>
          {Object.entries(props).map(([key, prop]) => {
            const isRequired = schema.required?.includes(key);
            
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                    {key} {isRequired && <span style={{ color: '#e74c3c' }}>*</span>}
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {prop.type}
                  </span>
                </div>
                
                {/* Form Controls based on property type */}
                {prop.enum ? (
                  <select
                    value={args[key] || ''}
                    onChange={e => handleArgChange(key, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                  >
                    <option value="">-- Choose option --</option>
                    {prop.enum.map(opt => (
                      <option key={opt} value={opt} style={{ background: '#1c2430' }}>{opt}</option>
                    ))}
                  </select>
                ) : prop.type === 'boolean' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox"
                      id={`chk-${key}`}
                      checked={args[key] || false}
                      onChange={e => handleArgChange(key, e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor={`chk-${key}`} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>True</label>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder={prop.description || `Enter ${key}...`}
                    value={args[key] || ''}
                    onChange={e => handleArgChange(key, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontFamily: prop.type === 'string' ? 'inherit' : 'var(--font-mono)'
                    }}
                  />
                )}
                
                {prop.description && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prop.description}</span>
                )}
              </div>
            );
          })}
          {Object.keys(props).length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>This tool takes no arguments.</span>
            </div>
          )}
        </div>
      </div>

      {/* JSON Code Generator Output */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#07090e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Generated Call Code
          </h3>
          <button
            onClick={copyCode}
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
              fontSize: '0.8rem',
              fontWeight: 500
            }}
          >
            {copied ? (
              <>
                <Check size={14} color="#2ecc71" />
                <span style={{ color: '#2ecc71' }}>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <pre
          style={{
            flex: 1,
            padding: '1.25rem',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            overflowX: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: '#38e5ff',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}
        >
          {`await call_mcp_tool(\n${toolCallCode}\n);`}
        </pre>
      </div>

    </div>
  );
}
