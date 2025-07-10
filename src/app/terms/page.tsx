
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // This will be set to July 2025 as per the user's document
    setLastUpdated('July 2025');
  }, []);
  
  const terms = [
    { title: "Age Requirement", text: "You must be 18+ to post or contact sellers." },
    { title: "Listing Quality", text: "All listings must be clean, legal, and truthful." },
    { title: "Prohibited Items", text: "No stolen items, fake documents, drugs, or weapons." },
    { title: "Moderation", text: "Ahia.ng reserves the right to delete misleading or harmful ads." },
    { title: "User Responsibility", text: "You’re responsible for what you post and who you deal with." },
    { title: "Account Suspension", text: "We can suspend accounts that abuse the platform." },
    { title: "Our Role", text: "Ahia.ng is not part of any transaction – always meet in public and be safe." },
    { title: "Changes to Terms", text: "Terms can change — you’ll be notified." },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Terms and Conditions</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Effective Date: {lastUpdated}
        </p>
      </section>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>Using Ahia.ng</CardTitle>
            <CardDescription>
                By using Ahia.ng, you agree to the following terms. This helps keep our community in Enugu safe and trusted.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
              {terms.map((term, index) => (
                <div key={index} className="space-y-1">
                  <h2 className="text-xl font-semibold">{index + 1}. {term.title}</h2>
                  <p className="text-muted-foreground pl-5">{term.text}</p>
                </div>
              ))}
            </div>
            
             <Alert variant="default" className="bg-yellow-50 border-yellow-200">
              <ShieldCheck className="h-4 w-4 text-yellow-700" />
              <AlertTitle className="text-yellow-800">Remember Your Safety!</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Always verify items before paying and meet sellers in safe, public locations. Ahia.ng does NOT act as a middleman or verify every seller.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2 pt-4 border-t">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have any questions about these Terms, please contact us at <a href="mailto:support@ahia.ng" className="text-primary hover:underline">support@ahia.ng</a>.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
