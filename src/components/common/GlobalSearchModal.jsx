import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, CheckSquare, BookOpen, Target, FileText, Clock, BarChart3, X } from 'lucide-react';

export const GlobalSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, tasks, subjects, topics, notes, exams, mockTests, setActiveTab } = useApp();
  const inputRef = useRef(null);

  // Keyboard shortcut listener Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  // Search across stores
  const filteredTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : [];
  const filteredSubjects = q ? subjects.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) : [];
  const filteredTopics = q ? topics.filter(tp => tp.name.toLowerCase().includes(q)) : [];
  const filteredNotes = q ? notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) : [];
  const filteredExams = q ? exams.filter(ex => ex.title.toLowerCase().includes(q)) : [];
  const filteredMocks = q ? mockTests.filter(m => m.testName.toLowerCase().includes(q)) : [];

  const hasResults = filteredTasks.length > 0 || filteredSubjects.length > 0 || filteredTopics.length > 0 || filteredNotes.length > 0 || filteredExams.length > 0 || filteredMocks.length > 0;

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '680px', padding: '1.25rem' }} onClick={(e) => e.stopPropagation()}>
        {/* Search Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <Search size={20} style={{ color: 'var(--accent-primary)' }} />
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            placeholder="Global search across tasks, subjects, notes, exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '1.05rem', boxShadow: 'none' }}
          />
          <button className="btn-icon" onClick={() => setIsSearchOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Search Results Area */}
        <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!q && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Type keyword to search EduTrack... Try <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>"Data Interpretation"</span> or <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>"Reasoning"</span>
            </div>
          )}

          {q && !hasResults && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matches found for "{searchQuery}". Try a different search term.
            </div>
          )}

          {/* Task Results */}
          {filteredTasks.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckSquare size={14} /> Tasks ({filteredTasks.length})
              </div>
              {filteredTasks.map(t => (
                <div key={t.id} onClick={() => navigateTo('tasks')} style={resultItemStyle}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Status: {t.status} • Priority: {t.priority}</div>
                </div>
              ))}
            </div>
          )}

          {/* Subject Results */}
          {filteredSubjects.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={14} /> Subjects ({filteredSubjects.length})
              </div>
              {filteredSubjects.map(s => (
                <div key={s.id} onClick={() => navigateTo('subjects')} style={resultItemStyle}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{s.name} ({s.code})</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.topicsCount} Topics • Avg: {s.testAverage}%</div>
                </div>
              ))}
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FileText size={14} /> Notes ({filteredNotes.length})
              </div>
              {filteredNotes.map(n => (
                <div key={n.id} onClick={() => navigateTo('notes')} style={resultItemStyle}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{n.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{n.tags.join(', ')}</div>
                </div>
              ))}
            </div>
          )}

          {/* Exam Results */}
          {filteredExams.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} /> Exams ({filteredExams.length})
              </div>
              {filteredExams.map(ex => (
                <div key={ex.id} onClick={() => navigateTo('exams')} style={resultItemStyle}>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{ex.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Date: {ex.date} • Target: {ex.targetScore}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const resultItemStyle = {
  padding: '0.6rem 0.85rem',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-tertiary)',
  cursor: 'pointer',
  marginBottom: '0.35rem',
  transition: 'background-color 0.15s ease'
};
