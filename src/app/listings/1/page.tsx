
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdCard from '@/components/AdCard';
import { MapPin, Phone, MessageSquare, ShieldCheck, Star, Check } from 'lucide-react';

const mainImage = 'https://placehold.co/800x600.png';
const thumbnails = [
  'https://placehold.co/100x80.png',
  'https://placehold.co/100x80.png',
  'https://placehold.co/100x80.png',
  'https://placehold.co/100x80.png',
];

const similarAds = [
    { id: '5', title: 'HP Spectre x360 Laptop', price: '750,000', location: 'Uwani, Enugu South', image: 'https://placehold.co/600x400.png', data_ai_hint: 'laptop computer' },
    { id: '6', title: 'Office Space for Lease', price: '800,000', location: 'Independence Layout, Enugu North', image: 'https://placehold.co/600x400.png', data_ai_hint: 'office building' },
    { id: '7', title: 'Honda CR-V 2018', price: '15,000,000', location: 'GRA, Enugu North', image: 'https://placehold.co/600x400.png', data_ai_hint: 'honda crv' },
    { id: '8', title: 'Cute Puppy for a new home', price: '150,000', location: 'Abakpa, Enugu East', image: 'https://placehold.co/600x400.png', data_ai_hint: 'puppy cute' },
]

export default function ProductDetailPage() {
  const [showContact, setShowContact] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackPopoverOpen, setCallbackPopoverOpen] = useState(false);

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackSubmitted(true);
    // In a real app, you'd submit the form data here.
    setTimeout(() => {
        setCallbackPopoverOpen(false);
        // Reset after a delay so user can see the success message
        setTimeout(() => setCallbackSubmitted(false), 500); 
    }, 2000);
  };
  
  const quickMessages = ['Is this still available?', 'What’s your last price?', 'Can I come inspect it today?'];


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Image Gallery */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4">
                <Image src={mainImage} alt="Product Image" fill className="object-cover" data-ai-hint="toyota camry" />
              </div>
              <div className="flex gap-2">
                {thumbnails.map((thumb, index) => (
                  <div key={index} className="relative w-1/4 aspect-[4/3] rounded-md overflow-hidden cursor-pointer border-2 border-primary">
                    <Image src={thumb} alt={`Thumbnail ${index + 1}`} fill className="object-cover" data-ai-hint="car interior" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <Badge>Used</Badge>
                    <h1 className="text-3xl font-bold mt-2">Clean Toyota Camry 2019</h1>
                    <div className="flex items-center text-muted-foreground mt-2">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>Posted in GRA, Enugu North</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary">&#8358;12,500,000</p>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                This 2019 Toyota Camry is in excellent condition. Foreign used, accident-free with original duty. Features include a powerful V6 engine, leather seats, panoramic sunroof, and advanced safety features. Perfect for anyone looking for a reliable and stylish ride.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          {/* Seller Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Seller" data-ai-hint="man smiling" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">John Motors</h3>
                  <div className="flex items-center text-sm text-green-600 font-semibold">
                    <ShieldCheck className="w-4 h-4 mr-1" /> Verified Seller
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showContact ? (
                 <a href="tel:+2348012345678" className="flex items-center justify-center text-center font-bold text-lg p-3 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5 mr-2" /> +234 801 234 5678
                </a>
              ) : (
                <Button size="lg" className="w-full" onClick={() => setShowContact(true)}>
                  <Phone className="w-5 h-5 mr-2" /> Show Contact
                </Button>
              )}
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full">
                    <MessageSquare className="w-5 h-5 mr-2" /> Chat with Seller
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Chat with Seller</h4>
                      <p className="text-sm text-muted-foreground">
                        Use a quick message or type your own.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {quickMessages.map(msg => (
                            <Button key={msg} variant="outline" size="sm" className="text-xs p-1 h-auto" onClick={() => setChatMessage(msg)}>
                                {msg}
                            </Button>
                        ))}
                    </div>
                    <Textarea 
                      placeholder="Type your message..." 
                      value={chatMessage} 
                      onChange={(e) => setChatMessage(e.target.value)}
                      rows={3}
                    />
                    <Button>Send Message</Button>
                  </div>
                </PopoverContent>
              </Popover>

               <Popover open={callbackPopoverOpen} onOpenChange={setCallbackPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="secondary" size="lg" className="w-full">Request a Callback</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    {callbackSubmitted ? (
                        <div className="text-center py-4 flex flex-col items-center gap-2">
                            <div className="bg-green-100 p-2 rounded-full">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="font-semibold text-foreground">Request Submitted!</p>
                            <p className="text-muted-foreground text-sm text-center">The seller will call you back shortly.</p>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleCallbackSubmit}>
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Request a Callback</h4>
                                <p className="text-sm text-muted-foreground">Enter your details and the seller will call you back.</p>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="name">Your Name</Label>
                                <Input id="name" placeholder="John Doe" required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="+234..." required />
                            </div>
                            <Button type="submit" className="w-full">Submit Request</Button>
                        </form>
                    )}
                </PopoverContent>
               </Popover>
            </CardContent>
          </Card>

          {/* Safety Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/>Safety Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Meet in a public place.</li>
                <li>Check the item before you buy.</li>
                <li>Pay only after collecting the item.</li>
                <li>Never pay for delivery in advance.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Similar Ads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarAds.map((ad) => (
                <AdCard key={ad.id} {...ad} />
            ))}
        </div>
      </div>
    </div>
  );
}
