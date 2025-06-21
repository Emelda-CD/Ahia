import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import AdCard from '@/components/AdCard';
import { Search, Car, Wrench, Home as HomeIcon, Shirt, Briefcase, Heart, BookOpen, Menu } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Vehicles', icon: Car, color: 'bg-blue-100 text-blue-600' },
  { name: 'Repairs', icon: Wrench, color: 'bg-green-100 text-green-600' },
  { name: 'Property', icon: HomeIcon, color: 'bg-purple-100 text-purple-600' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { name: 'Jobs', icon: Briefcase, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Health', icon: Heart, color: 'bg-red-100 text-red-600' },
  { name: 'Education', icon: BookOpen, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Services', icon: Menu, color: 'bg-gray-100 text-gray-600' },
];

const featuredAds = [
  {
    id: '1',
    title: 'Clean Toyota Camry 2019',
    price: '12,500,000',
    location: 'Lekki, Lagos',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'toyota camry'
  },
  {
    id: '2',
    title: 'Luxury 3-Bedroom Flat for Rent',
    price: '3,500,000',
    location: 'Ikeja, Lagos',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'modern apartment'
  },
  {
    id: '3',
    title: 'Brand New iPhone 14 Pro Max',
    price: '950,000',
    location: 'Wuse, Abuja',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'iphone pro'
  },
  {
    id: '4',
    title: 'Digital Marketing Expert Needed',
    price: 'Negotiable',
    location: 'Remote',
    image: 'https://placehold.co/600x400.png',
    data_ai_hint: 'office desk'
  },
];

export default function Home() {
  return (
    <>
      <section className="bg-primary/10 py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl text-gray-800">
            Find Anything in Nigeria
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            The best place to buy and sell. Trusted by millions of Nigerians.
          </p>
          <div className="mt-10 mx-auto max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="pl-12 h-14 text-lg"
                />
              </div>
              <Button size="lg" className="h-14 w-full sm:w-auto text-lg">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link href="#" key={category.name}>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300">
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

      <section className="bg-secondary/50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Ads</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredAds.map((ad) => (
              <AdCard key={ad.id} {...ad} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/listings">View All Ads</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
