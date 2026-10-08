import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  BarChart3,
  Printer,
  FileText,
  Target
} from 'lucide-react';

export const ResultsView = () => {
  const { mockTests, subjects, profile, setActiveTab } = useApp();

  const completedTests = mockTests.filter(m => m.status === 'Completed');

  // Compute Subject Portfolio Metrics
  const subjectPortfolios = subjects.map(sub => {
    let totalQ = 0;
    let correctQ = 0;
    let wrongQ = 0;
    let totalMarks = 0;

    completedTests.forEach(test => {
      if (test.subjectId === sub.id) {
        totalQ += (test.totalQuestions || test.questions?.length || 0);
        correctQ += (test.correctCount || 0);
        wrongQ += (test.wrongCount || 0);
        totalMarks += (test.marksObtained || 0);
      }
    });

    const attempted = correctQ + wrongQ;
    const accuracy = attempted > 0 ? +((correctQ / attempted) * 100).toFixed(1) : 0;

    return {
      ...sub,
      totalQ,
      correctQ,
      wrongQ,
      unattemptedQ: Math.max(0, totalQ - attempted),
      totalMarks: +totalMarks.toFixed(2),
      accuracy
    };
  });

  const totalAllQuestions = subjectPortfolios.reduce((acc, curr) => acc + curr.totalQ, 0);
  const totalAllCorrect = subjectPortfolios.reduce((acc, curr) => acc + curr.correctQ, 0);
  const totalAllWrong = subjectPortfolios.reduce((acc, curr) => acc + curr.wrongQ, 0);
  const overallAccuracy = (totalAllCorrect + totalAllWrong) > 0 ? +((totalAllCorrect / (totalAllCorrect + totalAllWrong)) * 100).toFixed(1) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Award size={28} style={{ color: '#10b981' }} />
            <span>Subject Portfolio & Results Center</span>
          </h1>
          <p className="page-subtitle">Detailed subject-wise accuracy portfolio, total questions, correct & wrong performance stats</p>
        </div>

        <button className="btn btn-primary" onClick={() => setActiveTab('mocktests')}>
          <BarChart3 size={18} /> View All Mock Tests
        </button>
      </div>

      {/* Overall Student Performance Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.12))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>
            STUDENT PORTFOLIO SUMMARY
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.2rem' }}>{profile?.name || 'Student'}</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Target: <strong style={{ color: 'var(--accent-primary)' }}>{profile?.targetExam || 'My Study Goals'}</strong> • Tests Completed: <strong>{completedTests.length}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalAllQuestions}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>QUESTIONS ATTEMPTED</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>{totalAllCorrect}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>CORRECT ANSWERS</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ef4444' }}>{totalAllWrong}</div>
            <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700' }}>WRONG ANSWERS</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{overallAccuracy}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700' }}>OVERALL ACCURACY</div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Portfolio Grid */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '0.5rem' }}>Subject Portfolio Breakdown</h3>

      {subjectPortfolios.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Award size={42} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4, color: '#10b981' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>No performance analytics yet</div>
          <div style={{ fontSize: '0.88rem', marginTop: '0.35rem', marginBottom: '1.25rem' }}>Create custom subjects and complete mock tests to generate your performance scorecard!</div>
          <button className="btn btn-primary" onClick={() => setActiveTab('mocktests')} style={{ margin: '0 auto' }}>
            <BarChart3 size={16} /> Go to Mock Tests
          </button>
        </div>
      ) : (
        <div className="grid-2col">
          {subjectPortfolios.map(sub => (
            <div
              key={sub.id}
              className="card"
              style={{
                borderTop: `4px solid ${sub.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${sub.color}15`,
                      color: sub.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800'
                    }}>
                      {sub.code}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{sub.name}</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub.topicsCount} Syllabus Topics</span>
                    </div>
                  </div>

                  <span style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    backgroundColor: `${sub.color}18`,
                    color: sub.color
                  }}>
                    Accuracy: {sub.accuracy}%
                  </span>
                </div>

                {/* Subject Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  padding: '0.9rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL QUESTIONS</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>{sub.totalQ}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700' }}>CORRECT</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>{sub.correctQ}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: '700' }}>WRONG</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ef4444' }}>{sub.wrongQ}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    <span>Subject Accuracy Rate</span>
                    <span>{sub.accuracy}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${sub.accuracy}%`, backgroundColor: sub.color }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
