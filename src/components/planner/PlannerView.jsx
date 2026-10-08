import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Trash2,
  X,
  Play
} from 'lucide-react';

export const PlannerView = ({ onOpenTimer }) => {
  const { plannerSlots, setPlannerSlots, subjects, showToast } = useApp();

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    timeSlot: '06:00 - 07:30',
    subjectId: '',
    topicName: '',
    plannedMins: 90
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const slotsForDay = plannerSlots.filter(s => s.day === selectedDay);

  // Totals for selected day
  const totalPlanned = slotsForDay.reduce((acc, curr) => acc + curr.plannedMins, 0);
  const totalActual = slotsForDay.reduce((acc, curr) => acc + (curr.actualMins || 0), 0);

  const openAddSlotModal = () => {
    setFormData({
      day: selectedDay,
      timeSlot: '08:00 - 09:30',
      subjectId: subjects[0]?.id || '',
      topicName: '',
      plannedMins: 90
    });
    setIsModalOpen(true);
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!formData.topicName.trim()) {
      showToast('Please enter topic/activity name!', 'warning');
      return;
    }

    const newSlot = {
      id: `slot-${Date.now()}`,
      day: formData.day,
      timeSlot: formData.timeSlot,
      subjectId: formData.subjectId,
      topicName: formData.topicName,
      plannedMins: parseInt(formData.plannedMins, 10) || 60,
      actualMins: 0,
      completed: false
    };

    setPlannerSlots(prev => [...prev, newSlot]);
    showToast('Time slot added to study planner!', 'success');
    setIsModalOpen(false);
  };

  const toggleSlotCompleted = (slotId) => {
    setPlannerSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        const nextCompleted = !s.completed;
        return {
          ...s,
          completed: nextCompleted,
          actualMins: nextCompleted ? s.plannedMins : 0
        };
      }
      return s;
    }));
  };

  const deleteSlot = (slotId) => {
    setPlannerSlots(prev => prev.filter(s => s.id !== slotId));
    showToast('Time slot removed', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Daily & Weekly Study Planner</span>
          </h1>
          <p className="page-subtitle">Schedule your study slots and compare planned vs actual study time</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenTimer}>
            <Play size={18} /> Start Timer Session
          </button>
          <button className="btn btn-secondary" onClick={openAddSlotModal}>
            <Plus size={18} /> Add Time Slot
          </button>
        </div>
      </div>

      {/* Planned vs Actual Summary Bar */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(16, 185, 129, 0.1))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Day Planned Time
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
              {(totalPlanned / 60).toFixed(1)} hrs <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({totalPlanned} mins)</span>
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-color)' }} />

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Day Actual Time Logged
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>
              {(totalActual / 60).toFixed(1)} hrs <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({totalActual} mins)</span>
            </div>
          </div>
        </div>

        <div style={{ flex: '1 1 200px', minWidth: 0, width: '100%', maxWidth: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem' }}>
            <span>Target Adherence</span>
            <span>{totalPlanned > 0 ? Math.min(100, Math.round((totalActual / totalPlanned) * 100)) : 0}%</span>
          </div>
          <div className="progress-container">
            <div className="progress-fill" style={{
              width: `${totalPlanned > 0 ? Math.min(100, Math.round((totalActual / totalPlanned) * 100)) : 0}%`,
              backgroundColor: 'var(--accent-success)'
            }} />
          </div>
        </div>
      </div>

      {/* Days of Week Tab Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {daysOfWeek.map(day => {
          const isSelected = selectedDay === day;
          const dayCount = plannerSlots.filter(s => s.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '0.65rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                fontWeight: isSelected ? '700' : '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{day}</span>
              {dayCount > 0 && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)'
                }}>
                  {dayCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Timetable Schedule Grid for Selected Day */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>{selectedDay} Schedule Allocation</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {slotsForDay.length} Time Slots Planned
          </span>
        </div>

        {slotsForDay.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Calendar size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <div style={{ fontSize: '1rem', fontWeight: '700' }}>No time slots allocated for {selectedDay}</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Click "Add Time Slot" above to design your ideal study timetable.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {slotsForDay.map(slot => {
              const sub = subjects.find(s => s.id === slot.subjectId);

              return (
                <div
                  key={slot.id}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderLeft: `5px solid ${sub?.color || 'var(--accent-primary)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="checkbox"
                      checked={slot.completed}
                      onChange={() => toggleSlotCompleted(slot.id)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: '800', color: sub?.color || 'var(--accent-primary)', textTransform: 'uppercase' }}>
                        ⏰ {slot.timeSlot} • ({slot.plannedMins} Mins)
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                        {slot.topicName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Subject: {sub?.name || 'General Study'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: slot.completed ? '#10b981' : 'var(--text-muted)' }}>
                        {slot.completed ? `Done: ${slot.actualMins} mins` : 'Pending'}
                      </div>
                    </div>
                    <button className="btn-icon" onClick={() => deleteSlot(slot.id)} title="Delete Slot" style={{ color: 'var(--accent-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Time Slot Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Allocate Study Time Slot</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Day of Week</label>
                  <select
                    className="select-field"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  >
                    {daysOfWeek.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Time Window (e.g. 06:00 - 07:30 AM)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Subject</label>
                <select
                  className="select-field"
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Topic / Activity Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Quantitative Aptitude: DI Practice"
                  value={formData.topicName}
                  onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Planned Duration (Minutes)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.plannedMins}
                  onChange={(e) => setFormData({ ...formData, plannedMins: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Slot
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
