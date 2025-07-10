
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated('July 2025');
  }, []);
  
  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-muted-foreground pl-5">{children}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Terms of Use</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Last Updated: {lastUpdated}
        </p>
      </section>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>Welcome to Ahia.ng!</CardTitle>
            <CardDescription>
                By accessing or using Ahia.ng (the “Platform”), you agree to follow the terms below (“Terms”). These Terms are between you and Ahia Digital Marketplace (“we,” “our,” or “us”).
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            
            <Section title="🌍 Our Service">
                <p>Ahia.ng is a community-driven platform that connects buyers and sellers in Nigeria, especially within Enugu State. We do not own or sell any item listed. Users are responsible for their ads and interactions.</p>
            </Section>

            <Section title="🔐 Account Registration">
                <ul className="list-disc list-outside space-y-1">
                    <li>You must be 18+ or supervised by a guardian to use our platform.</li>
                    <li>Create only one account per person.</li>
                    <li>You're responsible for your login details and all activities under your account.</li>
                </ul>
            </Section>

            <Section title="📣 Posting an Ad">
                <ul className="list-disc list-outside space-y-1">
                    <li>You must provide clear, truthful information about the product or service you're offering.</li>
                    <li>Don’t post illegal items, misleading information, or use abusive language.</li>
                    <li>Keep your contact info up-to-date and reachable. Inactive phone numbers may lead to ad removal.</li>
                </ul>
            </Section>

            <Section title="📞 Contacting Sellers / Requesting Callback">
                 <ul className="list-disc list-outside space-y-1">
                    <li>Always meet in public, safe places—preferably during daylight hours.</li>
                    <li>Ahia.ng isn’t responsible for transactions gone wrong. Be smart, verify goods, and don’t pay upfront without checking.</li>
                </ul>
            </Section>
            
            <Section title="🚫 What’s Not Allowed">
                 <ul className="list-disc list-outside space-y-1">
                    <li>Selling fake, stolen, or illegal items.</li>
                    <li>Posting ads with adult content, scams, hate speech, or misleading information.</li>
                    <li>Creating duplicate accounts to bypass limits or policies.</li>
                </ul>
            </Section>
            
            <Section title="💳 Paid Services">
                 <ul className="list-disc list-outside space-y-1">
                    <li>Most services are free, but we may offer optional paid promotions (e.g., ad boosts).</li>
                    <li>All paid services are optional and non-refundable.</li>
                </ul>
            </Section>

            <Section title="📜 Intellectual Property">
                <p>Your content is yours, but by posting it, you give us permission to display it on Ahia.ng and in our promotions.</p>
            </Section>
            
            <Section title="⚠️ Disclaimer">
                <ul className="list-disc list-outside space-y-1">
                    <li>Ahia.ng is provided “as is.” We don’t guarantee every item’s quality or seller reliability.</li>
                    <li>We’re not liable for damages, losses, or fraud between users.</li>
                </ul>
            </Section>

            <div className="space-y-2 pt-4 border-t">
                <h2 className="text-2xl font-semibold">📬 Reporting Problems</h2>
                <p className="text-muted-foreground">
                    If you see fraud, spam, or something suspicious, please contact us at: <a href="mailto:support@ahia.ng" className="text-primary hover:underline font-semibold">support@ahia.ng</a>
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
