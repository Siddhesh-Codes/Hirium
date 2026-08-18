'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { useAuthStore } from '@/lib/store/authStore';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  User,
  Search,
} from 'lucide-react';
import clsx from 'clsx';
import { Badge } from '@/components/ui/Badge';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isEmployer = user?.role === 'EMPLOYER';
  const isSeeker = user?.role === 'JOB_SEEKER';

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" strokeWidth={1.75} />,
      isActive: pathname === '/dashboard',
      visible: true,
    },
    {
      label: 'Find Jobs',
      href: '/jobs',
      icon: <Search className="w-4 h-4" strokeWidth={1.75} />,
      isActive: pathname === '/jobs' || (pathname.startsWith('/jobs/') && !pathname.startsWith('/dashboard')),
      visible: isSeeker,
    },
    {
      label: 'My Postings',
      href: '/dashboard/jobs',
      icon: <Briefcase className="w-4 h-4" strokeWidth={1.75} />,
      isActive:
        pathname === '/dashboard/jobs' ||
        (pathname.startsWith('/dashboard/jobs/') && pathname !== '/dashboard/jobs/new'),
      visible: isEmployer,
    },
    {
      label: 'Post a Job',
      href: '/dashboard/jobs/new',
      icon: <PlusCircle className="w-4 h-4" strokeWidth={1.75} />,
      isActive: pathname === '/dashboard/jobs/new',
      visible: isEmployer,
    },
    {
      label: 'Browse Listings',
      href: '/jobs',
      icon: <Search className="w-4 h-4" strokeWidth={1.75} />,
      isActive: pathname === '/jobs',
      visible: isEmployer,
    },
    {
      label: 'My Applications',
      href: '/dashboard/applications',
      icon: <FileText className="w-4 h-4" strokeWidth={1.75} />,
      isActive: pathname.startsWith('/dashboard/applications'),
      visible: isSeeker,
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: <User className="w-4 h-4" strokeWidth={1.75} />,
      isActive: pathname === '/dashboard/profile',
      visible: true,
    },
  ];

  return (
    <RequireAuth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-surface-light border border-border rounded p-4 shadow-subtle mb-4">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                <div className="w-9 h-9 rounded bg-accent-subtle text-accent flex items-center justify-center font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs text-ink truncate">{user?.name}</p>
                  <p className="text-[11px] text-muted truncate">{user?.email}</p>
                </div>
              </div>
              <Badge variant="accent" className="w-full justify-center">
                {isEmployer ? 'Employer Account' : 'Job Seeker Account'}
              </Badge>
            </div>

            <nav className="bg-surface-light border border-border rounded p-2 shadow-subtle space-y-0.5">
              {navItems
                .filter((item) => item.visible)
                .map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors',
                      item.isActive
                        ? 'bg-accent text-white'
                        : 'text-muted hover:text-ink hover:bg-surface-subtle'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
            </nav>
          </aside>

          {/* Main Dashboard Canvas */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
