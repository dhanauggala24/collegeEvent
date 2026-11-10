import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        <Icon size={18} color={type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0ea5e9'} />
        <span style={{ flex: 1 }}>{message}</span>
        <button onClick={onClose} style={{ color: '#94a3b8' }}>
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
