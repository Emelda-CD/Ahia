
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Ad } from '@/lib/listings-data';
import { cn } from '@/lib/utils';
import { categoriesData, Category } from '@/lib/categories-data';

import AdCard from '@/components/AdCard';
import AdCardListItem from '@/components/AdCardListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, X, Loader2, LayoutGrid, List, ArrowLeft } from 'lucide-react';
import { LocationModal } from '@/components/common/LocationModal';
import { getAds } from '@/lib/firebase/actions';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MobileCategorySelector } from '@/components/common/MobileCategorySelector';

const CategoryFilter = ({
    selectedCategory,
    selectedSubcategory,
    onCategorySelect,
}: {
    selectedCategory: string | null;
    selectedSubcategory: string | null;
    onCategorySelect: (cat: string | null, subcat: string | null) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const SUBCATEGORY_LIMIT = 5;

    const activeCategory = useMemo(() => {
        return categoriesData.find(c => c.name === selectedCategory);
    }, [selectedCategory]);

    const handleBackToAll = () => {
        onCategorySelect(null, null);
    };

    if (activeCategory) {
        const subcategoriesToShow = isExpanded
            ? activeCategory.subcategories
            : activeCategory.subcategories.slice(0, SUBCATEGORY_LIMIT);
            
        return (
            <div className="w-full">
                <div className="bg-primary text-primary-foreground -mx-4 -mt-4 p-4 rounded-t-lg mb-2">
                    <button onClick={handleBackToAll} className="font-semibold text-lg hover:underline flex items-center gap-2">
                         <ArrowLeft className="w-5 h-5"/> All Categories
                    </button>
                </div>
                <h3 className="px-4 py-2 text-lg font-bold text-primary">{activeCategory.name}</h3>
                <ul className="space-y-1 pl-4 pt-2">
                     <li key="all">
                        <button
                            onClick={() => onCategorySelect(activeCategory.name, null)}
                            className={cn(
                                'hover:text-primary w-full text-left p-2 rounded-md',
                                !selectedSubcategory ? 'text-primary font-bold bg-primary/10' : 'text-foreground'
                            )}
                        >
                            All in {activeCategory.name}
                        </button>
                    </li>
                    {subcategoriesToShow.map(sub => (
                        <li key={sub}>
                            <button
                                onClick={() => onCategorySelect(activeCategory.name, sub)}
                                className={cn(
                                    'hover:text-primary w-full text-left p-2 rounded-md',
                                    selectedSubcategory === sub ? 'text-primary font-bold bg-primary/10' : 'text-foreground'
                                )}
                            >
                                {sub}
                            </button>
                        </li>
                    ))}
                </ul>
                {activeCategory.subcategories.length > SUBCATEGORY_LIMIT && (
                     <div className="pl-6 pt-2">
                        <Button variant="link" onClick={() => setIsExpanded(!isExpanded)} className="p-0 h-auto">
                            {isExpanded ? 'Show Less' : `Show ${activeCategory.subcategories.length - SUBCATEGORY_LIMIT} more`}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full">
            <h4 className="font-semibold text-lg px-4 mb-2 text-primary-foreground bg-primary -mx-4 -mt-4 p-4 rounded-t-lg">Categories</h4>
            <Accordion type="multiple" className="w-full -mx-4">
                {categoriesData.map(category => (
                    <AccordionItem value={category.name} key={category.name} className="border-b-0 px-4">
                        <button
                            onClick={() => onCategorySelect(category.name, null)}
                            className={cn(
                                'py-2 w-full text-left text-base font-semibold hover:no-underline rounded-md hover:bg-muted',
                                selectedCategory === category.name && !selectedSubcategory ? 'bg-primary/10 text-primary' : ''
                            )}
                        >
                            {category.name}
                        </button>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};


export default function ListingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [allAds, setAllAds] = useState<Ad[]>([]);
    const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        verified: searchParams.get('verified') === 'true',
        condition: searchParams.getAll('condition') || [],
    });

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

    useEffect(() => {
        let ads = allAds;

        const q = searchParams.get('q')?.toLowerCase() || '';
        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');
        const location = searchParams.get('location');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const verified = searchParams.get('verified') === 'true';
        const conditions = searchParams.getAll('condition');

        if (q) {
            ads = ads.filter(ad => ad.title.toLowerCase().includes(q) || (ad.description && ad.description.toLowerCase().includes(q)));
        }
        if (category) {
            ads = ads.filter(ad => ad.category === category);
        }
        if (subcategory) {
            ads = ads.filter(ad => ad.subcategory === subcategory);
        }
        if (location) {
            ads = ads.filter(ad => ad.location === location);
        }
        if (minPrice) {
            ads = ads.filter(ad => ad.price >= Number(minPrice));
        }
        if (maxPrice) {
            ads = ads.filter(ad => ad.price <= Number(maxPrice));
        }
        if (verified) {
            ads = ads.filter(ad => ad.verified);
        }
        if (conditions.length > 0) {
            ads = ads.filter(ad => ad.condition && conditions.includes(ad.condition));
        }

        setFilteredAds(ads);
    }, [searchParams, allAds]);

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({...prev, [key]: value}));
    };
    
    const handleConditionChange = (condition: string, checked: boolean) => {
        const currentConditions = filters.condition || [];
        const newConditions = checked 
            ? [...currentConditions, condition] 
            : currentConditions.filter(c => c !== condition);
        handleFilterChange('condition', newConditions);
    };

    const applyFiltersToUrl = () => {
        const params = new URLSearchParams(window.location.search);
        
        // Handle single-value filters
        Object.entries(filters).forEach(([key, value]) => {
            if (key !== 'condition') { // Exclude multi-value filters from this loop
                if (value) {
                    params.set(key, String(value));
                } else {
                    params.delete(key);
                }
            }
        });

        // Handle multi-value 'condition' filter
        params.delete('condition');
        if (filters.condition && filters.condition.length > 0) {
            filters.condition.forEach(c => params.append('condition', c));
        }

        if (searchQuery) {
            params.set('q', searchQuery);
        } else {
            params.delete('q');
        }
        router.push(`/listings?${params.toString()}`);
    };

    const handleCategoryFilterChange = (category: string | null, subcategory: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category) {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        if (subcategory) {
            params.set('subcategory', subcategory);
        } else {
            params.delete('subcategory');
        }
        router.push(`/listings?${params.toString()}`);
    };

    const searchPlaceholder = useMemo(() => {
        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');
        if (subcategory) return `Search in ${subcategory}...`;
        if (category) return `Search in ${category}...`;
        return "Search for anything...";
    }, [searchParams]);
    
    const conditions = ["New", "Used", "Nigerian Used", "Foreign Used"];

    return (
        <div className="container mx-auto px-4 py-8">
            <section className="mb-8">
                 <div className="relative w-full max-w-2xl mx-auto mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder={searchPlaceholder}
                        className="pl-10 h-12 text-lg" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFiltersToUrl()}
                    />
                     <Button size="lg" className="absolute right-0 top-0 h-12" onClick={applyFiltersToUrl}>Search</Button>
                </div>
            </section>
            
            <div className="grid lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    {/* Desktop Filters */}
                    <div className="hidden lg:block space-y-6 sticky top-24">
                        <div className="p-4 rounded-lg border bg-card">
                            <CategoryFilter
                                selectedCategory={searchParams.get('category')}
                                selectedSubcategory={searchParams.get('subcategory')}
                                onCategorySelect={handleCategoryFilterChange}
                            />
                        </div>
                        
                       <Card>
                           <CardContent className="p-4 space-y-4">
                               <Accordion type="multiple" defaultValue={['location', 'price', 'verification', 'condition']} className="w-full">
                                    <AccordionItem value="location">
                                        <AccordionTrigger className="font-semibold">Location</AccordionTrigger>
                                        <AccordionContent className="space-y-2 pt-2">
                                            <LocationModal onSelect={(town, lga) => handleFilterChange('location', `${town}, ${lga}`)}>
                                                <Button variant="outline" className="w-full justify-between">
                                                    {filters.location || 'Enugu State'}
                                                    {filters.location && <X className="h-4 w-4" onClick={(e) => { e.stopPropagation(); handleFilterChange('location', '');}} />}
                                                </Button>
                                            </LocationModal>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="price">
                                        <AccordionTrigger className="font-semibold">Price Range</AccordionTrigger>
                                        <AccordionContent className="space-y-2 pt-2">
                                            <div className="flex gap-2">
                                                <Input placeholder="Min" type="number" value={filters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} />
                                                <Input placeholder="Max" type="number" value={filters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="condition">
                                        <AccordionTrigger className="font-semibold">Condition</AccordionTrigger>
                                        <AccordionContent className="space-y-3 pt-2">
                                            {conditions.map(condition => (
                                                <div key={condition} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`condition-${condition}`}
                                                        checked={filters.condition.includes(condition)}
                                                        onCheckedChange={(checked) => handleConditionChange(condition, !!checked)}
                                                    />
                                                    <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="verification" className="border-b-0">
                                        <AccordionTrigger className="font-semibold">Verification</AccordionTrigger>
                                        <AccordionContent className="space-y-3 pt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="verified" checked={filters.verified} onCheckedChange={(c) => handleFilterChange('verified', !!c)} />
                                                <Label htmlFor="verified">Verified Ad</Label>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <Button className="w-full" onClick={applyFiltersToUrl}>Apply Filters</Button>
                           </CardContent>
                       </Card>
                    </div>

                    {/* Mobile Filters Trigger */}
                    <div className="lg:hidden">
                        <MobileCategorySelector
                            selectedCategory={searchParams.get('category')}
                            selectedSubcategory={searchParams.get('subcategory')}
                            onCategorySelect={(cat) => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (cat) params.set('category', cat);
                                else params.delete('category');
                                params.delete('subcategory');
                                router.push(`/listings?${params.toString()}`);
                            }}
                            onSubcategorySelect={(subcat) => {
                                const params = new URLSearchParams(searchParams.toString());
                                if (subcat && subcat !== 'all') params.set('subcategory', subcat);
                                else params.delete('subcategory');
                                router.push(`/listings?${params.toString()}`);
                            }}
                        />
                    </div>

                </aside>

                <main className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-4">
                         {isLoading ? (
                            <div className="h-5 bg-muted rounded w-48 animate-pulse"></div>
                        ) : (
                            <p className="text-muted-foreground">
                                Showing {filteredAds.length} result{filteredAds.length === 1 ? '' : 's'}
                                {searchParams.get('category') && <> in <span className="font-semibold text-foreground">{searchParams.get('subcategory') || searchParams.get('category')}</span></>}
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

    
