
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { MoreHorizontal, Trash, Check, Ban, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getAds } from '@/lib/firebase/actions';
import type { Ad, AdStatus } from '@/lib/listings-data';
import { useToast } from '@/hooks/use-toast';

export default function ListingsTable({ limit, filter }: { limit?: number; filter?: AdStatus | 'All' }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        let allAdsFromDb = await getAds();

        let filteredAds = allAdsFromDb.filter(ad => filter && filter !== 'All' ? ad.status === filter : true);
        
        setAds(limit ? filteredAds.slice(0, limit) : filteredAds);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
        toast({
          variant: "destructive",
          title: "Could not load ads",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [limit, filter, toast]);

  if (loading) {
     return (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  const getStatusClass = (status: AdStatus) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800 border-green-200';
        case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'declined': return 'bg-red-100 text-red-800 border-red-200';
        case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-secondary text-secondary-foreground';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ad</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ads.map((ad) => {
          return (
          <TableRow key={ad.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                 <Image src={ad.image} alt={ad.title} width={64} height={48} className="rounded-md object-cover" data-ai-hint={ad.data_ai_hint || 'ad image'} />
                <div>
                  <p className="font-medium">{ad.title}</p>
                  <p className="text-sm text-muted-foreground">{ad.location}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{ad.category}</TableCell>
            <TableCell>{`₦${ad.price.toLocaleString()}`}</TableCell>
            <TableCell>
              <Badge 
                variant={'outline'}
                className={cn('capitalize', getStatusClass(ad.status))}
              >
                {ad.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Ad</DropdownMenuItem>
                   {ad.status === 'pending' && <DropdownMenuItem><Check className="mr-2 h-4 w-4" />Approve Ad</DropdownMenuItem>}
                   {ad.status !== 'declined' && <DropdownMenuItem><AlertTriangle className="mr-2 h-4 w-4" />Decline Ad</DropdownMenuItem>}
                   {ad.status === 'active' && <DropdownMenuItem><Ban className="mr-2 h-4 w-4" />Remove Ad</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash className="mr-2 h-4 w-4" />Delete Permanently</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
    </Table>
  );
}
