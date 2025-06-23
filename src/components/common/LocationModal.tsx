
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { locations } from '@/lib/locations';
import { ArrowLeft } from 'lucide-react';

export const LocationModal = ({ onSelect, children }: { onSelect: (town: string) => void, children: React.ReactNode }) => {
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
