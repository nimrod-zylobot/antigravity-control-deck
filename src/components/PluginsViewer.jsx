import React from 'react';
import { Layers, Shield, Sparkles, User, FileText } from 'lucide-react';

export default function PluginsViewer({ pluginsData, searchQuery }) {
  if (!pluginsData || pluginsData.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No Antigravity Plugins installed.</p>
      </div>
    );
  }

  // Filter plugins
  const filteredPlugins = pluginsData.filter(plugin => {
    return (
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plugin.keywords && plugin.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="bento-grid">
        {filteredPlugins.map(plugin => (
          <div key={plugin.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255, 0, 128, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 0, 128, 0.2)' }}>
                  <Layers size={20} color="#ff0080" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{plugin.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>v{plugin.version}</span>
                </div>
              </div>
              <span className="badge badge-pink" style={{ fontSize: '0.65rem' }}>{plugin.license}</span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem', flex: 1 }}>
              {plugin.description}
            </p>

            {/* Plugin Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                  <User size={12} />
                  <span>Author</span>
                </div>
                <span style={{ fontWeight: 500 }}>{plugin.author}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                  <FileText size={12} />
                  <span>Integrated Skills</span>
                </div>
                <span className="badge badge-violet" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{plugin.skillsCount} Skills</span>
              </div>

              {/* Keywords */}
              {plugin.keywords && plugin.keywords.length > 0 && (
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {plugin.keywords.map(kw => (
                    <span key={kw} className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Display absolute path on hover/debug */}
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.25rem' }}>
                {plugin.path}
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredPlugins.length === 0 && (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No plugins match your search query.</p>
        </div>
      )}

    </div>
  );
}
