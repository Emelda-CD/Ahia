
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Ad } from '@/lib/listings-data';
import { cn } from '@/lib/utils';
import { categoriesData } from '@/lib/categories-data';

import AdCard from '@/components/AdCard';
import AdCardListItem from '@/components/AdCardListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LandPlot, Sparkles, Car, Briefcase, PawPrint, Sofa, Wrench, Search, X, Shirt, Home, Loader2, LayoutGrid, List, Leaf } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationModal } from '@/components/common/LocationModal';
import { getAds } from '@/lib/firebase/actions';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const categoryIcons: { [key: string]: React.ElementType } = {
  Property: Home,
  Land: LandPlot,
  Electronics: Sparkles,
  Vehicles: Car,
  Jobs: Briefcase,
  'Animals & Pets': PawPrint,
  'Furniture & Home': Sofa,
  Services: Wrench,
  Fashion: Shirt,
  Phones: Sparkles,
  'Food, Agriculture & Farming': Leaf,
};

const deriveFiltersFromQuery = (searchParams: URLSearchParams): any => {
    const query = (searchParams.get('q') || '').toLowerCase();
    const newFilters: any = {
        location: searchParams.get('location') || null,
        minPrice: '',
        maxPrice: '',
        verified: searchParams.get('verified') === 'true' || false,
        category: searchParams.get('category') || null,
    };
    return newFilters;
};


export default function ListingsPage() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
    const [allAds, setAllAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    const initialFilters = useMemo(() => deriveFiltersFromQuery(searchParams), [searchParams]);
    const [filters, setFilters] = useState<any>(initialFilters);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            try {
                const adsFromDb = await getAds();
                setAllAds(adsFromDb);
            } catch (error) {
                console.error("Failed to fetch ads:", error);
                 toast({
                    variant: "destructive",
                    title: "Could not load ads",
                    description: "There was a problem fetching data. Please refresh the page.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAds();
    }, [toast]);

    const handleCategoryClick = (categoryName: string) => {
        setFilters((prev: any) => {
            if(prev.category === categoryName) return prev;
            return { ...prev, q: '', category: categoryName };
        });
    };
    
    const handleCategoryValueChange = (value: string) => {
        if (value === 'all') {
            setFilters((prev: any) => ({ ...prev, category: null }));
            return;
        }
        setFilters((prev: any) => ({ ...prev, category: value }));
    };

    const handleCheckboxChange = (key: string, checked: boolean) => {
        setFilters((prev: any) => ({ ...prev, [key]: checked }));
    };

    const handleInputChange = useCallback((key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    }, []);

    const applyFilters = useCallback(() => {
        let ads = allAds;
        
        if (filters.category) {
            ads = ads.filter(ad => ad.category === filters.category);
        }

        const query = searchQuery.toLowerCase();
        if (query) {
            ads = ads.filter(ad => ad.title.toLowerCase().includes(query) || (ad.description && ad.description.toLowerCase().includes(query)));
        }

        if (filters.location) {
            ads = ads.filter(ad => ad.location === filters.location);
        }

        if (filters.minPrice) {
            ads = ads.filter(ad => ad.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            ads = ads.filter(ad => ad.price <= Number(filters.maxPrice));
        }
        
        if(filters.verified) ads = ads.filter(ad => ad.verified);
        
        setFilteredAds(ads);
    }, [filters, searchQuery, allAds]);
    
    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleSearch = () => {
        const newUrlParams = new URLSearchParams(window.location.search);
        newUrlParams.set('q', searchQuery);
        const newFilters = deriveFiltersFromQuery(newUrlParams);
        setFilters(newFilters);
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <section className="mb-8">
                 <div className="relative w-full max-w-2xl mx-auto mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for anything..." 
                        className="pl-10 h-12 text-lg" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                     <Button size="lg" className="absolute right-0 top-0 h-12" onClick={handleSearch}>Search</Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 sm:gap-4 text-center">
                    {categoriesData.map(cat => {
                        const Icon = categoryIcons[cat.name] || Home;
                        return (
                        <button
                            key={cat.name}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors h-24",
                                filters.category === cat.name && "bg-primary/10 ring-2 ring-primary"
                            )}
                        >
                            <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2" />
                            <span className="font-semibold text-xs text-center">{cat.name}</span>
                        </button>
                    )})}
                </div>
            </section>
            
            <div className="grid lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    <div className="p-4 rounded-lg border bg-card space-y-6 sticky top-20">
                        <h3 className="text-xl font-bold">Filters</h3>
                        
                        <div>
                            <Label>Category</Label>
                            <Select
                                value={filters.category || 'all'}
                                onValueChange={handleCategoryValueChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categoriesData.map(cat => (
                                        <SelectItem key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                       <Accordion type="multiple" defaultValue={['location', 'price', 'verification']} className="w-full">
                            <AccordionItem value="location">
                                <AccordionTrigger>Location</AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                     <LocationModal onSelect={(town, lga) => handleInputChange('location', `${town}, ${lga}`)}>
                                        <Button variant="outline" className="w-full justify-between">
                                            {filters.location || 'Enugu State'}
                                            {filters.location && <X className="h-4 w-4" onClick={(e) => { e.stopPropagation(); handleInputChange('location', null);}} />}
                                        </Button>
                                    </LocationModal>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="price">
                                <AccordionTrigger>Price Range</AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input placeholder="Min" type="number" value={filters.minPrice} onChange={e => handleInputChange('minPrice', e.target.value)} />
                                        <Input placeholder="Max" type="number" value={filters.maxPrice} onChange={e => handleInputChange('maxPrice', e.target.value)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="verification">
                                <AccordionTrigger>Verification</AccordionTrigger>
                                <AccordionContent className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="verified" checked={filters.verified} onCheckedChange={(c) => handleCheckboxChange('verified', !!c)} />
                                        <Label htmlFor="verified">Verified Ad</Label>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                         {isLoading ? (
                            <div className="h-5 bg-muted rounded w-48 animate-pulse"></div>
                        ) : (
                            <p className="text-muted-foreground">
                                Showing {filteredAds.length} result{filteredAds.length === 1 ? '' : 's'}
                                {searchQuery && <> for <span className="font-semibold text-foreground">"{searchQuery}"</span></>}
                            </p>
                        )}
                        <div className="flex items-center gap-1">
                            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')} aria-label="Grid view" disabled={isLoading || filteredAds.length === 0}>
                                <LayoutGrid className="h-5 w-5" />
                            </Button>
                            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')} aria-label="List view" disabled={isLoading || filteredAds.length === 0}>
                                <List className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
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
                    ) : filteredAds.length > 0 ? (
                        <>
                            {view === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredAds.map(ad => (
                                        <AdCard key={ad.id} {...ad} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAds.map(ad => (
                                        <AdCardListItem key={ad.id} {...ad} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 border rounded-lg bg-card">
                            <h3 className="text-2xl font-bold">No results found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
