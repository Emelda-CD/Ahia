
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Privacy Policy</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Last updated: {lastUpdated}
        </p>
      </section>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>Your Privacy is Important to Us</CardTitle>
            <CardDescription>
                This Privacy Policy explains how Ahia ("we," "us," or "our") collects, uses, and discloses information about you when you use our website and services.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Template Document</AlertTitle>
              <AlertDescription>
                This is a template privacy policy. Before launching your website, you must replace the content of this page with your own comprehensive and legally compliant privacy policy.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                <p className="text-muted-foreground">
                    We collect information you provide directly to us, such as when you create an account, post an ad, or communicate with us. This may include your name, email address, phone number, and any other information you choose to provide. We also collect technical information automatically, such as your IP address and browsing behavior.
                </p>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
                <p className="text-muted-foreground">
                    We use the information we collect to provide, maintain, and improve our services. This includes connecting buyers and sellers, personalizing your experience, processing transactions, and sending you technical notices, updates, security alerts, and support messages.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">3. Sharing Your Information</h2>
                <p className="text-muted-foreground">
                   We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We may also share information in response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">4. Data Security</h2>
                <p className="text-muted-foreground">
                    We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">5. Your Rights & Choices</h2>
                <p className="text-muted-foreground">
                    You may update, correct or delete information about you at any time by logging into your online account or emailing us. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
