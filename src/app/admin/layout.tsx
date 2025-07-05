
'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
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
    const { user, loading, isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn || user?.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, loading, isLoggedIn, router]);

    if (loading || !isLoggedIn || user?.role !== 'admin') {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
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
                            <AvatarImage src={user.profileImage} alt={user.name} data-ai-hint="man serious" />
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
                    <Link href="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" asChild>
                    <Link href="/" className="flex items-center gap-2 w-full">
                        <LogOut className="h-4 w-4" /> Exit Admin
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
