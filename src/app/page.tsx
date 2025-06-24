
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AdCard from '@/components/AdCard';
import { ArrowRight, Car, Home as HomeIcon, Shirt, Briefcase, Sparkles, Wrench, LandPlot, PawPrint, Search, MapPin, X } from 'lucide-react';
import type { Listing } from '@/lib/listings-data';
import { categoriesData } from '@/lib/categories-data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { LocationModal } from '@/components/common/LocationModal';


const categoryIcons: { [key: string]: React.ElementType } = {
  Land: LandPlot,
  Property: HomeIcon,
  Vehicles: Car,
  Electronics: Sparkles,
  Jobs: Briefcase,
  Fashion: Shirt,
  Services: Wrench,
  Phones: Sparkles,
  'Animals & Pets': PawPrint,
  'Furniture & Home': HomeIcon,
};

const recentListings: Listing[] = [
    { id: '1', title: 'Clean Toyota Camry 2019', description: 'Foreign used, accident-free with original duty.', price: 12500000, category: 'Vehicles', subcategory: 'Cars', location: { lga: 'Enugu North', town: 'GRA' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'toyota camry' },
    { id: '2', title: 'Luxury 3-Bedroom Flat for Rent', description: 'A spacious and modern 3-bedroom flat with all amenities in a serene environment.', price: 3500000, category: 'Property', subcategory: 'Houses & Apartments for Rent', location: { lga: 'Enugu East', town: 'Trans-Ekulu' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'modern apartment' },
    { id: '3', title: 'Brand New iPhone 14 Pro Max', description: 'Slightly used iPhone 14 Pro Max, 256GB, in perfect condition.', price: 950000, category: 'Phones', subcategory: 'iPhones', location: { lga: 'Enugu South', town: 'Uwani' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'iphone pro' },
    { id: '4', title: 'Digital Marketing Expert', description: 'We are looking for an experienced digital marketer to join our team.', price: 'Negotiable', category: 'Jobs', subcategory: 'IT Jobs', location: { lga: 'Enugu North', town: 'Ogui' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'office desk' },
    { id: '5', title: 'HP Spectre x360 Laptop', description: 'Core i7, 16GB RAM, 512GB SSD. Barely used.', price: 750000, category: 'Electronics', subcategory: 'Laptops', location: { lga: 'Nsukka', town: 'Obukpa' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'laptop computer' },
    { id: '6', title: '1 Plot of Land in Awkunanaw', description: 'Fenced plot of land with C of O. Good for residential building.', price: 8000000, category: 'Land', subcategory: 'Land for Sale', location: { lga: 'Enugu South', town: 'Awkunanaw' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'land plot' },
    { id: '7', title: 'Honda CR-V 2018', description: 'Tokunbo Honda CR-V 2018 model. Excellent condition.', price: 15000000, category: 'Vehicles', subcategory: 'Cars', location: { lga: 'Igbo Eze North', town: 'Enugu-Ezike' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'honda crv' },
    { id: '8', title: 'German Shepherd Puppy', description: '8 weeks old purebred German Shepherd puppy. Vaccinated and dewormed.', price: 150000, category: 'Animals & Pets', subcategory: 'Dogs', location: { lga: 'Udi', town: 'Udi Urban' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'puppy cute' },
];

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState<string | null>(null);
    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) {
            params.set('q', searchQuery);
        }
        if (location) {
            params.set('location', location);
        }
        router.push(`/listings?${params.toString()}`);
    };

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12">
        <div className="bg-[linear-gradient(135deg,_#591942_0%,_#764ba2_100%)] text-white rounded-lg p-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Welcome to Ahia
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-200">
              Your trusted online marketplace in Nigeria. Find or sell anything, anytime!
            </p>
            <div className="mt-8 max-w-3xl mx-auto bg-white rounded-full p-2 flex items-center shadow-lg flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="What are you looking for?"
                        className="w-full pl-12 pr-4 py-3 text-gray-900 bg-transparent border-none rounded-full focus:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="border-l border-gray-200 h-8 mx-2 hidden sm:block"></div>
                <LocationModal onSelect={(town) => setLocation(town)}>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 whitespace-nowrap w-full justify-center sm:w-auto">
                        <MapPin className="h-5 w-5" />
                        <span>{location || 'All Enugu'}</span>
                        {location && <X className="h-4 w-4 ml-1 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setLocation(null);}} />}
                    </button>
                </LocationModal>
                <Button size="lg" className="rounded-full w-full sm:w-auto" onClick={handleSearch}>Search</Button>
            </div>
            <div className="mt-8">
               <Button size="lg" asChild>
                 <Link href="/post-ad">Post Your Ad FREE</Link>
               </Button>
            </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {categoriesData.map((category) => {
                  const Icon = categoryIcons[category.name] || HomeIcon;
                  return (
                    <AccordionItem value={category.slug} key={category.slug}>
                      <AccordionTrigger className="text-base font-semibold hover:no-underline">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span>{category.name}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3 pt-2">
                          {category.subcategories.map((sub) => (
                            <li key={sub}>
                              <Link
                                href={`/listings?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                className="text-muted-foreground hover:text-primary transition-colors block pl-8"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Recent Listings</h2>
                <Button asChild variant="link" className="text-base">
                  <Link href="/listings">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {recentListings.map((ad) => (
                  <AdCard key={ad.id} {...ad} />
                ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
