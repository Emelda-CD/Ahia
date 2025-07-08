
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.5 69.5c-23.6-22.6-55.2-36.8-91.6-36.8-69.1 0-125.5 56.4-125.5 125.5s56.4 125.5 125.5 125.5c80.8 0 112.3-61.5 116.5-91.2H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);

const getFirebaseAuthErrorMessage = (err: any): string => {
  if (typeof err !== 'object' || !err?.code) {
    return err?.message || 'An unexpected error occurred. Please try again.';
  }
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use by another account.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please enable it in your Firebase console under Authentication > Sign-in method.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use a stronger password (at least 6 characters).';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    default:
      return err.message || 'An unexpected error occurred. Please try again.';
  }
};


export function AuthModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState<null | 'google' | 'email' | 'register'>(null);
    const [error, setError] = useState('');
    const [resetPasswordEmail, setResetPasswordEmail] = useState('');
    const [resetFeedback, setResetFeedback] = useState({ type: '', message: '' });

    const { loginWithGoogle, loginWithEmail, registerWithEmail, sendPasswordReset, isFirebaseConfigured } = useAuth();
    const { toast } = useToast();

    const handleGoogleLogin = async () => {
        setLoading('google');
        setError('');
        try {
            await loginWithGoogle();
            onOpenChange(false);
            toast({ title: "Login Successful", description: "Welcome back!" });
        } catch (err: any) {
            const friendlyError = getFirebaseAuthErrorMessage(err);
            setError(friendlyError);
            toast({ variant: 'destructive', title: "Login Failed", description: friendlyError });
        } finally {
            setLoading(null);
        }
    };
    
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading('email');
        setError('');
        try {
            await loginWithEmail(email, password);
            onOpenChange(false);
            toast({ title: "Login Successful", description: "Welcome back!" });
        } catch (err: any) {
            const friendlyError = getFirebaseAuthErrorMessage(err);
            setError(friendlyError);
            toast({ variant: 'destructive', title: "Login Failed", description: friendlyError });
        } finally {
            setLoading(null);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading('register');
        setError('');
        try {
            await registerWithEmail(name, email, password);
            onOpenChange(false);
            toast({ title: "Registration Successful", description: "Please check your email to verify your account." });
        } catch (err: any)
        {
            const friendlyError = getFirebaseAuthErrorMessage(err);
            setError(friendlyError);
            toast({ variant: 'destructive', title: "Registration Failed", description: friendlyError });
        } finally {
            setLoading(null);
        }
    }
    
    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading('email');
        setResetFeedback({ type: '', message: '' });
        try {
            await sendPasswordReset(resetPasswordEmail);
            setResetFeedback({ type: 'success', message: 'Password reset link sent! Check your inbox.' });
        } catch (err: any) {
            setResetFeedback({ type: 'error', message: getFirebaseAuthErrorMessage(err) });
        } finally {
            setLoading(null);
        }
    }
    
    const [view, setView] = useState<'login' | 'forgot_password'>('login');

    const LoginView = (
        <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={!!loading}>
                {loading === 'email' ? <Loader2 className="animate-spin" /> : 'Login'}
            </Button>
            <div className="text-right">
                <Button type="button" variant="link" size="sm" className="p-0 h-auto" onClick={() => setView('forgot_password')}>
                    Forgot password?
                </Button>
            </div>
        </form>
    );

    const ForgotPasswordView = (
         <form onSubmit={handlePasswordReset} className="space-y-4">
             <Button variant="ghost" onClick={() => setView('login')} className="mb-4">&larr; Back to Login</Button>
            <div className="space-y-1">
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" type="email" placeholder="you@example.com" value={resetPasswordEmail} onChange={(e) => setResetPasswordEmail(e.target.value)} required />
            </div>
            {resetFeedback.message && (
                <p className={resetFeedback.type === 'error' ? 'text-destructive text-sm' : 'text-green-600 text-sm'}>{resetFeedback.message}</p>
            )}
            <Button type="submit" className="w-full" disabled={!!loading}>
                 {loading === 'email' ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
            </Button>
        </form>
    );

    const NotConfiguredView = () => (
        <DialogContent>
            <DialogHeader>
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
                <DialogTitle className="text-2xl font-bold text-center text-destructive">
                    Action Required: Configure Firebase
                </DialogTitle>
                <DialogDescription className="text-center text-lg text-muted-foreground px-4">
                    Your app is not connected to Firebase.
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4 text-left space-y-3 bg-muted p-4 rounded-lg">
                <p className="font-semibold">To fix this:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Fill in your Firebase API keys in the <code className="bg-background px-1 py-0.5 rounded">.env</code> file.</li>
                    <li>
                        <span className="font-bold text-destructive">MOST IMPORTANT:</span> Restart your development server.
                        <div className="text-xs text-muted-foreground">(Stop it with <code className="bg-background px-1 py-0.5 rounded">Ctrl + C</code> and start it with <code className="bg-background px-1 py-0.5 rounded">npm run dev</code>)</div>
                    </li>
                </ol>
                <p className="text-xs text-center pt-2 text-muted-foreground">The server only reads API keys on startup.</p>
            </div>
        </DialogContent>
    );

    if (!isFirebaseConfigured) {
        return (
             <Dialog open={open} onOpenChange={onOpenChange}>
                <NotConfiguredView />
            </Dialog>
        );
    }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            // Reset state on close
            setError('');
            setLoading(null);
            setView('login');
            setResetFeedback({type: '', message: ''});
        }
    }}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                    {view === 'login' ? 'Welcome to Ahia' : 'Reset Your Password'}
                </DialogTitle>
                <DialogDescription className="text-center">
                     {view === 'login' ? 'Sign in or create an account to continue.' : 'Enter your email to receive a password reset link.'}
                </DialogDescription>
            </DialogHeader>

            {view === 'forgot_password' ? ForgotPasswordView : (
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="space-y-4 pt-4">
                        {LoginView}
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={!!loading}>
                             {loading === 'google' ? <Loader2 className="animate-spin" /> : <><GoogleIcon /> Google</>}
                        </Button>
                    </TabsContent>
                    <TabsContent value="register">
                       <form onSubmit={handleRegister} className="space-y-4 pt-4">
                            <div className="space-y-1">
                                <Label htmlFor="name-reg">Full Name</Label>
                                <Input id="name-reg" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email-reg">Email</Label>
                                <Input id="email-reg" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password-reg">Password</Label>
                                <Input id="password-reg" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                             {error && <p className="text-destructive text-sm">{error}</p>}
                            <Button type="submit" className="w-full" disabled={!!loading}>
                                 {loading === 'register' ? <Loader2 className="animate-spin" /> : 'Register'}
                            </Button>
                       </form>
                    </TabsContent>
                </Tabs>
            )}
        </DialogContent>
    </Dialog>
  );
}

    