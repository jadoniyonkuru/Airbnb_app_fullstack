import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger:  { dot: '#DC2626', btn: '#DC2626', btnHover: '#B91C1C' },
    warning: { dot: '#EA580C', btn: '#EA580C', btnHover: '#C2410C' },
    info:    { dot: '#FF385C', btn: '#FF385C', btnHover: '#E31C5F' },
  };
  const c = colors[type];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/35" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full shadow-xl"
          style={{ maxWidth: 360, fontFamily: "'Inter', sans-serif" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-5">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                  style={{ background: c.dot }}
                />
                <h2
                  className="font-semibold leading-snug"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E', fontSize: '0.95rem' }}
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-[#AAAAAA]" />
              </button>
            </div>

            {message && (
              <p className="text-xs leading-relaxed mb-4 pl-4" style={{ color: '#8E8E93' }}>
                {message}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 border border-[#EBEBEB] hover:bg-[#F7F7F7] py-2 rounded-xl text-xs font-medium transition-colors"
                style={{ color: '#717171' }}
              >
                {cancelText}
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
                style={{ background: c.btn }}
                onMouseEnter={e => (e.currentTarget.style.background = c.btnHover)}
                onMouseLeave={e => (e.currentTarget.style.background = c.btn)}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
