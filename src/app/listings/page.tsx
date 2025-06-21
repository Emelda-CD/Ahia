import AdCard from '@/components/AdCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const allAds = [
  { id: '1', title: 'Clean Toyota Camry 2019', price: '12,500,000', location: 'Lekki, Lagos', image: 'https://placehold.co/600x400.png', data_ai_hint: 'toyota camry' },
  { id: '2', title: 'Luxury 3-Bedroom Flat for Rent', price: '3,500,000', location: 'Ikeja, Lagos', image: 'https://placehold.co/600x400.png', data_ai_hint: 'modern apartment' },
  { id: '3', title: 'Brand New iPhone 14 Pro Max', price: '950,000', location: 'Wuse, Abuja', image: 'https://placehold.co/600x400.png', data_ai_hint: 'iphone pro' },
  { id: '4', title: 'Digital Marketing Expert Needed', price: 'Negotiable', location: 'Remote', image: 'https://placehold.co/600x400.png', data_ai_hint: 'office desk' },
  { id: '5', title: 'HP Spectre x360 Laptop', price: '750,000', location: 'Port Harcourt, Rivers', image: 'https://placehold.co/600x400.png', data_ai_hint: 'laptop computer' },
  { id: '6', title: 'Office Space for Lease', price: '800,000', location: 'Victoria Island, Lagos', image: 'https://placehold.co/600x400.png', data_ai_hint: 'office building' },
  { id: '7', title: 'Honda CR-V 2018', price: '15,000,000', location: 'Maitama, Abuja', image: 'https://placehold.co/600x400.png', data_ai_hint: 'honda crv' },
  { id: '8', title: 'Cute Puppy for a new home', price: '150,000', location: 'Surulere, Lagos', image: 'https://placehold.co/600x400.png', data_ai_hint: 'puppy cute' },
];

export default function ListingsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-bold mb-4 text-center">All Listings</h1>
      <p className="text-muted-foreground text-center mb-12">Find the best deals from trusted sellers across Nigeria.</p>
      
      <Card className="mb-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search for ads..." className="pl-10 h-12" />
            </div>
             <Select>
                <SelectTrigger className="h-12">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                </SelectContent>
            </Select>
            <Button size="lg" className="h-12">Search</Button>
        </div>
      </Card>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Showing {allAds.length} results</p>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allAds.map((ad) => (
          <AdCard key={ad.id} {...ad} />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">Load More</Button>
      </div>
    </div>
  );
}
