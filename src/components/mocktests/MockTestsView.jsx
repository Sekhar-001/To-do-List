import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Play,
  Edit2,
  Trash2,
  Award,
  X,
  Printer,
  Download,
  Check,
  ChevronRight,
  FileText,
  Clipboard,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const MockTestsView = () => {
  const { mockTests, setMockTests, updateMockTest, subjects, profile, showToast } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);
  const [activeTakingTest, setActiveTakingTest] = useState(null); // Test object currently taking
  const [reviewTest, setReviewTest] = useState(null); // Test object reviewing result

  // Create/Edit Test Form State
  const [testTitle, setTestTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [durationMinutes, setDurationMinutes] = useState(15);
  
  // Importer Mode & Text
  const [activeBuilderTab, setActiveBuilderTab] = useState('bulk'); // 'bulk' | 'manual'
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkKeysText, setBulkKeysText] = useState('');

  // Questions Array Builder - starts empty for clean user creation
  const [questions, setQuestions] = useState([]);

  // Robust Universal Bulk Parser
  const parseBulkTextToQuestions = (text) => {
    if (!text || !text.trim()) return [];

    const cleanText = text.trim();

    // 1. Split questions by numbered headers (1., 1), Q1., Question 1, etc.) or double blank lines
    let rawBlocks = cleanText
      .split(/(?:^|\n)\s*(?=(?:Q\d+[:.\)\-]?|\d+[\.\)\:\-]|Question\s*\d+[:.\)\-]?)\s+)/i)
      .filter(b => b.trim().length > 0);

    // Fallback: If no numbered pattern detected, split by double newlines
    if (rawBlocks.length <= 1 && cleanText.includes('\n\n')) {
      rawBlocks = cleanText.split(/\n\s*\n/).filter(b => b.trim().length > 0);
    }

    const parsedQuestions = [];

    rawBlocks.forEach((block, index) => {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) return;

      const lines = trimmedBlock.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return;

      let questionStatement = '';
      let options = [];
      let correctOption = 0;
      let explanation = '';

      // Check for inline options on single lines
      const inlineOptionPattern = /(?:^|\s)(?:\(?([A-Da-d1-4])\)?[\.\:\-\)]\s*)([^\(\nA-Da-d1-4\.\:\-]+?)(?=(?:\s\(?[A-Da-d1-4]\)?[\.\:\-\)])|\s*(?:Answer|Ans|Key|Explanation)|$)/g;

      // Extract statement from first line(s)
      let firstLine = lines[0].replace(/^(?:Q\d+[:.\)\-]?|\d+[\.\)\:\-]|Question\s*\d+[:.\)\-]?)\s*/i, '').trim();
      questionStatement = firstLine;

      // Parse remaining lines
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // 1. Match Answer key line e.g. "Answer: A", "Ans: B", "Key: 3", "Correct: Option D"
        const ansMatch = line.match(/^(?:Answer|Ans|Key|Correct|Correct Option)[:\s\-\=\.]*(?:Option\s*)?\(?([A-D1-4])\)?/i);
        if (ansMatch) {
          const val = ansMatch[1].toUpperCase();
          if (['A', 'B', 'C', 'D'].includes(val)) {
            correctOption = val.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
          } else if (['1', '2', '3', '4'].includes(val)) {
            correctOption = parseInt(val, 10) - 1;
          }
          continue;
        }

        // 2. Match Explanation line e.g. "Explanation: ..." or "Solution: ..."
        const expMatch = line.match(/^(?:Explanation|Solution|Hint|Note)[:\s\-\=]*(.*)/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
          continue;
        }

        // 3. Match individual option line e.g. "A) 180", "A. 180", "(A) 180", "1) 180"
        const optMatch = line.match(/^(?:\(?([A-D1-4])\)?[\.\:\-\)]\s*)(.*)/i);
        if (optMatch && optMatch[2] !== undefined) {
          options.push(optMatch[2].trim());
          continue;
        }

        // 4. If no options matched yet and not answer/explanation, append to question statement
        if (options.length === 0) {
          questionStatement += ' ' + line;
        }
      }

      // If options were not found line-by-line, check for inline options in the whole block
      if (options.length === 0) {
        const matches = [...trimmedBlock.matchAll(inlineOptionPattern)];
        if (matches.length >= 2) {
          options = matches.map(m => m[2].trim());
        }
      }

      // Check if an answer key was mentioned inside the text block directly
      const inlineAnsMatch = trimmedBlock.match(/(?:Answer|Ans|Key|Correct Option)[:\s\-\=\.]*(?:Option\s*)?\(?([A-D1-4])\)?/i);
      if (inlineAnsMatch) {
        const val = inlineAnsMatch[1].toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(val)) {
          correctOption = val.charCodeAt(0) - 65;
        } else if (['1', '2', '3', '4'].includes(val)) {
          correctOption = parseInt(val, 10) - 1;
        }
      }

      // Ensure 4 options exist
      while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
      }

      parsedQuestions.push({
        id: `q-${Date.now()}-${index}`,
        questionText: questionStatement || `Question ${index + 1}`,
        options: options.slice(0, 4),
        correctOption: Math.min(3, Math.max(0, correctOption)),
        explanation: explanation || ''
      });
    });

    return parsedQuestions;
  };

  // Helper to parse answer key strings
  const parseBulkAnswerKeysString = (rawText, totalQs) => {
    if (!rawText || !rawText.trim()) return {};
    const text = rawText.trim();
    const keyMap = {};

    // Pattern 1: Numbered pairs e.g. "1-A" or "1. A" or "1: A" or "1) A" or "1-1"
    const numberedMatches = [...text.matchAll(/(?:^|[\s,;])(\d+)[\s\.\:\-\)]*([A-D1-4])(?=[\s,;\n]|$)/gi)];

    if (numberedMatches.length > 0) {
      numberedMatches.forEach(m => {
        const qNum = parseInt(m[1], 10) - 1; // 0-indexed
        const val = m[2].toUpperCase();
        let optIndex = 0;
        if (['A', 'B', 'C', 'D'].includes(val)) {
          optIndex = val.charCodeAt(0) - 65;
        } else if (['1', '2', '3', '4'].includes(val)) {
          optIndex = parseInt(val, 10) - 1;
        }
        if (qNum >= 0 && qNum < totalQs) {
          keyMap[qNum] = optIndex;
        }
      });
    } else {
      // Pattern 2: Extract pure sequence of A, B, C, D or 1, 2, 3, 4
      const tokens = text.split(/[\s,;\n]+/).filter(Boolean);
      let idx = 0;
      tokens.forEach(tok => {
        const clean = tok.trim().toUpperCase();
        if (/^[A-D]$/.test(clean)) {
          if (idx < totalQs) {
            keyMap[idx] = clean.charCodeAt(0) - 65;
            idx++;
          }
        } else if (/^[1-4]$/.test(clean)) {
          if (idx < totalQs) {
            keyMap[idx] = parseInt(clean, 10) - 1;
            idx++;
          }
        }
      });
    }

    return keyMap;
  };

  // Handle live textarea change with instant auto-parsing
  const handleBulkTextChange = (text) => {
    setBulkInputText(text);
    if (text.trim()) {
      const parsed = parseBulkTextToQuestions(text);
      if (parsed.length > 0) {
        setQuestions(parsed);
      }
    } else {
      setQuestions([]);
    }
  };

  // Paste directly from clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        showToast('Clipboard is empty or does not contain text!', 'warning');
        return;
      }
      setBulkInputText(text);
      const parsed = parseBulkTextToQuestions(text);
      if (parsed.length > 0) {
        setQuestions(parsed);
        showToast(`Pasted and parsed ${parsed.length} questions from clipboard! 🎉`, 'success');
      } else {
        showToast('Pasted text into box. Please review the question format.', 'info');
      }
    } catch (err) {
      showToast('Could not read clipboard automatically. Please press Ctrl+V in the box.', 'info');
    }
  };

  // Load Sample 5 Questions
  const loadSampleQuestions = () => {
    const sample = `1. What is the value of 15 * 12?
A) 150
B) 180
C) 200
D) 160
Answer: B
Explanation: 15 multiplied by 12 equals 180.

2. What is the capital city of India?
A) New Delhi
B) Mumbai
C) Kolkata
D) Chennai
Answer: A
Explanation: New Delhi is the national capital of India.

3. If a train travels 300 km in 5 hours, what is its speed?
A) 50 km/h
B) 60 km/h
C) 70 km/h
D) 80 km/h
Answer: B
Explanation: Speed = Distance / Time = 300 / 5 = 60 km/h.

4. Which gas do plants primarily absorb during photosynthesis?
A) Oxygen
B) Nitrogen
C) Carbon Dioxide
D) Hydrogen
Answer: C
Explanation: Plants absorb CO2 from the atmosphere to perform photosynthesis.

5. Find the next number in the sequence: 2, 4, 8, 16, ?
A) 24
B) 32
C) 30
D) 64
Answer: B
Explanation: Each number is doubled (2 * 2 = 4, 4 * 2 = 8, 8 * 2 = 16, 16 * 2 = 32).`;

    handleBulkTextChange(sample);
    showToast('Loaded 5 sample questions! ✨', 'success');
  };

  const handleImportBulkQuestions = () => {
    if (!bulkInputText.trim()) {
      showToast('Please paste your questions text first!', 'warning');
      return;
    }
    let parsed = parseBulkTextToQuestions(bulkInputText);
    if (parsed.length === 0) {
      showToast('Could not parse questions. Please check that each question has options (A, B, C, D).', 'warning');
      return;
    }

    // Apply bulk keys if present
    if (bulkKeysText.trim()) {
      const keyMap = parseBulkAnswerKeysString(bulkKeysText, parsed.length);
      if (Object.keys(keyMap).length > 0) {
        parsed = parsed.map((q, idx) => {
          if (keyMap[idx] !== undefined) {
            return { ...q, correctOption: keyMap[idx] };
          }
          return q;
        });
      }
    }

    setQuestions(parsed);
    showToast(`Successfully converted & loaded ${parsed.length} questions! 🎉`, 'success');
  };

  // Bulk Apply Answer Keys
  const handleApplyBulkAnswerKeys = () => {
    if (!bulkKeysText.trim()) {
      showToast('Please enter answer keys first!', 'warning');
      return;
    }

    let targetQuestions = [...questions];
    if (bulkInputText.trim() && targetQuestions.length === 0) {
      const parsed = parseBulkTextToQuestions(bulkInputText);
      if (parsed.length > 0) {
        targetQuestions = parsed;
      }
    }

    if (targetQuestions.length === 0) {
      showToast('Please paste questions text first before applying answer keys!', 'warning');
      return;
    }

    const keyMap = parseBulkAnswerKeysString(bulkKeysText, targetQuestions.length);
    const updatedCount = Object.keys(keyMap).length;

    if (updatedCount === 0) {
      showToast('Could not find valid answer keys (A, B, C, D or 1, 2, 3, 4).', 'warning');
      return;
    }

    const updatedQuestions = targetQuestions.map((q, idx) => {
      if (keyMap[idx] !== undefined) {
        return { ...q, correctOption: keyMap[idx] };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    showToast(`Applied answer keys to all ${updatedCount} questions! 🎉`, 'success');
  };

  const openCreateModal = () => {
    setEditingTestId(null);
    resetCreateForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (mock) => {
    setEditingTestId(mock.id);
    setTestTitle(mock.testName);
    setSubjectId(mock.subjectId || subjects[0]?.id || '');
    setScheduledDate(mock.scheduledDate || new Date().toISOString().split('T')[0]);
    setScheduledTime(mock.scheduledTime || '10:00 AM');
    setDurationMinutes(mock.durationMinutes || 15);
    setQuestions(mock.questions && mock.questions.length > 0 ? mock.questions : []);
    setIsCreateModalOpen(true);
  };

  const addQuestionField = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        explanation: ''
      }
    ]);
  };

  const updateQuestionText = (index, text) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index].questionText = text;
      return copy;
    });
  };

  const updateOptionText = (qIdx, optIdx, text) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].options[optIdx] = text;
      return copy;
    });
  };

  const updateCorrectOption = (qIdx, optIdx) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].correctOption = optIdx;
      return copy;
    });
  };

  const removeQuestion = (qIdx) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== qIdx));
  };

  const clearAllQuestions = () => {
    setQuestions([]);
    setBulkInputText('');
    setBulkKeysText('');
    showToast('Cleared all questions!', 'info');
  };

  const handleSaveMockTest = (e) => {
    e.preventDefault();
    if (!testTitle.trim()) {
      showToast('Please enter test title!', 'warning');
      return;
    }

    let finalQuestions = [...questions];

    // If user pasted bulk text in bulk tab, auto-parse questions on Save!
    if (activeBuilderTab === 'bulk' && bulkInputText.trim() && finalQuestions.length === 0) {
      const parsed = parseBulkTextToQuestions(bulkInputText);
      if (parsed.length > 0) {
        finalQuestions = parsed;
      }
    }

    // If bulkKeysText is provided, auto-apply bulk keys on Save!
    if (bulkKeysText.trim() && finalQuestions.length > 0) {
      const keyMap = parseBulkAnswerKeysString(bulkKeysText, finalQuestions.length);
      if (Object.keys(keyMap).length > 0) {
        finalQuestions = finalQuestions.map((q, idx) => {
          if (keyMap[idx] !== undefined) {
            return { ...q, correctOption: keyMap[idx] };
          }
          return q;
        });
      }
    }

    if (finalQuestions.length === 0) {
      showToast('Please add or paste at least 1 question for the mock test!', 'warning');
      return;
    }

    if (editingTestId) {
      updateMockTest(editingTestId, {
        testName: testTitle,
        subjectId,
        scheduledDate,
        scheduledTime,
        durationMinutes: parseInt(durationMinutes || 15, 10),
        totalQuestions: finalQuestions.length,
        questions: finalQuestions
      });
      showToast('Mock Test Updated Successfully!', 'success');
    } else {
      const newMock = {
        id: `mock-${Date.now()}`,
        testName: testTitle,
        subjectId,
        scheduledDate,
        scheduledTime,
        durationMinutes: parseInt(durationMinutes || 15, 10),
        status: 'Scheduled',
        totalQuestions: finalQuestions.length,
        questions: finalQuestions
      };
      setMockTests(prev => [newMock, ...prev]);
      showToast(`Created & Scheduled "${testTitle}" with ${finalQuestions.length} Questions! 🎉`, 'success');
    }

    setIsCreateModalOpen(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setEditingTestId(null);
    setTestTitle('');
    setScheduledDate(new Date().toISOString().split('T')[0]);
    setScheduledTime('10:00 AM');
    setDurationMinutes(15);
    setBulkInputText('');
    setBulkKeysText('');
    setActiveBuilderTab('bulk');
    setQuestions([]);
  };

  const deleteTest = (id) => {
    setMockTests(prev => prev.filter(m => m.id !== id));
    showToast('Mock test deleted', 'info');
  };

  const deleteAllOldTests = () => {
    if (window.confirm('Are you sure you want to delete all existing mock tests?')) {
      setMockTests([]);
      showToast('All mock tests cleared!', 'info');
    }
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginBottom: '0.4rem',
    color: 'var(--text-secondary)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BarChart3 size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Mock Test Creator & Performance Analytics</span>
          </h1>
          <p className="page-subtitle">Paste 30+ questions at once, schedule dates & write interactive tests 1 question at a time</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {mockTests.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={deleteAllOldTests}
              style={{ color: 'var(--accent-danger)' }}
              title="Delete all old mock tests"
            >
              <Trash2 size={16} /> Clear All Tests
            </button>
          )}

          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} /> Create Custom Mock Test
          </button>
        </div>
      </div>

      {/* Tests Overview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Scheduled Mock Tests Section */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Upcoming Scheduled Mock Tests ({mockTests.filter(m => m.status === 'Scheduled').length})</span>
            </div>
          </div>

          {mockTests.filter(m => m.status === 'Scheduled').length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <Clock size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <p style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.5rem' }}>No mock tests scheduled yet</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Create and paste your questions to schedule your first interactive test!</p>
              <button className="btn btn-primary" onClick={openCreateModal}>
                <Plus size={16} /> Create Mock Test Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {mockTests.filter(m => m.status === 'Scheduled').map(mock => {
                const sub = subjects.find(s => s.id === mock.subjectId);
                return (
                  <div
                    key={mock.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: `${sub?.color || 'var(--accent-primary)'}20`, color: sub?.color || 'var(--accent-primary)' }}>
                          {sub?.name || 'General Mock'}
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-icon" onClick={() => openEditModal(mock)} title="Edit Test">
                            <Edit2 size={15} />
                          </button>
                          <button className="btn-icon" onClick={() => deleteTest(mock.id)} style={{ color: '#ef4444' }} title="Delete Test">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                        {mock.testName}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={14} /> {mock.scheduledDate}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={14} /> {mock.durationMinutes} mins
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <HelpCircle size={14} /> {mock.questions ? mock.questions.length : mock.totalQuestions} Qs
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => setActiveTakingTest(mock)}
                    >
                      <Play size={16} /> Start Test Simulator
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Tests History Table */}
        {mockTests.filter(m => m.status === 'Completed').length > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Award size={18} style={{ color: '#10b981' }} />
                <span>Completed Tests & Scorecard History ({mockTests.filter(m => m.status === 'Completed').length})</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Test Name</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Subject</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Date Completed</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Marks Obtained</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Accuracy %</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTests.filter(m => m.status === 'Completed').map(mock => {
                    const sub = subjects.find(s => s.id === mock.subjectId);
                    return (
                      <tr key={mock.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>{mock.testName}</td>
                        <td style={{ padding: '0.9rem 1.25rem', color: sub?.color || 'var(--text-primary)', fontWeight: '700' }}>{sub?.name || 'General'}</td>
                        <td style={{ padding: '0.9rem 1.25rem' }}>{mock.completedDate}</td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: '800' }}>{mock.marksObtained} / {mock.totalQuestions}</td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#10b981', fontWeight: '800' }}>{mock.accuracy}%</td>
                        <td style={{ padding: '0.9rem 1.25rem', display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setReviewTest(mock)}>
                            <FileText size={14} /> Review & PDF Report
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MOCK TEST MODAL WITH BULK 30+ PASTE IMPORTER */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                {editingTestId ? 'Edit Scheduled Mock Test' : 'Create & Schedule Custom Mock Test'}
              </h3>
              <button className="btn-icon" onClick={() => setIsCreateModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMockTest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Test Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Speed Test & Assessment (30 Questions)"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid-3col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select
                    className="select-field"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Scheduled Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Duration (Mins)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                  />
                </div>
              </div>

              {/* MODE SELECTION TABS: BULK PASTE IMPORTER vs MANUAL BUILDER */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                
                {/* BULK ANSWER KEYS TOOL BAR */}
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#10b981' }}>
                    🔑 Bulk Add / Apply Answer Keys To All Questions at Once (Optional)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Paste all answer keys together (e.g. <code>A, B, C, D...</code> or <code>1-A, 2-B, 3-C, 4-D...</code>):
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. A, B, C, D, A, B, C... or 1-A, 2-C, 3-B, 4-D..."
                      value={bulkKeysText}
                      onChange={(e) => setBulkKeysText(e.target.value)}
                      style={{ flex: 1, minWidth: '260px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleApplyBulkAnswerKeys}
                      style={{ backgroundColor: '#10b981', padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                    >
                      ⚡ Apply Keys To All Questions
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                    <button
                      type="button"
                      className={`btn ${activeBuilderTab === 'bulk' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                      onClick={() => setActiveBuilderTab('bulk')}
                    >
                      📋 Bulk Paste 30+ Questions (Fastest)
                    </button>
                    <button
                      type="button"
                      className={`btn ${activeBuilderTab === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                      onClick={() => setActiveBuilderTab('manual')}
                    >
                      ✍️ Manual Question Builder ({questions.length})
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: questions.length > 0 ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                      color: questions.length > 0 ? '#10b981' : 'var(--text-muted)',
                      border: `1px solid ${questions.length > 0 ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`
                    }}>
                      {questions.length > 0 ? `✅ ${questions.length} Questions Loaded` : '0 Questions (Ready to Paste)'}
                    </span>

                    {questions.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllQuestions}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-danger)',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        🧹 Clear All
                      </button>
                    )}
                  </div>
                </div>

                {activeBuilderTab === 'bulk' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    
                    {/* Action Bar with Clipboard & Samples */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handlePasteFromClipboard}
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', gap: '0.4rem' }}
                        >
                          <Clipboard size={15} /> Paste from Clipboard
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={loadSampleQuestions}
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', gap: '0.4rem' }}
                        >
                          <Sparkles size={15} /> Load 5 Sample Qs
                        </button>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Instant auto-detection enabled as you paste!
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      💡 <strong>Quick Bulk Importer Instructions:</strong> Paste 10, 30, or 50 questions at once! Include <span style={{ color: '#10b981', fontWeight: '800' }}>Answer: A / B / C / D</span> at the end of each question to set key answers automatically:
                      <pre style={{ margin: '0.4rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
{`1. What is the value of 15 * 12?
A) 150
B) 180
C) 200
D) 160
Answer: B   <-- Sets Option B as correct Key Answer

2. What is the capital of India?
A) Delhi
B) Mumbai
C) Kolkata
D) Chennai
Answer: A   <-- Sets Option A as correct Key Answer`}
                      </pre>
                    </div>

                    <textarea
                      className="textarea-field"
                      rows={9}
                      placeholder="Paste all your questions here (e.g. 1. Question... A) ... B) ... C) ... D) ... Answer: A)..."
                      value={bulkInputText}
                      onChange={(e) => handleBulkTextChange(e.target.value)}
                    />

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleImportBulkQuestions}
                      >
                        ✨ Convert & Load Questions ({questions.length} Ready)
                      </button>

                      {questions.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setActiveBuilderTab('manual')}
                        >
                          👁️ View / Edit in Manual Builder ({questions.length})
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Edit individual questions below:</span>
                      <button type="button" className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }} onClick={addQuestionField}>
                        <Plus size={16} /> Add Single Question
                      </button>
                    </div>

                    {questions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ marginBottom: '0.75rem' }}>No questions added yet.</p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button type="button" className="btn btn-primary" onClick={() => setActiveBuilderTab('bulk')}>
                            Go to Bulk Paste &rarr;
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={addQuestionField}>
                            <Plus size={16} /> Add 1 Question Manually
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {questions.map((q, qIdx) => (
                          <div key={q.id} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>Question #{qIdx + 1}</span>
                                <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: '700' }}>
                                  Correct Key: Option {String.fromCharCode(65 + q.correctOption)}
                                </span>
                              </div>
                              <button type="button" onClick={() => removeQuestion(qIdx)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <textarea
                              className="textarea-field"
                              rows={2}
                              placeholder="Type question statement here..."
                              value={q.questionText}
                              onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                              style={{ marginBottom: '0.75rem' }}
                              required
                            />

                            {/* Options Grid */}
                            <div className="grid-2col" style={{ gap: '0.75rem', marginBottom: '0.75rem' }}>
                              {['Option A', 'Option B', 'Option C', 'Option D'].map((optLabel, optIdx) => (
                                <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <input
                                    type="radio"
                                    name={`correct-${qIdx}`}
                                    checked={q.correctOption === optIdx}
                                    onChange={() => updateCorrectOption(qIdx, optIdx)}
                                    style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
                                    title="Click green radio button to select as correct answer key"
                                  />
                                  <input
                                    type="text"
                                    className="input-field"
                                    placeholder={optLabel}
                                    value={q.options[optIdx]}
                                    onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                                    required
                                  />
                                </div>
                              ))}
                            </div>

                            <input
                              type="text"
                              className="input-field"
                              placeholder="Explanation / Solution hint (optional)..."
                              value={q.explanation}
                              onChange={(e) => {
                                const copy = [...questions];
                                copy[qIdx].explanation = e.target.value;
                                setQuestions(copy);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Schedule Mock Test ({questions.length} Qs)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAKE MOCK TEST SIMULATOR MODAL - WRITING TEST 1 QUESTION AT A TIME */}
      {activeTakingTest && (
        <TestTakingModal
          test={activeTakingTest}
          onClose={() => setActiveTakingTest(null)}
          onCompleted={(completedTestObj) => {
            setActiveTakingTest(null);
            setReviewTest(completedTestObj);
          }}
        />
      )}

      {/* REVIEW RESULT & PROFESSIONAL PDF DOWNLOAD MODAL */}
      {reviewTest && (
        <TestReviewModal test={reviewTest} subjects={subjects} profile={profile} onClose={() => setReviewTest(null)} />
      )}
    </div>
  );
};

// Interactive Test Simulator Component - Displays 1 Question At A Time with Palette
const TestTakingModal = ({ test, onClose, onCompleted }) => {
  const { setMockTests, showToast } = useApp();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeftSec, setTimeLeftSec] = useState((test.durationMinutes || 15) * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSec(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectAnswer = (qId, optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const submitTest = () => {
    let correctCount = 0;
    let wrongCount = 0;

    test.questions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected !== undefined) {
        if (selected === q.correctOption) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const marksObtained = +(correctCount - (wrongCount * 0.25)).toFixed(2);
    const accuracy = test.questions.length > 0 ? +((correctCount / test.questions.length) * 100).toFixed(1) : 0;
    const completedDate = new Date().toISOString().split('T')[0];

    const completedTestObj = {
      ...test,
      status: 'Completed',
      completedDate,
      correctCount,
      wrongCount,
      marksObtained,
      accuracy,
      userAnswers
    };

    setMockTests(prev => prev.map(m => m.id === test.id ? completedTestObj : m));
    showToast(`Test Submitted! Marks: ${marksObtained}/${test.questions.length} (Accuracy: ${accuracy}%)`, 'success');
    onCompleted(completedTestObj);
  };

  const currentQ = test.questions[currentQIndex];
  const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '850px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{test.testName}</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Question {currentQIndex + 1} of {test.questions.length}</span>
          </div>

          <div style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: '800', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} /> Time Left: {formatTime(timeLeftSec)}
          </div>
        </div>

        {/* 1 to N QUESTION PALETTE GRID */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {test.questions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isCurrent = idx === currentQIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQIndex(idx)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  border: isCurrent ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: isCurrent ? 'var(--accent-primary)' : isAnswered ? '#10b981' : 'var(--bg-secondary)',
                  color: (isCurrent || isAnswered) ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
                title={`Jump to Q${idx + 1} (${isAnswered ? 'Answered' : 'Not Answered'})`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* 1 QUESTION AT A TIME DISPLAY */}
        <div style={{ padding: '1.25rem 0' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', lineHeight: 1.4 }}>
            Q{currentQIndex + 1}. {currentQ.questionText}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => selectAnswer(currentQ.id, optIdx)}
                  style={{
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: isSelected ? '700' : '600',
                    fontSize: '0.95rem'
                  }}
                >
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-secondary" disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(prev => prev - 1)}>
            Previous
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {currentQIndex < test.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentQIndex(prev => prev + 1)}>
                Save & Next <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" style={{ backgroundColor: '#10b981' }} onClick={submitTest}>
                <Check size={16} /> Finish & Submit Test
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Review & Scorecard Modal Component
const TestReviewModal = ({ test, subjects, profile, onClose }) => {
  const sub = subjects.find(s => s.id === test.subjectId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Mock Test Performance & Detailed Report</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Diagnostic Analysis and Answer Key Solutions</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={handlePrint} style={{ gap: '0.4rem', fontSize: '0.85rem' }}>
              <Printer size={15} /> Print / Save PDF
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Score Card Header */}
        <div style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{test.testName}</h2>
              <div style={{ fontSize: '0.88rem', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '0.2rem' }}>
                Subject: {sub?.name || 'General Academic Mock'} ({sub?.code || 'GEN'})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Student Aspirant: <strong>{profile?.name || 'Student'}</strong> • Date Completed: <strong>{test.completedDate || new Date().toLocaleDateString()}</strong>
              </div>
            </div>

            {/* Score Badge Card */}
            <div style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--accent-primary)' }}>
                {test.marksObtained} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>/ {test.questions.length}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: '700' }}>
                Accuracy: {test.accuracy}%
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ padding: '0.6rem 0.85rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>Correct Answers</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>{test.correctCount || 0}</div>
            </div>
            <div style={{ padding: '0.6rem 0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700' }}>Wrong Answers</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ef4444' }}>{test.wrongCount || 0}</div>
            </div>
            <div style={{ padding: '0.6rem 0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Unanswered</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{test.questions.length - ((test.correctCount || 0) + (test.wrongCount || 0))}</div>
            </div>
          </div>
        </div>

        {/* Detailed Questions & Solutions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '800' }}>Question by Question Solutions:</h4>

          {test.questions.map((q, idx) => {
            const userAns = test.userAnswers ? test.userAnswers[q.id] : undefined;
            const isCorrect = userAns === q.correctOption;
            const isSkipped = userAns === undefined;

            return (
              <div
                key={q.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: `1.5px solid ${isCorrect ? 'rgba(16, 185, 129, 0.4)' : isSkipped ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.4)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>Q{idx + 1}. {q.questionText}</span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.15)' : isSkipped ? 'var(--bg-secondary)' : 'rgba(239, 68, 68, 0.15)',
                    color: isCorrect ? '#10b981' : isSkipped ? 'var(--text-muted)' : '#ef4444'
                  }}>
                    {isCorrect ? '✓ Correct (+1.0)' : isSkipped ? '⚪ Skipped (0.0)' : '✗ Wrong (-0.25)'}
                  </span>
                </div>

                {/* Options list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                  {q.options.map((opt, optIdx) => {
                    const isKey = optIdx === q.correctOption;
                    const isUserChoice = optIdx === userAns;

                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: isKey ? 'rgba(16, 185, 129, 0.15)' : isUserChoice && !isCorrect ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-secondary)',
                          border: `1px solid ${isKey ? '#10b981' : isUserChoice && !isCorrect ? '#ef4444' : 'var(--border-color)'}`,
                          fontWeight: isKey || isUserChoice ? '700' : '400'
                        }}
                      >
                        <span style={{ fontWeight: '800' }}>{String.fromCharCode(65 + optIdx)})</span>
                        <span>{opt}</span>
                        {isKey && <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: '0.75rem', fontWeight: '800' }}>Key ✓</span>}
                        {isUserChoice && !isKey && <span style={{ marginLeft: 'auto', color: '#ef4444', fontSize: '0.75rem', fontWeight: '800' }}>Your Ans ✗</span>}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <strong>💡 Solution & Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
