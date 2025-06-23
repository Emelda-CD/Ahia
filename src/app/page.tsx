
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AdCard from '@/components/AdCard';
import { ArrowRight, Car, Home as HomeIcon, Shirt, Briefcase, Sparkles, Wrench, LandPlot, PawPrint } from 'lucide-react';

import type { Listing } from '@/lib/listings-data';
import { categoriesData } from '@/lib/categories-data';

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
    { id: '1', title: 'Clean Toyota Camry 2019', price: 12500000, category: 'Vehicles', subcategory: 'Cars', location: { lga: 'Enugu North', town: 'GRA' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'toyota camry' },
    { id: '2', title: 'Luxury 3-Bedroom Flat for Rent', price: 3500000, category: 'Property', subcategory: 'Houses & Apartments for Rent', location: { lga: 'Enugu East', town: 'Trans-Ekulu' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'modern apartment' },
    { id: '3', title: 'Brand New iPhone 14 Pro Max', price: 950000, category: 'Phones', subcategory: 'iPhones', location: { lga: 'Enugu South', town: 'Uwani' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'iphone pro' },
    { id: '4', title: 'Digital Marketing Expert', price: 'Negotiable', category: 'Jobs', subcategory: 'IT Jobs', location: { lga: 'Enugu North', town: 'Ogui' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'office desk' },
    { id: '5', title: 'HP Spectre x360 Laptop', price: 750000, category: 'Electronics', subcategory: 'Laptops', location: { lga: 'Nsukka', town: 'Obukpa' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'laptop computer' },
    { id: '6', title: '1 Plot of Land in Awkunanaw', price: 8000000, category: 'Land', subcategory: 'Land for Sale', location: { lga: 'Enugu South', town: 'Awkunanaw' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'land plot' },
    { id: '7', title: 'Honda CR-V 2018', price: 15000000, category: 'Vehicles', subcategory: 'Cars', location: { lga: 'Igbo Eze North', town: 'Enugu-Ezike' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'honda crv' },
    { id: '8', title: 'German Shepherd Puppy', price: 150000, category: 'Animals & Pets', subcategory: 'Dogs', location: { lga: 'Udi', town: 'Udi Urban' }, image: 'https://placehold.co/600x400.png', data_ai_hint: 'puppy cute' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
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
           <section className="mb-16">
              <div className="bg-[linear-gradient(135deg,_#591942_0%,_#764ba2_100%)] text-white rounded-lg p-10 text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Welcome to Ahia
                  </h1>
                  <p className="mt-4 text-lg leading-8 text-gray-200">
                    Your trusted online marketplace in Nigeria. Find or sell anything, anytime!
                  </p>
                  <div className="mt-8">
                     <Button size="lg" asChild>
                       <Link href="/post-ad">Post Your Ad FREE</Link>
                     </Button>
                  </div>
              </div>
            </section>

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
