'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api';
import { useToastStore } from '@/lib/store/toastStore';
import { Briefcase, User, LogOut, PlusCircle, FileText, Menu, X, LayoutDashboard } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import Logo from '@/components/ui/Logo';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { success } = useToastStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      clearAuth();
      success('Logged out', 'You have been signed out safely.');
      router.push('/');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-light/95 backdrop-blur-xs border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/jobs"
                className={clsx(
                  'px-3 py-1.5 text-sm rounded transition-colors font-medium',
                  isActive('/jobs')
                    ? 'text-accent bg-accent-subtle/50'
                    : 'text-muted hover:text-ink hover:bg-surface-subtle'
                )}
              >
                Find Jobs
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className={clsx(
                      'px-3 py-1.5 text-sm rounded transition-colors font-medium flex items-center gap-1.5',
                      pathname === '/dashboard'
                        ? 'text-accent bg-accent-subtle/50'
                        : 'text-muted hover:text-ink hover:bg-surface-subtle'
                    )}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Overview
                  </Link>

                  {user?.role === 'EMPLOYER' && (
                    <>
                      <Link
                        href="/dashboard/jobs"
                        className={clsx(
                          'px-3 py-1.5 text-sm rounded transition-colors font-medium flex items-center gap-1.5',
                          pathname === '/dashboard/jobs' || (pathname.startsWith('/dashboard/jobs/') && pathname !== '/dashboard/jobs/new')
                            ? 'text-accent bg-accent-subtle/50'
                            : 'text-muted hover:text-ink hover:bg-surface-subtle'
                        )}
                      >
                        <Briefcase className="w-3.5 h-3.5" strokeWidth={1.75} />
                        My Postings
                      </Link>
                      <Link
                        href="/dashboard/jobs/new"
                        className={clsx(
                          'px-3 py-1.5 text-sm rounded transition-colors font-medium flex items-center gap-1.5',
                          pathname === '/dashboard/jobs/new'
                            ? 'text-accent bg-accent-subtle/50'
                            : 'text-muted hover:text-ink hover:bg-surface-subtle'
                        )}
                      >
                        <PlusCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
                        Post a Job
                      </Link>
                    </>
                  )}

                  {user?.role === 'JOB_SEEKER' && (
                    <Link
                      href="/dashboard/applications"
                      className={clsx(
                        'px-3 py-1.5 text-sm rounded transition-colors font-medium flex items-center gap-1.5',
                        pathname.startsWith('/dashboard/applications')
                          ? 'text-accent bg-accent-subtle/50'
                          : 'text-muted hover:text-ink hover:bg-surface-subtle'
                      )}
                    >
                      <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                      My Applications
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-surface-subtle/70 hover:bg-surface-subtle rounded border border-border transition-colors text-xs font-medium text-ink"
                >
                  <div className="w-6 h-6 rounded bg-accent/20 text-accent flex items-center justify-center font-medium">
                    <User className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <Badge variant="accent" size="sm">
                    {user.role === 'EMPLOYER' ? 'Employer' : 'Candidate'}
                  </Badge>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-muted hover:text-semantic-danger rounded border border-transparent hover:border-semantic-danger/20 hover:bg-semantic-dangerBg/50 transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-ink hover:bg-surface-subtle rounded transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-sm font-medium bg-accent text-white hover:bg-accent-hover rounded shadow-subtle transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted hover:text-ink rounded"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface-light px-4 pt-2 pb-4 space-y-1">
          <Link
            href="/jobs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
          >
            Find Jobs
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
              >
                Dashboard Overview
              </Link>
              {user?.role === 'EMPLOYER' && (
                <>
                  <Link
                    href="/dashboard/jobs"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
                  >
                    My Postings
                  </Link>
                  <Link
                    href="/dashboard/jobs/new"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
                  >
                    Post a Job
                  </Link>
                </>
              )}
              {user?.role === 'JOB_SEEKER' && (
                <Link
                  href="/dashboard/applications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
                >
                  My Applications
                </Link>
              )}
              <Link
                href="/dashboard/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
              >
                Profile & Account
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-semantic-danger rounded hover:bg-semantic-dangerBg"
              >
                Sign Out
              </button>
            </>
          )}
          {!isAuthenticated && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-ink border border-border rounded"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium bg-accent text-white rounded"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
