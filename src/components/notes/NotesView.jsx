import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Tag,
  Paperclip,
  Trash2,
  Edit,
  ExternalLink,
  BookOpen,
  Search,
  X
} from 'lucide-react';

export const NotesView = () => {
  const { notes, setNotes, subjects, topics, showToast } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: subjects[0]?.id || '',
    topicId: '',
    content: '',
    tagsText: 'Formulas, Revision',
    attachmentName: '',
    attachmentUrl: ''
  });

  const filteredNotes = notes.filter(n => {
    if (selectedSubject !== 'ALL' && n.subjectId !== selectedSubject) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = n.title.toLowerCase().includes(q);
      const contentMatch = n.content.toLowerCase().includes(q);
      return titleMatch || contentMatch;
    }
    return true;
  });

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Note title is required!', 'warning');
      return;
    }

    const tagsArr = formData.tagsText.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const attachmentsArr = formData.attachmentName ? [{ name: formData.attachmentName, url: formData.attachmentUrl || '#', type: 'link' }] : [];

    const newNote = {
      id: `note-${Date.now()}`,
      title: formData.title,
      subjectId: formData.subjectId,
      topicId: formData.topicId,
      content: formData.content,
      tags: tagsArr,
      attachments: attachmentsArr,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setNotes(prev => [newNote, ...prev]);
    showToast('Note created successfully!', 'success');
    setIsModalOpen(false);
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast('Note deleted', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Notes & Study Resource Library</span>
          </h1>
          <p className="page-subtitle">Organize formulas, summary notes, PDF links, and study materials by Subject & Topic</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create Study Note
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search notes content & tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <select
          className="select-field"
          style={{ width: 'auto', minWidth: '180px' }}
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="ALL">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid-2col">
        {filteredNotes.map(n => {
          const sub = subjects.find(s => s.id === n.subjectId);
          const topic = topics.find(t => t.id === n.topicId);

          return (
            <div
              key={n.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${sub?.color || 'var(--accent-primary)'}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: sub?.color || 'var(--accent-primary)', textTransform: 'uppercase' }}>
                      {sub?.name || 'General Note'} {topic ? `• Topic: ${topic.name}` : ''}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '0.2rem' }}>{n.title}</h3>
                  </div>

                  <button className="btn-icon" onClick={() => deleteNote(n.id)} style={{ color: 'var(--accent-danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '0.9rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-primary)',
                  marginBottom: '1rem',
                  maxHeight: '180px',
                  overflowY: 'auto'
                }}>
                  {n.content}
                </div>

                {/* Attachments & Resource Links */}
                {n.attachments && n.attachments.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>ATTACHMENTS:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {n.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: '600',
                            padding: '0.25rem 0.65rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--accent-primary-light)',
                            color: 'var(--accent-primary)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Paperclip size={14} /> {att.name} <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <Tag size={14} style={{ color: 'var(--text-muted)' }} />
                {n.tags.map((tg, idx) => (
                  <span key={idx} style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    #{tg}
                  </span>
                ))}
                <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Created: {n.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Note Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Create Study Note / Material</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Note Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. High-Speed DI Calculation Methods"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select
                    className="select-field"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '' })}
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Topic (Optional)</label>
                  <select
                    className="select-field"
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  >
                    <option value="">-- Select Topic --</option>
                    {topics
                      .filter(tp => tp.subjectId === formData.subjectId)
                      .map(tp => (
                        <option key={tp.id} value={tp.id}>{tp.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Note Content (Markdown supported)</label>
                <textarea
                  className="textarea-field"
                  rows={5}
                  placeholder="Write formulas, definitions, key rules or study tips..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>Tags (Comma Separated)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Formulas, Banking, ShortTricks"
                  value={formData.tagsText}
                  onChange={(e) => setFormData({ ...formData, tagsText: e.target.value })}
                />
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Attachment Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. DI_Cheatsheet.pdf"
                    value={formData.attachmentName}
                    onChange={(e) => setFormData({ ...formData, attachmentName: e.target.value })}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Attachment URL</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="https://example.com/file.pdf"
                    value={formData.attachmentUrl}
                    onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const labelStyle = {
  fontSize: '0.82rem',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '0.35rem'
};
