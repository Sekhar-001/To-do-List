import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, RotateCcw, Save, Clock, BookOpen, X, Sparkles } from 'lucide-react';

export const StudyTimerModal = ({ isOpen, onClose }) => {
  const {
    subjects,
    isTimerRunning,
    timerSeconds,
    timerSubjectId,
    setTimerSubjectId,
    startTimer,
    pauseTimer,
    resetTimer,
    saveTimerSession
  } = useApp();

  const [sessionNotes, setSessionNotes] = useState('');

  if (!isOpen) return null;

  const formatDisplay = (sec) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}>
            <Clock size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Interactive Study Session Timer</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Subject Selector */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
            Select Subject For Session
          </label>
          <select
            className="select-field"
            value={timerSubjectId}
            onChange={(e) => setTimerSubjectId(e.target.value)}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        {/* Live Timer Display Dial */}
        <div style={{
          padding: '2.5rem 1.5rem',
          margin: '1rem 0 1.5rem 0',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          position: 'relative'
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '3.5rem',
            fontWeight: '800',
            color: isTimerRunning ? 'var(--accent-primary)' : 'var(--text-primary)',
            letterSpacing: '0.05em'
          }}>
            {formatDisplay(timerSeconds)}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '600' }}>
            {isTimerRunning ? '⚡ Focus Mode Active...' : 'Paused / Ready to Focus'}
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          {!isTimerRunning ? (
            <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }} onClick={startTimer}>
              <Play size={20} /> Start Focus Session
            </button>
          ) : (
            <button className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }} onClick={pauseTimer}>
              <Pause size={20} /> Pause Timer
            </button>
          )}

          <button className="btn btn-secondary" onClick={resetTimer} title="Reset Timer">
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        {/* Save Session Action */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, backgroundColor: 'var(--accent-success)' }}
            onClick={() => {
              saveTimerSession();
              onClose();
            }}
          >
            <Save size={18} /> Log Study Time & Earn XP
          </button>
        </div>
      </div>
    </div>
  );
};
