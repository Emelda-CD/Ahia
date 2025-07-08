
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdsByUserId } from '@/lib/firebase/actions';
import type { Ad } from '@/lib/listings-data';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AdCardListItem from '@/components/AdCardListItem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAds = async () => {
      setLoading(true);
      try {
        const userAds = await getAdsByUserId(user.uid);
        setAds(userAds);
      } catch (error) {
        console.error("Failed to fetch user ads:", error);
        toast({
          variant: "destructive",
          title: "Could not load your ads",
          description: "There was an issue fetching your ads. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [user, authLoading, toast]);
  
  const isLoading = authLoading || loading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Please log in</h1>
        <p className="text-muted-foreground">You need to be logged in to view your ads.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
       <Button asChild variant="ghost" className="mb-6">
        <Link href="/account">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>My Published Ads</CardTitle>
          <CardDescription>Here you can view, edit, or delete your active and pending ads.</CardDescription>
        </CardHeader>
        <CardContent>
          {ads.length > 0 ? (
            <div className="space-y-4">
              {ads.map(ad => (
                <AdCardListItem key={ad.id} {...ad} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-2xl font-bold">You have no ads yet</h3>
                <p className="text-muted-foreground mt-2">Ready to sell something? Post your first ad now!</p>
                 <Button asChild className="mt-4">
                    <Link href="/post-ad">Post Ad</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
