
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AdCard from '@/components/AdCard';
import { MapPin, Phone, MessageSquare, ShieldCheck, Check, Loader2 } from 'lucide-react';
import type { Ad } from '@/lib/listings-data';
import { getAdById, trackAdView } from '@/lib/firebase/actions';
import { useToast } from '@/hooks/use-toast';

const similarAds = [
    { id: '5', title: 'HP Spectre x360 Laptop', price: 750000, location: 'Uwani, Enugu South', image: 'https://placehold.co/600x400.png', data_ai_hint: 'laptop computer', verified: true, userID: '1', timestamp: '', images: [] },
    { id: '6', title: 'Office Space for Lease', price: 800000, location: 'Independence Layout, Enugu North', image: 'https://placehold.co/600x400.png', data_ai_hint: 'office building', verified: false, userID: '1', timestamp: '', images: [] },
    { id: '7', title: 'Honda CR-V 2018', price: 15000000, location: 'GRA, Enugu North', image: 'https://placehold.co/600x400.png', data_ai_hint: 'honda crv', verified: true, userID: '1', timestamp: '', images: [] },
    { id: '8', title: 'Cute Puppy for a new home', price: 150000, location: 'Abakpa, Enugu East', image: 'https://placehold.co/600x400.png', data_ai_hint: 'puppy cute', verified: false, userID: '1', timestamp: '', images: [] },
]

export default function ProductDetailPage() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
        const fetchAd = async () => {
            setIsLoading(true);
            try {
                const fetchedAd = await getAdById(id);
                setAd(fetchedAd);
                if (fetchedAd) {
                  await trackAdView(id);
                }
            } catch (error) {
                console.error("Failed to fetch ad:", error);
                toast({
                    variant: "destructive",
                    title: "Could not load ad",
                    description: "Please check your internet connection and try again.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAd();
    }
  }, [id, toast]);


  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!ad) {
      return (
          <div className="container mx-auto px-4 py-12 text-center">
              <h1 className="text-2xl font-bold">Ad not found</h1>
              <p className="text-muted-foreground">This ad may have been removed or the link is incorrect.</p>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Image Gallery */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4">
                <Image src={ad.image} alt="Product Image" fill className="object-cover" data-ai-hint={ad.data_ai_hint} />
              </div>
              <div className="flex gap-2">
                {ad.images?.map((thumb, index) => (
                  <div key={index} className={`relative w-1/4 aspect-[4/3] rounded-md overflow-hidden cursor-pointer border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}>
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
                    {ad.verified && <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>}
                    <h1 className="text-3xl font-bold mt-2">{ad.title}</h1>
                    <div className="flex items-center text-muted-foreground mt-2">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>Posted in {ad.location}</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {`₦${ad.price.toLocaleString()}`}
                  </p>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                {ad.description}
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
                   {ad.verified && <div className="flex items-center text-sm text-green-600 font-semibold">
                    <ShieldCheck className="w-4 h-4 mr-1" /> Verified Seller
                  </div>}
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
              <Button variant="outline" size="lg" className="w-full">
                <MessageSquare className="w-5 h-5 mr-2" /> Chat with Seller
              </Button>
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
