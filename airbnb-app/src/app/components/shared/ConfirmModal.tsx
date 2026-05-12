import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
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
  type = 'warning'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: { bg: '#FEF2F2', icon: '#DC2626', btn: '#DC2626', btnHover: '#B91C1C' },
    warning: { bg: '#FFF7ED', icon: '#EA580C', btn: '#EA580C', btnHover: '#C2410C' },
    info: { bg: '#EFF6FF', icon: '#2563EB', btn: '#2563EB', btnHover: '#1D4ED8' }
  };

  const color = colors[type];

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: color.bg }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: color.icon }} />
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-[#F7F7F7] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[#717171]" />
              </button>
            </div>

            <h2
              className="font-semibold mb-2"
              style={{ fontFamily: "'Poppins', sans-serif", color: '#1C1C1E', fontSize: '1.1rem' }}
            >
              {title}
            </h2>
            <p className="text-sm mb-6" style={{ color: '#717171' }}>
              {message}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-[#EBEBEB] hover:bg-[#F7F7F7] py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: '#717171' }}
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: color.btn }}
                onMouseEnter={e => (e.currentTarget.style.background = color.btnHover)}
                onMouseLeave={e => (e.currentTarget.style.background = color.btn)}
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
