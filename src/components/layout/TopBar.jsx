import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Flame,
  X,
  User,
  LogOut,
  ChevronDown,
  Download,
  Smartphone
} from 'lucide-react';

export const TopBar = () => {
  const {
    theme,
    toggleTheme,
    setIsMobileSidebarOpen,
    setIsSearchOpen,
    setIsProfileModalOpen,
    profile,
    logout,
    getSmartRecommendations,
    setActiveTab,
    installPWA,
    isStandalone
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const recommendations = getSmartRecommendations();

  return (
    <header className="header">
      {/* Left: Mobile Sidebar Toggle & Search / Brand */}
      <div className="header-left">
        <button
          className="btn-icon mobile-menu-toggle"
          onClick={() => setIsMobileSidebarOpen(prev => !prev)}
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} strokeWidth={2.5} />
        </button>

        <div className="mobile-brand">
          <span>EduTrack</span><span style={{ color: 'var(--accent-primary)' }}>.pro</span>
        </div>

        {/* Desktop & Tablet Search Bar Trigger */}
        <button
          className="search-trigger desktop-search"
          onClick={() => setIsSearchOpen(true)}
          title="Search anything (Ctrl+K)"
        >
          <Search size={16} />
          <span className="search-placeholder">Search tasks, topics, exams...</span>
          <kbd className="search-kbd">Ctrl K</kbd>
        </button>
      </div>

      {/* Right: Actions, Streak, Notifications, Theme Toggle & User Profile */}
      <div className="header-right">
        {/* Mobile Search Icon Button */}
        <button
          className="btn-icon mobile-search-btn"
          onClick={() => setIsSearchOpen(true)}
          title="Search"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Install App Button (Visible on desktop/laptop) */}
        {!isStandalone && (
          <button
            className="install-app-btn desktop-only"
            onClick={installPWA}
            title="Download & Install App on this device"
          >
            <Download size={15} />
            <span className="install-text">Install App</span>
          </button>
        )}

        {/* Streak Badge */}
        <div className="streak-badge" title={`${profile?.streakDays || 1} day study streak`}>
          <Flame size={16} fill="#f59e0b" />
          <span className="streak-text">{profile?.streakDays || 1}d</span>
        </div>

        {/* Notifications Center */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon"
            onClick={() => setShowNotifications(prev => !prev)}
            style={{ position: 'relative' }}
            title="Smart Alerts"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {recommendations.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '9px',
                height: '9px',
                backgroundColor: 'var(--accent-danger)',
                borderRadius: '50%',
                border: '2px solid var(--bg-secondary)'
              }} />
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="popover-dropdown notifications-dropdown">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Smart Alerts ({recommendations.length})</h4>
                <button className="btn-icon" style={{ width: '26px', height: '26px' }} onClick={() => setShowNotifications(false)}>
                  <X size={14} />
                </button>
              </div>

              {recommendations.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No urgent alerts right now. All caught up! 🎉
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => {
                        setActiveTab(rec.actionTab);
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderLeft: `3px solid var(--accent-${rec.type === 'danger' ? 'danger' : rec.type === 'warning' ? 'warning' : 'primary'})`,
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                        {rec.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {rec.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button className="btn-icon" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Student Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserDropdown(prev => !prev)}
            className="user-profile-btn"
            aria-label="User Profile Menu"
          >
            <img
              src={profile?.avatarUrl}
              alt={profile?.name || 'Student'}
              style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span className="user-name-text">
              {profile?.name ? profile.name.split(' ')[0] : 'Student'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" className="user-chevron" />
          </button>

          {/* User Profile Menu */}
          {showUserDropdown && (
            <div className="popover-dropdown user-dropdown">
              <div style={{ padding: '0.5rem 0.5rem 0.75rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>{profile?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.email}</div>
              </div>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  setIsProfileModalOpen(true);
                }}
                className="dropdown-item"
              >
                <User size={16} color="var(--accent-primary)" />
                <span>Profile & Settings</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  installPWA();
                }}
                className="dropdown-item"
              >
                <Download size={16} color="var(--accent-primary)" />
                <span>Install / Download App</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}
                className="dropdown-item dropdown-item-danger"
              >
                <LogOut size={16} />
                <span>Log Out / Switch Account</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
