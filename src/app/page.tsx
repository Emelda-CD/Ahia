

"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdCard from '@/components/AdCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Car, Home as HomeIcon, Shirt, Briefcase, Sparkles, Wrench, ChevronDown, ArrowLeft, LandPlot, ArrowRight, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { locations } from '@/lib/locations';
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

const popularCategories = categoriesData.slice(0, 8).map(cat => ({
    name: cat.name,
    icon: categoryIcons[cat.name] || Wrench,
    subcategories: cat.subcategories.slice(0, 4),
    slug: cat.slug,
}));

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


const searchSampleData = [
    'iPhone 14 Pro', 'Toyota Camry 2020', '3-Bedroom Flat in Lekki', 'Lexus RX 350', 'Honda Accord', 'HP Spectre x360', 'Digital Marketing Expert', 'Office Space for Rent', 'Samsung Galaxy S23', 'MacBook Pro M2', 'Land in Ibeju-Lekki', 'Toyota Corolla', 'Job Vacancy for Accountant', 'Used iPhone 12', 'Honda CR-V'
];


type SearchResult = {
  level: 1 | 2 | 3;
  name: string;
  parent?: string;
  grandparent?: string;
};


export default function Home() {
  const [location, setLocation] = useState('Enugu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  const [modalView, setModalView] = useState<'lga' | 'community' | 'town'>('lga');
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ exact: string[]; similar: string[] }>({ exact: [], similar: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleLgaSelect = (lga: string) => {
    setSelectedLGA(lga);
    setModalView('community');
    setModalSearch('');
  };

  const handleCommunitySelect = (community: string) => {
    setSelectedCommunity(community);
    setModalView('town');
    setModalSearch('');
  };
  
  const handleTownSelect = (town: string) => {
    setLocation(town);
    setIsModalOpen(false);
  };

  const handleBack = () => {
    if (modalView === 'town') {
        setModalView('community');
    } else if (modalView === 'community') {
      setModalView('lga');
    }
    setModalSearch('');
  };

  const resetModal = () => {
    setModalView('lga');
    setSelectedLGA(null);
    setSelectedCommunity(null);
    setModalSearch('');
  }

  const lgaList = Object.keys(locations);
  const communityList = selectedLGA ? Object.keys(locations[selectedLGA] || {}) : [];
  const townList = selectedLGA && selectedCommunity ? (locations[selectedLGA]?.[selectedCommunity] || []) : [];

  let modalTitle = 'Select a Local Government Area';
  if (modalView === 'community' && selectedLGA) {
    modalTitle = `Select a Community in ${selectedLGA}`;
  } else if (modalView === 'town' && selectedCommunity) {
    modalTitle = `Select a Town in ${selectedCommunity}`;
  }
  
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!modalSearch.trim()) return [];
    
    const query = modalSearch.trim().toLowerCase();
    const results: SearchResult[] = [];

    for (const lga in locations) {
      if (lga.toLowerCase().includes(query)) {
        results.push({ level: 1, name: lga });
      }
      for (const community in locations[lga]) {
        if (community.toLowerCase().includes(query)) {
          results.push({ level: 2, name: community, parent: lga });
        }
        for (const town of locations[lga][community]) {
          if (town.toLowerCase().includes(query)) {
            results.push({ level: 3, name: town, parent: community, grandparent: lga });
          }
        }
      }
    }
    return results;
  }, [modalSearch]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.length === 0) {
      setSuggestions({ exact: [], similar: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    searchTimeout.current = setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase();
      
      const exactMatches = searchSampleData.filter(item =>
        item.toLowerCase().startsWith(lowerCaseQuery)
      );
      
      const similarMatches = searchSampleData.filter(item =>
        item.toLowerCase().includes(lowerCaseQuery) && !item.toLowerCase().startsWith(lowerCaseQuery)
      );

      setSuggestions({ exact: exactMatches, similar: similarMatches });
      setIsSearching(false);
    }, 300); // 300ms debounce
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions({ exact: [], similar: [] });
    router.push(`/listings?q=${encodeURIComponent(suggestion)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <>
      <section className="bg-[linear-gradient(135deg,_#591942_0%,_#764ba2_100%)] text-white py-20 sm:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Welcome to Ahia
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-200">
            Find or sell anything, anytime!
          </p>
          <div className="mt-10 mx-auto max-w-4xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <Dialog open={isModalOpen} onOpenChange={(open) => {
                   setIsModalOpen(open);
                   if (!open) {
                        setTimeout(() => resetModal(), 300);
                   }
                }}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="h-14 text-lg w-full sm:w-auto justify-between shadow-md mb-2 sm:mb-0 sm:mr-2 text-black">
                    {location}
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                   <DialogHeader>
                    <div className="flex items-center justify-center relative">
                      {modalView !== 'lga' && !modalSearch.trim() && (
                        <Button variant="ghost" onClick={handleBack} className="absolute left-0 text-sm p-2 h-auto">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      )}
                      <DialogTitle className="text-center">{modalSearch.trim() ? "Search Results" : modalTitle}</DialogTitle>
                    </div>
                  </DialogHeader>
                    
                    <Input 
                      placeholder="Search location..." 
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="my-2"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4 max-h-[60vh] overflow-y-auto">
                      {modalSearch.trim() ? (
                        searchResults.length > 0 ? (
                           searchResults.map((result, index) => {
                            if (result.level === 1) {
                              return <Button key={`${result.name}-${index}`} variant="outline" onClick={() => { setSelectedLGA(result.name); setModalView('community'); setModalSearch(''); }}>{result.name}</Button>
                            }
                            if (result.level === 2 && result.parent) {
                              return (
                                <Button key={`${result.name}-${index}`} variant="outline" className="text-left h-auto py-2" onClick={() => { setSelectedLGA(result.parent!); handleCommunitySelect(result.name); }}>
                                  {result.name}
                                  <span className="text-xs text-muted-foreground block w-full">in {result.parent}</span>
                                </Button>
                              )
                            }
                            if (result.level === 3) {
                              return (
                                <Button key={`${result.name}-${index}`} variant="outline" className="text-left h-auto py-2" onClick={() => handleTownSelect(result.name)}>
                                  {result.name}
                                  <span className="text-xs text-muted-foreground block w-full">in {result.parent}</span>
                                </Button>
                              )
                            }
                            return null;
                           })
                        ) : (
                          <div className="col-span-full text-center text-muted-foreground">No location found</div>
                        )
                      ) : (
                        <>
                          {modalView === 'lga' && lgaList.map(lga => (
                              <Button key={lga} variant="outline" onClick={() => handleLgaSelect(lga)}>{lga}</Button>
                          ))}
                          {modalView === 'community' && communityList.map(community => (
                              <Button key={community} variant="outline" onClick={() => handleCommunitySelect(community)}>{community}</Button>
                          ))}
                           {modalView === 'town' && townList.map(town => (
                              <Button key={town} variant="outline" onClick={() => handleTownSelect(town)}>{town}</Button>
                          ))}
                        </>
                      )}
                    </div>
                </DialogContent>
              </Dialog>

              <form onSubmit={handleSearchSubmit} className="relative flex-grow w-full sm:w-auto">
                 <div className="relative w-full" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setSuggestions({ exact: [], similar: [] }); setIsSearching(false); } }}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    placeholder="Search for cars, phones, jobs..."
                    className="pl-12 pr-28 h-14 text-lg w-full rounded-md shadow-md text-black"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchChange}
                    autoComplete="off"
                  />
                  {(isSearching || suggestions.exact.length > 0 || suggestions.similar.length > 0) && searchQuery.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-20 text-black max-h-80 overflow-y-auto">
                          {isSearching && <div className="p-3 text-muted-foreground">Searching...</div>}
                          
                          {!isSearching && suggestions.exact.length > 0 && (
                            suggestions.exact.map((item) => (
                            <div
                                key={item}
                                className="p-3 hover:bg-secondary cursor-pointer text-left"
                                onMouseDown={() => handleSuggestionClick(item)}
                            >
                                {item}
                            </div>
                            ))
                          )}
                          
                          {!isSearching && suggestions.exact.length === 0 && suggestions.similar.length > 0 && (
                            <>
                                <div className="p-3 text-sm text-muted-foreground border-b">No exact match found. Did you mean:</div>
                                {suggestions.similar.map((item) => (
                                    <div
                                        key={item}
                                        className="p-3 hover:bg-secondary cursor-pointer text-left"
                                        onMouseDown={() => handleSuggestionClick(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </>
                          )}
                          
                          {!isSearching && suggestions.exact.length === 0 && suggestions.similar.length === 0 && (
                            <div className="p-3 text-muted-foreground">No results found.</div>
                          )}
                      </div>
                  )}
                </div>
                <Button type="submit" size="lg" className="absolute right-0 top-0 h-14 w-auto text-lg shadow-md rounded-l-none">
                  <Search className="h-5 w-5 md:hidden" />
                  <span className="hidden md:inline">Search</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((category) => (
              <Card key={category.name} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <category.icon className="w-7 h-7 text-primary" />
                     <Link href={`/listings?category=${encodeURIComponent(category.name)}`} className="hover:text-primary transition-colors">
                      {category.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>
                        <Link
                           href={`/listings?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Recent Listings</h2>
                <Button asChild variant="link" className="hidden sm:flex text-base">
                  <Link href="/listings">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentListings.map((ad) => (
                  <AdCard key={ad.id} {...ad} />
                ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
                <Button size="lg" asChild>
                  <Link href="/listings">View All Listings</Link>
                </Button>
            </div>
        </div>
      </section>
    </>
  );
}
