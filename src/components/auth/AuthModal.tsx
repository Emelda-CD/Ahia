
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

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Facebook</title><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.351C0 23.41.59 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"/></svg>
);

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const { loginWithGoogle, loginWithFacebook, loginWithEmail, registerWithEmail } = useAuth();
  const { toast } = useToast();

  const handleFirebaseAuthError = (error: FirebaseError) => {
      if (error.code === 'auth/popup-closed-by-user') {
          return;
      }
      
      let title = 'Authentication Failed';
      let message = 'An unknown error occurred.';
      const detailedFacebookInstructions = "Your Facebook App is a 'Business' type, which handles permissions differently. To fix this, you must add the 'Facebook Login' product to your app. Here's how: 1. In your Facebook App Dashboard, find the 'Products' section in the left sidebar. 2. Click '+ Add product'. 3. Find 'Facebook Login' and click 'Set up'. 4. Once added, a new 'Facebook Login' menu will appear in your sidebar. Click on its 'Settings' submenu. 5. On the 'Facebook Login Settings' page, ensure the `email` permission is included in your requested data.";

      switch(error.code) {
          case 'auth/unauthorized-domain':
              title = 'Domain Not Authorized';
              message = "This app's domain is not authorized for OAuth operations. Please ensure the current hostname is added to the list of authorized domains in your Firebase project's Authentication settings.";
              break;
          case 'auth/user-not-found':
              message = 'No account found with this email.';
              break;
          case 'auth/wrong-password':
              message = 'Incorrect password. Please try again.';
              break;
          case 'auth/email-already-in-use':
              message = 'An account already exists with this email address.';
              break;
          case 'auth/weak-password':
              message = 'Password is too weak. It should be at least 6 characters.';
              break;
          case 'auth/configuration-not-found':
          case 'auth/invalid-credential':
              title = 'Facebook Login Error';
              message = detailedFacebookInstructions;
              break;
          default:
              if (error.message.includes('Invalid Scopes: email')) {
                  title = 'Facebook Login Error';
                  message = detailedFacebookInstructions;
              } else {
                  message = error.message;
              }
      }
      toast({ variant: 'destructive', title: title, description: message });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('login-email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('login-password') as HTMLInputElement).value;
    
    try {
      await loginWithEmail(email, password);
      onOpenChange(false);
    } catch (error) {
      handleFirebaseAuthError(error as FirebaseError);
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
    } catch (error) {
        handleFirebaseAuthError(error as FirebaseError);
    } finally {
        setIsLoading(false);
    }
  }
  
  const handleGoogleLogin = async () => {
    setIsSocialLoading('google');
    try {
        await loginWithGoogle();
        onOpenChange(false);
    } catch (error) {
        handleFirebaseAuthError(error as FirebaseError);
    } finally {
        setIsSocialLoading(null);
    }
  }
  
  const handleFacebookLogin = async () => {
    setIsSocialLoading('facebook');
    try {
        await loginWithFacebook();
        onOpenChange(false);
    } catch (error) {
        handleFirebaseAuthError(error as FirebaseError);
    } finally {
        setIsSocialLoading(null);
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
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleGoogleLogin} disabled={!!isSocialLoading}>
                 {isSocialLoading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                 Google
            </Button>
            <Button variant="outline" className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90" onClick={handleFacebookLogin} disabled={!!isSocialLoading}>
                {isSocialLoading === 'facebook' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FacebookIcon className="mr-2 h-4 w-4" />}
                Facebook
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
