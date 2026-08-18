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
    <footer className="border-t border-border bg-surface-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <p className="mt-3 text-xs text-muted max-w-sm leading-relaxed">
              Precision Hiring & Enterprise Talent Operating System. Connecting verified employers with qualified professionals through structured, compliant workflows.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Candidates</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <Link href="/jobs" className="hover:text-ink transition-colors">
                  Browse Positions
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-ink transition-colors">
                  Create Candidate Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard/applications" className="hover:text-ink transition-colors">
                  Track Applications
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">Employers</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted">
              <li>
                <Link href="/dashboard/jobs/new" className="hover:text-ink transition-colors">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-ink transition-colors">
                  Employer Registration
                </Link>
              </li>
              <li>
                <Link href="/dashboard/jobs" className="hover:text-ink transition-colors">
                  Candidate Pipeline
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted">
          <p>© {new Date().getFullYear()} Hirium Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
