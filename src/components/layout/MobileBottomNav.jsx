import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  BarChart3,
  Menu,
  Download
} from 'lucide-react';

export const MobileBottomNav = () => {
  const {
    activeTab,
    setActiveTab,
    setIsMobileSidebarOpen,
    canInstallPWA,
    isStandalone,
    setIsInstallModalOpen
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'exams', label: 'Exams', icon: Clock },
    { id: 'mocktests', label: 'Mocks', icon: BarChart3 },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="mobile-nav-icon-wrapper">
              <Icon size={20} />
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        );
      })}

      {/* More / All Sections Trigger */}
      <button
        onClick={() => setIsMobileSidebarOpen(prev => !prev)}
        className="mobile-nav-btn"
        aria-label="Menu"
      >
        <div className="mobile-nav-icon-wrapper">
          <Menu size={20} />
        </div>
        <span className="mobile-nav-label">More</span>
      </button>
    </nav>
  );
};
