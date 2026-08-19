'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import {
  employeesApi,
  departmentsApi,
  attendanceApi,
  leavesApi,
  payrollApi,
  jobsApi,
  applicationsApi
} from '@/lib/api';
import {
  Users,
  Building2,
  Clock,
  CalendarCheck,
  CreditCard,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const isHrOrAdmin = user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'EMPLOYER';
  const isStaff = user?.role === 'EMPLOYEE';

  // HR / Admin Enterprise Queries
  const { data: employeesRes, isLoading: isEmployeesLoading } = useQuery({
    queryKey: ['hrms-employees-all'],
    queryFn: employeesApi.getAll,
    enabled: isHrOrAdmin,
  });

  const { data: departmentsRes } = useQuery({
    queryKey: ['hrms-departments-all'],
    queryFn: departmentsApi.getAll,
    enabled: isHrOrAdmin,
  });

  const { data: attendanceRes } = useQuery({
    queryKey: ['hrms-attendance-overview'],
    queryFn: () => attendanceApi.getDailyOverview(),
    enabled: isHrOrAdmin,
  });

  const { data: pendingLeavesRes } = useQuery({
    queryKey: ['hrms-leaves-pending'],
    queryFn: leavesApi.getPending,
    enabled: isHrOrAdmin,
  });

  const { data: payrollRes } = useQuery({
    queryKey: ['hrms-payroll-all'],
    queryFn: payrollApi.getAll,
    enabled: isHrOrAdmin,
  });

  // Employee Specific Queries
  const { data: myAttendanceRes, isLoading: isMyAttendanceLoading } = useQuery({
    queryKey: ['my-attendance-today', user?.userId],
    queryFn: () => (user?.userId ? attendanceApi.getToday(user.userId) : Promise.reject()),
    enabled: isStaff && !!user?.userId,
  });

  const { data: myLeavesRes } = useQuery({
    queryKey: ['my-leaves', user?.userId],
    queryFn: () => (user?.userId ? leavesApi.getEmployeeLeaves(user.userId) : Promise.reject()),
    enabled: isStaff && !!user?.userId,
  });

  const { data: myPayslipsRes } = useQuery({
    queryKey: ['my-payslips', user?.userId],
    queryFn: () => (user?.userId ? payrollApi.getEmployeePayslips(user.userId) : Promise.reject()),
    enabled: isStaff && !!user?.userId,
  });

  // Candidate Queries
  const { data: seekerAppsResult } = useQuery({
    queryKey: ['jobSeekerApplications', user?.userId],
    queryFn: () => (user?.userId ? applicationsApi.getByJobSeeker(user.userId) : Promise.reject()),
    enabled: user?.role === 'JOB_SEEKER' && !!user?.userId,
  });

  // ==========================
  // 1. HR & ADMIN DASHBOARD
  // ==========================
  if (isHrOrAdmin) {
    const employees = employeesRes?.data || [];
    const departments = departmentsRes?.data || [];
    const todayAttendance = attendanceRes?.data || [];
    const pendingLeaves = pendingLeavesRes?.data || [];
    const payrollRecords = payrollRes?.data || [];

    const presentCount = todayAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
    const totalSalaryBudget = employees.reduce((sum, e) => sum + (e.salary || 0), 0);

    return (
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-light p-6 rounded-lg border border-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                HR Enterprise Control Center
              </h1>
              <Badge variant="accent" size="sm">
                {user?.role}
              </Badge>
            </div>
            <p className="text-xs text-muted mt-1">
              Live organizational metrics, attendance pulse, pending leave requests, and payroll execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/employees"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              Manage Staff
            </Link>
            <Link
              href="/dashboard/leaves"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface-subtle hover:bg-surface-subtle/80 text-ink text-xs font-semibold rounded transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-accent" />
              Review Leaves ({pendingLeaves.length})
            </Link>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-surface-light border border-border rounded shadow-xs hover:border-accent/40 transition-colors">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Total Staff</span>
              <Users className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{employees.length}</p>
            <p className="text-[11px] text-muted mt-1">{departments.length} Active Departments</p>
          </div>

          <div className="p-4 bg-surface-light border border-border rounded shadow-xs hover:border-semantic-success/40 transition-colors">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Today Present</span>
              <Clock className="w-4 h-4 text-semantic-success" />
            </div>
            <p className="text-2xl font-bold text-semantic-success tabular-nums">{presentCount}</p>
            <p className="text-[11px] text-muted mt-1">
              {employees.length > 0 ? Math.round((presentCount / employees.length) * 100) : 0}% Attendance Rate
            </p>
          </div>

          <div className="p-4 bg-surface-light border border-border rounded shadow-xs hover:border-semantic-warning/40 transition-colors">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Pending Leaves</span>
              <AlertCircle className="w-4 h-4 text-semantic-warning" />
            </div>
            <p className="text-2xl font-bold text-semantic-warning tabular-nums">{pendingLeaves.length}</p>
            <p className="text-[11px] text-muted mt-1">Awaiting HR Decision</p>
          </div>

          <div className="p-4 bg-surface-light border border-border rounded shadow-xs hover:border-accent/40 transition-colors">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Monthly Payroll</span>
              <CreditCard className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">
              ₹{(totalSalaryBudget / 100000).toFixed(2)}L
            </p>
            <p className="text-[11px] text-muted mt-1">{payrollRecords.length} payslips issued</p>
          </div>

          <div className="p-4 bg-surface-light border border-border rounded shadow-xs hover:border-accent/40 transition-colors">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Departments</span>
              <Building2 className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-ink tabular-nums">{departments.length}</p>
            <p className="text-[11px] text-muted mt-1">Engineering, HR, Ops...</p>
          </div>
        </div>

        {/* 2-Column Split: Pending Leaves & Recent Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <div className="bg-surface-light border border-border rounded-lg shadow-xs">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Pending Leave Requests
                </h2>
              </div>
              <Link href="/dashboard/leaves" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-semantic-success mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-ink">All leave requests resolved</p>
                <p className="text-[11px] text-muted mt-0.5">No pending employee requests in queue.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {pendingLeaves.slice(0, 4).map((leave) => (
                  <div key={leave.id} className="p-4 flex items-center justify-between hover:bg-surface-subtle/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">{leave.employeeName}</span>
                        <Badge variant="warning" size="sm">{leave.leaveType}</Badge>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        {leave.startDate} to {leave.endDate} ({leave.totalDays} days) • &ldquo;{leave.reason}&rdquo;
                      </p>
                    </div>
                    <Link
                      href="/dashboard/leaves"
                      className="px-2.5 py-1 bg-accent/10 hover:bg-accent hover:text-white text-accent rounded text-xs font-semibold transition-colors"
                    >
                      Decision
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today Attendance Log */}
          <div className="bg-surface-light border border-border rounded-lg shadow-xs">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Today Attendance Pulse
                </h2>
              </div>
              <Link href="/dashboard/attendance" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                Full Punch Log <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {todayAttendance.length === 0 ? (
              <div className="p-8 text-center">
                <Clock className="w-8 h-8 text-muted mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs font-semibold text-ink">No punches recorded yet today</p>
                <p className="text-[11px] text-muted mt-0.5">Staff punches will stream here in real-time.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {todayAttendance.slice(0, 4).map((att) => (
                  <div key={att.id} className="p-4 flex items-center justify-between hover:bg-surface-subtle/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink">{att.employeeName}</span>
                        <span className="text-[11px] text-muted font-mono">{att.departmentName}</span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        In: {att.checkInTime?.substring(0, 5)} {att.checkOutTime ? `• Out: ${att.checkOutTime.substring(0, 5)} (${att.workHours} hrs)` : '• On Shift'}
                      </p>
                    </div>
                    <Badge variant={att.status === 'PRESENT' ? 'success' : att.status === 'LATE' ? 'warning' : 'neutral'} size="sm">
                      {att.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Module Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <Link
            href="/dashboard/employees"
            className="p-4 bg-surface-light border border-border hover:border-accent rounded-lg shadow-xs transition-all group"
          >
            <Users className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-bold text-ink">Employee Directory</h3>
            <p className="text-[11px] text-muted mt-1">Add staff, assign departments, configure roles & compensation.</p>
          </Link>

          <Link
            href="/dashboard/payroll"
            className="p-4 bg-surface-light border border-border hover:border-accent rounded-lg shadow-xs transition-all group"
          >
            <CreditCard className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-bold text-ink">Payroll Engine</h3>
            <p className="text-[11px] text-muted mt-1">1-click monthly batch calculations, deductions, and payslip generation.</p>
          </Link>

          <Link
            href="/dashboard/recruitment"
            className="p-4 bg-surface-light border border-border hover:border-accent rounded-lg shadow-xs transition-all group"
          >
            <Briefcase className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-xs font-bold text-ink">Recruitment & Resumes</h3>
            <p className="text-[11px] text-muted mt-1">Job vacancies, applicant pipelines, and Cloudinary PDF resume preview.</p>
          </Link>
        </div>
      </div>
    );
  }

  // ==========================
  // 2. EMPLOYEE WORKSPACE
  // ==========================
  if (isStaff) {
    const todayRecord = myAttendanceRes?.data;
    const leaves = myLeavesRes?.data || [];
    const payslips = myPayslipsRes?.data || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-light p-6 rounded-lg border border-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Welcome, {user?.name}!
              </h1>
              <Badge variant="accent" size="sm">Employee Workspace</Badge>
            </div>
            <p className="text-xs text-muted mt-1">
              Punch in/out, view leave allowances, track salary disbursements, and access company resources.
            </p>
          </div>
          <Link
            href="/dashboard/attendance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-white text-xs font-semibold rounded hover:bg-accent-hover transition-colors shadow-xs"
          >
            <Clock className="w-4 h-4" />
            Punch Clock Portal
          </Link>
        </div>

        {/* Employee 3 Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Today Attendance Card */}
          <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Today&apos;s Shift</span>
              <Clock className="w-4 h-4 text-accent" />
            </div>
            {todayRecord ? (
              <div>
                <p className="text-xl font-bold text-semantic-success">Checked In</p>
                <p className="text-xs text-muted mt-1 font-mono">
                  In: {todayRecord.checkInTime?.substring(0, 5)} {todayRecord.checkOutTime ? `• Out: ${todayRecord.checkOutTime.substring(0, 5)}` : '• Active Shift'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-muted">Not Checked In</p>
                <Link
                  href="/dashboard/attendance"
                  className="inline-block mt-1 text-xs text-accent font-semibold hover:underline"
                >
                  Record punch now →
                </Link>
              </div>
            )}
          </div>

          {/* Leave Quota Card */}
          <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Leave Applications</span>
              <CalendarCheck className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xl font-bold text-ink tabular-nums">{leaves.length} Total Applied</p>
            <p className="text-xs text-muted mt-1">
              {leaves.filter((l) => l.status === 'PENDING').length} awaiting approval
            </p>
          </div>

          {/* Latest Payslip */}
          <div className="p-4 bg-surface-light border border-border rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-xs font-medium">Latest Payslip</span>
              <CreditCard className="w-4 h-4 text-accent" />
            </div>
            {payslips.length > 0 ? (
              <div>
                <p className="text-xl font-bold text-ink">₹{payslips[0].netSalary.toLocaleString()}</p>
                <p className="text-xs text-muted mt-1">{payslips[0].periodName} • {payslips[0].status}</p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-muted">No payslips yet</p>
                <p className="text-xs text-muted mt-1">Will appear after monthly payroll run</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/dashboard/attendance"
            className="p-4 bg-surface-light border border-border hover:border-accent rounded-lg shadow-xs transition-colors"
          >
            <Clock className="w-4 h-4 text-accent mb-2" />
            <h3 className="text-xs font-bold text-ink">Attendance & Punch Log</h3>
            <p className="text-[11px] text-muted mt-0.5">Punch in/out and review complete attendance history.</p>
          </Link>

          <Link
            href="/dashboard/leaves"
            className="p-4 bg-surface-light border border-border hover:border-accent rounded-lg shadow-xs transition-colors"
          >
            <CalendarCheck className="w-4 h-4 text-accent mb-2" />
            <h3 className="text-xs font-bold text-ink">Apply for Leave</h3>
            <p className="text-[11px] text-muted mt-0.5">Submit casual, sick, or annual leave applications.</p>
          </Link>

          <Link
            href="/dashboard/payroll"
            className="p-4 bg-surface-light border border-border hover:border-accent rounded-lg shadow-xs transition-colors"
          >
            <CreditCard className="w-4 h-4 text-accent mb-2" />
            <h3 className="text-xs font-bold text-ink">View Payslips</h3>
            <p className="text-[11px] text-muted mt-0.5">Download and inspect detailed salary breakdowns.</p>
          </Link>
        </div>
      </div>
    );
  }

  // ==========================
  // 3. CANDIDATE FALLBACK
  // ==========================
  const seekerApps = seekerAppsResult?.data || [];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">Candidate Overview</h1>
        <p className="text-xs text-muted mt-1">Track submitted job applications and review status updates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface-light border border-border rounded shadow-xs">
          <span className="text-xs text-muted font-medium">Total Applied</span>
          <p className="text-2xl font-bold text-ink tabular-nums mt-2">{seekerApps.length}</p>
        </div>
        <div className="p-4 bg-surface-light border border-border rounded shadow-xs">
          <span className="text-xs text-semantic-warning font-medium">Under Review</span>
          <p className="text-2xl font-bold text-ink tabular-nums mt-2">
            {seekerApps.filter((a) => a.status === 'PENDING').length}
          </p>
        </div>
        <div className="p-4 bg-surface-light border border-border rounded shadow-xs">
          <span className="text-xs text-semantic-success font-medium">Approved</span>
          <p className="text-2xl font-bold text-ink tabular-nums mt-2">
            {seekerApps.filter((a) => a.status === 'APPROVED').length}
          </p>
        </div>
      </div>
    </div>
  );
}
