import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function CreateSkill({ refreshData, setActiveTab }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    risk: 'safe',
    author: 'Nimrod',
    tags: '',
    bodyMarkdown: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.bodyMarkdown) {
      setStatus({ type: 'error', message: 'Skill Name and Protocol Markdown are required!' });
      return;
    }

    setLoading(true);
    setStatus(null);

    const tagsArray = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch('/api/skills/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setStatus({
          type: 'success',
          message: `Skill saved successfully! Written to: ${result.path}`
        });
        
        // Refresh global state so new skill shows up immediately
        if (refreshData) refreshData();
        
        // Clear form
        setFormData({
          name: '',
          description: '',
          category: 'general',
          risk: 'safe',
          author: 'Nimrod',
          tags: '',
          bodyMarkdown: ''
        });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Failed to save the skill to the filesystem.'
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'Could not connect to backend server endpoint to write file.'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = () => {
    const template = `## When to Use
- Use when designing...
- Use when configuring...

## Limitations
- Does not support...
- Validate that...

## 1. Protocol Directives
Provide detailed guidelines for the AI agent to follow:
- **Rule 1:** Must always...
- **Rule 2:** Avoid using...

## 2. Examples & Best Practices
\`\`\`javascript
// Example helper implementation
const sample = () => {
  return true;
};
\`\`\`
`;
    setFormData(prev => ({ ...prev, bodyMarkdown: template }));
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }} className="animate-fade-in">
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem', fontWeight: 600 }}>
              <BookOpen size={22} color="#7928ca" />
              <span>Forge New Skill Blueprint</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Create a custom prompt protocol. It will be saved as a local `SKILL.md` inside your Antigravity skills directory.
            </p>
          </div>
          <button 
            type="button"
            onClick={loadTemplate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'var(--accent-glow)',
              border: '1px solid rgba(121, 40, 202, 0.3)',
              color: '#c996ff',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <Sparkles size={14} />
            <span>Load Protocol Template</span>
          </button>
        </div>

        {/* Status Messages */}
        {status && (
          <div 
            style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              padding: '1rem', 
              borderRadius: '10px', 
              marginBottom: '1.5rem',
              alignItems: 'center',
              background: status.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
              border: '1px solid ' + (status.type === 'success' ? 'rgba(46, 204, 113, 0.25)' : 'rgba(231, 76, 60, 0.25)'),
              color: status.type === 'success' ? '#2ecc71' : '#e74c3c',
              fontSize: '0.9rem'
            }}
          >
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span style={{ flex: 1 }}>{status.message}</span>
            {status.type === 'success' && (
              <button 
                onClick={() => setActiveTab('skills')}
                style={{
                  background: '#2ecc71',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View Skills List
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Top Form Fields Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>SKILL NAME <span style={{ color: '#e74c3c' }}>*</span></label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. NextJS SEO guidelines"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>CATEGORY</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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
                <option value="general" style={{ background: '#1c2430' }}>General</option>
                <option value="frontend" style={{ background: '#1c2430' }}>Frontend</option>
                <option value="backend" style={{ background: '#1c2430' }}>Backend</option>
                <option value="automation" style={{ background: '#1c2430' }}>Automation</option>
                <option value="marketing" style={{ background: '#1c2430' }}>Marketing</option>
                <option value="system" style={{ background: '#1c2430' }}>System</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>RISK LEVEL</label>
              <select
                name="risk"
                value={formData.risk}
                onChange={handleInputChange}
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
                <option value="safe" style={{ background: '#1c2430' }}>Safe (Read Only / Config)</option>
                <option value="medium" style={{ background: '#1c2430' }}>Medium (Edits Code)</option>
                <option value="high" style={{ background: '#1c2430' }}>High (Runs commands / Execs)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>AUTHOR</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>SKILL TAGS (Comma separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g. design, seo, custom-rules"
                value={formData.tags}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>SHORT DESCRIPTION</label>
              <input
                type="text"
                name="description"
                placeholder="Provide a brief summary of when the agent should apply this skill..."
                value={formData.description}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
            </div>

          </div>

          {/* Markdown editor */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>PROTOCOL CONTENT (Markdown) <span style={{ color: '#e74c3c' }}>*</span></label>
            <textarea
              name="bodyMarkdown"
              required
              rows={12}
              placeholder="# Protocol Title&#10;&#10;## When to Use&#10;- Bullet point instructions here..."
              value={formData.bodyMarkdown}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ 
              width: '100%', 
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <Send size={16} />
            <span>{loading ? 'Writing to Disk...' : 'Save Skill Blueprint'}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
