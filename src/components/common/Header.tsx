
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Info, Phone, User, LogOut, ChevronDown, Loader2, Tag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const navLinks = [
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isLoggedIn, loading, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
        await logout();
    } catch (error) {
        console.error("Logout failed", error);
    } finally {
        setIsLoggingOut(false);
        setMobileMenuOpen(false); // Close mobile menu on logout
    }
  }

  const NavLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
    <Link href={href} onClick={onClick} className={cn("transition-colors hover:text-primary", pathname === href ? "text-primary font-semibold" : "")}>
      {children}
    </Link>
  );
  
  const UserMenu = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage} alt={user?.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">Dashboard</Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link href="/post-ad"><Tag className="mr-2 h-4 w-4"/>Sell</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
               <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(link => <NavLink key={link.href} href={link.href}>{link.label}</NavLink>)}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
            <Button asChild>
                <Link href="/post-ad"><Tag />Sell</Link>
            </Button>
            {loading ? (
                <div className="h-10 w-24 rounded-md bg-muted animate-pulse" />
            ) : isLoggedIn && user ? (
                <UserMenu />
            ) : (
                <Button variant="outline" onClick={() => setAuthModalOpen(true)}>Login / Register</Button>
            )}
        </div>

        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-0">
              <div className="flex h-full flex-col p-6">
                  <SheetHeader>
                      <SheetTitle className="sr-only">Menu</SheetTitle>
                      <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                  </SheetHeader>
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mb-8 flex items-center">
                  <Logo />
                </Link>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn("flex items-center gap-3 rounded-lg p-2 text-lg", pathname === link.href ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted")}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                    <Button asChild size="lg">
                        <Link href="/post-ad" onClick={() => setMobileMenuOpen(false)}><Tag />Sell</Link>
                    </Button>
                    {loading ? <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                     : isLoggedIn && user ? (
                        <>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                            </Button>
                            <Button size="lg" variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
                                {isLoggingOut ? <Loader2 className="animate-spin" /> : 'Logout'}
                            </Button>
                        </>
                     ) : (
                        <Button size="lg" variant="outline" onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}>
                            Login / Register
                        </Button>
                     )
                    }
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
