
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import AdCard from '@/components/AdCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Car, Home as HomeIcon, Shirt, Briefcase, Sparkles, Gamepad2, Wrench, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Property', icon: HomeIcon, color: 'bg-purple-100 text-purple-600' },
  { name: 'Electronics', icon: Sparkles, color: 'bg-blue-100 text-blue-600' },
  { name: 'Vehicles', icon: Car, color: 'bg-green-100 text-green-600' },
  { name: 'Jobs', icon: Briefcase, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Furniture', icon: Gamepad2, color: 'bg-orange-100 text-orange-600' },
  { name: 'Services', icon: Wrench, color: 'bg-gray-100 text-gray-600' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { name: 'Gaming', icon: Gamepad2, color: 'bg-indigo-100 text-indigo-600' },
];

const recentListings = [
  {
    id: '3',
    title: 'Used iPhone 13',
    price: '300,000',
    location: 'Enugu',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'iphone 13'
  },
  {
    id: '5',
    title: 'Mountain Bike',
    price: '250,000',
    location: 'Lagos',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'mountain bike'
  },
  {
    id: '4',
    title: 'Graphic Design Services',
    price: 'Negotiable',
    location: 'Remote',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'graphic design'
  },
  {
    id: '7',
    title: 'Lexus Hybrid Car',
    price: '15,000,000',
    location: 'Abuja',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'lexus car'
  },
];

export default function Home() {
  const [location, setLocation] = useState('Enugu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const communities = ['New Haven', 'Independence Layout', 'GRA', 'Abakpa', 'Uwani', 'Trans-Ekulu'];
  
  const handleLocationSelect = (community: string) => {
    setLocation(community);
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="bg-secondary/50 py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Welcome to Ahia
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Find or sell anything, anytime!
          </p>
          <div className="mt-10 mx-auto max-w-3xl">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-lg shadow-lg">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-14 text-lg w-full sm:w-auto justify-between sm:justify-center">
                    {location}
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select a Community</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2">
                    {communities.map((community) => (
                      <Button
                        key={community}
                        variant="outline"
                        onClick={() => handleLocationSelect(community)}
                      >
                        {community}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  className="pl-12 h-14 text-lg border-0 focus-visible:ring-0"
                />
              </div>
              <Button size="lg" className="h-14 w-full sm:w-auto text-lg">
                <Search className="h-5 w-5 md:hidden" />
                <span className="hidden md:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link href="#" key={category.name}>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-0 flex flex-col items-center justify-center gap-2">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color}`}>
                      <category.icon className="w-8 h-8"/>
                    </div>
                    <span className="font-semibold text-sm mt-2">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentListings.map((ad) => (
              <AdCard key={ad.id} {...ad} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild variant="outline">
              <Link href="/listings">View All Listings</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
