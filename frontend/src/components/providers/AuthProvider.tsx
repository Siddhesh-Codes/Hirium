'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { authApi } from '@/lib/api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const res = await authApi.refresh();
        if (isMounted && res.succes && res.data) {
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
        } else if (isMounted) {
          clearAuth();
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      }
    }

    if (!isInitialized) {
      restoreSession();
    }

    return () => {
      isMounted = false;
    };
  }, [isInitialized, setAuth, clearAuth, setInitialized]);

  return <>{children}</>;
}
