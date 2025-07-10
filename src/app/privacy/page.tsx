
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated('July 2025');
  }, []);

  const policies = [
      { title: "Information We Collect", text: "We collect your name, email/phone, and listings info." },
      { title: "Use of Information", text: "We use this to help people find your ads faster and contact you." },
      { title: "Data Storage", text: "Your info is stored securely in Firebase (a Google cloud service)." },
      { title: "Third-Party Sharing", text: "We do NOT sell your personal info to 3rd parties." },
      { title: "Cookies", text: "Cookies are used to remember your filters & login status." },
      { title: "Your Rights", text: "You can request your data or close your account anytime." },
      { title: "Compliance", text: "We follow Nigerian data privacy expectations to the best of our ability." },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Privacy Policy</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Effective Date: {lastUpdated}
        </p>
      </section>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>Your Data is Safe With Us</CardTitle>
            <CardDescription>
                This Privacy Policy explains how we handle your information when you use Ahia.ng. Our goal is to be transparent and protect your privacy.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
              {policies.map((policy, index) => (
                <div key={index} className="space-y-1">
                  <h2 className="text-xl font-semibold">{index + 1}. {policy.title}</h2>
                  <p className="text-muted-foreground pl-5">{policy.text}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@ahia.ng" className="text-primary hover:underline">support@ahia.ng</a>.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
