import React from 'react';
import clsx from 'clsx';
import { JobApplicationStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'danger' | 'warning' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'neutral', size = 'sm', className }: BadgeProps) {
  const variantStyles = {
    neutral: 'bg-surface-subtle text-muted border-border',
    success: 'bg-semantic-successBg text-semantic-success border-semantic-success/20',
    danger: 'bg-semantic-dangerBg text-semantic-danger border-semantic-danger/20',
    warning: 'bg-semantic-warningBg text-semantic-warning border-semantic-warning/20',
    accent: 'bg-accent-subtle text-accent border-accent/20',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded border tabular-nums leading-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: JobApplicationStatus | string }) {
  const normalized = status.toUpperCase();
  if (normalized === 'APPROVED' || normalized === 'ACTIVE') {
    return <Badge variant="success">{normalized}</Badge>;
  }
  if (normalized === 'REJECTED' || normalized === 'INACTIVE') {
    return <Badge variant="danger">{normalized}</Badge>;
  }
  if (normalized === 'PENDING') {
    return <Badge variant="warning">{normalized}</Badge>;
  }
  return <Badge variant="neutral">{normalized}</Badge>;
}
