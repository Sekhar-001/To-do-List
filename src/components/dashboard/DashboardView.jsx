import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Flame,
  BarChart3,
  Sparkles,
  Target,
  BookOpen,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Play,
  Edit2,
  Trash2,
  Plus
} from 'lucide-react';

export const DashboardView = () => {
  const {
    profile,
    tasks,
    subjects,
    topics,
    exams,
    setExams,
    mockTests,
    setMockTests,
    studyLogs,
    toggleTaskStatus,
    deleteTask,
    getSmartRecommendations,
    setActiveTab,
    showToast
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Metrics
  const todayTasks = tasks.filter(t => t.startDate <= todayStr && t.dueDate >= todayStr);
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr);

  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.status === 'Completed' || t.status === 'Mastered' || t.status.startsWith('Revision'));
  const masteredTopicsCount = topics.filter(t => t.status === 'Mastered').length;
  const overallCompletionPct = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;

  const scheduledMockTests = mockTests
    .filter(m => m.status === 'Scheduled')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const completedMockTests = mockTests.filter(m => m.status === 'Completed');

  const upcomingExams = exams
    .filter(e => e.date >= todayStr)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const recommendations = getSmartRecommendations();

  // Delete Handlers for Dashboard
  const deleteExam = (id) => {
    setExams(prev => prev.filter(e => e.id !== id));
    showToast('Exam deadline deleted', 'info');
  };

  const deleteScheduledMockTest = (id) => {
    setMockTests(prev => prev.filter(m => m.id !== id));
    showToast('Scheduled mock test deleted', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Welcome Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.35rem' }}>👋</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Welcome back, {profile?.name || 'Student'}!</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Target Goal: <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{profile?.targetExam || 'Academic & Study Goals'}</span> • Daily Goal: <span style={{ fontWeight: '700' }}>{profile?.dailyTargetHours || 6.0} hrs</span>
          </p>
        </div>
      </div>

      {/* SCHEDULED MOCK TEST REMINDER ALERT BANNER (With Delete Option!) */}
      {scheduledMockTests.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.1rem 1.35rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <BarChart3 size={22} />
          </div>

          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⏰ Scheduled Mock Test Reminder
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
              "{scheduledMockTests[0].testName}" is scheduled for <span style={{ color: 'var(--accent-primary)' }}>{scheduledMockTests[0].scheduledDate} ({scheduledMockTests[0].scheduledTime})</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
              onClick={() => setActiveTab('mocktests')}
            >
              <Play size={16} /> Attempt Test <ChevronRight size={16} />
            </button>

            {/* Delete Scheduled Test Reminder */}
            <button
              className="btn-icon"
              onClick={() => deleteScheduledMockTest(scheduledMockTests[0].id)}
              title="Delete Scheduled Test"
              style={{ color: 'var(--accent-danger)', width: '36px', height: '36px' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Summary Overview Grid */}
      <div className="grid-stats">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={statIconStyle('var(--accent-primary)')}>
            <CheckSquare size={22} />
          </div>
          <div>
            <div style={statLabelStyle}>Tasks Completed / Created</div>
            <div style={statValueStyle}>{completedTasks.length} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {tasks.length} Total</span></div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={statIconStyle('#10b981')}>
            <Target size={22} />
          </div>
          <div>
            <div style={statLabelStyle}>Syllabus Topics Mastered</div>
            <div style={statValueStyle}>{masteredTopicsCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {totalTopics} Topics ({overallCompletionPct}%)</span></div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={statIconStyle('#ec4899')}>
            <Clock size={22} />
          </div>
          <div>
            <div style={statLabelStyle}>Exams & Deadlines</div>
            <div style={statValueStyle}>{upcomingExams.length} <span style={{ fontSize: '0.85rem', color: '#ec4899' }}>Active</span></div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={statIconStyle('#8b5cf6')}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div style={statLabelStyle}>Mock Tests Completed</div>
            <div style={statValueStyle}>{completedMockTests.length} <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>({scheduledMockTests.length} Scheduled)</span></div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={statIconStyle('#f59e0b')}>
            <Flame size={22} />
          </div>
          <div>
            <div style={statLabelStyle}>Active Study Streak</div>
            <div style={statValueStyle}>{profile?.streakDays || 1} Days <span style={{ fontSize: '0.85rem', color: '#f59e0b' }}>🔥 Active</span></div>
          </div>
        </div>
      </div>

      {/* 2-Column Dashboard Breakdown */}
      <div className="grid-2col">
        {/* Left Column: Tasks & Completed Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active & Created Tasks Card (With Direct Delete Option!) */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CheckSquare size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>Active & Pending Tasks ({pendingTasks.length})</span>
              </div>
              <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => setActiveTab('tasks')}>
                Manage Tasks
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <CheckSquare size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                  {tasks.length === 0 ? 'No tasks created yet.' : 'All tasks completed! Great job! ✨'}
                </p>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem', margin: '0 auto' }}
                  onClick={() => setActiveTab('tasks')}
                >
                  <Plus size={15} /> Create Your First Task
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {pendingTasks.slice(0, 5).map(t => {
                  const sub = subjects.find(s => s.id === t.subjectId);
                  return (
                    <div key={t.id} style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={t.status === 'Completed'}
                        onChange={() => toggleTaskStatus(t.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {t.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                          <span style={{ color: sub?.color || 'var(--accent-primary)', fontWeight: '700' }}>{sub?.code || 'GEN'}</span>
                          <span>•</span>
                          <span>Due: {t.dueDate}</span>
                        </div>
                      </div>
                      
                      <span className={`badge badge-${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>

                      {/* Task Edit & Delete Option Buttons */}
                      <button
                        className="btn-icon"
                        onClick={() => setActiveTab('tasks')}
                        title="Edit Task"
                        style={{ color: 'var(--accent-primary)', width: '30px', height: '30px' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => deleteTask(t.id)}
                        title="Delete Task"
                        style={{ color: 'var(--accent-danger)', width: '30px', height: '30px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Completed Activity Feed */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <span>Recently Completed Items ({completedTasks.length + completedTopics.length + completedMockTests.length})</span>
              </div>
            </div>

            {completedTasks.length + completedTopics.length + completedMockTests.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No completed items yet. Complete tasks or syllabus topics to see your achievements here! ✨
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {completedTasks.slice(0, 3).map(t => (
                  <div key={t.id} style={completedItemStyle}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.88rem', textDecoration: 'line-through' }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Task Completed</div>
                    </div>
                  </div>
                ))}

                {completedTopics.slice(0, 3).map(tp => (
                  <div key={tp.id} style={completedItemStyle}>
                    <Target size={16} color="var(--accent-primary)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{tp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Syllabus Status: {tp.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scheduled Tests & Upcoming Exams */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Upcoming Exams & Deadlines List (With Direct Delete Button Option!) */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Calendar size={18} style={{ color: '#ec4899' }} />
                <span>Exams & Scheduled Deadlines ({upcomingExams.length})</span>
              </div>
              <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => setActiveTab('exams')}>
                Manage Deadlines
              </button>
            </div>

            {upcomingExams.length === 0 ? (
              <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No exam deadlines. Click "Manage Deadlines" to add an exam!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {upcomingExams.map(ex => {
                  const daysLeft = Math.ceil((new Date(ex.date) - new Date(todayStr)) / (1000 * 3600 * 24));
                  return (
                    <div key={ex.id} style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{ex.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Target: {ex.targetScore} • {ex.type}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: daysLeft <= 7 ? '#ef4444' : 'var(--accent-primary)' }}>
                            {daysLeft <= 0 ? 'Today!' : `${daysLeft} Days`}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ex.date}</div>
                        </div>

                        {/* Exam Deadline Edit & Delete Option Buttons */}
                        <button
                          className="btn-icon"
                          onClick={() => setActiveTab('exams')}
                          title="Edit Exam Deadline"
                          style={{ color: 'var(--accent-primary)', width: '32px', height: '32px' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => deleteExam(ex.id)}
                          title="Delete Exam Deadline"
                          style={{ color: 'var(--accent-danger)', width: '32px', height: '32px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scheduled Mock Tests List (With Direct Delete Button Option!) */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <BarChart3 size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>Scheduled Mock Tests ({scheduledMockTests.length})</span>
              </div>
              <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }} onClick={() => setActiveTab('mocktests')}>
                All Mock Tests
              </button>
            </div>

            {scheduledMockTests.length === 0 ? (
              <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No scheduled tests. Click "All Mock Tests" to create custom tests!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {scheduledMockTests.map(m => (
                  <div key={m.id} style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{m.testName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        📅 Scheduled: <strong>{m.scheduledDate} ({m.scheduledTime})</strong>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('mocktests')}>
                        Attempt Test
                      </button>

                      {/* Scheduled Mock Test Edit & Delete Option Buttons */}
                      <button
                        className="btn-icon"
                        onClick={() => setActiveTab('mocktests')}
                        title="Edit Scheduled Mock Test"
                        style={{ color: 'var(--accent-primary)', width: '32px', height: '32px' }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => deleteScheduledMockTest(m.id)}
                        title="Delete Scheduled Mock Test"
                        style={{ color: 'var(--accent-danger)', width: '32px', height: '32px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const completedItemStyle = {
  padding: '0.65rem 0.85rem',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-tertiary)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem'
};

const statIconStyle = (color) => ({
  width: '46px',
  height: '46px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: `${color}18`,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
});

const statLabelStyle = {
  fontSize: '0.78rem',
  fontWeight: '700',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};

const statValueStyle = {
  fontSize: '1.3rem',
  fontWeight: '800',
  color: 'var(--text-primary)',
  lineHeight: 1.2
};
