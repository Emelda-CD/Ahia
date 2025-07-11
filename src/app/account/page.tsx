
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will serve as the main dashboard overview.
// For now, we redirect to the "My Ads" page as it's the primary section.
export default function AccountDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account/my-ads');
  }, [router]);

  return null; // Render nothing while redirecting
}
