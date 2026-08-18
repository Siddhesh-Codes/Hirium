'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { User, Mail, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const isEmployer = user?.role === 'EMPLOYER';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">Account Profile</h1>
        <p className="text-xs text-muted mt-1">Manage your account information and contact credentials.</p>
      </div>

      <div className="bg-surface-light border border-border rounded p-6 sm:p-8 space-y-6 shadow-subtle">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded bg-accent-subtle text-accent flex items-center justify-center font-display text-2xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">{user?.name}</h2>
            <p className="text-xs text-muted">{user?.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="accent">
                {isEmployer ? 'Employer Account' : 'Job Seeker Account'}
              </Badge>
              <Badge variant="success">Verified</Badge>
            </div>
          </div>
        </div>

        {/* Profile Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-surface-subtle/50 rounded border border-border">
            <span className="text-muted block flex items-center gap-1.5">
              {isEmployer ? <Building2 className="w-3.5 h-3.5 text-muted" /> : <User className="w-3.5 h-3.5 text-muted" />}
              {isEmployer ? 'Organization Name' : 'Full Name'}
            </span>
            <span className="font-semibold text-ink text-sm mt-1 block">
              {user?.name}
            </span>
          </div>

          <div className="p-4 bg-surface-subtle/50 rounded border border-border">
            <span className="text-muted block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted" />
              Registered Email Address
            </span>
            <span className="font-medium text-ink text-sm mt-1 block">
              {user?.email}
            </span>
          </div>

          <div className="p-4 bg-surface-subtle/50 rounded border border-border">
            <span className="text-muted block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-muted" />
              Account Category
            </span>
            <span className="font-medium text-ink text-sm mt-1 block">
              {isEmployer ? 'Corporate Recruiter / Employer' : 'Candidate Professional'}
            </span>
          </div>

          <div className="p-4 bg-surface-subtle/50 rounded border border-border">
            <span className="text-muted block flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" />
              Account Status
            </span>
            <span className="font-medium text-semantic-success text-sm mt-1 block">
              Active & Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
