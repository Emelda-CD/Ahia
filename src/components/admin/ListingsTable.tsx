
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
import { getAds, updateAdStatus } from '@/lib/firebase/actions';
import type { Ad, AdStatus } from '@/lib/listings-data';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/formatPrice';

export default function ListingsTable({ limit, filter }: { limit?: number; filter?: AdStatus | 'All' }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingAdId, setUpdatingAdId] = useState<string | null>(null);
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

  const handleUpdateStatus = async (adId: string, newStatus: 'active' | 'declined') => {
    setUpdatingAdId(adId);
    try {
      await updateAdStatus(adId, newStatus);

      if (filter && filter !== 'All' && newStatus !== filter) {
        // If the table is filtered and the new status doesn't match the filter,
        // remove the ad from the view.
        setAds(currentAds => currentAds.filter(ad => ad.id !== adId));
      } else {
        // Otherwise, just update the status in the view.
        setAds(currentAds => 
            currentAds.map(ad => 
                ad.id === adId ? { ...ad, status: newStatus, verified: newStatus === 'active' } : ad
            )
        );
      }
      
      toast({
        title: `Ad ${newStatus === 'active' ? 'Approved' : 'Declined'}`,
        description: `The ad has been successfully updated.`,
      });
    } catch (error) {
      console.error("Failed to update ad status:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the ad's status. Please try again.",
      });
    } finally {
      setUpdatingAdId(null);
    }
  };


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
    <div className="w-full overflow-x-auto">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Ad</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {ads.map((ad) => {
            const isUpdating = updatingAdId === ad.id;
            return (
            <TableRow key={ad.id}>
                <TableCell>
                <div className="flex items-center gap-3">
                    <Image src={ad.image} alt={ad.title} width={64} height={48} className="rounded-md object-cover hidden sm:block" data-ai-hint={ad.data_ai_hint || 'ad image'} />
                    <div>
                    <p className="font-medium">{ad.title}</p>
                    <p className="text-sm text-muted-foreground hidden lg:block">{ad.location}</p>
                    </div>
                </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{ad.category}</TableCell>
                <TableCell className="hidden sm:table-cell">{formatPrice(ad.price)}</TableCell>
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
                    <Button variant="ghost" size="icon" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Ad</DropdownMenuItem>
                    {ad.status === 'pending' && <DropdownMenuItem onClick={() => handleUpdateStatus(ad.id, 'active')}><Check className="mr-2 h-4 w-4" />Approve Ad</DropdownMenuItem>}
                    {ad.status !== 'declined' && <DropdownMenuItem onClick={() => handleUpdateStatus(ad.id, 'declined')}><AlertTriangle className="mr-2 h-4 w-4" />Decline Ad</DropdownMenuItem>}
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
    </div>
  );
}
