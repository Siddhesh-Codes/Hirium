'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  CalendarCheck,
  CreditCard,
  Briefcase,
  CheckCircle2,
  Check,
  X,
  FileText,
  Lock,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  Building2,
  Send,
  Eye,
  IndianRupee,
  Server
} from 'lucide-react';

export default function HomePage() {
  // Live ticking clock state for signature widget
  const [time, setTime] = useState<string>('09:41:24 AM');
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [shiftSeconds, setShiftSeconds] = useState<number>(31354); // ~08h 42m 34s
  const [activeSurfaceTab, setActiveSurfaceTab] = useState<number>(0);
  const [demoLeaveApproved, setDemoLeaveApproved] = useState<boolean | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      if (isClockedIn) {
        setShiftSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const formatShiftTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const productSurfaces = [
    {
      id: 'directory',
      title: 'Employee Registry',
      tag: '01 · Personnel',
      headline: 'A single, auditable source of truth for your entire workforce.',
      description:
        'Manage full personnel lifecycles, structured department mapping, granular role privileges (Admin, HR, Employee), and automated email onboarding.',
      badge: 'Zero Spreadsheet Drift',
    },
    {
      id: 'attendance',
      title: 'Shift Attendance',
      tag: '02 · Time & Shifts',
      headline: 'Precision punch clock with automated shift duration tracking.',
      description:
        'Live punch-in / punch-out logs, real-time work duration calculation, and automated classification for punctuality, overtime, and half-day shifts.',
      badge: 'Real-time Duration Engine',
    },
    {
      id: 'leaves',
      title: 'Leave Approvals',
      tag: '03 · Time Off',
      headline: 'Multi-category leave quotas with 1-click decision workflows.',
      description:
        'Structured quotas for Annual, Sick, and Casual leaves. Employees submit with reason notes, and HR managers approve or reject with instant balance deductions.',
      badge: 'Automated Quota Balance',
    },
    {
      id: 'payroll',
      title: 'Automated Payroll',
      tag: '04 · Compensation',
      headline: 'One-click monthly salary batch calculation with printable payslips.',
      description:
        'Calculates Basic Salary + Allowances (15%) - Statutory Deductions (10%) = Net Payable with formal company-branded printable salary slips.',
      badge: 'INR (₹) Benchmark Formula',
    },
    {
      id: 'recruitment',
      title: 'Recruitment & CVs',
      tag: '05 · Talent Acquisition',
      headline: 'Public candidate pipeline with secure in-browser resume preview.',
      description:
        'Publish job openings with salary ranges, receive direct candidate applications with PDF resumes, and review hiring decisions with multi-company data isolation.',
      badge: 'Embedded Resume Viewer',
    },
  ];

  return (
    <div className="flex flex-col flex-1 bg-bg-light text-ink selection:bg-accent/20">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION & SIGNATURE INTERACTIVE SHIFT TERMINAL
      ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-border pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
        {/* Subtle architectural hairline background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#12131608_1px,transparent_1px),linear-gradient(to_bottom,#12131608_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-16">
            {/* Hero Left: Value Proposition */}
            <div className="max-w-2xl">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent-subtle border border-accent/25 text-xs font-semibold text-accent mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Enterprise Talent Operating System & HRMS
              </div>

              {/* Headline with editorial Newsreader pairing */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[60px] text-ink font-bold tracking-tight leading-[1.08]">
                Every employee, shift, and rupee.{' '}
                <span className="italic font-normal text-ink/90 block sm:inline">
                  Audited in one place.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-xl font-normal">
                Replace fragmented spreadsheets, disconnected biometric clocks, and manual payroll formulas with an auditable people-operations platform.
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2 active:scale-[0.99]"
                >
                  Launch Organization Workspace
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#product-surfaces"
                  className="px-5 py-3 bg-surface-light border border-border text-ink hover:text-accent hover:border-accent/40 text-xs sm:text-sm font-semibold rounded-lg hover:bg-surface-subtle transition-all inline-flex items-center gap-2"
                >
                  Explore Product Surfaces
                  <ChevronRight className="w-4 h-4 text-muted" />
                </a>
              </div>

              {/* Metric stats ribbon */}
              <div className="mt-10 pt-8 border-t border-border grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-ink tabular-nums font-mono">100%</div>
                  <div className="text-[11px] text-muted font-medium mt-0.5">Audited Payroll Math</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-ink tabular-nums font-mono">0.14s</div>
                  <div className="text-[11px] text-muted font-medium mt-0.5">Punch Clock Latency</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-ink tabular-nums font-mono">99.9%</div>
                  <div className="text-[11px] text-muted font-medium mt-0.5">Platform Reliability</div>
                </div>
              </div>
            </div>

            {/* Hero Right: THE SIGNATURE INTERACTIVE SHIFT TERMINAL */}
            <div className="w-full lg:w-[480px] bg-surface-light border border-border/90 rounded-2xl shadow-elevated p-5 sm:p-6 relative">
              {/* Terminal top bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-semantic-success animate-pulse" />
                  <span className="text-xs font-bold text-ink font-mono">LIVE SHIFT TERMINAL</span>
                </div>
                <div className="text-xs font-mono text-muted tabular-nums bg-surface-subtle px-2.5 py-1 rounded">
                  {time}
                </div>
              </div>

              {/* Active Employee Simulated Card */}
              <div className="p-3.5 bg-surface-subtle/70 border border-border rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/20 text-accent font-bold flex items-center justify-center text-xs font-mono">
                      AP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">Aarav Patel</div>
                      <div className="text-[11px] text-muted">Senior Software Engineer · ENG</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      isClockedIn
                        ? 'bg-semantic-successBg text-semantic-success border border-semantic-success/20'
                        : 'bg-surface-light text-muted border border-border'
                    }`}
                  >
                    {isClockedIn ? 'ON SHIFT' : 'OFF SHIFT'}
                  </span>
                </div>

                {/* Shift Clock Timer */}
                <div className="mt-3.5 pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Today's Duration</div>
                    <div className="text-sm font-bold text-ink font-mono tabular-nums mt-0.5">
                      {formatShiftTime(shiftSeconds)}
                    </div>
                  </div>

                  {/* Interactive Punch In / Out Button */}
                  <button
                    onClick={() => setIsClockedIn(!isClockedIn)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      isClockedIn
                        ? 'bg-semantic-danger text-white hover:bg-semantic-danger/90'
                        : 'bg-semantic-success text-white hover:bg-semantic-success/90'
                    }`}
                  >
                    {isClockedIn ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        Clock Out
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Clock In
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time System Ledger Event Stream */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">Live System Events</div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="p-2 bg-surface-subtle/40 rounded border border-border flex items-center justify-between">
                    <span className="text-ink truncate">Monthly Batch Payroll Verified</span>
                    <span className="text-semantic-success font-semibold shrink-0">₹18,45,000 OK</span>
                  </div>
                  <div className="p-2 bg-surface-subtle/40 rounded border border-border flex items-center justify-between">
                    <span className="text-ink truncate">Leave Request: 2d Casual</span>
                    <span className="text-accent font-semibold shrink-0">In Review</span>
                  </div>
                  <div className="p-2 bg-surface-subtle/40 rounded border border-border flex items-center justify-between">
                    <span className="text-ink truncate">Welcome Email Dispatched</span>
                    <span className="text-muted shrink-0">Credentials Sent</span>
                  </div>
                </div>
              </div>

              {/* Terminal footer note */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-accent" />
                  Enterprise System of Record
                </span>
                <span className="font-mono text-accent font-semibold">Active Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PRODUCT DEPTH SECTION (INTERACTIVE TABBED PRODUCT STAGE)
      ───────────────────────────────────────────────────────────── */}
      <section id="product-surfaces" className="py-16 sm:py-24 border-b border-border bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
              Five Integrated Systems · Zero Manual Reconciliation
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight">
              Designed for the exact way an HR operations team works.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
              Explore the five interconnected engines that run your personnel registry, shift tracking, approvals, payroll calculations, and recruitment pipeline.
            </p>
          </div>

          {/* Interactive Surface Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-border mb-8">
            {productSurfaces.map((surface, idx) => (
              <button
                key={surface.id}
                onClick={() => setActiveSurfaceTab(idx)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeSurfaceTab === idx
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-surface-subtle/70 text-muted hover:text-ink hover:bg-surface-subtle'
                }`}
              >
                <span>{surface.title}</span>
                {activeSurfaceTab === idx && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>

          {/* Active Product Viewport Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono font-bold text-accent">
                {productSurfaces[activeSurfaceTab].tag}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-ink font-bold leading-snug">
                {productSurfaces[activeSurfaceTab].headline}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {productSurfaces[activeSurfaceTab].description}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent-subtle border border-accent/20 text-xs font-semibold text-accent">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {productSurfaces[activeSurfaceTab].badge}
                </span>
              </div>
            </div>

            {/* Right Interactive Surface Mockup */}
            <div className="lg:col-span-7 bg-bg-light border border-border rounded-2xl p-5 sm:p-7 shadow-elevated">
              {/* 1. Employee Registry Preview */}
              {activeSurfaceTab === 0 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                    <span className="font-bold text-ink flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      Personnel Directory (124 Active)
                    </span>
                    <span className="text-[11px] font-mono text-muted">Auto-Synced</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Pooja Varma', role: 'HR', dept: 'Human Resources', email: 'pooja.v@hirium.com', status: 'ACTIVE' },
                      { name: 'Rohan Deshmukh', role: 'ADMIN', dept: 'Executive Ops', email: 'rohan.d@hirium.com', status: 'ACTIVE' },
                      { name: 'Aarav Patel', role: 'EMPLOYEE', dept: 'Engineering', email: 'aarav.p@hirium.com', status: 'ACTIVE' },
                    ].map((emp, i) => (
                      <div key={i} className="p-3 bg-surface-light rounded-xl border border-border flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-ink">{emp.name}</div>
                          <div className="text-[11px] text-muted">{emp.email} · {emp.dept}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-subtle font-bold text-ink border border-border">
                            {emp.role}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-semantic-successBg text-semantic-success font-bold">
                            {emp.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Shift Attendance Preview */}
              {activeSurfaceTab === 1 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                    <span className="font-bold text-ink flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      Today's Shift Punch Ledger
                    </span>
                    <span className="text-[11px] font-mono text-semantic-success font-semibold">96.8% Punctual</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Aarav Patel', in: '09:00 AM', out: '06:00 PM', duration: '9h 00m', status: 'PRESENT' },
                      { name: 'Neha Joshi', in: '09:12 AM', out: '06:30 PM', duration: '9h 18m', status: 'LATE' },
                      { name: 'Vikram Singh', in: '08:55 AM', out: '05:55 PM', duration: '9h 00m', status: 'PRESENT' },
                    ].map((item, i) => (
                      <div key={i} className="p-3 bg-surface-light rounded-xl border border-border flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-ink">{item.name}</div>
                          <div className="text-[11px] font-mono text-muted">In: {item.in} → Out: {item.out}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-ink tabular-nums">{item.duration}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              item.status === 'PRESENT'
                                ? 'bg-semantic-successBg text-semantic-success'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Leave Approvals Preview */}
              {activeSurfaceTab === 2 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                    <span className="font-bold text-ink flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-accent" />
                      Pending Leave Request
                    </span>
                    <span className="text-[11px] font-mono text-muted">Quota Auto-Deduction</span>
                  </div>

                  <div className="p-4 bg-surface-light rounded-xl border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-ink">Vikram Singh · Engineering</div>
                        <div className="text-[11px] text-muted">Casual Leave (2 Days) · Aug 24 - Aug 25</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-subtle text-accent font-bold">
                        Balance: 12d Left
                      </span>
                    </div>
                    <p className="text-xs text-muted italic bg-surface-subtle/50 p-2.5 rounded">
                      "Attending family wedding in Pune. All sprint deliverables handed over."
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {demoLeaveApproved === null ? (
                        <>
                          <button
                            onClick={() => setDemoLeaveApproved(false)}
                            className="px-3 py-1.5 border border-border text-xs font-bold text-muted hover:text-semantic-danger rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setDemoLeaveApproved(true)}
                            className="px-3.5 py-1.5 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent-hover transition-colors shadow-xs"
                          >
                            Approve Leave
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold font-mono px-3 py-1 rounded-lg ${
                              demoLeaveApproved
                                ? 'bg-semantic-successBg text-semantic-success'
                                : 'bg-semantic-dangerBg text-semantic-danger'
                            }`}
                          >
                            {demoLeaveApproved ? '✓ Approved & Balance Deducted' : '✕ Leave Request Rejected'}
                          </span>
                          <button
                            onClick={() => setDemoLeaveApproved(null)}
                            className="p-1 text-muted hover:text-ink"
                            title="Reset"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Automated Payroll Preview */}
              {activeSurfaceTab === 3 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                    <span className="font-bold text-ink flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-accent" />
                      Salary Calculation Ledger
                    </span>
                    <span className="text-[11px] font-mono text-semantic-success font-semibold">Processed</span>
                  </div>

                  <div className="p-4 bg-surface-light rounded-xl border border-border space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-muted">Basic Monthly Salary</span>
                      <span className="font-bold text-ink">₹85,000</span>
                    </div>
                    <div className="flex items-center justify-between text-semantic-success">
                      <span>+ HRA & Allowances (15%)</span>
                      <span className="font-bold">+ ₹12,750</span>
                    </div>
                    <div className="flex items-center justify-between text-semantic-danger">
                      <span>- Statutory Deductions (10%)</span>
                      <span className="font-bold">- ₹8,500</span>
                    </div>
                    <div className="pt-2 border-t border-border flex items-center justify-between text-sm">
                      <span className="font-bold text-ink">Net Payable Disbursement</span>
                      <span className="font-bold text-accent text-base">₹89,250</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Recruitment Preview */}
              {activeSurfaceTab === 4 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                    <span className="font-bold text-ink flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-accent" />
                      Candidate Pipeline & In-Browser CV Preview
                    </span>
                    <span className="text-[11px] font-mono text-muted">Isolated Tenant</span>
                  </div>

                  <div className="p-3.5 bg-surface-light rounded-xl border border-border flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-ink">Rahul Sharma</div>
                      <div className="text-[11px] text-muted">Applying for: Lead Frontend Architect</div>
                      <div className="text-[10px] text-muted/80 font-mono mt-0.5">Resume: rahul_sharma_lead_cv.pdf</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-accent-subtle text-accent font-bold border border-accent/20">
                        In Review
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-surface-subtle text-ink font-semibold border border-border">
                        PDF Attached
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. THREE-STAGE DEPLOYMENT SEQUENCE (HOW IT WORKS)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-b border-border bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
              Structured Rollout Sequence
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight">
              From organization setup to first payroll run in 3 steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 bg-surface-light rounded-2xl border border-border space-y-3 relative shadow-subtle">
              <div className="w-8 h-8 rounded-lg bg-ink text-white font-mono text-xs font-bold flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-bold text-ink">Map Departments & Compensation</h3>
              <p className="text-xs text-muted leading-relaxed">
                Establish organizational units (Engineering, HR, Operations, Finance), assign department heads, and set base compensation benchmarks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-surface-light rounded-2xl border border-border space-y-3 relative shadow-subtle">
              <div className="w-8 h-8 rounded-lg bg-accent text-white font-mono text-xs font-bold flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-bold text-ink">Onboard Staff with Auto-Dispatch</h3>
              <p className="text-xs text-muted leading-relaxed">
                Create personnel records with one click. Hirium generates secure temporary passwords and automatically dispatches official welcome emails.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-surface-light rounded-2xl border border-border space-y-3 relative shadow-subtle">
              <div className="w-8 h-8 rounded-lg bg-ink text-white font-mono text-xs font-bold flex items-center justify-center">
                03
              </div>
              <h3 className="text-base font-bold text-ink">Track Shifts & Execute Payroll</h3>
              <p className="text-xs text-muted leading-relaxed">
                Daily punch clock logs feed automatically into the monthly payroll calculator. Generate, verify, and export employee salary slips in one batch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. ENTERPRISE SECURITY & AUDIT ARCHITECTURE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-b border-border bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
              Enterprise Security & Defense
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink font-bold tracking-tight">
              Engineered for organizations that take compliance seriously.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-bg-light rounded-xl border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-accent/15 text-accent flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-ink">Encrypted Authentication</div>
              <div className="text-[11px] text-muted leading-relaxed">
                Cryptographic credential hashing with resilient session persistence across devices.
              </div>
            </div>

            <div className="p-5 bg-bg-light rounded-xl border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-accent/15 text-accent flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-ink">Abuse & Bot Protection</div>
              <div className="text-[11px] text-muted leading-relaxed">
                Automated rate-limiting and intrusion protection on all portal sign-in endpoints.
              </div>
            </div>

            <div className="p-5 bg-bg-light rounded-xl border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-accent/15 text-accent flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-ink">Role-Based Access Control</div>
              <div className="text-[11px] text-muted leading-relaxed">
                Granular boundary separation between Admin, HR, and Employee dashboard surfaces.
              </div>
            </div>

            <div className="p-5 bg-bg-light rounded-xl border border-border space-y-2">
              <div className="w-8 h-8 rounded-md bg-accent/15 text-accent flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-ink">Data Isolation & Privacy</div>
              <div className="text-[11px] text-muted leading-relaxed">
                Candidate applications and employee records strictly isolated to your organization.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HIGH-CONVICTION FINAL CTA
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-bg-light via-bg-light to-accent-subtle/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl text-ink font-bold tracking-tight">
            Build your organization's people operations on solid ground.
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            Join modern organizations managing their staff directory, shift punch clock, leave approvals, and automated payroll with Hirium.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="px-7 py-3.5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2 active:scale-[0.99]"
            >
              Register Organization Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 bg-surface-light border border-border text-ink font-semibold rounded-lg hover:bg-surface-subtle transition-all text-xs sm:text-sm"
            >
              Sign In to Existing Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
