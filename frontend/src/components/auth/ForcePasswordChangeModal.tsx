'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useToastStore } from '@/lib/store/toastStore';
import { employeesApi } from '@/lib/api';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function ForcePasswordChangeModal() {
  const { user, setAuth, accessToken } = useAuthStore();
  const { success, error: toastError } = useToastStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || !user.passwordChangeRequired) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await employeesApi.changePassword({
        employeeId: user.userId,
        newPassword,
      });

      if (res.succes) {
        // Clear passwordChangeRequired flag in current state
        setAuth(
          {
            ...user,
            passwordChangeRequired: false,
          },
          accessToken || ''
        );
        success('Password Updated', 'Your permanent password has been set successfully.');
      } else {
        setErrorMsg(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Could not update password. Please try again.';
      setErrorMsg(msg);
      toastError('Update Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
      <div className="bg-surface-light border border-border/80 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-ink">Set Your New Password</h2>
          <p className="text-xs text-muted mt-1.5 leading-relaxed">
            Welcome to Hirium! For your account security on your first login, please replace your temporary password with a permanent private password.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-semantic-dangerBg border border-semantic-danger/20 rounded-lg text-xs text-semantic-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">New Permanent Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 focus:bg-white text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors p-0.5"
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs border border-border rounded-lg bg-surface-subtle/50 focus:bg-white text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors p-0.5"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              'Updating Password...'
            ) : (
              <>
                Save Password & Enter Workspace
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
