'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Shield,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function HomePage() {
  const { data: jobsResult } = useQuery({
    queryKey: ['activeJobs'],
    queryFn: jobsApi.getActive,
  });

  const jobs = jobsResult?.data || [];

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-surface-light via-surface-light to-accent-subtle/20 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-accent-subtle border border-accent/20 text-xs font-semibold text-accent mb-4">
              <Shield className="w-3.5 h-3.5" />
              Full Enterprise Human Resource Management System
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink font-bold tracking-tight leading-[1.1]">
              Next-Generation HRMS Platform for Modern Workplaces.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
              Centralized staff directories, real-time punch clock attendance, multi-tiered leave approvals, 1-click automated payroll calculation, and resume-ready recruitment pipelines.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-2.5 bg-accent text-white font-semibold rounded shadow-sm hover:bg-accent-hover transition-colors inline-flex items-center gap-2 text-sm"
              >
                Access HR Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-surface-light border border-border text-ink font-semibold rounded hover:bg-surface-subtle transition-colors text-sm inline-flex items-center gap-2"
              >
                Register Organization
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core HRMS Module Pillars */}
      <section className="py-12 bg-surface-light border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold">
              Complete Enterprise HRMS Architecture
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1.5">
              Built in accordance with enterprise HR specifications, powered by Spring Boot 3, Neon Serverless PostgreSQL, and Next.js.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Employee Management */}
            <div className="p-6 rounded-xl border border-border bg-surface-subtle/40 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Employee Directory</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Centralized registry of personnel profiles, department mapping, role definitions (Admin, HR, Employee), contact details, and base salary configurations.
              </p>
            </div>

            {/* 2. Department Management */}
            <div className="p-6 rounded-xl border border-border bg-surface-subtle/40 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Department Management</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Structured organizational units (Engineering, HR, Finance, Marketing, Operations) with department codes, unit heads, and live headcount counters.
              </p>
            </div>

            {/* 3. Attendance Tracking */}
            <div className="p-6 rounded-xl border border-border bg-surface-subtle/40 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Attendance Tracking</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Live punch clock for employee punch-in and punch-out, automatic work hours calculation, and status classification (Present, Late, Half-Day).
              </p>
            </div>

            {/* 4. Leave Management */}
            <div className="p-6 rounded-xl border border-border bg-surface-subtle/40 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Leave Management</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Leave applications for Casual, Sick, Annual, Maternity, and Unpaid leaves with 1-click HR Approve/Reject decision workflow and quota balances.
              </p>
            </div>

            {/* 5. Payroll Processing */}
            <div className="p-6 rounded-xl border border-border bg-surface-subtle/40 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Payroll Processing</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                1-click monthly batch payroll generation: Basic Salary + Allowances - Deductions = Net Payout, with detailed printable employee payslips.
              </p>
            </div>

            {/* 6. Recruitment & Cloudinary */}
            <div className="p-6 rounded-xl border border-border bg-surface-subtle/40 hover:border-accent/50 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Recruitment & Resumes</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                End-to-end recruitment with job vacancies, candidate applications, and in-browser Cloudinary PDF resume preview.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
