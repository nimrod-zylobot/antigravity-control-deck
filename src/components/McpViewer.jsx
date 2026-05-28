import React, { useState } from 'react';
import { Terminal, Shield, Key, Cpu, HelpCircle, ChevronRight, Search } from 'lucide-react';

export default function McpViewer({ mcpData, searchQuery }) {
  const [selectedServer, setSelectedServer] = useState(mcpData?.[0]?.name || null);
  const [selectedTool, setSelectedTool] = useState(null);

  // Fallback if data hasn't loaded yet
  if (!mcpData || mcpData.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No Model Context Protocols detected.</p>
      </div>
    );
  }

  // Filter servers or tools if searchQuery is present
  const filteredServers = mcpData.map(server => {
    const matchingTools = server.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const matchesServerName = server.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (matchesServerName || matchingTools.length > 0) {
      return {
        ...server,
        // If server matched but no tool matched, keep all tools. Otherwise, keep only matching tools.
        tools: searchQuery && !matchesServerName ? matchingTools : server.tools,
        matched: true
      };
    }
    return { ...server, matched: false };
  }).filter(s => s.matched);

  const activeServerData = filteredServers.find(s => s.name === (selectedServer || filteredServers[0]?.name));
  const toolsList = activeServerData?.tools || [];
  const currentTool = selectedTool || toolsList[0];

  const handleServerClick = (name) => {
    setSelectedServer(name);
    setSelectedTool(null); // Reset tool selection
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', minHeight: '600px' }}>
      
      {/* Sidebar - MCP Server List & Tools List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Servers list */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            Connected Servers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {filteredServers.map(server => (
              <button
                key={server.name}
                onClick={() => handleServerClick(server.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: (selectedServer || filteredServers[0]?.name) === server.name ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: '1px solid ' + ((selectedServer || filteredServers[0]?.name) === server.name ? 'var(--border-color)' : 'transparent'),
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  <span style={{ fontSize: '1.1rem' }}>💻</span>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{server.name}</span>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{server.toolsCount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tools list in selected server */}
        {activeServerData && (
          <div className="glass-card" style={{ padding: '1rem', flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
              Available Tools ({toolsList.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {toolsList.map(tool => {
                const isActive = currentTool?.name === tool.name;
                return (
                  <button
                    key={tool.name}
                    onClick={() => setSelectedTool(tool)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                      border: '1px solid ' + (isActive ? 'rgba(0, 242, 254, 0.2)' : 'transparent'),
                      color: isActive ? '#38e5ff' : 'var(--text-secondary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tool.name}</span>
                    <ChevronRight size={14} style={{ opacity: isActive ? 1 : 0.3 }} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main View - Tool Inspector */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {currentTool ? (
          <>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-cyan">Tool Definition</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{activeServerData.name}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{currentTool.name}</h2>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {currentTool.description || 'No description provided for this tool.'}
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Input Parameters Schema</h3>
              {currentTool.input_schema || currentTool.schema ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* List of properties */}
                  {Object.entries((currentTool.input_schema || currentTool.schema).properties || {}).map(([key, prop]) => {
                    const isRequired = (currentTool.input_schema || currentTool.schema).required?.includes(key);
                    return (
                      <div 
                        key={key} 
                        style={{ 
                          padding: '1rem', 
                          background: 'rgba(255, 255, 255, 0.02)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '10px' 
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{key}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ff60ad' }}>{prop.type}</span>
                          {isRequired && <span className="badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.2)' }}>Required</span>}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                          {prop.description || 'No parameter description.'}
                        </p>
                        {prop.enum && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allowed values:</span>
                            {prop.enum.map(val => (
                              <code key={val} style={{ fontSize: '0.75rem', padding: '0.1rem 0.35rem', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', color: 'var(--text-primary)' }}>
                                {val}
                              </code>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {Object.keys((currentTool.input_schema || currentTool.schema).properties || {}).length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>This tool accepts no arguments.</p>
                  )}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No input schema specified.</p>
              )}
            </div>

            {/* Quick playground code snippet generator */}
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Integration Syntax
              </h3>
              <pre 
                style={{ 
                  background: 'rgba(0,0,0,0.25)', 
                  padding: '1rem', 
                  borderRadius: '10px', 
                  border: '1px solid var(--border-color)', 
                  fontSize: '0.8rem', 
                  fontFamily: 'var(--font-mono)',
                  overflowX: 'auto',
                  color: '#f0f3f6'
                }}
              >
                {`// In Antigravity Agent, run this tool via call_mcp_tool:\nawait call_mcp_tool({\n  ServerName: "${activeServerData.name}",\n  ToolName: "${currentTool.name}",\n  Arguments: {\n${Object.keys((currentTool.input_schema || currentTool.schema)?.properties || {}).slice(0, 2).map(k => `    ${k}: "..."`).join(',\n')}\n  }\n});`}
              </pre>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.5rem', color: 'var(--text-muted)' }}>
            <HelpCircle size={32} />
            <p>Select a tool from the list to inspect its schema details.</p>
          </div>
        )}
      </div>

    </div>
  );
}
