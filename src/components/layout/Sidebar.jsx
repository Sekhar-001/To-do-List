import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BookOpen,
  Target,
  Clock,
  BarChart3,
  Award,
  HelpCircle,
  FileText,
  Trophy,
  RotateCw,
  PieChart,
  Sparkles,
  Zap,
  X,
  LogOut,
  Settings,
  Download
} from 'lucide-react';

const navSections = [
  {
    category: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
      { id: 'planner', label: 'Study Planner', icon: Calendar }
    ]
  },
  {
    category: 'ACADEMICS & CURRICULUM',
    items: [
      { id: 'subjects', label: 'Subjects', icon: BookOpen },
      { id: 'syllabus', label: 'Syllabus Tracker', icon: Target },
      { id: 'notes', label: 'Study Notes', icon: FileText },
      { id: 'questions', label: 'Question Bank', icon: HelpCircle }
    ]
  },
  {
    category: 'TESTS & PERFORMANCE',
    items: [
      { id: 'exams', label: 'Exams & Deadlines', icon: Clock },
      { id: 'mocktests', label: 'Mock Tests', icon: BarChart3 },
      { id: 'results', label: 'Results & Analysis', icon: Award },
      { id: 'goals', label: 'Goals & Badges', icon: Trophy },
      { id: 'revision', label: 'Spaced Revision', icon: RotateCw },
      { id: 'analytics', label: 'Analytics & Reports', icon: PieChart }
    ]
  }
];

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setIsProfileModalOpen,
    profile,
    logout,
    installPWA,
    isStandalone
  } = useApp();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: 1.1 }}>EduTrack<span style={{ color: 'var(--accent-primary)' }}>.pro</span></h2>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Study Management</span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            className="btn-icon"
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{ display: isMobileSidebarOpen ? 'flex' : 'none' }}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Student Profile Quick Summary Card */}
        <div
          onClick={() => {
            setIsProfileModalOpen(true);
            setIsMobileSidebarOpen(false);
          }}
          style={{
            padding: '0.85rem 1.1rem',
            margin: '0.75rem 1rem 0.5rem 1rem',
            backgroundColor: 'var(--accent-primary-light)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          title="Click to edit profile"
        >
          <img
            src={profile?.avatarUrl}
            alt={profile?.name || 'Student'}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.name || 'Student'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Zap size={12} fill="var(--accent-primary)" />
              {profile?.streakDays || 1} Day Streak • Lvl {profile?.level || 1}
            </div>
          </div>
          <Settings size={15} color="var(--accent-primary)" />
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '0.5rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navSections.map(section => (
              <div key={section.category}>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  color: 'var(--text-muted)',
                  padding: '0.25rem 0.75rem 0.4rem 0.75rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  {section.category}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileSidebarOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                            color: isActive ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: isActive ? '700' : '600',
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <Icon size={18} style={{ opacity: isActive ? 1 : 0.85 }} />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Install App Quick Promo Card (If not in standalone) */}
        {!isStandalone && (
          <div style={{ padding: '0 0.75rem 0.5rem 0.75rem' }}>
            <button
              onClick={() => {
                setIsMobileSidebarOpen(false);
                installPWA();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: 'var(--accent-primary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Download size={17} />
              <div style={{ flex: 1 }}>
                <div>Download App</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>Install on this device</span>
              </div>
            </button>
          </div>
        )}

        {/* Target Exam Banner & Log out Footer */}
        <div style={{
          padding: '0.85rem 1.15rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>Target Goal:</div>
            <div style={{ color: 'var(--accent-primary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              🎯 {profile?.targetExam || 'General Study'}
            </div>
          </div>

          <button
            onClick={() => {
              setIsMobileSidebarOpen(false);
              logout();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              width: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <LogOut size={13} />
            <span>Switch Account / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
