import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Clock,
  Award,
  AlertCircle,
  Target,
  Edit,
  Trash2,
  X,
  Calculator,
  BrainCircuit,
  Landmark,
  Cpu
} from 'lucide-react';

export const SubjectsView = () => {
  const { subjects, topics, addSubject, updateSubject, deleteSubject, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubId, setEditingSubId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    color: '#6366f1',
    description: '',
    weakAreasText: ''
  });

  const openCreateModal = () => {
    setEditingSubId(null);
    setFormData({
      name: '',
      code: '',
      color: '#6366f1',
      description: '',
      weakAreasText: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSubId(sub.id);
    setFormData({
      name: sub.name,
      code: sub.code,
      color: sub.color,
      description: sub.description || '',
      weakAreasText: sub.weakAreas.join('\n')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Subject name is required!', 'warning');
      return;
    }

    const weakAreasArr = formData.weakAreasText.split('\n').filter(w => w.trim().length > 0);

    if (editingSubId) {
      updateSubject(editingSubId, {
        name: formData.name,
        code: formData.code,
        color: formData.color,
        description: formData.description,
        weakAreas: weakAreasArr
      });
      showToast('Subject updated successfully!', 'success');
    } else {
      addSubject({
        name: formData.name,
        code: formData.code,
        color: formData.color,
        description: formData.description,
        weakAreas: weakAreasArr
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BookOpen size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Subject Management</span>
          </h1>
          <p className="page-subtitle">Track academic subjects, topic mastery, weak areas, and total study hours</p>
        </div>

        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Custom Subject
        </button>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <BookOpen size={42} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4, color: 'var(--accent-primary)' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>No subjects added yet</div>
          <div style={{ fontSize: '0.88rem', marginTop: '0.35rem', marginBottom: '1.25rem' }}>Add your study subjects (e.g., Mathematics, General Studies, Reasoning) to get started!</div>
          <button className="btn btn-primary" onClick={openCreateModal} style={{ margin: '0 auto' }}>
            <Plus size={16} /> Add Your First Subject
          </button>
        </div>
      ) : (
        <div className="grid-2col">
          {subjects.map(sub => {
          const subTopics = topics.filter(t => t.subjectId === sub.id);
          const completedTopicsCount = subTopics.filter(t => t.status === 'Completed' || t.status === 'Mastered' || t.status.startsWith('Revision')).length;
          const totalCount = subTopics.length;
          const pct = totalCount > 0 ? Math.round((completedTopicsCount / totalCount) * 100) : 0;

          return (
            <div
              key={sub.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${sub.color}`
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
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
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{sub.name}</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{totalCount} Syllabus Topics</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button className="btn-icon" onClick={() => openEditModal(sub)} title="Edit Subject">
                      <Edit size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => deleteSubject(sub.id)} title="Delete Subject" style={{ color: 'var(--accent-danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {sub.description || 'No subject description provided.'}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    <span>Syllabus Completion</span>
                    <span>{pct}% ({completedTopicsCount}/{totalCount})</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: sub.color }} />
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>STUDY HOURS</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>{sub.studyHours}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>TEST AVG</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{sub.testAverage}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>PENDING</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f59e0b' }}>{totalCount - completedTopicsCount}</div>
                  </div>
                </div>

                {/* Identified Weak Areas List */}
                {sub.weakAreas && sub.weakAreas.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={14} /> Weak Areas Needing Revision:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {sub.weakAreas.map((w, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'rgba(239, 68, 68, 0.12)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          fontWeight: '600'
                        }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Subject Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingSubId ? 'Edit Subject' : 'Add Custom Subject'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Subject Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Data Interpretation"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Subject Code (3-4 Letters)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. DI"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Accent Color</label>
                <input
                  type="color"
                  className="input-field"
                  style={{ height: '42px', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  className="textarea-field"
                  rows={2}
                  placeholder="Subject scope, syllabus modules, or exam weightage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label style={labelStyle}>Weak Areas (One item per line)</label>
                <textarea
                  className="textarea-field"
                  rows={3}
                  placeholder="e.g. Caselet DI&#10;Radar Charts"
                  value={formData.weakAreasText}
                  onChange={(e) => setFormData({ ...formData, weakAreasText: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSubId ? 'Save Subject' : 'Create Subject'}
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
