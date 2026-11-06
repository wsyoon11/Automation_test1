import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getToastStyles = () => {
          switch (toast.type) {
            case 'success':
              return {
                border: 'border-emerald-300',
                bg: 'bg-emerald-50',
                text: 'text-emerald-900',
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
              };
            case 'error':
              return {
                border: 'border-rose-300',
                bg: 'bg-rose-50',
                text: 'text-rose-900',
                icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
              };
            case 'warning':
              return {
                border: 'border-amber-300',
                bg: 'bg-amber-50',
                text: 'text-amber-900',
                icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
              };
            default:
              return {
                border: 'border-blue-300',
                bg: 'bg-blue-50',
                text: 'text-blue-900',
                icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
              };
          }
        };

        const style = getToastStyles();

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg ${style.bg} ${style.border} ${style.text} transition-all duration-200 animate-in slide-in-from-bottom-2`}
          >
            {style.icon}
            <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
