'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { jobsApi, applicationsApi } from '@/lib/api';
import { Briefcase, FileText, PlusCircle, CheckCircle2, Clock, XCircle, ArrowRight, Building2, MapPin } from 'lucide-react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const isEmployer = user?.role === 'EMPLOYER';

  // Employer queries
  const { data: employerJobsResult, isLoading: isEmployerJobsLoading } = useQuery({
    queryKey: ['employerActiveJobs', user?.userId],
    queryFn: () => (user?.userId ? jobsApi.getActiveByEmployer(user.userId) : Promise.reject()),
    enabled: isEmployer && !!user?.userId,
  });

  // Candidate queries
  const { data: seekerAppsResult, isLoading: isSeekerAppsLoading } = useQuery({
    queryKey: ['jobSeekerApplications', user?.userId],
    queryFn: () => (user?.userId ? applicationsApi.getByJobSeeker(user.userId) : Promise.reject()),
    enabled: !isEmployer && !!user?.userId,
  });

  const employerJobs = employerJobsResult?.data || [];
  const seekerApps = seekerAppsResult?.data || [];

  if (isEmployer) {
    const totalOpenings = employerJobs.reduce((acc, j) => acc + (j.openPositionCount || 0), 0);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">Employer Overview</h1>
          <p className="text-xs text-muted mt-1">Manage your active recruitment pipelines and job postings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-surface-light border border-border rounded shadow-subtle">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Active Postings</span>
              <Briefcase className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{employerJobs.length}</p>
            <p className="text-[11px] text-muted mt-1">Currently live on public board</p>
          </div>

          <div className="p-4 bg-surface-light border border-border rounded shadow-subtle">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Open Positions</span>
              <Building2 className="w-4 h-4 text-semantic-success" />
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{totalOpenings}</p>
            <p className="text-[11px] text-muted mt-1">Total candidate target seats</p>
          </div>

          <div className="p-4 bg-accent-subtle/50 border border-accent/20 rounded shadow-subtle flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-accent block">Quick Action</span>
              <p className="text-xs text-ink mt-1">Need to hire for a new role?</p>
            </div>
            <Link
              href="/dashboard/jobs/new"
              className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-medium rounded hover:bg-accent-hover transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Job Posting
            </Link>
          </div>
        </div>

        {/* Recent Postings */}
        <div className="bg-surface-light border border-border rounded shadow-subtle">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Your Active Postings</h2>
            <Link href="/dashboard/jobs" className="text-xs font-medium text-accent hover:underline">
              View All
            </Link>
          </div>

          {isEmployerJobsLoading ? (
            <TableSkeleton rows={4} cols={4} />
          ) : employerJobs.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase className="w-8 h-8 text-muted mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-medium text-ink">No job postings created yet</p>
              <Link
                href="/dashboard/jobs/new"
                className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline font-medium"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post your first opening
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {employerJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink">{job.jobTitle}</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.city}
                      </span>
                      <span className="tabular-nums">Deadline: {job.applicationDeadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/jobs/${job.id}/applications`}
                      className="px-3 py-1 bg-surface-subtle hover:bg-border text-ink rounded text-xs font-medium transition-colors"
                    >
                      View Applicants
                    </Link>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-3 py-1 border border-border hover:bg-surface-subtle text-muted hover:text-ink rounded text-xs transition-colors"
                    >
                      Public View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Candidate Overview
  const pendingCount = seekerApps.filter((a) => a.status === 'PENDING').length;
  const approvedCount = seekerApps.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = seekerApps.filter((a) => a.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">Candidate Overview</h1>
        <p className="text-xs text-muted mt-1">Track submitted job applications and review status updates.</p>
      </div>

      {/* Candidate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-light border border-border rounded shadow-subtle">
          <span className="text-xs text-muted font-medium">Total Applied</span>
          <p className="text-2xl font-bold text-ink tabular-nums mt-2">{seekerApps.length}</p>
        </div>
        <div className="p-4 bg-surface-light border border-border rounded shadow-subtle">
          <span className="text-xs text-semantic-warning font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </span>
          <p className="text-2xl font-bold text-ink tabular-nums mt-2">{pendingCount}</p>
        </div>
        <div className="p-4 bg-surface-light border border-border rounded shadow-subtle">
          <span className="text-xs text-semantic-success font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
          <p className="text-2xl font-bold text-ink tabular-nums mt-2">{approvedCount}</p>
        </div>
        <div className="p-4 bg-surface-light border border-border rounded shadow-subtle">
          <span className="text-xs text-semantic-danger font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
          <p className="text-2xl font-bold text-ink tabular-nums mt-2">{rejectedCount}</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-surface-light border border-border rounded shadow-subtle">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">Recent Applications</h2>
          <Link href="/jobs" className="text-xs font-medium text-accent hover:underline flex items-center gap-1">
            Explore Openings
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isSeekerAppsLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : seekerApps.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-8 h-8 text-muted mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs font-medium text-ink">You haven&apos;t applied to any positions yet</p>
            <Link
              href="/jobs"
              className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:underline font-medium"
            >
              Browse active listings
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {seekerApps.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-ink">{app.jobTitle}</h3>
                  <p className="text-[11px] text-muted mt-0.5">{app.employerName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted tabular-nums hidden sm:inline">
                    Applied {app.applicationDate?.substring(0, 10)}
                  </span>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
