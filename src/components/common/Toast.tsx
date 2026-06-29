import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 2000, onClose }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); onClose(); }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  if (!visible) return null;
  const bgColors = { success: 'bg-[var(--success)]', error: 'bg-[var(--danger)]', info: 'bg-[var(--secondary)]' };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] ${bgColors[type]} text-white px-6 py-3 rounded-xl shadow-lg font-semibold`}>
      {message}
    </div>
  );
};
