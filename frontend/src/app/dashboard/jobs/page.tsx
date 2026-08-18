'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { RequireRole } from '@/components/auth/RequireRole';
import { PlusCircle, Briefcase, Users, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function EmployerJobsPage() {
  const { user } = useAuthStore();

  const { data: jobsResult, isLoading } = useQuery({
    queryKey: ['employerJobs', user?.userId],
    queryFn: () => (user?.userId ? jobsApi.getActiveByEmployer(user.userId) : Promise.reject()),
    enabled: !!user?.userId,
  });

  const jobs = jobsResult?.data || [];

  return (
    <RequireRole role="EMPLOYER">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">My Job Postings</h1>
            <p className="text-xs text-muted mt-1">Manage active listings and review candidate submissions.</p>
          </div>
          <Link
            href="/dashboard/jobs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors shadow-subtle self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Create New Listing
          </Link>
        </div>

        {/* Postings Table */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center border border-border rounded bg-surface-light">
            <Briefcase className="w-10 h-10 text-muted mx-auto mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-ink">No Job Postings Found</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              You currently have no active listings. Create an advertisement to begin receiving candidate applications.
            </p>
            <Link
              href="/dashboard/jobs/new"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded text-xs font-medium hover:bg-accent-hover transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Post a Job Opening
            </Link>
          </div>
        ) : (
          <div className="bg-surface-light border border-border rounded overflow-hidden shadow-subtle">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/50 text-muted font-medium">
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-subtle/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-ink">{job.jobTitle}</p>
                      <p className="text-[11px] text-muted tabular-nums mt-0.5">
                        {job.openPositionCount} {job.openPositionCount === 1 ? 'seat' : 'seats'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted" />
                        {job.city}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-ink tabular-nums">
                      {job.minSalary && job.maxSalary
                        ? `Rs. ${job.minSalary.toLocaleString('en-IN')} - ${job.maxSalary.toLocaleString('en-IN')}`
                        : job.minSalary
                        ? `From Rs. ${job.minSalary.toLocaleString('en-IN')}`
                        : 'Negotiable'}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-muted">{job.applicationDeadline}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={job.active ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/dashboard/jobs/${job.id}/applications`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-surface-subtle hover:bg-border text-ink rounded text-xs font-medium transition-colors"
                      >
                        <Users className="w-3 h-3" />
                        Applicants
                      </Link>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 text-muted hover:text-ink transition-colors"
                        title="View Public Listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
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
