
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Newspaper,
  MessageSquare,
  User,
  LogOut,
  Settings,
  BarChart,
  Gem,
  AlertCircle
} from 'lucide-react';

const navItems = [
  { href: '/account/my-ads', label: 'My Adverts', icon: Newspaper },
  { href: '/account/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/account/performance', label: 'Performance', icon: BarChart },
  { href: '/account/pro-sales', label: 'Pro Sales', icon: Gem },
  { href: '/account/premium', label: 'Premium Services', icon: Gem },
];

export default function AccountSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showAlert, setShowAlert] = useState(true);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border bg-card text-center">
        <Link href="/account/settings">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary hover:opacity-80 transition-opacity">
            <AvatarImage src={user.profileImage} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-muted-foreground">{user.email}</p>
        <Button variant="ghost" size="sm" asChild className="mt-2">
            <Link href="/account/settings"><Settings className="mr-2 h-4 w-4"/> Settings</Link>
        </Button>
      </div>

      <div className="p-2 rounded-lg border bg-card">
         {showAlert && (
            <div className="p-4 bg-orange-100 border border-orange-200 text-orange-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold flex items-center gap-2"><AlertCircle/> Alerts</h3>
                <Button variant="ghost" size="sm" className="text-orange-800 hover:bg-orange-200 h-auto p-1" onClick={() => setShowAlert(false)}>hide</Button>
                </div>
                <p className="text-sm"><b>1 your ad was declined!</b><br/><Link href="#" className="underline hover:text-orange-900">Click here</Link> to edit Ad.</p>
            </div>
         )}
        <nav className="mt-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

       <div className="p-2 rounded-lg border bg-card">
         <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive" onClick={logout}>
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
       </div>
    </div>
  );
}
