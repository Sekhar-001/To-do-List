import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  RotateCw,
  CheckCircle2,
  Clock,
  Settings,
  Calendar,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';

export const RevisionView = () => {
  const { revisions, revisionConfig, setRevisionConfig, completeRevisionItem, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('Due'); // Due, Scheduled
  const [customIntervals, setCustomIntervals] = useState(revisionConfig.intervals.join(', '));

  const todayStr = new Date().toISOString().split('T')[0];

  const dueItems = revisions.filter(r => r.dueDate <= todayStr);
  const scheduledItems = revisions.filter(r => r.dueDate > todayStr);

  const displayedItems = activeTab === 'Due' ? dueItems : scheduledItems;

  const handleSaveIntervals = (e) => {
    e.preventDefault();
    const parsed = customIntervals.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    if (parsed.length === 0) {
      showToast('Invalid intervals format! Enter numbers separated by commas.', 'warning');
      return;
    }
    setRevisionConfig({ ...revisionConfig, intervals: parsed });
    showToast(`Updated Spaced Repetition schedule to: ${parsed.join(', ')} days`, 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <RotateCw size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Spaced Repetition Revision System</span>
          </h1>
          <p className="page-subtitle">Scientific spaced intervals (1, 3, 7, 15, 30 days) for maximum memory retention</p>
        </div>
      </div>

      {/* Spaced Intervals Config Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Configured Spaced Repetition Intervals</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Interval sequence (Days after study): {revisionConfig.intervals.map(i => `Day ${i}`).join(' ➔ ')}
          </p>
        </div>

        <form onSubmit={handleSaveIntervals} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-field"
            style={{ width: '160px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            value={customIntervals}
            onChange={(e) => setCustomIntervals(e.target.value)}
            placeholder="1, 3, 7, 15, 30"
          />
          <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
            Update Intervals
          </button>
        </form>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="btn"
          onClick={() => setActiveTab('Due')}
          style={{
            backgroundColor: activeTab === 'Due' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            color: activeTab === 'Due' ? '#ffffff' : 'var(--text-primary)',
            border: '1px solid var(--border-color)'
          }}
        >
          Due Revisions Today ({dueItems.length})
        </button>

        <button
          className="btn"
          onClick={() => setActiveTab('Scheduled')}
          style={{
            backgroundColor: activeTab === 'Scheduled' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            color: activeTab === 'Scheduled' ? '#ffffff' : 'var(--text-primary)',
            border: '1px solid var(--border-color)'
          }}
        >
          Upcoming Scheduled ({scheduledItems.length})
        </button>
      </div>

      {/* Revisions Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {displayedItems.length === 0 ? (
          <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RotateCw size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <div style={{ fontSize: '1rem', fontWeight: '700' }}>No revision items in "{activeTab}" queue</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Great memory performance! All topics revised on schedule.</div>
          </div>
        ) : (
          displayedItems.map(item => {
            const isDueToday = item.dueDate <= todayStr;

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderLeft: `5px solid ${isDueToday ? '#f59e0b' : 'var(--accent-primary)'}`
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                    {item.subjectName} • Stage {item.currentStage} Revision
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {item.topicName}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <span>Studied: {item.originalStudyDate}</span>
                    <span>•</span>
                    <span>Gap: {item.intervalDays} Days</span>
                    <span>•</span>
                    <span style={{ color: isDueToday ? '#ef4444' : 'var(--text-muted)', fontWeight: isDueToday ? '700' : '500' }}>
                      Due Date: {item.dueDate} {isDueToday && '(Due Today!)'}
                    </span>
                  </div>

                  {item.notes && (
                    <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                      Note: "{item.notes}"
                    </div>
                  )}
                </div>

                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => completeRevisionItem(item.id)}
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}
                  >
                    <CheckCircle2 size={16} /> Mark Revised
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
