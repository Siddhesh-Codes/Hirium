'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { RequireRole } from '@/components/auth/RequireRole';
import { FileText, ArrowRight, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function CandidateApplicationsPage() {
  const { user } = useAuthStore();

  const { data: appsResult, isLoading } = useQuery({
    queryKey: ['jobSeekerApplications', user?.userId],
    queryFn: () => (user?.userId ? applicationsApi.getByJobSeeker(user.userId) : Promise.reject()),
    enabled: !!user?.userId,
  });

  const applications = appsResult?.data || [];

  return (
    <RequireRole role="JOB_SEEKER">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">My Applications</h1>
            <p className="text-xs text-muted mt-1">Track the status and progress of your submitted applications.</p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors shadow-subtle self-start sm:self-auto"
          >
            Explore More Jobs
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Applications Table */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : applications.length === 0 ? (
          <div className="p-12 text-center border border-border rounded bg-surface-light">
            <FileText className="w-10 h-10 text-muted mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-ink">No Applications Submitted Yet</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              You have not applied to any job listings. Discover verified employer openings on our public board.
            </p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors"
            >
              Browse Open Roles
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="bg-surface-light border border-border rounded overflow-hidden shadow-subtle">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/50 text-muted font-medium">
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Resume</th>
                  <th className="py-3 px-4">Review Status</th>
                  <th className="py-3 px-4 text-right">Listing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-subtle/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-ink">{app.jobTitle}</p>
                      <p className="text-[11px] text-muted font-mono mt-0.5">Ref #{app.id}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-ink">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                        {app.employerName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted tabular-nums">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted shrink-0" strokeWidth={1.5} />
                        {app.applicationDate?.substring(0, 10)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {app.resumeUrl ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-accent-subtle/60 text-accent font-medium text-[11px] truncate max-w-[150px]">
                          <FileText className="w-3 h-3 shrink-0" />
                          <span className="truncate">{app.resumeUrl}</span>
                        </span>
                      ) : (
                        <span className="text-muted text-[11px]">Default Profile</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/jobs/${app.jobAdvertisementId}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-surface-subtle hover:bg-border text-ink rounded text-xs font-medium transition-colors"
                      >
                        View Post
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RequireRole>
  );
}
