'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Only render the footer on the public landing page
  if (pathname !== '/') {
    return null;
  }

  return (
    <footer className="border-t border-border bg-surface-pure mt-auto text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              Enterprise Talent Operating System & HRMS. The unified system of record for your personnel directory, shift punch clock, leave balances, and automated payroll disbursements.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-muted">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Stateless JWT Security
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-accent" />
                Multi-Tenant Scoped
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">HRMS Engines</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <a href="#product-surfaces" className="hover:text-accent transition-colors">
                  Personnel Directory
                </a>
              </li>
              <li>
                <a href="#product-surfaces" className="hover:text-accent transition-colors">
                  Shift Punch Clock
                </a>
              </li>
              <li>
                <a href="#product-surfaces" className="hover:text-accent transition-colors">
                  Leave Approval Workflow
                </a>
              </li>
              <li>
                <a href="#product-surfaces" className="hover:text-accent transition-colors">
                  Automated Payroll
                </a>
              </li>
            </ul>
          </div>

          {/* Talent & Recruitment */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Recruitment</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <Link href="/jobs" className="hover:text-accent transition-colors">
                  Open Positions Board
                </Link>
              </li>
              <li>
                <Link href="/dashboard/jobs/new" className="hover:text-accent transition-colors">
                  Publish Vacancy
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-accent transition-colors">
                  Organization Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Employee Portal Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Architecture</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted font-mono text-[11px]">
              <li className="flex items-center gap-1.5 text-semantic-success font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                47/47 Tests Passed
              </li>
              <li>Spring Boot 3 API</li>
              <li>PostgreSQL Cloud DB</li>
              <li>Next.js 14 App Router</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3">
          <p>© {new Date().getFullYear()} Hirium Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-muted">Stateless HS256 JWT</span>
            <span>·</span>
            <span className="text-muted">Strict RBAC</span>
            <span>·</span>
            <span className="text-muted">INR (₹) Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
