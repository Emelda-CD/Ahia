
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdsByUserId } from '@/lib/firebase/actions';
import type { Ad } from '@/lib/listings-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Eye, Package, Loader2, MessageSquare } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const StatCard = ({ icon: Icon, title, value }: { icon: React.ElementType, title: string, value: string | number }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function PerformancePage() {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserAds = async () => {
        setLoading(true);
        try {
          const userAds = await getAdsByUserId(user.uid);
          setAds(userAds);
        } catch (error) {
          console.error("Failed to fetch user's ads for performance:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserAds();
    }
  }, [user]);

  const totalAds = ads.length;
  // Note: 'views' are not implemented in the Ad object yet, so we mock them.
  const totalViews = ads.reduce((acc, ad) => acc + (ad.views || 0), 0);
  // Mocked total reviews for now
  const totalReviews = 3; 
  
  const chartData = ads
    .slice(0, 10) // Show top 10 ads for simplicity
    .map(ad => ({
      name: ad.title.substring(0, 15) + (ad.title.length > 15 ? '...' : ''),
      views: ad.views || Math.floor(Math.random() * 500), // Mock views
    }))
    .sort((a, b) => b.views - a.views);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ad Performance</h1>
      <p className="text-muted-foreground">Track how your ads are performing on Ahia.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} title="Total Ads" value={totalAds} />
        <StatCard icon={Eye} title="Total Views" value={totalViews.toLocaleString()} />
        <StatCard icon={MessageSquare} title="Total Reviews Received" value={totalReviews} />
        <StatCard icon={BarChart} title="Total Chats (Coming Soon)" value="0" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ad Views Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {totalAds > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted))'}}
                  contentStyle={{background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold">No performance data yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Post some ads to see your performance metrics here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
