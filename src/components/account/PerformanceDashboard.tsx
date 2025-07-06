
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, Eye, Package, CheckCircle } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { getAds } from "@/lib/firebase/actions";
import { Ad } from "@/lib/listings-data";

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


export default function PerformanceDashboard() {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
        const fetchUserAds = async () => {
            setLoading(true);
            try {
                // In a real app, you'd query for ads where ad.userID === user.uid
                // For this demo, we filter all ads on the client.
                const allAds = await getAds();
                const userAds = allAds.filter(ad => ad.userID === user.uid);
                setAds(userAds);
            } catch (error) {
                console.error("Failed to fetch user ads:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserAds();
    }
  }, [user?.uid]);

  if (!user) return null;

  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </div>
    );
  }

  const totalListings = ads.length;
  const activeListings = ads.filter(ad => ad.verified).length;
  const totalViews = 0; // The 'views' field is not implemented yet.

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
            <BarChart2 className="h-8 w-8 text-muted-foreground mt-1" />
            <div>
                <CardTitle>Your Ad Performance</CardTitle>
                <CardDescription>An overview of how your ads are doing.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {totalListings > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={Package} title="Total Ads" value={totalListings} />
                <StatCard icon={CheckCircle} title="Active Ads" value={activeListings} />
                <StatCard icon={Eye} title="Total Views" value={`${totalViews.toLocaleString()}+`} />
            </div>
        ) : (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>You haven't posted any ads yet.</p>
                <p className="text-sm">Post an ad to see its performance here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
