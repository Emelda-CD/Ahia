
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAdsByUserId, deleteAd } from '@/lib/firebase/actions';
import type { Ad } from '@/lib/listings-data';
import { Loader2, ArrowLeft, MoreVertical, FilePenLine, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MyAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
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

  const handleDeleteConfirm = () => {
    if (!adToDelete || !user) return;

    startDeleteTransition(async () => {
      try {
        await deleteAd(adToDelete.id, user.uid);
        setAds((prevAds) => prevAds.filter((ad) => ad.id !== adToDelete.id));
        toast({
          title: "Ad Deleted",
          description: "Your ad has been successfully removed.",
        });
      } catch (error) {
        console.error("Failed to delete ad:", error);
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: "Could not delete the ad. Please try again.",
        });
      } finally {
        setAdToDelete(null);
      }
    });
  };
  
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
    <>
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
                <Card key={ad.id} className="flex items-center p-4 gap-4">
                  <Image src={ad.image} alt={ad.title} width={128} height={96} className="rounded-md object-cover hidden sm:block"/>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{ad.title}</h3>
                    <p className="text-primary font-bold">{`₦${ad.price.toLocaleString()}`}</p>
                    <Badge variant={ad.verified ? "secondary" : "outline"} className={ad.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {ad.verified ? 'Active' : 'Pending Review'}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5"/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem asChild>
                          <Link href={`/account/my-ads/edit/${ad.id}`} className="cursor-pointer">
                            <FilePenLine className="mr-2 h-4 w-4"/>
                            <span>Edit</span>
                          </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => setAdToDelete(ad)} className="text-destructive focus:text-destructive cursor-pointer">
                         <Trash2 className="mr-2 h-4 w-4"/>
                         <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
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

    <AlertDialog open={!!adToDelete} onOpenChange={(isOpen) => !isOpen && setAdToDelete(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your ad
            <span className="font-semibold text-foreground"> &quot;{adToDelete?.title}&quot; </span> 
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
