
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { allListings, Listing } from '@/lib/listings-data';
import { locations } from '@/lib/locations';
import { cn } from '@/lib/utils';

import AdCard from '@/components/AdCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LandPlot, Sparkles, Car, Briefcase, PawPrint, Sofa, Wrench, Search, ArrowLeft, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = [
  { name: 'Land & Property', icon: LandPlot, value: 'property' },
  { name: 'Electronics', icon: Sparkles, value: 'electronics' },
  { name: 'Vehicles', icon: Car, value: 'vehicles' },
  { name: 'Jobs', icon: Briefcase, value: 'jobs' },
  { name: 'Animals', icon: PawPrint, value: 'animals' },
  { name: 'Furniture', icon: Sofa, value: 'furniture' },
  { name: 'Services', icon: Wrench, value: 'services' },
];

const DynamicFilters = ({ category, filters, setFilters }: { category: string | null, filters: any, setFilters: any }) => {
    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    if (!category) return null;

    return (
        <>
            {category === 'animals' && (
                <div className="space-y-4">
                    <Label>Breed</Label>
                    <Input placeholder="e.g., German Shepherd" value={filters.breed || ''} onChange={(e) => handleFilterChange('breed', e.target.value)} />
                    <Label>Gender</Label>
                    <Select value={filters.gender || ''} onValueChange={(val) => handleFilterChange('gender', val)}>
                        <SelectTrigger><SelectValue placeholder="Any Gender" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            {category === 'electronics' && (
                 <div className="space-y-4">
                    <Label>Brand</Label>
                    <Input placeholder="e.g., Apple" value={filters.brand || ''} onChange={(e) => handleFilterChange('brand', e.target.value)} />
                    <Label>Storage</Label>
                     <Select value={filters.storage || ''} onValueChange={(val) => handleFilterChange('storage', val)}>
                        <SelectTrigger><SelectValue placeholder="Any Storage" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="128gb">128GB</SelectItem>
                            <SelectItem value="256gb">256GB</SelectItem>
                            <SelectItem value="512gb">512GB</SelectItem>
                            <SelectItem value="1tb">1TB</SelectItem>
                        </SelectContent>
                    </Select>
                    <Label>Condition</Label>
                     <Select value={filters.condition || ''} onValueChange={(val) => handleFilterChange('condition', val)}>
                        <SelectTrigger><SelectValue placeholder="Any Condition" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
             {category === 'property' && (
                <div className="space-y-4">
                    <Label>Property Type</Label>
                    <Select value={filters.propertyType || ''} onValueChange={(val) => handleFilterChange('propertyType', val)}>
                        <SelectTrigger><SelectValue placeholder="Any Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="land">Land</SelectItem>
                            <SelectItem value="shop">Shop</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                        </SelectContent>
                    </Select>
                     <Label>Title</Label>
                    <Select value={filters.propertyTitle || ''} onValueChange={(val) => handleFilterChange('propertyTitle', val)}>
                        <SelectTrigger><SelectValue placeholder="Any Title" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cofo">C of O</SelectItem>
                            <SelectItem value="deed">Deed of Assignment</SelectItem>
                            <SelectItem value="allocation">Allocation</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            {category === 'jobs' && (
                 <div className="space-y-4">
                    <Label>Job Type</Label>
                     <Select value={filters.jobType || ''} onValueChange={(val) => handleFilterChange('jobType', val)}>
                        <SelectTrigger><SelectValue placeholder="Any Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
             {category === 'vehicles' && (
                <div className="space-y-4">
                    <Label>Brand</Label>
                    <Input placeholder="e.g., Toyota" value={filters.brand || ''} onChange={(e) => handleFilterChange('brand', e.target.value)} />
                    <Label>Transmission</Label>
                    <Select value={filters.transmission || ''} onValueChange={(val) => handleFilterChange('transmission', val)}>
                        <SelectTrigger><SelectValue placeholder="Any Transmission" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </>
    )
};


const LocationModal = ({ onSelect, children }: { onSelect: (town: string) => void, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'lga' | 'town'>('lga');
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);

  const lgas = Object.keys(locations);
  const towns = selectedLGA ? locations[selectedLGA] ? Object.values(locations[selectedLGA]).flat() : [] : [];

  const handleLgaSelect = (lga: string) => {
    setSelectedLGA(lga);
    setView('town');
  };

  const handleTownSelect = (town: string) => {
    onSelect(town);
    setIsOpen(false);
    reset();
  };
    
  const reset = () => {
    setView('lga');
    setSelectedLGA(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setTimeout(reset, 300);
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
           <div className="flex items-center justify-center relative">
                {view === 'town' && (
                    <Button variant="ghost" onClick={() => setView('lga')} className="absolute left-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                )}
                <DialogTitle>{view === 'lga' ? 'Select LGA' : `Towns in ${selectedLGA}`}</DialogTitle>
            </div>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4 max-h-[60vh] overflow-y-auto">
          {view === 'lga' && lgas.map(lga => (
            <Button key={lga} variant="outline" onClick={() => handleLgaSelect(lga)}>{lga}</Button>
          ))}
          {view === 'town' && towns.map(town => (
            <Button key={town} variant="outline" onClick={() => handleTownSelect(town)}>{town}</Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function ListingsPage() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
    
    const [filters, setFilters] = useState<any>({
        location: searchParams.get('location') || null,
        minPrice: '',
        maxPrice: '',
        sellerVerified: searchParams.get('verified') === 'true' || false,
        propertyVerified: searchParams.get('property_verified') === 'true' || false,
        verifiedID: false,
        minRating: searchParams.get('rating') ? 4 : 0,
        popularity: '',
    });

    const primaryCategory = useMemo(() => {
        const query = (searchParams.get('search') || '').toLowerCase();
        const categoryParam = searchParams.get('category');
        if (categoryParam) return categoryParam;

        const categoryKeywords: Record<string, string[]> = {
            animals: ['dog', 'cat', 'puppy', 'goat', 'animal'],
            electronics: ['iphone', 'phone', 'laptop', 'tv', 'samsung', 'electronic'],
            property: ['land', 'apartment', 'shop', 'flat', 'property'],
            jobs: ['job', 'developer', 'manager', 'accountant'],
            vehicles: ['car', 'toyota', 'honda', 'lexus', 'vehicle'],
            furniture: ['sofa', 'chair', 'table', 'furniture'],
            services: ['service', 'repair', 'cleaning'],
        };

        for (const category in categoryKeywords) {
            if (categoryKeywords[category].some(keyword => query.includes(keyword))) {
                return category;
            }
        }
        return null;
    }, [searchParams]);

    const applyFilters = () => {
        let listings = allListings;

        // Filter by primary category if detected from search
        if (primaryCategory) {
            listings = listings.filter(l => l.category === primaryCategory);
        }

        // Search query filter
        const query = searchQuery.toLowerCase();
        if (query) {
            listings = listings.filter(l => l.title.toLowerCase().includes(query) || l.description.toLowerCase().includes(query));
        }

        // Location filter
        if (filters.location) {
            listings = listings.filter(l => l.location.town === filters.location);
        }

        // Price filter
        if (filters.minPrice) {
            listings = listings.filter(l => l.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            listings = listings.filter(l => l.price <= Number(filters.maxPrice));
        }
        
        // Verification filters
        if(filters.sellerVerified) listings = listings.filter(l => l.verifiedSeller);
        if(filters.propertyVerified) listings = listings.filter(l => l.propertyVerified);
        if(filters.verifiedID) listings = listings.filter(l => l.verifiedID);
        if(filters.minRating > 0) listings = listings.filter(l => l.rating && l.rating >= filters.minRating);

        // Popularity filters
        if(filters.popularity === 'most_viewed') listings = listings.sort((a,b) => (b.views || 0) - (a.views || 0));
        if(filters.popularity === 'most_contacted') listings = listings.sort((a,b) => (b.contacts || 0) - (a.contacts || 0));
        
        // Dynamic filters
        if(primaryCategory && filters.brand) {
            listings = listings.filter(l => l.specifics?.brand?.toLowerCase().includes(filters.brand.toLowerCase()));
        }
        if(primaryCategory && filters.condition) {
            listings = listings.filter(l => l.specifics?.condition === filters.condition);
        }
        if(primaryCategory && filters.gender) {
            listings = listings.filter(l => l.specifics?.gender === filters.gender);
        }
        if(primaryCategory && filters.propertyType) {
            listings = listings.filter(l => l.specifics?.propertyType === filters.propertyType);
        }
         if(primaryCategory && filters.jobType) {
            listings = listings.filter(l => l.specifics?.jobType === filters.jobType);
        }
        
        setFilteredListings(listings);
    };
    
    // Apply filters on initial load and when filters change
    useEffect(() => {
        applyFilters();
    }, [searchParams, filters.location, filters.minPrice, filters.maxPrice, filters.sellerVerified, filters.propertyVerified, filters.verifiedID, filters.minRating, filters.popularity]);
    
    // Re-apply filters when dynamic filter values change
    useEffect(() => {
        applyFilters();
    }, [filters.brand, filters.condition, filters.gender, filters.propertyType, filters.jobType]);


    const handleCheckboxChange = (key: string, checked: boolean) => {
        setFilters((prev: any) => ({ ...prev, [key]: checked }));
    };

    const handleInputChange = (key: string, value: string) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };
    
    const handleSearch = () => {
        // We just need to trigger the effect that depends on searchParams
        // The easiest way is to push a new URL, but since we are already on the page
        // we can just call applyFilters manually
        applyFilters();
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

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-center">
                    {categories.map(cat => (
                        <a href={`/listings?category=${cat.value}&search=${cat.name.toLowerCase()}`} key={cat.name} className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-lg bg-secondary hover:bg-primary/10 transition-colors",
                            primaryCategory === cat.value && "bg-primary/10 ring-2 ring-primary"
                        )}>
                            <cat.icon className="h-8 w-8 text-primary mb-2" />
                            <span className="font-semibold text-sm">{cat.name}</span>
                        </a>
                    ))}
                </div>
            </section>
            
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="p-4 rounded-lg border bg-card space-y-6 sticky top-20">
                        <h3 className="text-xl font-bold">Filters</h3>
                       <Accordion type="multiple" defaultValue={['location', 'price', 'verification', 'dynamic']} className="w-full">
                            <AccordionItem value="location">
                                <AccordionTrigger>Location</AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                     <LocationModal onSelect={(town) => handleInputChange('location', town)}>
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
                             {primaryCategory && (
                                <AccordionItem value="dynamic">
                                    <AccordionTrigger>Details</AccordionTrigger>
                                    <AccordionContent>
                                        <DynamicFilters category={primaryCategory} filters={filters} setFilters={setFilters} />
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                            <AccordionItem value="verification">
                                <AccordionTrigger>Verification</AccordionTrigger>
                                <AccordionContent className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="sellerVerified" checked={filters.sellerVerified} onCheckedChange={(c) => handleCheckboxChange('sellerVerified', !!c)} />
                                        <Label htmlFor="sellerVerified">Seller Verified</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="propertyVerified" checked={filters.propertyVerified} onCheckedChange={(c) => handleCheckboxChange('propertyVerified', !!c)} />
                                        <Label htmlFor="propertyVerified">Property Verified</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="verifiedID" checked={filters.verifiedID} onCheckedChange={(c) => handleCheckboxChange('verifiedID', !!c)}/>
                                        <Label htmlFor="verifiedID">Verified Government ID</Label>
                                    </div>
                                     <div className="flex items-center space-x-2">
                                        <Checkbox id="minRating" checked={filters.minRating > 0} onCheckedChange={(c) => handleInputChange('minRating', c ? 4 : 0)}/>
                                        <Label htmlFor="minRating">4+ Star Rated Sellers</Label>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="popularity">
                                <AccordionTrigger>Popularity</AccordionTrigger>
                                <AccordionContent>
                                    <RadioGroup value={filters.popularity} onValueChange={(v) => handleInputChange('popularity', v)}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="most_viewed" id="most_viewed" />
                                            <Label htmlFor="most_viewed">Most Viewed</Label>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="most_contacted" id="most_contacted" />
                                            <Label htmlFor="most_contacted">Most Contacted</Label>
                                        </div>
                                    </RadioGroup>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
                    </div>
                </aside>

                {/* Listings Grid */}
                <main className="lg:col-span-3">
                    <div className="mb-4">
                        <p className="text-muted-foreground">
                            Showing {filteredListings.length} results
                            {searchQuery && <> for <span className="font-semibold text-foreground">"{searchQuery}"</span></>}
                        </p>
                    </div>
                    {filteredListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredListings.map(ad => (
                                <AdCard key={ad.id} {...ad} />
                            ))}
                        </div>
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
