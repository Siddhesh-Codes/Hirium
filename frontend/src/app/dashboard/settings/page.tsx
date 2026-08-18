'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/profile');
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-muted">
      Redirecting to profile...
    </div>
  );
}
