'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  const pathname = usePathname();

  // Only render the footer on the public landing page
  if (pathname !== '/') {
    return null;
  }

  return (
    <footer className="border-t border-border bg-surface-pure mt-auto text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              Enterprise Talent Operating System & HRMS. The unified system of record for your personnel directory, shift punch clock, leave balances, and automated payroll disbursements.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">HRMS Modules</h3>
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
                <Link href="/dashboard/applications" className="hover:text-accent transition-colors">
                  Track Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Access */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Workspace Access</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <Link href="/register" className="hover:text-accent transition-colors">
                  Register Organization
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-accent transition-colors">
                  Employee Portal Sign In
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-accent transition-colors">
                  Explore Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3">
          <p>© {new Date().getFullYear()} Hirium Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>Enterprise People Operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
