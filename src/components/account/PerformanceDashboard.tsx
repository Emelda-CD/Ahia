
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { allListings, type Listing } from '@/lib/listings-data';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Eye, MessageSquare, PhoneCall, Star, TrendingUp, Flame } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface PerformanceStats {
  totalViews: number;
  totalChats: number;
  totalCallbacks: number;
  averageRating: number;
  listings: Listing[];
  chartData: { date: string; views: number }[];
}

export default function PerformanceDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PerformanceStats | null>(null);

  useEffect(() => {
    if (user) {
      const userListings = allListings.filter(listing => listing.sellerId === user.uid);
      
      const totalViews = userListings.reduce((sum, l) => sum + (l.views || 0), 0);
      const totalChats = userListings.reduce((sum, l) => sum + (l.contacts || 0), 0);
      const totalCallbacks = userListings.reduce((sum, l) => sum + (l.favorites || 0), 0); // Using favorites as a stand-in for callbacks
      
      const ratedListings = userListings.filter(l => l.rating);
      const averageRating = ratedListings.length > 0
        ? ratedListings.reduce((sum, l) => sum + l.rating!, 0) / ratedListings.length
        : 0;

      // Generate mock chart data for the last 7 days
      const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), i);
        return {
          date: format(date, 'MMM d'),
          views: Math.floor(Math.random() * (totalViews / 7) + (totalViews / 14)),
        };
      }).reverse();

      setStats({
        totalViews,
        totalChats,
        totalCallbacks,
        averageRating,
        listings: userListings,
        chartData
      });
    }
  }, [user]);

  if (!stats) {
    return <p>Loading performance data...</p>;
  }
  
  const StatCard = ({ icon: Icon, title, value, change }: { icon: React.ElementType, title: string, value: string | number, change?: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && <p className="text-xs text-muted-foreground">{change}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>A summary of your listings' performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Eye} title="Total Views" value={stats.totalViews.toLocaleString()} change="+20.1% from last month" />
            <StatCard icon={MessageSquare} title="Total Chats" value={stats.totalChats.toLocaleString()} change="+180.1% from last month" />
            <StatCard icon={PhoneCall} title="Callback Requests" value={stats.totalCallbacks.toLocaleString()} change="+19% from last month" />
            <StatCard icon={Star} title="Average Rating" value={stats.averageRating.toFixed(1)} change="Based on all listings" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Views</CardTitle>
          <CardDescription>Your total ad views over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
              <BarChart data={stats.chartData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="views" fill="var(--color-views)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Detailed performance for each of your ads.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Chats</TableHead>
                <TableHead className="text-center">Favorites</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.title}</TableCell>
                  <TableCell className="text-center">{listing.views || 0}</TableCell>
                  <TableCell className="text-center">{listing.contacts || 0}</TableCell>
                  <TableCell className="text-center">{listing.favorites || 0}</TableCell>
                  <TableCell className="text-center">
                    {listing.promoted && <Badge variant="destructive"><Flame className="w-3 h-3 mr-1" /> Promoted</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/listings/${listing.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {stats.listings.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">You have no active listings to display.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
