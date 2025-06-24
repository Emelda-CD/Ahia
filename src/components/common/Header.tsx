
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Info, Phone, Tag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';

const navLinks = [
  { href: '/post-ad', label: 'Sell', icon: Tag },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export default function Header() {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className={cn("transition-colors hover:text-primary", pathname === href ? "text-primary font-semibold" : "")}>
      {children}
    </Link>
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

          <div className="hidden items-center gap-2 md:flex">
            <Button asChild>
              <Link href="/post-ad">Post Ad</Link>
            </Button>
            <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>
              Register / Login
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs">
                <div className="p-4">
                  <Link href="/" className="mb-8 flex items-center">
                    <Logo />
                  </Link>
                  <nav className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={cn("flex items-center gap-3 rounded-lg p-2 text-lg", pathname === link.href ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted")}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-8 flex flex-col gap-4">
                    <Button asChild size="lg">
                      <Link href="/post-ad">Post Ad</Link>
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => setIsAuthModalOpen(true)}>
                      Register / Login
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/account">My Account</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}
