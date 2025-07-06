
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import { Separator } from '../ui/separator';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.78 2.04-5.78 0-9.5-4.26-9.5-9.8s3.72-9.8 9.5-9.8c2.8 0 4.93 1.05 6.4 2.45l2.4-2.38C19.2 1.11 16.2.36 12.48.36c-6.9 0-12.13 5.3-12.13 11.97s5.23 11.97 12.13 11.97c6.7 0 11.7-4.4 11.7-11.52 0-.76-.1-1.45-.24-2.04z"/></svg>
);


export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<boolean>(false);
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const { toast } = useToast();

  const handleFirebaseAuthError = (error: unknown) => {
    // Log the raw error for debugging purposes
    console.error("Full Firebase Auth Error Object:", error);

    // Don't show toast for user-cancelled popups
    if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') {
        console.log("Authentication popup closed by user.");
        return;
    }

    let title = 'Authentication Failed';
    let description: string | React.ReactNode = 'An unknown error occurred. Please try again.';

    if (error instanceof FirebaseError) {
        // This is the most likely culprit, so let's check for it specifically,
        // using both the official code and parts of the message.
        if (error.code === 'auth/invalid-api-key' || error.message.includes('API key not valid')) {
            title = 'Invalid Firebase API Key';
            description = (
                <>
                    <p className="font-bold">Your Firebase API Key is not correct.</p>
                    <p className="mt-2">Please go to your Firebase project settings, copy the `apiKey` value, and paste it into your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file for the `NEXT_PUBLIC_FIREBASE_API_KEY` variable.</p>
                    <p className="mt-2 text-xs text-muted-foreground">Make sure there are no extra spaces or quotes around the key.</p>
                </>
            );
        } else if (error.code === 'auth/unauthorized-domain') {
            title = 'Domain Not Authorized';
            description = (
                <>
                    <p className="font-bold">This website's domain is not authorized for Google Sign-In.</p>
                    <p className="mt-2">Please go to your Firebase Console, navigate to <code className="bg-muted px-1 py-0.5 rounded">Authentication &gt; Settings &gt; Authorized domains</code>, and add the following domain:</p>
                    <p className="mt-2 font-mono bg-muted p-2 rounded text-center">{window.location.hostname}</p>
                </>
            );
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            title = 'Login Failed';
            description = "Incorrect email or password. Please try again.";
        } else if (error.code === 'auth/email-already-in-use') {
            title = 'Registration Failed';
            description = 'An account already exists with this email address. Please log in instead.';
        } else {
             // Generic fallback for other Firebase errors
            title = 'Firebase Error';
            description = `An unexpected Firebase error occurred: ${error.message} (Code: ${error.code})`;
        }
    } else if (error instanceof Error) {
        // Fallback for non-Firebase errors
        description = `An unexpected error occurred: ${error.message}`;
    }
    
    toast({
        variant: 'destructive',
        title: title,
        description: description,
        duration: 20000, // Longer duration for important messages
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('login-email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('login-password') as HTMLInputElement).value;
    
    try {
      await loginWithEmail(email, password);
      onOpenChange(false);
    } catch (error: unknown) {
      handleFirebaseAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem('register-name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('register-email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('register-password') as HTMLInputElement).value;

    try {
        await registerWithEmail(name, email, password);
        onOpenChange(false);
    } catch (error: unknown) {
        handleFirebaseAuthError(error);
    } finally {
        setIsLoading(false);
    }
  }
  
  const handleGoogleLogin = async () => {
    setIsSocialLoading(true);
    try {
        await loginWithGoogle();
        onOpenChange(false);
    } catch (error: unknown) {
        handleFirebaseAuthError(error);
    } finally {
        setIsSocialLoading(false);
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Welcome to Ahia</DialogTitle>
          <DialogDescription className="text-center">
            Log in or create an account to post ads and manage your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isSocialLoading}>
                 {isSocialLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                 Continue with Google
            </Button>
        </div>

        <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">OR</span>
            <Separator className="flex-1" />
        </div>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="pt-4">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="pt-4">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input id="register-name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input id="register-password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
