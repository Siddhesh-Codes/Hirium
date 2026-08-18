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
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
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
        setApiError(res.message || 'Invalid credentials.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setApiError(msg);
      toastError('Authentication Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface-light border border-border rounded-lg shadow-elevated p-8">
      {/* Session Expired Banner */}
      {isSessionExpired && (
        <div className="mb-6 p-3 bg-semantic-warningBg border border-semantic-warning/20 rounded text-xs text-semantic-warning flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Your session has expired. Please authenticate again.</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mx-auto mb-3">
          <Logo size="lg" />
        </Link>
        <h1 className="font-display text-2xl font-normal text-ink">Sign in to Hirium</h1>
        <p className="text-xs text-muted mt-1">Enter your organization or candidate account credentials.</p>
      </div>

      {/* Global Error Banner */}
      {apiError && (
        <div
          role="alert"
          className="mb-6 p-3 bg-semantic-dangerBg border border-semantic-danger/20 rounded text-xs text-semantic-danger flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-medium text-ink mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              {...register('email')}
              placeholder="name@company.com"
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-semantic-danger mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-ink">Password</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded bg-surface-light text-ink placeholder:text-muted"
              aria-invalid={!!errors.password}
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-semantic-danger mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-medium rounded shadow-subtle transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            'Authenticating...'
          ) : (
            <>
              Sign In
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-accent hover:underline font-medium">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-surface-light border border-border rounded-lg p-8 text-center animate-pulse">
            <div className="w-10 h-10 bg-border/60 rounded mx-auto mb-4" />
            <div className="h-6 w-3/4 bg-border/60 rounded mx-auto mb-2" />
            <div className="h-4 w-1/2 bg-border/40 rounded mx-auto mb-6" />
            <div className="h-10 bg-border/40 rounded mb-3" />
            <div className="h-10 bg-border/40 rounded" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
