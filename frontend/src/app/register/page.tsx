'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  employerRegisterSchema,
  EmployerRegisterFormData,
} from '@/schemas/authSchemas';
import { authApi } from '@/lib/api';
import { useToastStore } from '@/lib/store/toastStore';
import {
  Building2,
  Lock,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: toastError } = useToastStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<EmployerRegisterFormData>({
    resolver: zodResolver(employerRegisterSchema),
  });

  const onSubmit = async (data: EmployerRegisterFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await authApi.registerEmployer(data);
      if (res.succes) {
        success('Organization Registered', 'Your enterprise Hirium workspace is ready. Please sign in.');
        router.push('/login');
      } else {
        setApiError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please verify your details.';
      setApiError(msg);
      toastError('Registration Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-surface-light via-surface-light to-surface-subtle/40">
      <div className="w-full max-w-lg bg-surface-light border border-border/80 rounded-2xl shadow-xl p-8 sm:p-10">
        {/* Header with emblem-only logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-4 transition-transform hover:scale-105">
            <Logo size="xl" showText={false} />
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">Register Organization</h1>
          <p className="text-xs text-muted mt-1.5">
            Create an enterprise Hirium workspace for your organization.
          </p>
        </div>

        {/* Global API Error */}
        {apiError && (
          <div
            role="alert"
            className="mb-6 p-3.5 bg-semantic-dangerBg border border-semantic-danger/20 rounded-lg text-xs text-semantic-danger flex items-center gap-2.5 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Company / Organization Name *</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...form.register('companyName')}
                placeholder="Acme Technologies Pvt Ltd"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              />
            </div>
            {form.formState.errors.companyName && (
              <p className="text-[11px] text-semantic-danger mt-1 font-medium">
                {form.formState.errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Company Website *</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                {...form.register('companyWebPage')}
                placeholder="https://acme.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              />
            </div>
            {form.formState.errors.companyWebPage && (
              <p className="text-[11px] text-semantic-danger mt-1 font-medium">
                {form.formState.errors.companyWebPage.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Corporate Work Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...form.register('email')}
                  placeholder="admin@acme.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-[11px] text-semantic-danger mt-1 font-medium">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Contact Phone *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...form.register('phoneNumber')}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
              {form.formState.errors.phoneNumber && (
                <p className="text-[11px] text-semantic-danger mt-1 font-medium">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors p-1 rounded hover:bg-surface-subtle"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.75} />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-[11px] text-semantic-danger mt-1 font-medium">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...form.register('confirmPassword')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors p-1 rounded hover:bg-surface-subtle"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.75} />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-[11px] text-semantic-danger mt-1 font-medium">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            {isSubmitting ? (
              'Creating Organization Workspace...'
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Register Organization
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline font-semibold">
            Sign in to Hirium
          </Link>
        </div>
      </div>
    </div>
  );
}
