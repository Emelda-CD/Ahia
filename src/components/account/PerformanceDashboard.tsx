
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserAds } from '@/lib/firebase/actions';
import type { Ad } from '@/lib/listings-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Eye, MessageSquare, PhoneCall, Star, TrendingUp, Flame, Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

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
  ads: Ad[];
  chartData: { date: string; views: number }[];
}

export default function PerformanceDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const fetchPerformanceData = async () => {
        setIsLoading(true);
        try {
            const userAds = await getUserAds(user.uid);
            
            // Mock data for performance stats as fields are not in new schema
            const totalViews = userAds.length * 150;
            const totalChats = userAds.length * 20;
            const totalCallbacks = userAds.length * 5;
            const averageRating = 4.5;

            // Generate mock chart data for the last 7 days
            const chartData = Array.from({ length: 7 }).map((_, i) => {
              const date = subDays(new Date(), i);
              const dailyViews = Math.floor(Math.random() * (totalViews / 7));
              return {
                date: format(date, 'MMM d'),
                views: dailyViews,
              };
            }).reverse();

            setStats({
              totalViews,
              totalChats,
              totalCallbacks,
              averageRating,
              ads: userAds,
              chartData
            });
        } catch (error) {
            console.error("Failed to fetch performance data:", error);
            toast({
                variant: "destructive",
                title: "Could not load performance data",
                description: "Please check your internet connection and try again.",
            });
        } finally {
            setIsLoading(false);
        }
      }
      fetchPerformanceData();
    }
  }, [user, toast]);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!stats) {
    return <p>Could not load performance data.</p>;
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
          <CardDescription>A summary of your ads' performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Eye} title="Total Views" value={stats.totalViews.toLocaleString()} change="+20.1% from last month" />
            <StatCard icon={MessageSquare} title="Total Chats" value={stats.totalChats.toLocaleString()} change="+180.1% from last month" />
            <StatCard icon={PhoneCall} title="Callback Requests" value={stats.totalCallbacks.toLocaleString()} change="+19% from last month" />
            <StatCard icon={Star} title="Average Rating" value={stats.averageRating.toFixed(1)} change="Based on all ads" />
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
          <CardTitle>Your Ads</CardTitle>
          <CardDescription>Detailed performance for each of your ads.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Chats</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell className="text-center">{/* Mock data */ Math.floor(Math.random() * 200)}</TableCell>
                  <TableCell className="text-center">{/* Mock data */ Math.floor(Math.random() * 30)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">Standard</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/listings/${ad.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {stats.ads.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">You have no active ads to display.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
