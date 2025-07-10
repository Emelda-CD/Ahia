
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // This will run only on the client, avoiding server/client mismatch
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-muted-foreground space-y-3 pl-2">{children}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Privacy Policy</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Last Revised: {lastUpdated || 'Loading...'}
        </p>
      </section>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>Your Privacy is Our Priority</CardTitle>
            <CardDescription>
              Welcome to Ahia.ng. This Privacy Policy explains how Ahia Digital Marketplace (“we,” “us,” or “our”) collects, uses, and shares information about you when you use our website, mobile apps, and services (collectively, our “Platform”). By using our Platform, you agree to the collection and use of information in accordance with this policy.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Section title="1. Our Commitment & Your Agreement">
                <p>We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us. Use of our Platform is intended for individuals aged 16 and over. If you are under 16, you must use our services with the consent and supervision of a parent or guardian.</p>
            </Section>

            <Section title="2. The Data We Collect">
                <p>To provide our services, we collect information in a few different ways:</p>
                <ul className="list-disc list-outside space-y-2 pl-5">
                    <li><strong>Information You Provide to Us:</strong> This includes your name, email address, phone number, date of birth, and any content you post in an ad, including photos and descriptions. For verification purposes, we may also request a government-issued ID, BVN, or business documents (like a CAC registration).</li>
                    <li><strong>Information Collected Automatically:</strong> When you access our Platform, we automatically log information such as your IP address, device type, browser details, geolocation data, and your activity on the site (log files).</li>
                    <li><strong>Information from Third Parties:</strong> If you register or log in using a third-party service like Google, Meta (Facebook), Apple, or Truecaller, we may receive information from them, such as your name and email address, as permitted by your privacy settings on those services.</li>
                </ul>
            </Section>

            <Section title="3. Why We Use Your Data">
                <p>We use the information we collect for various purposes:</p>
                <ul className="list-disc list-outside space-y-2 pl-5">
                    <li>To operate, maintain, and secure our Platform.</li>
                    <li>To facilitate account creation, ad posting, and communication between users.</li>
                    <li>To personalize your experience by recommending relevant listings.</li>
                    <li>To provide customer support and improve our ad performance and services.</li>
                    <li>To send you promotional communications, like newsletters or special offers. You can opt-out of marketing communications at any time.</li>
                </ul>
            </Section>

            <Section title="4. Who We Share Your Data With">
                <p>Your privacy is important. We only share your data in the following circumstances:</p>
                <ul className="list-disc list-outside space-y-2 pl-5">
                    <li><strong>Service Providers:</strong> We work with authorized third-party vendors to help us operate our Platform, such as Firebase for database and hosting, Paystack or Flutterwave for payment processing, and AWS for cloud services.</li>
                    <li><strong>Legal Obligations:</strong> We may disclose your information to regulatory bodies or law enforcement if required by law or to protect our rights and the safety of our users.</li>
                    <li><strong>Business Transfers:</strong> In the event of a partnership, merger, or sale of assets, your data may be transferred to our affiliates or a successor entity.</li>
                </ul>
            </Section>
            
            <Section title="5. Your Data Protection Rights">
                <p>You have rights regarding your personal data. You can:</p>
                <ul className="list-disc list-outside space-y-2 pl-5">
                    <li>Request access to, modify, or download a copy of your personal data.</li>
                    <li>Ask for the deletion of your personal data from our systems.</li>
                    <li>Object to our processing of your data for marketing purposes.</li>
                    <li>Withdraw your consent at any time where we rely on it to process your data.</li>
                    <li>File a complaint with the relevant Nigerian data protection authority if you believe your rights have been violated.</li>
                </ul>
            </Section>

             <Section title="6. Cookies and Tracking Technologies">
                <p>We use cookies, tracking pixels, and other technologies to help us understand user behavior, manage our Platform, and for advertising purposes. For more details on how to manage your cookie preferences, please refer to our upcoming Cookie Policy section or your browser settings.</p>
            </Section>
            
            <Section title="7. Data Retention & Server Location">
                 <p>We retain your personal data only for as long as necessary to provide our services or for legal and security reasons. Some anonymized data may be kept for analytical purposes. Your data may be stored and processed on servers in regions like the United States or Europe (managed by providers like Firebase and AWS), under strict data protection safeguards.</p>
            </Section>
            
            <Section title="8. Changes to This Privacy Policy">
                <p>We may update this policy from time to time. We will notify you of any significant changes by email or through an in-app notification. The "Last Revised" date at the top of this page indicates when it was last updated.</p>
            </Section>

            <div className="space-y-2 pt-4 border-t">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at <a href="mailto:support@ahia.ng" className="text-primary hover:underline">support@ahia.ng</a>.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
