import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export const ExamsView = () => {
  const { exams, addExam, updateExam, deleteExam, subjects, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Competitive Exam',
    date: new Date().toISOString().split('T')[0],
    targetScore: '80 / 100',
    description: '',
    priority: 'High',
    subjectId: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const openAddModal = () => {
    setEditingExam(null);
    setFormData({
      title: '',
      type: 'Competitive Exam',
      date: new Date().toISOString().split('T')[0],
      targetScore: '80 / 100',
      description: '',
      priority: 'High',
      subjectId: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ex) => {
    setEditingExam(ex);
    setFormData({
      title: ex.title,
      type: ex.type,
      date: ex.date,
      targetScore: ex.targetScore || '',
      description: ex.description || '',
      priority: ex.priority || 'High',
      subjectId: ex.subjectId || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveExam = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Exam title is required!', 'warning');
      return;
    }

    if (editingExam) {
      updateExam(editingExam.id, formData);
    } else {
      addExam(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Clock size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Exams & Deadline Management</span>
          </h1>
          <p className="page-subtitle">Track competitive exams, assignments, projects, internal tests & application deadlines</p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Exam / Deadline
        </button>
      </div>

      {/* Countdown Cards Grid */}
      {exams.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Clock size={42} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4, color: 'var(--accent-primary)' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>No exams or deadlines scheduled</div>
          <div style={{ fontSize: '0.88rem', marginTop: '0.35rem', marginBottom: '1.25rem' }}>Track upcoming exams, mock tests, college finals, and deadlines with live day countdowns!</div>
          <button className="btn btn-primary" onClick={openAddModal} style={{ margin: '0 auto' }}>
            <Plus size={16} /> Add Your First Exam / Deadline
          </button>
        </div>
      ) : (
        <div className="grid-2col">
          {exams.map(ex => {
            const sub = subjects.find(s => s.id === ex.subjectId);
            const diffDays = Math.ceil((new Date(ex.date) - new Date(todayStr)) / (1000 * 3600 * 24));
            const isUrgent = diffDays <= 7;

            return (
              <div
                key={ex.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `5px solid ${isUrgent ? '#ef4444' : 'var(--accent-primary)'}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div>
                      <span className={`badge badge-${ex.priority.toLowerCase()}`} style={{ marginBottom: '0.35rem' }}>
                        {ex.type}
                      </span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '0.2rem' }}>{ex.title}</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        className="btn-icon"
                        onClick={() => openEditModal(ex)}
                        title="Edit Exam Deadline"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => deleteExam(ex.id)}
                        title="Delete Exam Deadline"
                        style={{ color: 'var(--accent-danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    {ex.description || 'No description provided.'}
                  </p>
                </div>

                {/* Countdown Bar */}
                <div style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isUrgent ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                  border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.25)' : 'var(--border-color)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                      Exam Date & Target
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                      📅 {ex.date} • Target: <span style={{ color: 'var(--accent-primary)' }}>{ex.targetScore}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: isUrgent ? '#ef4444' : 'var(--accent-primary)' }}>
                      {diffDays <= 0 ? 'Today!' : `${diffDays} Days`}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Countdown</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingExam ? 'Edit Exam / Deadline' : 'Add Exam / Deadline'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExam} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Exam / Event Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. SBI PO Mains Examination 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Deadline Type</label>
                  <select
                    className="select-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Competitive Exam">Competitive Exam</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                    <option value="Internal Exam">Internal Exam</option>
                    <option value="Application Deadline">Application Deadline</option>
                    <option value="Mock Test">Mock Test</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Target Score / Grade</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 85 / 100"
                    value={formData.targetScore}
                    onChange={(e) => setFormData({ ...formData, targetScore: e.target.value })}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Priority</label>
                  <select
                    className="select-field"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description & Notes</label>
                <textarea
                  className="textarea-field"
                  rows={3}
                  placeholder="Exam venue, syllabus coverage or registration requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Deadline
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
