import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Search,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Folder,
  Layers
} from 'lucide-react';

export const QuestionsView = () => {
  const { mockTests, subjects } = useApp();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Extract all questions across all mock tests with metadata
  const allQuestions = [];
  mockTests.forEach(test => {
    const sub = subjects.find(s => s.id === test.subjectId);
    if (test.questions && Array.isArray(test.questions)) {
      test.questions.forEach(q => {
        allQuestions.push({
          ...q,
          testName: test.testName,
          subjectId: test.subjectId || 'other',
          subjectName: sub?.name || 'General Questions',
          subjectColor: sub?.color || '#6366f1'
        });
      });
    }
  });

  const filteredQuestions = allQuestions.filter(q => {
    if (selectedSubjectFilter !== 'ALL' && q.subjectId !== selectedSubjectFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const textMatch = q.questionText.toLowerCase().includes(query);
      const testMatch = q.testName.toLowerCase().includes(query);
      const optMatch = q.options.some(o => o.toLowerCase().includes(query));
      return textMatch || testMatch || optMatch;
    }
    return true;
  });

  // Group questions by Subject
  const subjectGroups = subjects.map(sub => {
    const questionsForSub = filteredQuestions.filter(q => q.subjectId === sub.id);
    return {
      subject: sub,
      questions: questionsForSub
    };
  }).filter(group => group.questions.length > 0);

  // Catch any questions with missing or custom subjectId
  const unassignedQuestions = filteredQuestions.filter(q => !subjects.some(s => s.id === q.subjectId));
  if (unassignedQuestions.length > 0) {
    subjectGroups.push({
      subject: { id: 'other', name: 'General Questions', color: '#6366f1' },
      questions: unassignedQuestions
    });
  }

  const toggleSubject = (subId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  const toggleExpandAll = () => {
    const allExpanded = subjectGroups.every(g => expandedSubjects[g.subject.id]);
    if (allExpanded) {
      setExpandedSubjects({});
    } else {
      const nextState = {};
      subjectGroups.forEach(g => { nextState[g.subject.id] = true; });
      setExpandedSubjects(nextState);
    }
  };

  const areAllExpanded = subjectGroups.length > 0 && subjectGroups.every(g => expandedSubjects[g.subject.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <HelpCircle size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Question Bank ({allQuestions.length} Questions)</span>
          </h1>
          <p className="page-subtitle">Grouped by subject name. Click any subject card to open all questions and answer keys</p>
        </div>

        {subjectGroups.length > 0 && (
          <button className="btn btn-secondary" onClick={toggleExpandAll}>
            <Layers size={16} /> {areAllExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search questions by keyword or options..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        <select
          className="select-field"
          style={{ width: 'auto', minWidth: '180px' }}
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
        >
          <option value="ALL">All Subjects ({subjects.length})</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Subject Folders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {subjectGroups.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <HelpCircle size={42} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4, color: 'var(--accent-primary)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>No questions found</div>
            <div style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>Create custom mock tests in the "Mock Tests" section to populate your Question Bank!</div>
          </div>
        ) : (
          subjectGroups.map(({ subject, questions: subQuestions }) => {
            const isExpanded = !!expandedSubjects[subject.id];

            return (
              <div
                key={subject.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderLeft: `5px solid ${subject.color || 'var(--accent-primary)'}`
                }}
              >
                {/* Subject Name Clickable Card Header */}
                <div
                  onClick={() => toggleSubject(subject.id)}
                  style={{
                    padding: '1.1rem 1.35rem',
                    backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${subject.color || '#6366f1'}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: subject.color || '#6366f1'
                    }}>
                      <BookOpen size={20} />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {subject.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.1rem' }}>
                        {subQuestions.length} {subQuestions.length === 1 ? 'Question' : 'Questions'} Available • Click to {isExpanded ? 'close' : 'open'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: `${subject.color || '#6366f1'}20`,
                      color: subject.color || '#6366f1',
                      fontWeight: '800',
                      fontSize: '0.8rem'
                    }}>
                      {subQuestions.length} Qs
                    </span>

                    <button
                      className="btn-icon"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Questions & Answers List */}
                {isExpanded && (
                  <div style={{
                    padding: '1.25rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    backgroundColor: 'var(--bg-secondary)'
                  }}>
                    {subQuestions.map((q, qIdx) => (
                      <div
                        key={`${q.id}-${qIdx}`}
                        style={{
                          padding: '1.1rem 1.25rem',
                          borderRadius: 'var(--radius-lg)',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}
                      >
                        {/* Question Badge Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                            Mock Test: "{q.testName}"
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: subject.color || 'var(--accent-primary)' }}>
                            Question #{qIdx + 1}
                          </span>
                        </div>

                        {/* Question Text */}
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                          {q.questionText}
                        </h4>

                        {/* Options A, B, C, D */}
                        <div className="grid-2col" style={{ gap: '0.65rem' }}>
                          {q.options.map((opt, optIdx) => {
                            const isCorrectKey = optIdx === q.correctOption;
                            return (
                              <div
                                key={optIdx}
                                style={{
                                  padding: '0.6rem 0.85rem',
                                  borderRadius: 'var(--radius-md)',
                                  border: `1.5px solid ${isCorrectKey ? '#10b981' : 'var(--border-color)'}`,
                                  backgroundColor: isCorrectKey ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-tertiary)',
                                  color: isCorrectKey ? '#10b981' : 'var(--text-primary)',
                                  fontWeight: isCorrectKey ? '700' : '500',
                                  fontSize: '0.88rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}
                              >
                                <span style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '50%',
                                  backgroundColor: isCorrectKey ? '#10b981' : 'var(--bg-secondary)',
                                  color: isCorrectKey ? '#fff' : 'var(--text-secondary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem',
                                  fontWeight: '800'
                                }}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span style={{ flex: 1 }}>{opt}</span>
                                {isCorrectKey && <CheckCircle2 size={16} color="#10b981" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Solution Explanation */}
                        {q.explanation && (
                          <div style={{
                            padding: '0.6rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.82rem',
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic'
                          }}>
                            💡 <strong>Solution Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
