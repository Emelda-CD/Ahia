
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Users, BarChart } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: CheckCircle,
    title: 'Secure & Trusted',
    description: 'We verify sellers and monitor ads to ensure a safe marketplace for everyone.',
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Join thousands of buyers and sellers across Enugu connecting every day.',
  },
  {
    icon: BarChart,
    title: 'Grow Your Business',
    description: 'Reach more customers and grow your sales with our powerful ad promotion tools.',
  },
];

const teamMembers = [
  { name: 'John Doe', role: 'CEO & Founder', image: 'https://placehold.co/100x100.png', data_ai_hint: 'man portrait' },
  { name: 'Jane Smith', role: 'Head of Operations', image: 'https://placehold.co/100x100.png', data_ai_hint: 'woman portrait' },
  { name: 'Samuel Adebayo', role: 'Lead Engineer', image: 'https://placehold.co/100x100.png', data_ai_hint: 'man smiling' },
  { name: 'Chioma Nwosu', role: 'Marketing Director', image: 'https://placehold.co/100x100.png', data_ai_hint: 'woman smiling' },
];

const testimonials = [
    { name: 'Chinedu from Enugu', text: '"Ahia made selling my old car so easy! I got a buyer within 3 days. Highly recommended!"', data_ai_hint: 'man face' },
    { name: 'Nkechi from Nsukka', text: '"I found the perfect apartment for my family on Ahia. The platform is user-friendly and has so many options."', data_ai_hint: 'woman face' },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">About Ahia</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We are on a mission to connect people in Enugu to opportunities, making it easier and safer to buy and sell anything online.
        </p>
      </section>

      <section className="mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardContent className="p-8">
                <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.data_ai_hint} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h4 className="font-semibold text-lg">{member.name}</h4>
              <p className="text-primary">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 rounded-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
                 <Card key={testimonial.name}>
                    <CardContent className="p-6">
                        <blockquote className="text-lg text-center italic text-muted-foreground">"{testimonial.text}"</blockquote>
                        <div className="flex items-center justify-center mt-4">
                            <Avatar className="w-12 h-12 mr-4">
                                <AvatarImage src={`https://placehold.co/48x48.png`} alt={testimonial.name} data-ai-hint={testimonial.data_ai_hint}/>
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{testimonial.name}</p>
                        </div>
                    </CardContent>
                 </Card>
            ))}
        </div>
      </section>
    </div>
  );
}
