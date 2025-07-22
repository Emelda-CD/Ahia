
'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Filter, X } from 'lucide-react';
import { LocationModal } from '@/components/common/LocationModal';
import { useSearchParams } from 'next/navigation';

interface MobileFilterSheetProps {
  onFilterChange: (key: string, value: any) => void;
  onMultiFilterChange: (key: string, value: string, checked: boolean) => void;
  children: React.ReactNode;
}

export function MobileFilterSheet({
  onFilterChange,
  onMultiFilterChange,
  children,
}: MobileFilterSheetProps) {
  const searchParams = useSearchParams();
  const conditions = ["New", "Used", "Nigerian Used", "Foreign Used"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Accordion type="multiple" defaultValue={['location', 'price', 'verification', 'condition']} className="w-full">
            <AccordionItem value="location">
                <AccordionTrigger className="font-semibold">Location</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    <LocationModal onSelect={(town, lga) => onFilterChange('location', `${town}, ${lga}`)}>
                        <Button variant="outline" className="w-full justify-between">
                            {searchParams.get('location') || 'Enugu State'}
                            {searchParams.get('location') && <X className="h-4 w-4" onClick={(e) => { e.stopPropagation(); onFilterChange('location', '');}} />}
                        </Button>
                    </LocationModal>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
                <AccordionTrigger className="font-semibold">Price Range</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    <div className="flex gap-2">
                        <Input placeholder="Min" type="number" defaultValue={searchParams.get('minPrice') || ''} onChange={e => onFilterChange('minPrice', e.target.value)} />
                        <Input placeholder="Max" type="number" defaultValue={searchParams.get('maxPrice') || ''} onChange={e => onFilterChange('maxPrice', e.target.value)} />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="condition">
                <AccordionTrigger className="font-semibold">Condition</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                    {conditions.map(condition => (
                        <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                                id={`condition-${condition}-mobile`}
                                checked={searchParams.getAll('condition').includes(condition)}
                                onCheckedChange={(checked) => onMultiFilterChange('condition', condition, !!checked)}
                            />
                            <Label htmlFor={`condition-${condition}-mobile`}>{condition}</Label>
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="verification" className="border-b-0">
                <AccordionTrigger className="font-semibold">Verification</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="verified-mobile" checked={searchParams.get('verified') === 'true'} onCheckedChange={(c) => onFilterChange('verified', c ? 'true' : '')} />
                        <Label htmlFor="verified-mobile">Verified Seller</Label>
                    </div>
                </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <SheetFooter>
            <SheetClose asChild>
                <Button className="w-full">Show Results</Button>
            </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
