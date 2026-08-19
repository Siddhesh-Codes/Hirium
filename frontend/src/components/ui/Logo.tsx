import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const iconDimensions = {
    sm: { width: 20, height: 20, class: 'w-5 h-5' },
    md: { width: 26, height: 26, class: 'w-7 h-7' },
    lg: { width: 36, height: 36, class: 'w-9 h-9' },
    xl: { width: 48, height: 48, class: 'w-12 h-12' },
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-lg font-semibold',
    xl: 'text-xl font-bold',
  };

  const dim = iconDimensions[size];

  return (
    <div className={clsx('inline-flex items-center gap-2 select-none', className)}>
      {/* Brand Monogram Icon */}
      <div
        className={clsx(
          dim.class,
          'rounded-lg overflow-hidden bg-surface-subtle shadow-subtle border border-border/70 shrink-0 relative flex items-center justify-center'
        )}
      >
        <Image
          src="/logo.png"
          alt="Hirium"
          width={dim.width}
          height={dim.height}
          className="object-contain w-full h-full"
          priority
        />
      </div>

      {showText && (
        <span className={clsx(textSizes[size], 'tracking-tight text-ink flex items-center')}>
          Hirium<span className="text-accent ml-0.5 font-bold">.</span>
        </span>
      )}
    </div>
  );
}
