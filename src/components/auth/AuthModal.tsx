
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
import { Loader2, AlertTriangle } from 'lucide-react';
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

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const isFirebaseReady = apiKey && !apiKey.includes('your-') && projectId && !projectId.includes('your-');


  const handleFirebaseAuthError = (error: unknown) => {
    console.error("Full Firebase Auth Error Object:", error);

    if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') {
        console.log("Authentication popup closed by user.");
        return;
    }

    let title = 'Authentication Failed';
    let description: string | React.ReactNode = 'An unknown error occurred. Please try again.';

    if (error instanceof FirebaseError) {
        if (error.code.includes('api-key-not-valid') || error.message.includes('API key not valid')) {
            title = 'Invalid Firebase API Key';
            description = (
                <>
                    <p className="font-bold">Your Firebase API Key is not correct.</p>
                    <p className="mt-2">Please go to your Firebase project settings, copy the `apiKey` value, and paste it into your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file for the `NEXT_PUBLIC_FIREBASE_API_KEY` variable.</p>
                    <p className="mt-2 text-xs text-muted-foreground">Make sure there are no extra spaces or quotes around the key, and restart your server.</p>
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
            title = 'Firebase Error';
            description = `An unexpected Firebase error occurred: ${error.message} (Code: ${error.code})`;
        }
    } else if (error instanceof Error) {
        description = `An unexpected error occurred: ${error.message}`;
    }
    
    toast({
        variant: 'destructive',
        title: title,
        description: description,
        duration: 20000,
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

  const FirebaseNotReadyContent = (
    <>
      <DialogHeader>
        <div className="flex justify-center">
            <div className="bg-destructive/10 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
        </div>
        <DialogTitle className="text-center text-xl font-bold text-destructive">Firebase Not Configured</DialogTitle>
        <DialogDescription className="text-center">
            Authentication is disabled. This is usually because the API keys in your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file are missing or incorrect.
        </DialogDescription>
      </DialogHeader>
      <div className="text-left text-sm bg-muted p-4 rounded-md border space-y-3">
        <div>
          <p className="font-semibold">Your App's Current Project ID:</p>
          <p className="font-mono bg-background p-2 rounded text-center text-destructive mt-1">{projectId || 'UNDEFINED'}</p>
          <p className="text-xs text-muted-foreground mt-1">
            If this says "UNDEFINED" or shows the wrong ID, your <code className="bg-muted px-1 py-0.5 rounded">.env</code> file is not being loaded correctly.
          </p>
        </div>
        
        <div>
          <p className="font-semibold">How to Fix:</p>
          <ol className="list-decimal list-inside mt-2 space-y-2">
              <li>
                  Ensure your Firebase Project ID is correctly set for <code className="font-bold">NEXT_PUBLIC_FIREBASE_PROJECT_ID</code> in the <strong className="text-primary">.env</strong> file.
              </li>
              <li>
                  <span className="font-bold text-destructive">Crucial Step:</span> You must <strong className="text-primary">stop and restart</strong> your development server for the changes to take effect.
              </li>
          </ol>
        </div>
      </div>
    </>
  );

  const AuthContent = (
    <>
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
    </>
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {!isFirebaseReady ? FirebaseNotReadyContent : AuthContent}
      </DialogContent>
    </Dialog>
  );
}
