import React from 'react';

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full bg-surface-light border border-border rounded overflow-hidden">
      <div className="border-b border-border bg-surface-subtle/50 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-3.5 bg-border/60 rounded animate-pulse"
            style={{ width: `${Math.floor(80 / cols)}%` }}
          />
        ))}
      </div>
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-4 py-3.5 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-border/40 rounded animate-pulse"
                style={{ width: `${Math.floor(90 / cols)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 bg-surface-light border border-border rounded flex flex-col gap-3">
          <div className="h-4 w-3/4 bg-border/60 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-border/40 rounded animate-pulse" />
          <div className="h-16 w-full bg-border/30 rounded animate-pulse mt-2" />
          <div className="h-3 w-1/3 bg-border/40 rounded animate-pulse mt-auto" />
        </div>
      ))}
    </div>
  );
}
