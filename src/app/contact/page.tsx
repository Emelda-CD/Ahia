import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, title: 'Our Office', value: '123 Market Road, Lagos, Nigeria' },
  { icon: Phone, title: 'Support Call', value: '+234 800 123 4567' },
  { icon: Mail, title: 'Email Us', value: 'support@ahia.com' },
  { icon: Clock, title: 'Business Hours', value: 'Mon - Fri: 9am - 6pm' },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Get in Touch</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We&apos;d love to hear from you! Whether you have a question, feedback, or need support, our team is here to help.
        </p>
      </section>
      
      <div className="grid md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form and we&apos;ll get back to you shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">General Support</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="ad_issue">Issue with an Ad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={6} />
              </div>
              <Button type="submit" size="lg" className="w-full">Submit Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold">Contact Information</h3>
          {contactInfo.map((info) => (
            <div key={info.title} className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-full">
                <info.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">{info.title}</h4>
                <p className="text-muted-foreground">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
