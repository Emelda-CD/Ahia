
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { allAds } from '@/lib/listings-data';
import { MoreHorizontal } from 'lucide-react';
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

type Status = 'Active' | 'Pending' | 'Removed';

export default function ListingsTable({ limit, filter }: { limit?: number; filter?: Status }) {
  
  // Adding a mock status for demonstration
  const getStatus = (id: string): Status => {
    const statuses: Status[] = ['Active', 'Pending', 'Removed'];
    return statuses[parseInt(id.replace('ad_', '')) % statuses.length];
  }

  let ads = allAds
    .map(ad => ({ ...ad, status: getStatus(ad.id) }))
    .filter(ad => filter ? ad.status === filter : true);

  if (limit) {
    ads = ads.slice(0, limit);
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
                 <Image src={ad.image} alt={ad.title} width={64} height={48} className="rounded-md object-cover" data-ai-hint={ad.data_ai_hint} />
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
                variant={ad.status === 'Active' ? 'secondary' : ad.status === 'Pending' ? 'outline' : 'destructive'}
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
                   {ad.status === 'Pending' && <DropdownMenuItem>Approve Ad</DropdownMenuItem>}
                   {ad.status === 'Active' && <DropdownMenuItem>Remove Ad</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete Permanently</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
    </Table>
  );
}
