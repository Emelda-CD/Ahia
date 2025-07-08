
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostAdForm from '@/components/post-ad/PostAdForm';
import { getAdById } from '@/lib/firebase/actions';
import type { Ad } from '@/lib/listings-data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditAdPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { user } = useAuth();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!id || !user) return;

    const fetchAd = async () => {
      try {
        setLoading(true);
        const fetchedAd = await getAdById(id as string);
        if (!fetchedAd) {
          setError('Ad not found.');
          toast({ variant: 'destructive', title: 'Error', description: 'Ad could not be found.' });
          router.push('/account/my-ads');
          return;
        }
        if (fetchedAd.userID !== user.uid) {
           setError('You do not have permission to edit this ad.');
           toast({ variant: 'destructive', title: 'Permission Denied', description: 'You can only edit your own ads.' });
           router.push('/account/my-ads');
           return;
        }
        setAd(fetchedAd);
      } catch (e) {
        setError('Failed to load ad data.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id, user, router, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/account/my-ads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Ads
            </Link>
          </Button>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary">Edit Your Ad</h1>
            <p className="text-muted-foreground mt-2">Update the details of your listing below.</p>
          </div>
          {error && <p className="text-destructive text-center">{error}</p>}
          {ad && <PostAdForm mode="edit" adToEdit={ad} />}
        </div>
      </div>
    </div>
  );
}
