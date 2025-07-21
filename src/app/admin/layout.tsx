
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/common/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, Users, Package, Settings, LogOut, ChevronDown, Loader2 } from 'lucide-react';


const AdminNavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ElementType }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <Button variant={isActive ? 'secondary' : 'ghost'} className="w-full justify-start gap-3">
                <Icon className="h-5 w-5" />
                <span>{children}</span>
            </Button>
        </Link>
    );
};


export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        router.replace('/');
        return (
             <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-muted-foreground">Redirecting you to the homepage...</p>
                </div>
            </div>
        );
    }
    
  return (
    <div className="min-h-screen w-full flex bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo />
            </Link>
        </div>
        <nav className="space-y-2 p-4">
            <AdminNavLink href="/admin" icon={LayoutDashboard}>Dashboard</AdminNavLink>
            <AdminNavLink href="/admin/listings" icon={Package}>Listings</AdminNavLink>
            <AdminNavLink href="/admin/users" icon={Users}>Users</AdminNavLink>
            <AdminNavLink href="/admin/settings" icon={Settings}>Settings</AdminNavLink>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background px-6">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative flex items-center gap-2">
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profileImage} alt={user.name} data-ai-hint="person icon" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">My Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" /> Exit Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
