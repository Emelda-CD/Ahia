
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Terms and Conditions</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>
      
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
            <CardTitle>Welcome to Ahia!</CardTitle>
            <CardDescription>
                These terms and conditions outline the rules and regulations for the use of Ahia's Website, located at ahia.com.
                By accessing this website we assume you accept these terms and conditions. Do not continue to use Ahia if you do not agree to take all of the terms and conditions stated on this page.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                    By using our service, you agree to be bound by these terms. If you disagree with any part of the terms, then you may not access the service. This is a legally binding agreement between you and Ahia.
                </p>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">2. User Conduct and Responsibilities</h2>
                <p className="text-muted-foreground">
                    You are solely responsible for all information, data, text, photographs, graphics, messages, or other materials ("content") that you upload, post, publish or display. You agree to not use the service to post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">3. Prohibited Items and Content</h2>
                <p className="text-muted-foreground">
                    Users are prohibited from posting ads for illegal items, including but not limited to firearms, drugs, stolen goods, and counterfeit products. We reserve the right to remove any content that violates our policies without prior notice.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">4. Disclaimers and Limitation of Liability</h2>
                <p className="text-muted-foreground">
                    Ahia is a platform that connects buyers and sellers. We are not involved in the actual transaction between users. We do not guarantee the quality, safety, or legality of items advertised. You use the service at your own risk. Ahia will not be liable for any damages of any kind arising from the use of this site.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                    The Service and its original content, features and functionality are and will remain the exclusive property of Ahia and its licensors.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">6. Changes to Terms</h2>
                <p className="text-muted-foreground">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.
                </p>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have any questions about these Terms, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
