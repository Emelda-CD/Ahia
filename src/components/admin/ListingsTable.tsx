import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { allListings } from '@/lib/listings-data';
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
    return statuses[parseInt(id) % statuses.length];
  }

  let listings = allListings
    .map(listing => ({ ...listing, status: getStatus(listing.id) }))
    .filter(listing => filter ? listing.status === filter : true);

  if (limit) {
    listings = listings.slice(0, limit);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listings.map((listing) => {
          return (
          <TableRow key={listing.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                 <Image src={listing.image} alt={listing.title} width={64} height={48} className="rounded-md object-cover" data-ai-hint={listing.data_ai_hint} />
                <div>
                  <p className="font-medium">{listing.title}</p>
                  <p className="text-sm text-muted-foreground">{listing.location.town}, {listing.location.lga}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{listing.category}</TableCell>
            <TableCell> {typeof listing.price === 'number' ? `₦${listing.price.toLocaleString()}` : listing.price}</TableCell>
            <TableCell>
              <Badge 
                variant={listing.status === 'Active' ? 'secondary' : listing.status === 'Pending' ? 'outline' : 'destructive'}
                className={cn({
                    'bg-green-100 text-green-800': listing.status === 'Active',
                    'bg-amber-100 text-amber-800 border-amber-200': listing.status === 'Pending',
                })}
              >
                {listing.status}
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
                  <DropdownMenuItem>View Listing</DropdownMenuItem>
                   {listing.status === 'Pending' && <DropdownMenuItem>Approve Listing</DropdownMenuItem>}
                   {listing.status === 'Active' && <DropdownMenuItem>Remove Listing</DropdownMenuItem>}
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
