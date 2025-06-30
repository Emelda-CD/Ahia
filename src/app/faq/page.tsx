
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const faqs = [
  {
    question: "How do I post an ad?",
    answer: "To post an ad, simply click the 'Post Ad' button in the header, fill out the form with details about your item, add photos, and submit it for review. It's completely free!",
  },
  {
    question: "Is it safe to buy and sell on Ahia?",
    answer: "We take safety seriously. We recommend meeting sellers in public places, never paying for items in advance (especially for delivery), and inspecting the item thoroughly before you buy. Look for our 'Verified Seller' badges for extra peace of mind.",
  },
  {
    question: "How do I contact a seller?",
    answer: "On each ad page, you'll find buttons to 'Show Contact' (which reveals the seller's phone number), 'Chat with Seller', or 'Request a Callback'. Choose the option that works best for you.",
  },
  {
    question: "Can I edit my ad after posting it?",
    answer: "Yes, you can manage all your ads from your account dashboard. Go to 'My Account' -> 'My Ads' to find options to edit, view, or delete your listings.",
  },
  {
    question: "What items are not allowed on Ahia?",
    answer: "We prohibit the sale of illegal items, including but not limited to firearms, drugs, stolen goods, and counterfeit products. Please review our Terms and Conditions for a more detailed list.",
  },
  {
    question: "How does seller verification work?",
    answer: "Sellers can verify their identity by submitting a government-issued ID through their account settings. Verified sellers get a badge on their profile and ads, which helps build trust with buyers. The process is simple and helps create a safer marketplace for everyone.",
  },
];


export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Frequently Asked Questions</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Have a question? We're here to help. If you can't find your answer here, feel free to <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
        </p>
      </section>

      <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>Find answers to the most common questions about using Ahia.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
      </Card>
    </div>
  );
}
