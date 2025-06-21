
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import AdCard from '@/components/AdCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Car, Home as HomeIcon, Shirt, Briefcase, Sparkles, Gamepad2, Wrench, ChevronDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { locations } from '@/lib/locations';

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
    { id: '3', title: 'Used iPhone 13', price: '300,000', location: 'Enugu', image: 'https://placehold.co/600x400.png', data_ai_hint: 'iphone 13'},
    { id: '5', title: 'Mountain Bike', price: '250,000', location: 'Lagos', image: 'https://placehold.co/600x400.png', data_ai_hint: 'mountain bike'},
    { id: '4', title: 'Graphic Design Services', price: 'Negotiable', location: 'Remote', image: 'https://placehold.co/600x400.png', data_ai_hint: 'graphic design'},
    { id: '7', title: 'Lexus Hybrid Car', price: '15,000,000', location: 'Abuja', image: 'https://placehold.co/600x400.png', data_ai_hint: 'lexus car'},
];

const searchSampleData = ['Apple', 'Banana', 'Orange', 'Grapes', 'Pineapple', 'Toyota Camry', 'iPhone 13', '3-Bedroom Flat', 'Lexus'];

export default function Home() {
  const [location, setLocation] = useState('Enugu');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  const [modalView, setModalView] = useState<'lga' | 'village' | 'community'>('lga');
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleLgaSelect = (lga: string) => {
    setSelectedLGA(lga);
    setModalView('village');
    setModalSearch('');
  };

  const handleVillageSelect = (village: string) => {
    setSelectedVillage(village);
    setModalView('community');
    setModalSearch('');
  };
  
  const handleCommunitySelect = (community: string) => {
    setLocation(community);
    setIsModalOpen(false);
  };

  const handleBack = () => {
    if (modalView === 'community') {
      setModalView('village');
      setSelectedVillage(null);
    } else if (modalView === 'village') {
      setModalView('lga');
      setSelectedLGA(null);
    }
    setModalSearch('');
  };

  const resetModal = () => {
    setModalView('lga');
    setSelectedLGA(null);
    setSelectedVillage(null);
    setModalSearch('');
  }

  const lgaList = Object.keys(locations).filter(lga => lga.toLowerCase().includes(modalSearch.toLowerCase()));
  const villageList = selectedLGA ? Object.keys(locations[selectedLGA]).filter(v => v.toLowerCase().includes(modalSearch.toLowerCase())) : [];
  const communityList = selectedLGA && selectedVillage ? locations[selectedLGA][selectedVillage].filter(c => c.toLowerCase().includes(modalSearch.toLowerCase())) : [];
  
  let modalTitle = 'Select a Local Government';
  if (modalView === 'village' && selectedLGA) {
    modalTitle = `Select a Village in ${selectedLGA}`;
  } else if (modalView === 'community' && selectedVillage) {
    modalTitle = `Select a Community in ${selectedVillage}`;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filteredSuggestions = searchSampleData.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
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
                  <Button variant="secondary" className="h-14 text-lg w-full sm:w-auto justify-between shadow-md">
                    {location}
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <div className="flex items-center justify-center relative mb-4">
                        {modalView !== 'lga' && (
                            <Button variant="ghost" onClick={handleBack} className="absolute left-0 text-sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        )}
                        <DialogTitle>{modalTitle}</DialogTitle>
                    </div>
                    
                    <Input 
                      placeholder="Search..." 
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="my-2"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-4 max-h-[60vh] overflow-y-auto">
                        {modalView === 'lga' && lgaList.map(lga => (
                            <Button key={lga} variant="outline" onClick={() => handleLgaSelect(lga)}>{lga}</Button>
                        ))}
                        {modalView === 'village' && villageList.map(village => (
                            <Button key={village} variant="outline" onClick={() => handleVillageSelect(village)}>{village}</Button>
                        ))}
                        {modalView === 'community' && communityList.map(community => (
                            <Button key={community} variant="outline" onClick={() => handleCommunitySelect(community)}>{community}</Button>
                        ))}
                    </div>
                </DialogContent>
              </Dialog>

              <form onSubmit={handleSearchSubmit} className="flex-grow w-full sm:w-auto flex items-center gap-2">
                <div className="relative flex-grow w-full" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setSuggestions([]); } }}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    placeholder="Search listings..."
                    className="pl-12 h-14 text-lg w-full rounded-md shadow-md"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchChange}
                  />
                  {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-20 text-black">
                          {suggestions.map((item) => (
                          <div
                              key={item}
                              className="p-3 hover:bg-secondary/20 cursor-pointer text-left"
                              onMouseDown={() => handleSuggestionClick(item)}
                          >
                              {item}
                          </div>
                          ))}
                      </div>
                  )}
                </div>
                <Button type="submit" size="lg" className="h-14 w-auto text-lg shadow-md">
                  <Search className="h-5 w-5 md:hidden" />
                  <span className="hidden md:inline">Search</span>
                </Button>
              </form>
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
                <Card className="text-center p-4 hover:shadow-lg transition-shadow duration-300 h-full hover:bg-primary hover:text-primary-foreground">
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
