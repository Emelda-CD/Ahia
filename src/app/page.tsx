
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AdCard from '@/components/AdCard';
import AdCardListItem from '@/components/AdCardListItem';
import { ArrowRight, Car, Home as HomeIcon, Shirt, Briefcase, Sparkles, Wrench, LandPlot, PawPrint, Search, MapPin, X, Loader2, LayoutGrid, List, Leaf } from 'lucide-react';
import type { Ad } from '@/lib/listings-data';
import { categoriesData } from '@/lib/categories-data';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { LocationModal } from '@/components/common/LocationModal';
import { getRecentAds } from '@/lib/firebase/actions';
import { useToast } from '@/hooks/use-toast';


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
  'Food, Agriculture & Farming': Leaf,
};


export default function Home() {
    const [recentAds, setRecentAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState<string | null>(null);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            try {
                const ads = await getRecentAds(8);
                setRecentAds(ads);
            } catch (error) {
                console.error("Failed to fetch recent ads:", error);
                 toast({
                    variant: "destructive",
                    title: "Could not load recent ads",
                    description: "There was a problem fetching data. Please refresh the page.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAds();
    }, [toast]);

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
        <div className="bg-[linear-gradient(135deg,_#591942_0%,_#764ba2_100%)] text-white rounded-lg p-6 md:p-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white md:text-5xl">
              Welcome to Ahia
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-200">
              Your trusted online marketplace in Enugu. Find or sell anything.
            </p>
            <div className="mt-8 max-w-3xl mx-auto bg-white rounded-lg p-2 flex items-center shadow-lg flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="What are you looking for?"
                        className="w-full pl-12 pr-4 py-3 h-12 text-gray-900 bg-transparent border-none rounded-full focus:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="border-l border-gray-200 h-8 mx-2 hidden sm:block"></div>
                 <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                    <LocationModal onSelect={(town, lga) => setLocation(`${town}, ${lga}`)}>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 whitespace-nowrap w-full justify-center sm:w-auto border border-gray-200 rounded-full h-12 text-base">
                            <MapPin className="h-5 w-5" />
                            <span>{location || 'All Enugu'}</span>
                            {location && <X className="h-4 w-4 ml-1 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setLocation(null);}} />}
                        </button>
                    </LocationModal>
                    <Button size="lg" className="rounded-full w-full sm:w-auto h-12" onClick={handleSearch}>Search</Button>
                 </div>
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
        <aside className="lg:col-span-1 lg:sticky lg:top-24 hidden lg:block">
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
                <h2 className="text-2xl md:text-3xl font-bold">Recent Ads</h2>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1">
                        <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')} aria-label="Grid view" disabled={isLoading || recentAds.length === 0}>
                            <LayoutGrid className="h-5 w-5" />
                        </Button>
                        <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')} aria-label="List view" disabled={isLoading || recentAds.length === 0}>
                            <List className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button asChild variant="link" className="text-base">
                      <Link href="/listings">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="h-full">
                            <div className="animate-pulse">
                                <div className="bg-muted aspect-[4/3] w-full"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2"></div>
                                    <div className="h-6 bg-muted rounded w-1/3"></div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : recentAds.length > 0 ? (
                <>
                    {view === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentAds.map((ad) => (
                              <AdCard key={ad.id} {...ad} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentAds.map(ad => (
                                <AdCardListItem key={ad.id} {...ad} />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <p>No recent ads found.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
