'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { UserRole } from '@/types';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface RequireRoleProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasAccess = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasAccess) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-light border border-border rounded text-center">
        <div className="w-10 h-10 rounded-full bg-semantic-dangerBg text-semantic-danger flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <h2 className="text-lg font-semibold text-ink">Access Restricted</h2>
        <p className="text-sm text-muted mt-2">
          Your account ({user?.role || 'Guest'}) does not have permission to view this section.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm bg-accent text-white rounded hover:bg-accent-hover transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/jobs"
            className="px-4 py-2 text-sm border border-border text-ink rounded hover:bg-surface-subtle transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
