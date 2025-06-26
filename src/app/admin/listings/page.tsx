import ListingsTable from '@/components/admin/ListingsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminListingsPage() {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Listing Management</h1>
            <p className="text-muted-foreground">View, manage, and moderate listings.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>All Listings</CardTitle>
                <CardDescription>A list of all listings on the platform.</CardDescription>
                 <div className="relative pt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search listings by title..." className="pl-10 w-full md:w-1/3" />
                </div>
            </CardHeader>
            <CardContent>
                <ListingsTable />
            </CardContent>
        </Card>
    </div>
  );
}
