import React, { useState } from 'react';
import { BookOpen, Tag, Calendar, User, ShieldAlert, ArrowLeft, ExternalLink } from 'lucide-react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true, linkify: true, breaks: true });

export default function SkillsViewer({ skillsData, searchQuery }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  if (!skillsData || skillsData.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No Antigravity Skills detected.</p>
      </div>
    );
  }

  // Categories list
  const categories = ['all', ...new Set(skillsData.map(s => s.category).filter(Boolean))];

  // Filtering logic
  const filteredSkills = skillsData.filter(skill => {
    const matchesSearch = 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getRiskBadgeColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'safe': return 'badge-green';
      case 'medium': return 'badge-yellow';
      case 'high': return 'badge-pink';
      default: return 'badge-cyan';
    }
  };

  if (selectedSkill) {
    // Render detailed Markdown Protocol View
    const renderedHtml = md.render(selectedSkill.bodyMarkdown || selectedSkill.rawMarkdown);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
        
        {/* Back Button */}
        <div>
          <button 
            onClick={() => setSelectedSkill(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Skills Grid</span>
          </button>
        </div>

        {/* Skill Header Details */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-violet">{selectedSkill.category}</span>
              <span className={`badge ${getRiskBadgeColor(selectedSkill.risk)}`}>Risk: {selectedSkill.risk}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Source: {selectedSkill.sourceType}</span>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedSkill.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.5' }}>{selectedSkill.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minWidth: '240px', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>AUTHOR</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', fontWeight: 500 }}>
                <User size={14} color="var(--text-secondary)" />
                <span>{selectedSkill.author}</span>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>DATE ADDED</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', fontWeight: 500 }}>
                <Calendar size={14} color="var(--text-secondary)" />
                <span>{selectedSkill.dateAdded || 'N/A'}</span>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>PATH</span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{selectedSkill.path}</span>
            </div>
          </div>
        </div>

        {/* Markdown Render Pane */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div 
            className="markdown-body" 
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>

      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Category Pills Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: '1px solid ' + (activeCategory === cat ? 'var(--accent-color)' : 'var(--border-color)'),
              background: activeCategory === cat ? 'var(--accent-glow)' : 'rgba(255, 255, 255, 0.02)',
              color: activeCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="bento-grid">
        {filteredSkills.map(skill => (
          <div 
            key={skill.id} 
            className="glass-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              cursor: 'pointer',
              minHeight: '220px'
            }}
            onClick={() => setSelectedSkill(skill)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-violet">{skill.category}</span>
              <span className={`badge ${getRiskBadgeColor(skill.risk)}`}>{skill.risk}</span>
            </div>
            
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>{skill.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>
              {skill.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {skill.author}</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {skill.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No skills match your filter criteria.</p>
        </div>
      )}

    </div>
  );
}
