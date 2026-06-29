import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[var(--bg-overlay)]" />
      <div className="relative bg-[var(--bg-card)] rounded-2xl p-6 mx-4 max-w-lg w-full shadow-xl" onClick={e => e.stopPropagation()}>
        {title && <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{title}</h2>}
        {children}
      </div>
    </div>
  );
};
