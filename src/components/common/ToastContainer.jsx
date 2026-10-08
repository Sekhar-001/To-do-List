import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let borderCol = 'var(--accent-primary)';
        let bgCol = 'var(--bg-secondary)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderCol = 'var(--accent-success)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderCol = 'var(--accent-warning)';
        } else if (toast.type === 'danger') {
          Icon = XCircle;
          borderCol = 'var(--accent-danger)';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.1rem',
              backgroundColor: bgCol,
              borderLeft: `4px solid ${borderCol}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontWeight: '600',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            <Icon size={20} style={{ color: borderCol, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
};
