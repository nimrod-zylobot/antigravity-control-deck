import React from 'react';
import { Terminal, BookOpen, Layers, Search, ChevronRight } from 'lucide-react';

export default function GlobalSearch({ mcpData, skillsData, pluginsData, searchQuery, setActiveTab, setSelectedMcpServer, setSelectedSkillId }) {
  if (!searchQuery) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Search size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
        <p>Type in the header search bar above to crawl the entire deck.</p>
      </div>
    );
  }

  // 1. Crawl MCP
  const matchedTools = [];
  mcpData?.forEach(server => {
    server.tools?.forEach(tool => {
      if (
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        matchedTools.push({
          serverName: server.name,
          tool: tool
        });
      }
    });
  });

  // 2. Crawl Skills
  const matchedSkills = skillsData?.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (skill.bodyMarkdown && skill.bodyMarkdown.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  // 3. Crawl Plugins
  const matchedPlugins = pluginsData?.filter(plugin => 
    plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plugin.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const totalMatches = matchedTools.length + matchedSkills.length + matchedPlugins.length;

  const navigateToTool = (serverName, toolName) => {
    // Switch to MCP tab
    setActiveTab('mcp');
    // Trigger window custom event or hook (handled in App/Parent layout if we pass setters)
    if (window._mcpNavCallback) {
      window._mcpNavCallback(serverName, toolName);
    }
  };

  const navigateToSkill = (skill) => {
    setActiveTab('skills');
    if (window._skillsNavCallback) {
      window._skillsNavCallback(skill);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '1.25rem' }}>Global Search Results</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Found {totalMatches} results matching your search keyword <strong style={{ color: '#38e5ff' }}>"{searchQuery}"</strong>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* MCP matches */}
        {matchedTools.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Terminal size={16} />
              <span>MCP Server Tools ({matchedTools.length})</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {matchedTools.map(({ serverName, tool }) => (
                <div 
                  key={`${serverName}-${tool.name}`}
                  className="glass-card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', cursor: 'pointer' }}
                  onClick={() => navigateToTool(serverName, tool.name)}
                >
                  <div>
                    <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', marginBottom: '0.25rem' }}>{serverName}</span>
                    <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>{tool.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '600px' }}>
                      {tool.description}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills matches */}
        {matchedSkills.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <BookOpen size={16} />
              <span>Skills & Protocols ({matchedSkills.length})</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {matchedSkills.map(skill => (
                <div 
                  key={skill.id}
                  className="glass-card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', cursor: 'pointer' }}
                  onClick={() => navigateToSkill(skill)}
                >
                  <div>
                    <span className="badge badge-violet" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', marginBottom: '0.25rem' }}>{skill.category}</span>
                    <h4 style={{ fontSize: '0.95rem' }}>{skill.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '600px' }}>
                      {skill.description}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plugins matches */}
        {matchedPlugins.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Layers size={16} />
              <span>Plugins ({matchedPlugins.length})</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {matchedPlugins.map(plugin => (
                <div 
                  key={plugin.id}
                  className="glass-card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', cursor: 'pointer' }}
                  onClick={() => setActiveTab('plugins')}
                >
                  <div>
                    <span className="badge badge-pink" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', marginBottom: '0.25rem' }}>Plugin</span>
                    <h4 style={{ fontSize: '0.95rem' }}>{plugin.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '600px' }}>
                      {plugin.description}
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {totalMatches === 0 && (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No matches found across tools, skills, or plugins.</p>
          </div>
        )}

      </div>
    </div>
  );
}
