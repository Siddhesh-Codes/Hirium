'use client';

import React from 'react';
import { useToastStore, ToastMessage } from '@/lib/store/toastStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export function ToastItem({ toast }: { toast: ToastMessage }) {
  const removeToast = useToastStore((s) => s.removeToast);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0" strokeWidth={1.75} />,
    error: <AlertCircle className="w-4 h-4 text-semantic-danger shrink-0" strokeWidth={1.75} />,
    warning: <AlertTriangle className="w-4 h-4 text-semantic-warning shrink-0" strokeWidth={1.75} />,
    info: <Info className="w-4 h-4 text-accent shrink-0" strokeWidth={1.75} />,
  };

  const borders = {
    success: 'border-semantic-success/20 bg-surface-light text-ink',
    error: 'border-semantic-danger/20 bg-surface-light text-ink',
    warning: 'border-semantic-warning/20 bg-surface-light text-ink',
    info: 'border-accent/20 bg-surface-light text-ink',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'flex items-start gap-3 p-3.5 rounded border shadow-elevated w-80 text-sm transition-all duration-150',
        borders[toast.type]
      )}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink leading-tight">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-muted mt-1 leading-normal">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-muted hover:text-ink p-0.5 rounded transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

export default function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
