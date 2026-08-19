'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api';
import { useToastStore } from '@/lib/store/toastStore';
import {
  Briefcase,
  User,
  LogOut,
  Users,
  Building2,
  Clock,
  CalendarCheck,
  CreditCard,
  Menu,
  X,
  LayoutDashboard,
  FileSpreadsheet
} from 'lucide-react';
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
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  const isHrOrAdmin = user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'EMPLOYER';
  const isStaff = user?.role === 'EMPLOYEE';

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-light/95 backdrop-blur-xs border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group">
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className={clsx(
                    'px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
                    pathname === '/dashboard'
                      ? 'text-accent bg-accent-subtle/50 font-semibold'
                      : 'text-muted hover:text-ink hover:bg-surface-subtle'
                  )}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Overview
                </Link>

                {isHrOrAdmin && (
                  <>
                    <Link
                      href="/dashboard/employees"
                      className={clsx(
                        'px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
                        isActive('/dashboard/employees')
                          ? 'text-accent bg-accent-subtle/50 font-semibold'
                          : 'text-muted hover:text-ink hover:bg-surface-subtle'
                      )}
                    >
                      <Users className="w-3.5 h-3.5" />
                      Employees
                    </Link>

                    <Link
                      href="/dashboard/departments"
                      className={clsx(
                        'px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
                        isActive('/dashboard/departments')
                          ? 'text-accent bg-accent-subtle/50 font-semibold'
                          : 'text-muted hover:text-ink hover:bg-surface-subtle'
                      )}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Departments
                    </Link>

                    <Link
                      href="/dashboard/recruitment"
                      className={clsx(
                        'px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
                        isActive('/dashboard/recruitment') || isActive('/dashboard/jobs')
                          ? 'text-accent bg-accent-subtle/50 font-semibold'
                          : 'text-muted hover:text-ink hover:bg-surface-subtle'
                      )}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Recruitment
                    </Link>
                  </>
                )}

                <Link
                  href="/dashboard/attendance"
                  className={clsx(
                    'px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
                    isActive('/dashboard/attendance')
                      ? 'text-accent bg-accent-subtle/50 font-semibold'
                      : 'text-muted hover:text-ink hover:bg-surface-subtle'
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Attendance
                </Link>

                <Link
                  href="/dashboard/leaves"
                  className={clsx(
                    'px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
                    isActive('/dashboard/leaves')
                      ? 'text-accent bg-accent-subtle/50 font-semibold'
                      : 'text-muted hover:text-ink hover:bg-surface-subtle'
                  )}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Leaves
                </Link>

                <Link
                  href="/dashboard/payroll"
                  className={clsx(
                    'px-2.5 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5',
                    isActive('/dashboard/payroll')
                      ? 'text-accent bg-accent-subtle/50 font-semibold'
                      : 'text-muted hover:text-ink hover:bg-surface-subtle'
                  )}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Payroll
                </Link>
              </nav>
            )}

            {!isAuthenticated && (
              <nav className="hidden md:flex items-center gap-2">
                <Link
                  href="/jobs"
                  className="px-3 py-1.5 text-sm rounded font-medium text-muted hover:text-ink hover:bg-surface-subtle transition-colors"
                >
                  Open Positions
                </Link>
              </nav>
            )}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-surface-subtle/70 rounded border border-border text-xs font-medium text-ink">
                  <div className="w-6 h-6 rounded bg-accent/20 text-accent flex items-center justify-center font-medium">
                    <User className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <Badge variant={isHrOrAdmin ? 'accent' : 'neutral'} size="sm">
                    {user.role}
                  </Badge>
                </div>

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
          <div className="flex lg:hidden items-center">
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
        <div className="lg:hidden border-t border-border bg-surface-light px-4 pt-2 pb-4 space-y-1">
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
              >
                Overview
              </Link>
              {isHrOrAdmin && (
                <>
                  <Link
                    href="/dashboard/employees"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
                  >
                    Employee Directory
                  </Link>
                  <Link
                    href="/dashboard/departments"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
                  >
                    Departments
                  </Link>
                  <Link
                    href="/dashboard/recruitment"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
                  >
                    Recruitment
                  </Link>
                </>
              )}
              <Link
                href="/dashboard/attendance"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
              >
                Attendance Tracking
              </Link>
              <Link
                href="/dashboard/leaves"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
              >
                Leave Management
              </Link>
              <Link
                href="/dashboard/payroll"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-ink rounded hover:bg-surface-subtle"
              >
                Payroll Processing
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
