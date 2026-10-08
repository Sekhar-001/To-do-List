import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Mail,
  Target,
  Clock,
  LogOut,
  Sparkles,
  Save,
  RotateCcw,
  Zap,
  CheckCircle2
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'
];

export const ProfileModal = ({ isOpen, onClose }) => {
  const { profile, updateProfile, logout, showToast } = useApp();

  const [name, setName] = useState(profile?.name || '');
  const [targetExam, setTargetExam] = useState(profile?.targetExam || '');
  const [dailyTargetHours, setDailyTargetHours] = useState(profile?.dailyTargetHours || 6.0);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || AVATAR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty!', 'warning');
      return;
    }
    updateProfile({
      name: name.trim(),
      targetExam: targetExam.trim() || 'My Academic Goals',
      dailyTargetHours: parseFloat(dailyTargetHours) || 4.0,
      avatarUrl
    });
    showToast('Profile updated successfully! ✨', 'success');
    onClose();
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out / switch user? Your data will remain saved under your email.')) {
      onClose();
      logout();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--modal-overlay)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--card-shadow-hover)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), transparent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Student Profile & Settings</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Signed in as {profile?.email}</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Avatar Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Profile Avatar
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {AVATAR_OPTIONS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  onClick={() => setAvatarUrl(url)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: `3px solid ${avatarUrl === url ? 'var(--accent-primary)' : 'transparent'}`,
                    transform: avatarUrl === url ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all var(--transition-fast)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* First / Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Full Name / Display Name
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)'
            }}>
              <User size={16} color="var(--accent-primary)" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          {/* Target Exam / Goal */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Target Exam / Study Goal
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)'
            }}>
              <Target size={16} color="var(--accent-primary)" />
              <input
                type="text"
                value={targetExam}
                onChange={(e) => setTargetExam(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          {/* Daily Study Hours */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                Daily Target Hours
              </label>
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                {dailyTargetHours} Hours / day
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[2.0, 4.0, 6.0, 8.0, 10.0].map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setDailyTargetHours(h)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: `1px solid ${dailyTargetHours === h ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: dailyTargetHours === h ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: dailyTargetHours === h ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            marginTop: '0.5rem'
          }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: 'var(--accent-danger)',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Log Out / Switch</span>
            </button>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '0.6rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
