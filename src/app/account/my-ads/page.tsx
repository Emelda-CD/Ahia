
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAdsByUserId, deleteAd } from '@/lib/firebase/actions';
import type { Ad } from '@/lib/listings-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Trash2, Edit, Package, BadgeCheck, Ban, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
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
  
  const handleDeleteAd = async () => {
    if (!adToDelete || !user) return;
    setIsDeleting(true);
    try {
      await deleteAd(adToDelete.id, user.uid);
      setAds(currentAds => currentAds.filter(ad => ad.id !== adToDelete.id));
      toast({
        title: "Ad Deleted",
        description: "Your ad has been successfully removed.",
      });
    } catch (error: any) {
      console.error("Failed to delete ad:", error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message || "There was a problem deleting your ad.",
      });
    } finally {
      setIsDeleting(false);
      setAdToDelete(null);
    }
  };

  const activeAds = ads.filter(ad => ad.status === 'active');
  const pendingAds = ads.filter(ad => ad.status === 'pending');
  const declinedAds = ads.filter(ad => ad.status === 'declined');

  const AdListItem = ({ ad }: { ad: Ad }) => (
    <Card className={cn(ad.status === 'declined' && 'border-destructive/50 bg-destructive/5')}>
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
                 <div className="text-sm mt-1">
                    {ad.status === 'pending' && <p className="text-amber-600"><b>Status:</b> Pending Review</p>}
                    {ad.status === 'declined' && <p className="text-destructive"><b>Status:</b> Declined. Please review and edit your ad.</p>}
                 </div>
            </div>
            <div className="flex gap-2 self-start sm:self-end mt-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/post-ad?edit=${ad.id}`}><Edit className="h-4 w-4 mr-1"/> Edit</Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setAdToDelete(ad)}>
                    <Trash2 className="h-4 w-4 mr-1"/> Delete
                </Button>
            </div>
        </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Adverts</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active"><BadgeCheck className="mr-2"/> Active ({activeAds.length})</TabsTrigger>
              <TabsTrigger value="pending"><Ban className="mr-2"/> Pending ({pendingAds.length})</TabsTrigger>
              <TabsTrigger value="declined" className="text-destructive data-[state=active]:text-destructive data-[state=active]:border-destructive/50">
                  <AlertTriangle className="mr-2"/> Declined ({declinedAds.length})
              </TabsTrigger>
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
            <TabsContent value="declined" className="space-y-4 pt-4">
              {declinedAds.length > 0 ? (
                  declinedAds.map(ad => <AdListItem key={ad.id} ad={ad} />)
              ) : (
                  <div className="text-center py-16 border rounded-lg bg-card">
                      <h3 className="text-lg font-semibold">No declined ads</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Great! None of your ads have been declined.</p>
                  </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <AlertDialog open={!!adToDelete} onOpenChange={(open) => !open && setAdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your ad
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAd} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
