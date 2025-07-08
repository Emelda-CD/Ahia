
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Loader2, User, LogOut, Shield, Settings, ListOrdered } from 'lucide-react';
import Link from 'next/link';
import PerformanceDashboard from '@/components/account/PerformanceDashboard';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  // State for handling async logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // If loading is finished and there's no user, redirect to home.
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
        await logout();
        router.push('/'); // Redirect to home after logout
    } catch (error) {
        console.error("Logout failed:", error);
        // Optionally show a toast message here
    } finally {
        setIsLoggingOut(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center items-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={user.profileImage} alt={user.name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3" asChild>
                  <Link href="/account/my-ads"><ListOrdered/> My Ads</Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3"><Settings/> Account Settings</Button>
                {user.role === 'admin' && (
                    <Button variant="outline" className="w-full justify-start gap-3" asChild>
                        <Link href="/admin"><Shield/> Admin Panel</Link>
                    </Button>
                )}
                <Button variant="destructive" className="w-full justify-start gap-3" onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? <Loader2 className="animate-spin"/> : <LogOut/>} 
                    Logout
                </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
            <PerformanceDashboard />
        </div>
      </div>
    </div>
  );
}
