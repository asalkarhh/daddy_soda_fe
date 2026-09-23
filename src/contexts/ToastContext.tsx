import React, { createContext, useCallback, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastContextType {
  toast: (options: { type?: ToastType; title?: string; message: string; duration?: number }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }: { type?: ToastType; title?: string; message: string; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  const success = useCallback((message: string, title?: string) => toast({ type: 'success', title, message }), [toast]);
  const error = useCallback((message: string, title?: string) => toast({ type: 'error', title, message }), [toast]);
  const warning = useCallback((message: string, title?: string) => toast({ type: 'warning', title, message }), [toast]);
  const info = useCallback((message: string, title?: string) => toast({ type: 'info', title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4"
      >
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
            info: <Info className="w-5 h-5 text-brand-600 shrink-0" />,
          };

          const borderColors = {
            success: 'border-emerald-200 bg-white shadow-lg',
            error: 'border-red-200 bg-white shadow-lg',
            warning: 'border-amber-200 bg-white shadow-lg',
            info: 'border-brand-200 bg-white shadow-lg',
          };

          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 ease-out transform translate-y-0',
                borderColors[t.type]
              )}
            >
              {icons[t.type]}
              <div className="flex-1 min-w-0">
                {t.title && <h4 className="text-sm font-semibold text-slate-900 mb-0.5">{t.title}</h4>}
                <p className="text-xs text-slate-600 leading-relaxed break-words">{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Close notification"
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
