'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employerRegisterSchema,
  EmployerRegisterFormData,
  jobSeekerRegisterSchema,
  JobSeekerRegisterFormData,
} from '@/schemas/authSchemas';
import { authApi } from '@/lib/api';
import { useToastStore } from '@/lib/store/toastStore';
import { Building2, User, Lock, Mail, Phone, Globe, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import clsx from 'clsx';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'employer' | 'seeker'>('employer');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: toastError } = useToastStore();

  // Employer Form
  const employerForm = useForm<EmployerRegisterFormData>({
    resolver: zodResolver(employerRegisterSchema),
  });

  // Candidate Form
  const seekerForm = useForm<JobSeekerRegisterFormData>({
    resolver: zodResolver(jobSeekerRegisterSchema),
  });

  const onEmployerSubmit = async (data: EmployerRegisterFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await authApi.registerEmployer(data);
      if (res.succes) {
        success('Registration Successful', 'Your employer account has been created. Please sign in.');
        router.push('/login');
      } else {
        setApiError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please check your data.';
      setApiError(msg);
      toastError('Registration Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSeekerSubmit = async (data: JobSeekerRegisterFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await authApi.registerJobSeeker(data);
      if (res.succes) {
        success('Registration Successful', 'Your candidate account has been created. Please sign in.');
        router.push('/login');
      } else {
        setApiError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please check your data.';
      setApiError(msg);
      toastError('Registration Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-surface-light border border-border rounded-lg shadow-elevated p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mx-auto mb-3">
            <Logo size="lg" />
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-normal text-ink">Join Hirium</h1>
          <p className="text-xs text-muted mt-1">Select your account type to register on the platform.</p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 p-1 bg-surface-subtle rounded border border-border mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('employer');
              setApiError(null);
            }}
            className={clsx(
              'py-2 text-xs font-medium rounded flex items-center justify-center gap-2 transition-all',
              activeTab === 'employer'
                ? 'bg-surface-light text-ink shadow-subtle'
                : 'text-muted hover:text-ink'
            )}
          >
            <Building2 className="w-3.5 h-3.5" />
            Employer
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('seeker');
              setApiError(null);
            }}
            className={clsx(
              'py-2 text-xs font-medium rounded flex items-center justify-center gap-2 transition-all',
              activeTab === 'seeker'
                ? 'bg-surface-light text-ink shadow-subtle'
                : 'text-muted hover:text-ink'
            )}
          >
            <User className="w-3.5 h-3.5" />
            Job Seeker
          </button>
        </div>

        {/* Global API Error */}
        {apiError && (
          <div
            role="alert"
            className="mb-6 p-3 bg-semantic-dangerBg border border-semantic-danger/20 rounded text-xs text-semantic-danger flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Employer Registration Form */}
        {activeTab === 'employer' && (
          <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-ink mb-1">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...employerForm.register('companyName')}
                  placeholder="Acme Technologies Inc."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                />
              </div>
              {employerForm.formState.errors.companyName && (
                <p className="text-[11px] text-semantic-danger mt-1">
                  {employerForm.formState.errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">Website URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...employerForm.register('companyWebPage')}
                  placeholder="https://acme.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                />
              </div>
              {employerForm.formState.errors.companyWebPage && (
                <p className="text-[11px] text-semantic-danger mt-1">
                  {employerForm.formState.errors.companyWebPage.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    {...employerForm.register('email')}
                    placeholder="recruiter@acme.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                  />
                </div>
                {employerForm.formState.errors.email && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {employerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    {...employerForm.register('phoneNumber')}
                    placeholder="5551234567"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                  />
                </div>
                {employerForm.formState.errors.phoneNumber && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {employerForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...employerForm.register('password')}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                  />
                </div>
                {employerForm.formState.errors.password && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {employerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...employerForm.register('confirmPassword')}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                  />
                </div>
                {employerForm.formState.errors.confirmPassword && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {employerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded shadow-subtle transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Registering Company...'
              ) : (
                <>
                  Register Employer
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Job Seeker Registration Form */}
        {activeTab === 'seeker' && (
          <form onSubmit={seekerForm.handleSubmit(onSeekerSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">First Name</label>
                <input
                  type="text"
                  {...seekerForm.register('name')}
                  placeholder="Jane"
                  className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                />
                {seekerForm.formState.errors.name && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {seekerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">Last Name</label>
                <input
                  type="text"
                  {...seekerForm.register('lastName')}
                  placeholder="Doe"
                  className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                />
                {seekerForm.formState.errors.lastName && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {seekerForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">National ID</label>
                <input
                  type="text"
                  {...seekerForm.register('nationalId')}
                  placeholder="11-digit National ID"
                  className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted tabular-nums"
                />
                {seekerForm.formState.errors.nationalId && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {seekerForm.formState.errors.nationalId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">Birth Date</label>
                <div className="relative">
                  <input
                    type="date"
                    {...seekerForm.register('birthDate')}
                    className="w-full px-3 py-2 text-xs border border-border rounded bg-surface-light text-ink"
                  />
                </div>
                {seekerForm.formState.errors.birthDate && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {seekerForm.formState.errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...seekerForm.register('email')}
                  placeholder="jane.doe@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                />
              </div>
              {seekerForm.formState.errors.email && (
                <p className="text-[11px] text-semantic-danger mt-1">
                  {seekerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...seekerForm.register('password')}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                  />
                </div>
                {seekerForm.formState.errors.password && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {seekerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...seekerForm.register('confirmPassword')}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
                  />
                </div>
                {seekerForm.formState.errors.confirmPassword && (
                  <p className="text-[11px] text-semantic-danger mt-1">
                    {seekerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded shadow-subtle transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Creating Profile...'
              ) : (
                <>
                  Register Candidate
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Switch to Login */}
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
          Already registered?{' '}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
}
