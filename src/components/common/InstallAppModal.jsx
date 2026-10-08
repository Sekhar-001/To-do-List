import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  Apple,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
  Terminal,
  ArrowRight
} from 'lucide-react';

export const InstallAppModal = () => {
  const { isInstallModalOpen, setIsInstallModalOpen, canInstallPWA, isStandalone, installPWA } = useApp();

  // Detect current platform
  const [platformTab, setPlatformTab] = useState('android');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatformTab('ios');
    } else if (/android/.test(userAgent)) {
      setPlatformTab('android');
    } else if (/macintosh|mac os x/.test(userAgent)) {
      setPlatformTab('mac');
    } else {
      setPlatformTab('windows');
    }
  }, [isInstallModalOpen]);

  if (!isInstallModalOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsInstallModalOpen(false)}
      style={{ zIndex: 1100 }}
    >
      <div
        className="modal-content"
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Download size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                Download & Install EduTrack Pro
              </h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0 }}>
                Install as a native app on Phone, Tablet & Desktop
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInstallModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* If already in Standalone mode */}
          {isStandalone && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontSize: '0.88rem',
              fontWeight: '700'
            }}>
              <CheckCircle2 size={18} />
              <span>Great! You are already running EduTrack Pro as an installed application.</span>
            </div>
          )}

          {/* 1-Click Install Button if supported */}
          {canInstallPWA && (
            <button
              className="btn btn-primary"
              onClick={installPWA}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Download size={20} />
              <span>1-Click Instant Install on this Device</span>
            </button>
          )}

          {/* Device Selection Tabs */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
              Choose your device platform:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', backgroundColor: 'var(--bg-tertiary)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
              {[
                { id: 'android', label: 'Android Phone / Tablet', icon: Smartphone },
                { id: 'ios', label: 'iPhone / iPad (iOS)', icon: Apple },
                { id: 'windows', label: 'Windows PC', icon: Laptop },
                { id: 'mac', label: 'Mac / MacBook', icon: Laptop },
                { id: 'apk', label: 'Export APK Guide', icon: Terminal }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = platformTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPlatformTab(tab.id)}
                    style={{
                      flex: '1 1 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      fontWeight: isActive ? '700' : '600',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform Step-by-Step Instructions */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)'
          }}>

            {/* ANDROID GUIDE */}
            {platformTab === 'android' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Smartphone size={18} color="var(--accent-primary)" />
                  How to Install on Android (Chrome, Brave, Samsung Internet):
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>1</span>
                  <div>
                    <strong>Open Chrome or Samsung Internet:</strong> Visit this website address on your Android phone or tablet.
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>2</span>
                  <div>
                    <strong>Tap the Menu button:</strong> Tap the <strong>3 vertical dots (⋮)</strong> icon at the top right corner of Chrome.
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>3</span>
                  <div>
                    <strong>Tap "Install App" or "Add to Home screen":</strong> A prompt will appear. Tap <strong>"Install"</strong>.
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>4</span>
                  <div>
                    <strong>Ready to use!</strong> The app icon will appear on your Home Screen and App Drawer with full offline and fullscreen support.
                  </div>
                </div>
              </div>
            )}

            {/* IOS (IPHONE / IPAD) GUIDE */}
            {platformTab === 'ios' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Apple size={18} color="var(--accent-primary)" />
                  How to Install on iPhone & iPad (Safari):
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>1</span>
                  <div>
                    <strong>Open in Safari:</strong> Open this web app inside <strong>Safari</strong> browser on your iPhone or iPad.
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>2</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span><strong>Tap the Share button:</strong> Tap the Share icon</span>
                    <span style={{ padding: '0.2rem 0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Share2 size={13} /> Share
                    </span>
                    <span>at the bottom of your screen.</span>
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>3</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span><strong>Select Add to Home Screen:</strong> Scroll down and tap</span>
                    <span style={{ padding: '0.2rem 0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <PlusSquare size={13} /> Add to Home Screen
                    </span>
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>4</span>
                  <div>
                    <strong>Tap "Add":</strong> Tap <strong>"Add"</strong> in the top right corner. EduTrack Pro is now installed like a native iOS app!
                  </div>
                </div>
              </div>
            )}

            {/* WINDOWS PC GUIDE */}
            {platformTab === 'windows' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Laptop size={18} color="var(--accent-primary)" />
                  How to Install on Windows PC (Chrome, Edge, Brave):
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>1</span>
                  <div>
                    <strong>Look at the Address Bar:</strong> In Google Chrome or Microsoft Edge, look at the right side of the URL address bar.
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>2</span>
                  <div>
                    <strong>Click the Install Icon:</strong> Click the <strong>computer screen icon with download arrow (⊕ / 📥)</strong> labeled <em>"Install EduTrack Pro"</em>.
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>3</span>
                  <div>
                    <strong>Click "Install":</strong> It creates a desktop shortcut, Start Menu entry, and opens in a standalone window without browser tabs!
                  </div>
                </div>
              </div>
            )}

            {/* MAC / MACBOOK GUIDE */}
            {platformTab === 'mac' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Laptop size={18} color="var(--accent-primary)" />
                  How to Install on macOS (Safari, Chrome, Edge):
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>1</span>
                  <div>
                    <strong>In Safari (macOS Sonoma+):</strong> Click <strong>File &gt; Add to Dock...</strong> from the top menu bar.
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>2</span>
                  <div>
                    <strong>In Chrome / Edge on Mac:</strong> Click the Install icon in the address bar or <strong>Menu (⋮) &gt; Install EduTrack Pro...</strong>
                  </div>
                </div>

                <div style={stepStyle}>
                  <span style={stepNumberStyle}>3</span>
                  <div>
                    <strong>Launches from Launchpad & Dock:</strong> EduTrack Pro opens directly in its own window.
                  </div>
                </div>
              </div>
            )}

            {/* NATIVE APK / CAPACITOR GUIDE */}
            {platformTab === 'apk' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Terminal size={18} color="var(--accent-primary)" />
                  How to Generate Standalone APK or Native Android App:
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  You have two easy methods to generate an installable <code>.apk</code> package:
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.88rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                    Method 1: PWABuilder (100% Free, No Coding)
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    1. Deploy your app on Vercel / Netlify / Firebase Hosting.<br />
                    2. Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>pwabuilder.com</a> and enter your website URL.<br />
                    3. Click <strong>"Package For Stores" &gt; "Android"</strong> &gt; Download your generated <strong>.apk</strong> / <strong>.aab</strong> ready for Google Play or direct phone installation!
                  </div>
                </div>

                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#10b981', marginBottom: '0.25rem' }}>
                    Method 2: Capacitor CLI (Native Android Studio Build)
                  </div>
                  <pre style={{ margin: '0.3rem 0', padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-primary)', overflowX: 'auto' }}>
{`npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "EduTrack Pro" "com.edutrack.app"
npm run build
npx cap add android
npx cap open android`}
                  </pre>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Build APK directly in Android Studio via <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setIsInstallModalOpen(false)}
            >
              Got it, thanks!
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const stepStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
  fontSize: '0.86rem',
  color: 'var(--text-primary)',
  lineHeight: 1.4
};

const stepNumberStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'var(--accent-primary)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: '800',
  flexShrink: 0,
  marginTop: '2px'
};
