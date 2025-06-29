
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Listing } from '@/lib/listings-data';
import { locations } from '@/lib/locations';
import { cn } from '@/lib/utils';
import { categoriesData } from '@/lib/categories-data';

import AdCard from '@/components/AdCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LandPlot, Sparkles, Car, Briefcase, PawPrint, Sofa, Wrench, Search, ArrowLeft, X, Shirt, Home, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '@/components/ui/select';
import { LocationModal } from '@/components/common/LocationModal';
import { getListings } from '@/lib/firebase/actions';
import { Card } from '@/components/ui/card';

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
};


const DynamicFilters = ({ category, filters, setFilters }: { category: string | null, filters: any, setFilters: any }) => {
    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    if (!category) return null;

    if (category === 'Land') {
        return (
            <div className="space-y-4">
                <Label>Purpose</Label>
                <Select value={filters.listingType || ''} onValueChange={(val) => handleFilterChange('listingType', val)}>
                    <SelectTrigger><SelectValue placeholder="For Sale or Rent" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                </Select>
                
                <Label>Land Use</Label>
                <Select value={filters.landUse || ''} onValueChange={(val) => handleFilterChange('landUse', val)}>
                    <SelectTrigger><SelectValue placeholder="Any Use" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="agricultural">Agricultural / Farming</SelectItem>
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
        )
    }

    return (
        <>
            {category === 'Animals & Pets' && (
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
            {(category === 'Electronics' || category === 'Phones') && (
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
            {category === 'Jobs' && (
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
             {category === 'Vehicles' && (
                <div className="space-y-4">
                    <Label>Brand</Label>
                    <Input placeholder="e.g., Toyota" value={filters.brand || ''} onChange={(e) => handleFilterChange('brand', e.target.value)} />
                    <Label>Model</Label>
                    <Input placeholder="e.g., Camry" value={filters.model || ''} onChange={(e) => handleFilterChange('model', e.target.value)} />
                    <Label>Year</Label>
                    <Input type="number" placeholder="e.g., 2019" value={filters.year || ''} onChange={(e) => handleFilterChange('year', e.target.value)} />
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
            {category === 'Fashion' && (
                <div className="space-y-4">
                    <Label>Brand</Label>
                    <Input placeholder="e.g., Gucci" value={filters.brand || ''} onChange={(e) => handleFilterChange('brand', e.target.value)} />
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
        </>
    )
};

const categoryKeywords: Record<string, { category: string, subcategory?: string }> = {
    'land': { category: 'Land' },
    'plot': { category: 'Land' },
    'acre': { category: 'Land' },
    'hectare': { category: 'Land' },
    'property': { category: 'Property' },
    'apartment': { category: 'Property', subcategory: 'Houses & Apartments for Rent' },
    'flat': { category: 'Property', subcategory: 'Houses & Apartments for Rent' },
    'house': { category: 'Property', subcategory: 'Houses & Apartments for Sale' },
    'shop': { category: 'Property', subcategory: 'Commercial Property for Sale' },
    'office': { category: 'Property', subcategory: 'Commercial Property for Sale' },
    'iphone': { category: 'Phones', subcategory: 'iPhones' },
    'samsung': { category: 'Phones', subcategory: 'Samsung' },
    'galaxy': { category: 'Phones', subcategory: 'Samsung' },
    'tecno': { category: 'Phones', subcategory: 'Tecno' },
    'infinix': { category: 'Phones', subcategory: 'Infinix' },
    'phone': { category: 'Phones' },
    'car': { category: 'Vehicles', subcategory: 'Cars' },
    'camry': { category: 'Vehicles', subcategory: 'Cars' },
    'honda': { category: 'Vehicles', subcategory: 'Cars' },
    'toyota': { category: 'Vehicles', subcategory: 'Cars' },
    'vehicle': { category: 'Vehicles' },
    'job': { category: 'Jobs' },
    'dog': { category: 'Animals & Pets', subcategory: 'Dogs' },
    'puppy': { category: 'Animals & Pets', subcategory: 'Dogs' },
    'cat': { category: 'Animals & Pets', subcategory: 'Cats' },
    'pet': { category: 'Animals & Pets' },
    'bag': { category: 'Fashion', subcategory: 'Bags' },
    'shoe': { category: 'Fashion', subcategory: 'Shoes' },
    'dress': { category: 'Fashion', subcategory: 'Women’s Fashion' },
    'laptop': { category: 'Electronics', subcategory: 'Laptops' },
    'tv': { category: 'Electronics', subcategory: 'TVs' },
};

const deriveFiltersFromQuery = (searchParams: URLSearchParams): any => {
    const query = (searchParams.get('q') || '').toLowerCase();
    const newFilters: any = {
        location: searchParams.get('location') || null,
        minPrice: '',
        maxPrice: '',
        sellerVerified: searchParams.get('verified') === 'true' || false,
        propertyVerified: searchParams.get('property_verified') === 'true' || false,
        verifiedID: false,
        minRating: searchParams.get('rating') ? 4 : 0,
        popularity: '',
        category: searchParams.get('category') || null,
        subcategory: searchParams.get('subcategory') || null,
    };

    if (!newFilters.category) {
        for (const keyword in categoryKeywords) {
            if (query.includes(keyword)) {
                newFilters.category = categoryKeywords[keyword].category;
                if (categoryKeywords[keyword].subcategory) {
                   newFilters.subcategory = categoryKeywords[keyword].subcategory;
                }
                break;
            }
        }
    }
    return newFilters;
};


export default function ListingsPage() {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const initialFilters = useMemo(() => deriveFiltersFromQuery(searchParams), [searchParams]);
    const [filters, setFilters] = useState<any>(initialFilters);

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            try {
                const listingsFromDb = await getListings();
                setAllListings(listingsFromDb);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            }
            setIsLoading(false);
        };
        fetchListings();
    }, []);

    const handleCategoryClick = (categoryName: string) => {
        setFilters((prev: any) => {
            if(prev.category === categoryName) return prev;
            return {
                ...prev,
                q: '', 
                category: categoryName,
                subcategory: null
            };
        });
    };
    
    const handleCategoryValueChange = (value: string) => {
        if (value === 'all') {
            setFilters(prev => {
                const newFilters: any = { ...prev };
                delete newFilters.category;
                delete newFilters.subcategory;
                return newFilters;
            });
            return;
        }

        const mainCategory = categoriesData.find(c => c.name === value);
        if (mainCategory) {
            setFilters(prev => ({
                ...prev,
                category: value,
                subcategory: null,
            }));
            return;
        }
        
        const parentCategory = categoriesData.find(c => c.subcategories.includes(value));
        if (parentCategory) {
            setFilters(prev => ({
                ...prev,
                category: parentCategory.name,
                subcategory: value,
            }));
        }
    };


    const handleCheckboxChange = (key: string, checked: boolean) => {
        setFilters((prev: any) => ({ ...prev, [key]: checked }));
    };

    const handleInputChange = useCallback((key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    }, []);

    const applyFilters = useCallback(() => {
        let listings = allListings;
        
        if (filters.category) {
            listings = listings.filter(l => l.category === filters.category);
        }
        if (filters.subcategory) {
            listings = listings.filter(l => l.subcategory === filters.subcategory);
        }

        const query = searchQuery.toLowerCase();
        if (query) {
            listings = listings.filter(l => l.title.toLowerCase().includes(query) || (l.description && l.description.toLowerCase().includes(query)));
        }

        if (filters.location) {
            listings = listings.filter(l => l.location.town === filters.location);
        }

        if (filters.minPrice) {
            listings = listings.filter(l => typeof l.price === 'number' && l.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            listings = listings.filter(l =>  typeof l.price === 'number' && l.price <= Number(filters.maxPrice));
        }
        
        if(filters.sellerVerified) listings = listings.filter(l => l.verifiedSeller);
        if(filters.propertyVerified) listings = listings.filter(l => l.propertyVerified);
        if(filters.verifiedID) listings = listings.filter(l => l.verifiedID);
        if(filters.minRating > 0) listings = listings.filter(l => l.rating && l.rating >= filters.minRating);

        if(filters.popularity === 'most_viewed') listings = listings.sort((a,b) => (b.views || 0) - (a.views || 0));
        if(filters.popularity === 'most_contacted') listings = listings.sort((a,b) => (b.contacts || 0) - (a.contacts || 0));
        
        if (filters.category) {
            const dynamicFilters = filters; // simplified for clarity
            if (dynamicFilters.brand) listings = listings.filter(l => l.specifics?.brand?.toLowerCase().includes(dynamicFilters.brand.toLowerCase()));
            if (dynamicFilters.model) listings = listings.filter(l => l.specifics?.model?.toLowerCase().includes(dynamicFilters.model.toLowerCase()));
            if (dynamicFilters.year) listings = listings.filter(l => l.specifics?.year === Number(dynamicFilters.year));
            if (dynamicFilters.transmission) listings = listings.filter(l => l.specifics?.transmission === dynamicFilters.transmission);
            if (dynamicFilters.storage) listings = listings.filter(l => l.specifics?.storage === dynamicFilters.storage);
            if (dynamicFilters.condition) listings = listings.filter(l => l.specifics?.condition === dynamicFilters.condition);
            if (dynamicFilters.breed) listings = listings.filter(l => l.specifics?.breed?.toLowerCase().includes(dynamicFilters.breed.toLowerCase()));
            if (dynamicFilters.gender) listings = listings.filter(l => l.specifics?.gender === dynamicFilters.gender);
            if (dynamicFilters.propertyTitle) listings = listings.filter(l => l.specifics?.propertyTitle === dynamicFilters.propertyTitle);
            if (dynamicFilters.landUse) listings = listings.filter(l => l.specifics?.landUse === dynamicFilters.landUse);
            if (dynamicFilters.listingType) listings = listings.filter(l => l.specifics?.listingType === dynamicFilters.listingType);
            if (dynamicFilters.jobType) listings = listings.filter(l => l.specifics?.jobType === dynamicFilters.jobType);
        }
        
        setFilteredListings(listings);
    }, [filters, searchQuery, allListings]);
    
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

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4 text-center">
                    {categoriesData.map(cat => {
                        const Icon = categoryIcons[cat.name] || Home;
                        return (
                        <button
                            key={cat.name}
                            onClick={() => handleCategoryClick(cat.name)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors",
                                filters.category === cat.name && "bg-primary/10 ring-2 ring-primary"
                            )}
                        >
                            <Icon className="h-8 w-8 text-primary mb-2" />
                            <span className="font-semibold text-xs">{cat.name}</span>
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
                                value={filters.subcategory || filters.category || 'all'}
                                onValueChange={handleCategoryValueChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filters.category && categoriesData.find(c => c.name === filters.category) ? (
                                        <>
                                            <SelectItem value={filters.category}>
                                                All in {filters.category}
                                            </SelectItem>
                                            <SelectSeparator />
                                            {categoriesData.find(c => c.name === filters.category)!.subcategories.map(sub => (
                                                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                            ))}
                                            <SelectSeparator />
                                            <SelectItem value="all">Back to All Categories</SelectItem>
                                        </>
                                    ) : (
                                        <>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categoriesData.map(cat => (
                                                <SelectItem key={cat.name} value={cat.name}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        
                       <Accordion type="multiple" defaultValue={['location', 'price', 'verification', 'dynamic', 'popularity']} className="w-full">
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
                             {filters.category && (
                                <AccordionItem value="dynamic">
                                    <AccordionTrigger>Details</AccordionTrigger>
                                    <AccordionContent>
                                        <DynamicFilters category={filters.category} filters={filters} setFilters={setFilters} />
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

                <main className="lg:col-span-3">
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
                    ) : filteredListings.length > 0 ? (
                        <>
                            <div className="mb-4">
                                <p className="text-muted-foreground">
                                    Showing {filteredListings.length} result{filteredListings.length === 1 ? '' : 's'}
                                    {searchQuery && <> for <span className="font-semibold text-foreground">"{searchQuery}"</span></>}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredListings.map(ad => (
                                    <AdCard key={ad.id} {...ad} />
                                ))}
                            </div>
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
