import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  Clock,
  Trash2,
  Edit,
  Tag,
  Paperclip,
  X
} from 'lucide-react';

export const TasksView = () => {
  const { tasks, subjects, topics, addTask, updateTask, toggleTaskStatus, deleteTask, clearAllTasks, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    topicId: '',
    description: '',
    priority: 'Medium',
    startDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    estMinutes: 45,
    actMinutes: 0,
    status: 'Not Started',
    isRecurring: false,
    notes: ''
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const endOfWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  // Filtering Logic
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'Today' && (task.startDate > todayStr || task.dueDate < todayStr)) return false;
    if (activeFilter === 'Tomorrow' && (task.startDate > tomorrowStr || task.dueDate < tomorrowStr)) return false;
    if (activeFilter === 'ThisWeek' && task.dueDate > endOfWeekStr) return false;
    if (activeFilter === 'Overdue' && (task.status === 'Completed' || task.dueDate >= todayStr)) return false;
    if (activeFilter === 'Completed' && task.status !== 'Completed') return false;

    if (selectedSubjectFilter !== 'ALL' && task.subjectId !== selectedSubjectFilter) return false;
    if (selectedPriorityFilter !== 'ALL' && task.priority !== selectedPriorityFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = task.description.toLowerCase().includes(q);
      return titleMatch || descMatch;
    }

    return true;
  });

  const openCreateModal = () => {
    setEditingTaskId(null);
    setFormData({
      title: '',
      subjectId: subjects[0]?.id || '',
      topicId: '',
      description: '',
      priority: 'Medium',
      startDate: todayStr,
      dueDate: todayStr,
      estMinutes: 45,
      actMinutes: 0,
      status: 'Not Started',
      isRecurring: false,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      subjectId: task.subjectId || '',
      topicId: task.topicId || '',
      description: task.description || '',
      priority: task.priority || 'Medium',
      startDate: task.startDate || todayStr,
      dueDate: task.dueDate || todayStr,
      estMinutes: task.estMinutes || 45,
      actMinutes: task.actMinutes || 0,
      status: task.status || 'Not Started',
      isRecurring: !!task.isRecurring,
      notes: task.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Task title is required!', 'warning');
      return;
    }

    if (editingTaskId) {
      updateTask(editingTaskId, formData);
      showToast('Task updated successfully!', 'success');
    } else {
      addTask(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CheckSquare size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Task Manager ({tasks.length})</span>
          </h1>
          <p className="page-subtitle">Create and organize your custom study tasks from scratch</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {tasks.length > 0 && (
            <button className="btn btn-danger" onClick={clearAllTasks}>
              <Trash2 size={16} /> Clear All Tasks
            </button>
          )}
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} /> Create New Task
          </button>
        </div>
      </div>

      {/* Filter & Toolbar Area */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['All', 'Today', 'Tomorrow', 'ThisWeek', 'Overdue', 'Completed'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: activeFilter === filter ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: activeFilter === filter ? 'var(--accent-primary-light)' : 'var(--bg-tertiary)',
                color: activeFilter === filter ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {filter === 'ThisWeek' ? 'This Week' : filter}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <select
            className="select-field"
            style={{ width: 'auto', minWidth: '160px' }}
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          >
            <option value="ALL">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select
            className="select-field"
            style={{ width: 'auto', minWidth: '150px' }}
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {filteredTasks.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckSquare size={42} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4, color: 'var(--accent-primary)' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>No tasks found</div>
            <div style={{ fontSize: '0.88rem', marginTop: '0.35rem' }}>Click "Create New Task" above to add your own tasks!</div>
          </div>
        ) : (
          filteredTasks.map(task => {
            const sub = subjects.find(s => s.id === task.subjectId);
            const topic = topics.find(tp => tp.id === task.topicId);
            const isCompleted = task.status === 'Completed';
            const isOverdue = !isCompleted && task.dueDate < todayStr;

            return (
              <div
                key={task.id}
                className="card"
                style={{
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  borderLeft: `4px solid ${isOverdue ? '#ef4444' : isCompleted ? '#10b981' : sub?.color || 'var(--accent-primary)'}`
                }}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTaskStatus(task.id)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', marginTop: '3px', accentColor: 'var(--accent-primary)' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '1.02rem',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {task.title}
                    </span>

                    {sub && (
                      <span style={{
                        padding: '0.15rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: `${sub.color}15`,
                        color: sub.color,
                        fontSize: '0.75rem',
                        fontWeight: '700'
                      }}>
                        {sub.name}
                      </span>
                    )}

                    <span className={`badge badge-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                      {task.description}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.65rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> Due: {task.dueDate} {isOverdue && <strong style={{ color: '#ef4444' }}>(Overdue!)</strong>}
                    </span>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> Est: {task.estMinutes}m
                    </span>

                    {topic && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Tag size={14} /> Topic: {topic.name}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button className="btn-icon" onClick={() => openEditModal(task)} title="Edit Task">
                    <Edit size={16} />
                  </button>
                  <button className="btn-icon" onClick={() => deleteTask(task.id)} title="Delete Task" style={{ color: 'var(--accent-danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={labelStyle}>Task Title *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Solve 10 Quadratic Equations"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select
                    className="select-field"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value, topicId: '' })}
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Topic (Optional)</label>
                  <select
                    className="select-field"
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                  >
                    <option value="">-- Select Topic --</option>
                    {topics
                      .filter(tp => !formData.subjectId || tp.subjectId === formData.subjectId)
                      .map(tp => (
                        <option key={tp.id} value={tp.id}>{tp.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid-2col" style={{ gap: '1rem' }}>
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

                <div>
                  <label style={labelStyle}>Due Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description (Optional)</label>
                <textarea
                  className="textarea-field"
                  rows={3}
                  placeholder="Task instructions, textbook chapters or notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTaskId ? 'Save Changes' : 'Create Task'}
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
