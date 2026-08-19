'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/authSchemas';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/ui/Logo';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('redirectUrl') || '/dashboard';
  const isSessionExpired = searchParams.get('session') === 'expired';

  const { setAuth, isAuthenticated } = useAuthStore();
  const { success, error: toastError } = useToastStore();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      const res = await authApi.login(data);
      if (res.succes && res.data) {
        setAuth(
          {
            userId: res.data.userId,
            email: res.data.email,
            name: res.data.name,
            role: res.data.role,
            expiresIn: res.data.expiresIn,
          },
          res.data.accessToken
        );
        success('Welcome back', `Signed in as ${res.data.name}`);
        router.push(redirectUrl);
      } else {
        setApiError(res.message || 'Invalid corporate email or password.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.';
      setApiError(msg);
      toastError('Authentication Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-light border border-border/80 rounded-2xl shadow-xl p-8 sm:p-10">
      {/* Session Expired Banner */}
      {isSessionExpired && (
        <div className="mb-6 p-3 bg-semantic-warningBg border border-semantic-warning/20 rounded-lg text-xs text-semantic-warning flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Your session has expired. Please sign in again.</span>
        </div>
      )}

      {/* Header with emblem-only logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center justify-center mb-4 transition-transform hover:scale-105">
          <Logo size="xl" showText={false} />
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">Sign in to Hirium</h1>
        <p className="text-xs text-muted mt-1.5">Enterprise Human Resource Management System</p>
      </div>

      {/* Global Error Banner */}
      {apiError && (
        <div
          role="alert"
          className="mb-6 p-3.5 bg-semantic-dangerBg border border-semantic-danger/20 rounded-lg text-xs text-semantic-danger flex items-center gap-2.5 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">Corporate Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              {...register('email')}
              placeholder="name@company.com"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all"
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-semantic-danger mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-ink">Password</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 hover:bg-surface-subtle focus:bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 transition-all font-mono"
              aria-invalid={!!errors.password}
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
          {errors.password && (
            <p className="text-[11px] text-semantic-danger mt-1 font-medium">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
        >
          {isSubmitting ? (
            'Authenticating...'
          ) : (
            <>
              Sign In to Hirium
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
        Need a company account?{' '}
        <Link href="/register" className="text-accent hover:underline font-semibold">
          Register Organization
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-surface-light via-surface-light to-surface-subtle/40">
      <Suspense fallback={<div className="text-xs text-muted">Loading secure portal...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
