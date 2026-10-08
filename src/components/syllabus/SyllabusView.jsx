import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

const statusFlow = ['Not Started', 'Learning', 'Completed', 'Revision 1', 'Revision 2', 'Mastered'];

export const SyllabusView = () => {
  const { topics, subjects, addTopic, updateTopic, updateTopicStatus, deleteTopic, showToast } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || '',
    name: '',
    status: 'Not Started',
    weightage: 'High',
    isWeak: false
  });

  const openAddModal = () => {
    setEditingTopic(null);
    setFormData({
      subjectId: subjects[0]?.id || '',
      name: '',
      status: 'Not Started',
      weightage: 'High',
      isWeak: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (tp) => {
    setEditingTopic(tp);
    setFormData({
      subjectId: tp.subjectId,
      name: tp.name,
      status: tp.status,
      weightage: tp.weightage,
      isWeak: !!tp.isWeak
    });
    setIsModalOpen(true);
  };

  const filteredTopics = topics.filter(tp => {
    if (selectedSubject !== 'ALL' && tp.subjectId !== selectedSubject) return false;
    if (selectedStatus !== 'ALL' && tp.status !== selectedStatus) return false;
    return true;
  });

  const totalCount = topics.length;
  const masteredCount = topics.filter(t => t.status === 'Mastered').length;
  const completedCount = topics.filter(t => t.status === 'Completed' || t.status.startsWith('Revision') || t.status === 'Mastered').length;
  const learningCount = topics.filter(t => t.status === 'Learning').length;

  const handleSaveTopic = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      showToast('Topic name is required!', 'warning');
      return;
    }

    if (editingTopic) {
      const success = updateTopic(editingTopic.id, { ...formData, name: trimmedName });
      if (success !== false) {
        setIsModalOpen(false);
      }
    } else {
      const isDuplicate = topics.some(
        t => t.name.trim().toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        showToast(`Topic "${trimmedName}" already exists in syllabus! Duplicates are not allowed.`, 'warning');
        return;
      }

      const success = addTopic({
        ...formData,
        name: trimmedName
      });

      if (success !== false) {
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Target size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Topic & Syllabus Tracker</span>
          </h1>
          <p className="page-subtitle">Track status progression: Not Started ➔ Learning ➔ Completed ➔ Revisions ➔ Mastered</p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Syllabus Topic
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid-stats">
        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>TOTAL SYLLABUS TOPICS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.2rem' }}>{totalCount}</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#10b981' }}>MASTERED TOPICS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginTop: '0.2rem' }}>
            {masteredCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({Math.round((masteredCount / totalCount) * 100 || 0)}%)</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-primary)' }}>COMPLETED / REVISED</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
            {completedCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({Math.round((completedCount / totalCount) * 100 || 0)}%)</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#f59e0b' }}>CURRENTLY LEARNING</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>{learningCount}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card filter-toolbar">
        <select
          className="select-field filter-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="ALL">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          className="select-field filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="ALL">All Status Levels</option>
          {statusFlow.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Topics Table List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredTopics.length === 0 ? (
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Target size={42} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4, color: 'var(--accent-primary)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>No syllabus topics found</div>
            <div style={{ fontSize: '0.88rem', marginTop: '0.35rem', marginBottom: '1.25rem' }}>Add topics to your syllabus to track learning and revision milestones!</div>
            <button className="btn btn-primary" onClick={openAddModal} style={{ margin: '0 auto' }}>
              <Plus size={16} /> Add Your First Topic
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: '700' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>Topic Name</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Subject</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Weightage</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Current Status</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Status Progress Action</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopics.map(tp => {
                const sub = subjects.find(s => s.id === tp.subjectId);

                return (
                  <tr key={tp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.9rem 1.25rem', fontWeight: '700' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {tp.name}
                        {tp.isWeak && (
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: '700' }}>
                            Weak Topic
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span style={{ color: sub?.color || 'var(--text-primary)', fontWeight: '700' }}>
                        {sub?.name || 'General'}
                      </span>
                    </td>

                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span className={`badge badge-${tp.weightage === 'High' ? 'urgent' : tp.weightage === 'Medium' ? 'medium' : 'low'}`}>
                        {tp.weightage}
                      </span>
                    </td>

                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        backgroundColor: statusColorMap(tp.status).bg,
                        color: statusColorMap(tp.status).fg
                      }}>
                        {tp.status}
                      </span>
                    </td>

                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <select
                        className="select-field"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem', width: 'auto' }}
                        value={tp.status}
                        onChange={(e) => updateTopicStatus(tp.id, e.target.value)}
                      >
                        {statusFlow.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>

                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          className="btn-icon"
                          onClick={() => openEditModal(tp)}
                          title="Edit Topic"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => deleteTopic(tp.id)}
                          title="Delete Topic"
                          style={{ color: 'var(--accent-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Add / Edit Topic Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingTopic ? 'Edit Syllabus Topic' : 'Add Syllabus Topic'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTopic} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Subject *</label>
                {subjects.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    No subjects created yet. (Topic will be listed under General)
                  </div>
                ) : (
                  <select
                    className="select-field"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label style={labelStyle}>Topic Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Ratio and Proportion"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Initial Status</label>
                  <select
                    className="select-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {statusFlow.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Exam Weightage</label>
                  <select
                    className="select-field"
                    value={formData.weightage}
                    onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="weakCheck"
                  checked={formData.isWeak}
                  onChange={(e) => setFormData({ ...formData, isWeak: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="weakCheck" style={{ fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}>
                  Mark as Weak Area (Needs priority practice)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const statusColorMap = (status) => {
  switch (status) {
    case 'Mastered': return { bg: 'rgba(16, 185, 129, 0.2)', fg: '#10b981' };
    case 'Revision 2':
    case 'Revision 1': return { bg: 'rgba(99, 102, 241, 0.2)', fg: '#6366f1' };
    case 'Completed': return { bg: 'rgba(139, 92, 246, 0.2)', fg: '#8b5cf6' };
    case 'Learning': return { bg: 'rgba(245, 158, 11, 0.2)', fg: '#f59e0b' };
    default: return { bg: 'rgba(148, 163, 184, 0.15)', fg: '#64748b' };
  }
};

const labelStyle = {
  fontSize: '0.82rem',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  display: 'block',
  marginBottom: '0.35rem'
};
