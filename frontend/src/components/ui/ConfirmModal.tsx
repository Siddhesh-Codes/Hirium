'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-semantic-danger hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-accent hover:bg-accent-hover text-white';
      default:
        return 'bg-accent hover:bg-accent-hover text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-light border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-semantic-dangerBg text-semantic-danger flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-ink">{title}</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-ink p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-ink bg-surface-subtle hover:bg-border/60 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 ${getButtonStyles()}`}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
