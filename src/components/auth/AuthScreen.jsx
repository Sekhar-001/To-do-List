import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Target,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'
];

export const AuthScreen = () => {
  const { loginWithCredentials, registerNewAccount, loginWithGoogle } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (isSignUp) {
      const cleanName = name.trim();
      if (!cleanName) {
        setErrorMessage('Please enter your name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      setIsSubmitting(true);
      const result = await registerNewAccount({
        email: cleanEmail,
        name: cleanName,
        password: password,
        targetExam: targetExam.trim() || 'My Academic & Study Goals',
        dailyTargetHours: 6.0,
        avatarUrl: selectedAvatar
      });
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.message);
      }
    } else {
      // Sign In Flow
      setIsSubmitting(true);
      const result = await loginWithCredentials(cleanEmail, password);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage(result.message);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, var(--bg-primary) 70%)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '18%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '12%',
        right: '18%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--card-shadow-hover)',
        padding: '2.5rem 2.25rem',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '0.85rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)'
          }}>
            <Sparkles size={30} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
            EduTrack<span style={{ color: 'var(--accent-primary)' }}>.pro</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            {isSignUp
              ? 'Create your personalized workspace'
              : 'Sign in to access your study dashboard'}
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--accent-danger)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Unified Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            
            {/* If Sign Up, Ask for Name */}
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Your Name <span style={{ color: 'var(--accent-danger)' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 0.9rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <User size={18} color="var(--accent-primary)" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
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
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Email Address <span style={{ color: 'var(--accent-danger)' }}>*</span>
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 0.9rem',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Mail size={18} color="var(--accent-primary)" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem'
                  }}
                  autoFocus={!isSignUp}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                Password {isSignUp && <span style={{ color: 'var(--accent-danger)' }}>(min 6 chars) *</span>}
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 0.9rem',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}>
                <Lock size={18} color="var(--accent-primary)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Optional Target Goal for Sign Up */}
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                  Target Exam / Goal (Optional)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 0.9rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Target size={18} color="var(--accent-primary)" />
                  <input
                    type="text"
                    placeholder="e.g. UPSC CSE, SBI PO, Semester Finals"
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
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.98rem',
                fontWeight: '700',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
              }}
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span>{isSignUp ? 'Create My Account 🚀' : 'Sign In to Workspace &rarr;'}</span>
              )}
            </button>

            {/* Switch between Sign In and Sign Up */}
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(prev => !prev);
                    setErrorMessage('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-primary)',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '0.2rem'
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up for free'}
                </button>
              </span>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
