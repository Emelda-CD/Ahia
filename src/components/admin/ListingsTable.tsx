
'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { MoreHorizontal, Trash, Check, Ban, Loader2 } from 'lucide-react';
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
import type { Ad } from '@/lib/listings-data';
import { useToast } from '@/hooks/use-toast';

type Status = 'Active' | 'Pending';

export default function ListingsTable({ limit, filter }: { limit?: number; filter?: 'Active' | 'Pending' }) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getStatus = (ad: Ad): Status => {
    // A real implementation would check a field on the ad object.
    // For now, verified ads are 'Active', others are 'Pending'
    return ad.verified ? 'Active' : 'Pending';
  }

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        let allAdsFromDb = await getAds();

        let adsWithStatus = allAdsFromDb
          .map(ad => ({ ...ad, status: getStatus(ad) }))
          .filter(ad => filter ? ad.status === filter : true);
        
        setAds(limit ? adsWithStatus.slice(0, limit) : adsWithStatus);
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
                variant={ad.status === 'Active' ? 'secondary' : 'outline'}
                className={cn({
                    'bg-green-100 text-green-800': ad.status === 'Active',
                    'bg-amber-100 text-amber-800 border-amber-200': ad.status === 'Pending',
                })}
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
                   {ad.status === 'Pending' && <DropdownMenuItem><Check className="mr-2 h-4 w-4" />Approve Ad</DropdownMenuItem>}
                   {ad.status === 'Active' && <DropdownMenuItem><Ban className="mr-2 h-4 w-4" />Remove Ad</DropdownMenuItem>}
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
