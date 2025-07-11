'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AccountSidebar from '@/components/account/AccountSidebar';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null; 
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <AccountSidebar />
        </aside>
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
