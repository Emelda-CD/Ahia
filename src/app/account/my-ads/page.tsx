
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAdsByUserId } from '@/lib/firebase/actions';
import type { Ad } from '@/lib/listings-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Trash2, Edit, Package, BadgeCheck, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MyAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const fetchUserAds = async () => {
        setLoading(true);
        try {
          const userAds = await getAdsByUserId(user.uid);
          setAds(userAds);
        } catch (error) {
          console.error("Failed to fetch user's ads:", error);
          toast({
            variant: "destructive",
            title: "Could not load your ads",
            description: "There was an issue fetching your ads. Please try again later.",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUserAds();
    }
  }, [user, toast]);

  const activeAds = ads.filter(ad => ad.verified);
  const pendingAds = ads.filter(ad => !ad.verified); // Assuming not verified means pending/declined

  const AdListItem = ({ ad }: { ad: Ad }) => (
    <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
            <Link href={`/listings/${ad.id}`} className="flex-shrink-0">
                <Image
                    src={ad.image}
                    alt={ad.title}
                    width={128}
                    height={96}
                    className="rounded-md object-cover w-full sm:w-32 h-auto aspect-[4/3]"
                    data-ai-hint={ad.data_ai_hint}
                />
            </Link>
            <div className="flex-grow">
                <p className="text-muted-foreground text-sm">₦{ad.price.toLocaleString()}</p>
                <h3 className="font-semibold text-lg hover:text-primary">
                    <Link href={`/listings/${ad.id}`}>{ad.title}</Link>
                </h3>
                {!ad.verified && (
                    <div className="text-sm text-amber-600 mt-1">
                        <p><b>Status:</b> Pending Review</p>
                        <p className="text-xs">Your ad is waiting for approval from our team.</p>
                    </div>
                )}
            </div>
            <div className="flex gap-2 self-start sm:self-end mt-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/post-ad?edit=${ad.id}`}><Edit className="h-4 w-4 mr-1"/> Edit</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-1"/> Delete
                </Button>
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Adverts</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active"><BadgeCheck className="mr-2"/> Active ({activeAds.length})</TabsTrigger>
            <TabsTrigger value="pending"><Ban className="mr-2"/> Pending ({pendingAds.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4 pt-4">
            {activeAds.length > 0 ? (
                activeAds.map(ad => <AdListItem key={ad.id} ad={ad} />)
            ) : (
                <div className="text-center py-16 border rounded-lg bg-card">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No active ads yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">When you post an ad, it will appear here after approval.</p>
                    <Button asChild className="mt-4">
                        <Link href="/post-ad">Post Your First Ad</Link>
                    </Button>
                </div>
            )}
          </TabsContent>
          <TabsContent value="pending" className="space-y-4 pt-4">
             {pendingAds.length > 0 ? (
                pendingAds.map(ad => <AdListItem key={ad.id} ad={ad} />)
            ) : (
                <div className="text-center py-16 border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold">No pending ads</h3>
                    <p className="mt-1 text-sm text-muted-foreground">You have no ads currently awaiting review.</p>
                </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
