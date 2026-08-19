'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Briefcase,
  PlusCircle,
  Users,
  MapPin,
  Calendar,
  ExternalLink,
  FileText,
  Search,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function RecruitmentPage() {
  const { user } = useAuthStore();

  const { data: jobsRes, isLoading } = useQuery({
    queryKey: ['hrms-all-jobs'],
    queryFn: jobsApi.getAll,
  });

  const jobs = jobsRes?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-accent" />
            Recruitment & Talent Acquisition
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage job vacancies, track candidate application pipelines, and review Cloudinary PDF resumes.
          </p>
        </div>

        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Create Job Opening
        </Link>
      </div>

      {/* Recruitment Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs">
          <span className="text-xs font-semibold text-muted">Active Job Openings</span>
          <p className="text-2xl font-bold text-ink mt-1">{jobs.filter((j) => j.active).length}</p>
          <p className="text-[10px] text-muted">Currently accepting candidate applications</p>
        </div>

        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs">
          <span className="text-xs font-semibold text-muted">Target Positions Needed</span>
          <p className="text-2xl font-bold text-accent mt-1">
            {jobs.reduce((sum, j) => sum + (j.openPositionCount || 0), 0)}
          </p>
          <p className="text-[10px] text-muted">Across engineering, design, marketing & finance</p>
        </div>

        <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs">
          <span className="text-xs font-semibold text-muted">Resume Cloud Storage</span>
          <p className="text-2xl font-bold text-semantic-success mt-1">Cloudinary PDF</p>
          <p className="text-[10px] text-muted">Integrated fast embedded in-browser previewer</p>
        </div>
      </div>

      {/* Job Openings & Applicant Pipeline List */}
      <div className="bg-surface-light border border-border rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
            Current Vacancy Pipeline
          </h2>
          <span className="text-xs text-muted">{jobs.length} total listings</span>
        </div>

        {isLoading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 text-muted mx-auto mb-3 opacity-60" />
            <p className="text-xs font-semibold text-ink">No job openings created yet</p>
            <Link
              href="/dashboard/jobs/new"
              className="mt-3 inline-flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Publish your first job opening
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {jobs.map((job) => (
              <div key={job.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-subtle/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-ink">{job.jobTitle}</h3>
                    <Badge variant={job.active ? 'success' : 'neutral'} size="sm">
                      {job.active ? 'Active' : 'Closed'}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {job.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-accent" />
                      {job.openPositionCount} open seats
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      Deadline: {job.applicationDeadline}
                    </span>
                    {job.minSalary && job.maxSalary && (
                      <span className="font-mono font-medium text-ink">
                        ₹{(job.minSalary / 100000).toFixed(1)}L - ₹{(job.maxSalary / 100000).toFixed(1)}L PA
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/jobs/${job.id}/applications`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded transition-colors shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Review Candidates & Resumes
                  </Link>

                  <Link
                    href={`/jobs/${job.id}`}
                    target="_blank"
                    className="p-1.5 text-muted hover:text-ink border border-border hover:bg-surface-subtle rounded text-xs transition-colors"
                    title="Public candidate link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
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
