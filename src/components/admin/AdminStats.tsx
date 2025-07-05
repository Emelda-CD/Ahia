
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, CircleDollarSign, BadgeCheck } from 'lucide-react';
import { getAds, getAllUsers } from '@/lib/firebase/actions';
import { Skeleton } from '../ui/skeleton';

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

export default function AdminStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalListings: 0,
        pendingApprovals: 0,
        totalRevenue: 85600, // Mocked as revenue is not tracked
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [allUsers, allAds] = await Promise.all([
                    getAllUsers(),
                    getAds()
                ]);
                
                const pendingCount = allAds.filter(ad => !ad.verified).length;

                setStats(prev => ({
                    ...prev,
                    totalUsers: allUsers.length,
                    totalListings: allAds.length,
                    pendingApprovals: pendingCount,
                }));
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <Skeleton className="h-4 w-20" />
                        </CardHeader>
                        <CardContent>
                           <Skeleton className="h-7 w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} title="Total Users" value={stats.totalUsers.toLocaleString()} />
            <StatCard icon={Package} title="Total Listings" value={stats.totalListings.toLocaleString()} />
            <StatCard icon={BadgeCheck} title="Pending Approvals" value={stats.pendingApprovals.toLocaleString()} />
            <StatCard icon={CircleDollarSign} title="Total Revenue (Mock)" value={`₦${stats.totalRevenue.toLocaleString()}`} />
        </div>
    )
}
