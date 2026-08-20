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
  ShieldCheck,
  Check,
  X
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
    mode: 'onChange',
  });

  const passwordVal = form.watch('password') || '';

  // Password requirements calculation
  const hasMinLen = passwordVal.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordVal);
  const hasLower = /[a-z]/.test(passwordVal);
  const hasNumber = /\d/.test(passwordVal);
  const hasSpecial = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordVal);

  const passedCount = [hasMinLen, hasUpper && hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthMeta = () => {
    if (!passwordVal) return { label: 'Enter password', color: 'bg-border', width: 'w-0' };
    if (passedCount === 1) return { label: 'Weak', color: 'bg-semantic-danger', width: 'w-1/4' };
    if (passedCount === 2) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (passedCount === 3) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Strong & Secure', color: 'bg-semantic-success', width: 'w-full' };
  };

  const strengthMeta = getStrengthMeta();

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
                placeholder="Tata Strive Pvt Ltd"
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
                placeholder="https://tatastrive.com"
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
                  placeholder="hr@tatastrive.com"
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
              <label className="block text-xs font-semibold text-ink mb-1.5">Contact Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  {...form.register('phoneNumber')}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
              {form.formState.errors.phoneNumber ? (
                <p className="text-[11px] text-semantic-danger mt-1 font-medium">
                  {form.formState.errors.phoneNumber.message}
                </p>
              ) : (
                <p className="text-[10px] text-muted mt-1">10-digit mobile number starting with 6, 7, 8, or 9</p>
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
                  placeholder="e.g. Tata@2026Secure!"
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
                  placeholder="Repeat password"
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

          {/* Real-time Password Security Checklist & Visual Meter */}
          {passwordVal.length > 0 && (
            <div className="p-3 bg-surface-subtle/70 border border-border rounded-lg space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted font-medium">Password Security:</span>
                <span className="font-semibold text-ink">{strengthMeta.label}</span>
              </div>
              <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strengthMeta.color} ${strengthMeta.width}`} />
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px]">
                <div className={`flex items-center gap-1.5 ${hasMinLen ? 'text-semantic-success' : 'text-muted'}`}>
                  {hasMinLen ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-muted/60" />}
                  <span>Min 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-semantic-success' : 'text-muted'}`}>
                  {hasUpper && hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-muted/60" />}
                  <span>Uppercase & Lowercase</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-semantic-success' : 'text-muted'}`}>
                  {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-muted/60" />}
                  <span>At least 1 number</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-semantic-success' : 'text-muted'}`}>
                  {hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-muted/60" />}
                  <span>Special character (!@#$)</span>
                </div>
              </div>
            </div>
          )}

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
