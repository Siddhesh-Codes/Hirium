'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { jobsApi, citiesApi, positionsApi } from '@/lib/api';
import { ArrowRight, Briefcase, Building2, Shield, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/TableSkeleton';

export default function HomePage() {
  const { data: jobsResult, isLoading: isJobsLoading } = useQuery({
    queryKey: ['activeJobs'],
    queryFn: jobsApi.getActive,
  });

  const { data: citiesResult } = useQuery({
    queryKey: ['cities'],
    queryFn: citiesApi.getAll,
  });

  const { data: positionsResult } = useQuery({
    queryKey: ['positions'],
    queryFn: positionsApi.getAll,
  });

  const jobs = jobsResult?.data || [];
  const citiesCount = citiesResult?.data?.length || 0;
  const positionsCount = positionsResult?.data?.length || 0;

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section with Compact Spacing */}
      <section className="border-b border-border bg-surface-light pt-8 pb-10 sm:pt-10 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-accent-subtle border border-accent/20 text-xs font-medium text-accent mb-3">
              <Shield className="w-3.5 h-3.5" strokeWidth={1.75} />
              Enterprise Talent Operating System
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink font-normal tracking-tight leading-[1.1]">
              Structured hiring for modern organizations.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              Connect verified employers with qualified professionals. A secure, compliant talent pipeline on Hirium for posting advertisements, reviewing applicants, and managing end-to-end recruitment.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link
                href="/jobs"
                className="px-6 py-2.5 bg-accent text-white font-medium rounded shadow-subtle hover:bg-accent-hover transition-colors inline-flex items-center gap-2 text-sm"
              >
                Browse Open Roles
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-surface-light border border-border text-ink font-medium rounded hover:bg-surface-subtle transition-colors text-sm"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-b border-border bg-surface-subtle/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <p className="text-2xl font-bold text-ink tabular-nums">{jobs.length}</p>
              <p className="text-xs text-muted mt-0.5">Active Job Openings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ink tabular-nums">{citiesCount || '15+'}</p>
              <p className="text-xs text-muted mt-0.5">Regional Hubs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ink tabular-nums">{positionsCount || '20+'}</p>
              <p className="text-xs text-muted mt-0.5">Position Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ink tabular-nums">100%</p>
              <p className="text-xs text-muted mt-0.5">Verified Listings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal">
              Latest Open Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Direct postings from verified employers with structured salary benchmarks.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1 self-start sm:self-auto"
          >
            View all listings
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isJobsLoading ? (
          <CardSkeleton count={3} />
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center border border-border rounded bg-surface-light">
            <Briefcase className="w-8 h-8 mx-auto text-muted mb-3" strokeWidth={1.5} />
            <p className="text-sm font-medium text-ink">No active listings available</p>
            <p className="text-xs text-muted mt-1">Check back shortly or publish a new position.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.slice(0, 6).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group p-5 bg-surface-light border border-border hover:border-accent/60 rounded transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs text-muted font-medium flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                      {job.companyName}
                    </span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                    {job.jobTitle}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" strokeWidth={1.5} />
                      {job.city}
                    </span>
                    <span className="tabular-nums">
                      {job.openPositionCount} {job.openPositionCount === 1 ? 'opening' : 'openings'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="font-medium text-ink tabular-nums">
                    {job.minSalary && job.maxSalary
                      ? `Rs. ${job.minSalary.toLocaleString('en-IN')} - ${job.maxSalary.toLocaleString('en-IN')}`
                      : job.minSalary
                      ? `From Rs. ${job.minSalary.toLocaleString('en-IN')}`
                      : 'Salary negotiable'}
                  </span>
                  <span className="text-muted flex items-center gap-1 tabular-nums">
                    <Calendar className="w-3 h-3" strokeWidth={1.5} />
                    Due {job.applicationDeadline}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Platform Pillars */}
      <section className="border-t border-border bg-surface-light py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-normal">
              Built for Enterprise Reliability
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Engineered with strict role isolation, extended session durability, and rate-limited credential security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded border border-border bg-surface-light">
              <div className="w-9 h-9 rounded bg-accent-subtle text-accent flex items-center justify-center mb-3">
                <Shield className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-ink">Hardened Security</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                Dual-token authentication with persistent session cookies to ensure seamless access without premature logouts.
              </p>
            </div>

            <div className="p-5 rounded border border-border bg-surface-light">
              <div className="w-9 h-9 rounded bg-accent-subtle text-accent flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-ink">Employer Hub</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                Structured candidate pipeline management with real-time application status reviews and applicant filtering.
              </p>
            </div>

            <div className="p-5 rounded border border-border bg-surface-light">
              <div className="w-9 h-9 rounded bg-accent-subtle text-accent flex items-center justify-center mb-3">
                <Briefcase className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-semibold text-ink">Transparent Applications</h3>
              <p className="text-xs text-muted mt-1.5 leading-relaxed">
                Direct candidate submissions with structured validation rules, status tracking, and zero hidden requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
