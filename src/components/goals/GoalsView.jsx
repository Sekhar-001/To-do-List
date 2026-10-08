import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Target,
  Plus,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

export const GoalsView = () => {
  const { goals, addGoal, updateGoalProgress, badges, profile, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Weekly',
    targetValue: 5,
    unit: 'Topics',
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Goal title is required!', 'warning');
      return;
    }

    addGoal(formData);
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Trophy size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Academic Goals & Productivity Badges</span>
          </h1>
          <p className="page-subtitle">Track daily, weekly, monthly study goals and unlock academic achievements</p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Create New Goal
        </button>
      </div>

      {/* Profile XP & Level Deck */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(245, 158, 11, 0.15))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent-primary)' }}
          />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              Level {profile.level} • {profile.levelTitle}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{profile.name}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Total Earned Experience: <strong style={{ color: 'var(--accent-primary)' }}>{profile.xp} XP</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f59e0b', fontWeight: '800', fontSize: '1.3rem' }}>
              <Flame size={20} fill="#f59e0b" /> {profile.streakDays} Days
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>CURRENT STREAK</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontWeight: '800', fontSize: '1.3rem' }}>
              <ShieldCheck size={20} /> 94 / 100
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>PRODUCTIVITY SCORE</div>
          </div>
        </div>
      </div>

      {/* Active Academic Goals List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Target size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Active Study & Performance Goals</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
            const isCompleted = g.status === 'Completed';

            return (
              <div
                key={g.id}
                style={{
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
                      {g.type} Goal
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {g.endDate}</span>
                  </div>

                  <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {g.title}
                  </div>

                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem' }}>
                      <span>Progress</span>
                      <span>{g.currentValue} / {g.targetValue} {g.unit} ({pct}%)</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: isCompleted ? '#10b981' : 'var(--accent-primary)' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.78rem', padding: '0.35rem' }} onClick={() => updateGoalProgress(g.id, 1)}>
                    +1 {g.unit} Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Deck */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Award size={18} style={{ color: '#f59e0b' }} />
            <span>Academic Achievement Badges</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {badges.map(b => (
            <div
              key={b.id}
              style={{
                padding: '1.1rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-tertiary)',
                border: `1px solid ${b.unlocked ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)'}`,
                opacity: b.unlocked ? 1 : 0.5,
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: b.unlocked ? `${b.color}20` : 'var(--bg-secondary)',
                color: b.unlocked ? b.color : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}>
                <Award size={26} />
              </div>

              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {b.title}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {b.description}
              </div>

              <div style={{ fontSize: '0.72rem', color: b.unlocked ? '#10b981' : 'var(--text-muted)', fontWeight: '700', marginTop: '0.5rem' }}>
                {b.unlocked ? `Unlocked ${b.unlockedDate}` : '🔒 Locked'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Create Academic Goal</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Goal Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Complete 5 Reasoning topics and attempt 3 mock tests"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Goal Scope</label>
                  <select
                    className="select-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Daily">Daily Goal</option>
                    <option value="Weekly">Weekly Goal</option>
                    <option value="Monthly">Monthly Goal</option>
                    <option value="Exam Goal">Exam Goal</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Target Completion Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Target Value</label>
                  <input
                    type="number"
                    className="input-field"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Unit of Measure</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Hours, Topics, Tests"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Goal
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
