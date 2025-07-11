
"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileImage, ArrowLeft, ArrowRight, Loader2, X, MapPin, Sparkles } from 'lucide-react';
import { categoriesData } from '@/lib/categories-data';
import { LocationModal } from '@/components/common/LocationModal';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/lib/firebase/storage';
import { createAd, updateAd, getAdById } from '@/lib/firebase/actions';
import { Badge } from '../ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { Ad } from '@/lib/listings-data';
import { handleSuggestTags } from '@/app/post-ad/actions';
import imageCompression from 'browser-image-compression';


const createSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.preprocess((val) => Number(val), z.number().min(1, "Price must be at least 1")),
  tags: z.array(z.string()).optional(),
  images: z.array(z.instanceof(File))
    .min(1, 'Please upload at least 1 photo.')
    .max(10, 'You can upload a maximum of 10 photos.'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

const editSchema = createSchema.extend({
  images: z.array(z.instanceof(File)).optional(), 
  terms: z.boolean().optional(),
});

type AdFormValues = z.infer<typeof createSchema>;

export default function PostAdForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [adToEdit, setAdToEdit] = useState<Ad | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const form = useForm<AdFormValues>({
    resolver: zodResolver(mode === 'create' ? createSchema : editSchema),
    defaultValues: {
      terms: mode === 'edit' ? true : false,
      category: '',
      location: '',
      images: [],
      tags: [],
    }
  });

  const { register, handleSubmit, control, trigger, setValue, watch, formState: { errors }, reset } = form;

  useEffect(() => {
    const editAdId = searchParams.get('edit');
    if (editAdId && user) {
        setMode('edit');
        const fetchAd = async () => {
            try {
                const ad = await getAdById(editAdId);
                if (ad && ad.userID === user.uid) {
                    setAdToEdit(ad);
                    reset({
                        title: ad.title,
                        description: ad.description,
                        price: ad.price,
                        category: ad.category,
                        location: ad.location,
                        tags: ad.tags || [],
                        terms: true,
                        images: [],
                    });
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'Ad not found or you do not have permission to edit it.' });
                    router.push('/post-ad');
                }
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Failed to load ad data.' });
                 router.push('/post-ad');
            } finally {
                setIsFormLoading(false);
            }
        }
        fetchAd();
    } else {
        setMode('create');
        setIsFormLoading(false);
    }
  }, [searchParams, user, reset, router, toast]);

  const images = watch('images') || [];
  const imagePreviews = useMemo(() => images.map(file => URL.createObjectURL(file)), [images]);
  const currentTags = watch('tags') || [];

  const nextStep = async () => {
    const fieldsToValidate: (keyof AdFormValues)[] = (step === 1)
      ? ['category', 'location']
      : ['title', 'description', 'price', 'tags'];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: AdFormValues) => {
    setIsSubmitting(true);
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
        setIsSubmitting(false);
        return;
    }

    try {
      let imageUrls: string[] | undefined;
      if (data.images && data.images.length > 0) {
        imageUrls = await Promise.all(
          data.images.map(imageFile => uploadFile(imageFile, `ads/${user.uid}`))
        );
      }

      if (mode === 'create') {
        if (!imageUrls || imageUrls.length === 0) {
          toast({ variant: 'destructive', title: 'Image Upload Required', description: 'Please upload at least one image.' });
          setIsSubmitting(false);
          return;
        }
        await createAd({
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          location: data.location,
          images: imageUrls,
          tags: data.tags,
          image: imageUrls[0],
          data_ai_hint: '',
          userID: user.uid,
        });
        toast({ title: 'Ad Submitted!', description: 'Your ad is now pending review.', className: 'bg-green-100 text-green-800' });
        router.push('/account/my-ads');
      } else if (mode === 'edit' && adToEdit) {
        const adUpdateData: Partial<Ad> = {
          title: data.title, description: data.description, category: data.category,
          price: data.price, location: data.location, tags: data.tags,
        };
        if (imageUrls && imageUrls.length > 0) {
          adUpdateData.images = [...(adToEdit.images || []), ...imageUrls];
          adUpdateData.image = adUpdateData.images[0];
        }
        await updateAd(adToEdit.id, user.uid, adUpdateData);
        toast({ title: 'Ad Updated!', description: 'Your changes have been saved and sent for review.', className: 'bg-green-100 text-green-800' });
        router.push('/account/my-ads');
      }
    } catch (error) {
        console.error("Error submitting ad:", error);
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'An unexpected error occurred. Please try again.' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleFiles = async (files: FileList | null) => {
    if (files) {
      setIsCompressing(true);
      toast({ title: 'Compressing images...', description: 'Please wait while we optimize your photos.' });
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const newFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));
      
      if (newFiles.length !== files.length) {
          toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload only .jpg, .png, or .webp files.' })
      }
      
      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      try {
        const compressedFiles = await Promise.all(
          newFiles.map(file => imageCompression(file, compressionOptions))
        );

        const currentImages = watch('images') || [];
        const updatedImages = [...currentImages, ...compressedFiles].slice(0, 10);
        setValue('images', updatedImages, { shouldValidate: true });
        
        toast({ title: 'Images ready!', description: 'Your photos have been added.' });
      } catch (error) {
        console.error('Image compression error: ', error);
        toast({ variant: 'destructive', title: 'Compression Failed', description: 'Could not process your images. Please try again.' });
      } finally {
        setIsCompressing(false);
      }
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    if (event.target) event.target.value = '';
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = (watch('images') || []).filter((_, index) => index !== indexToRemove);
    setValue('images', updatedImages, { shouldValidate: true });
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('image/vnd.custom', String(index));
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const draggedIdx = parseInt(e.dataTransfer.getData('image/vnd.custom'), 10);
    if (draggedIdx === null || draggedIdx === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    const newImages = [...watch('images')];
    const [draggedItem] = newImages.splice(draggedIdx, 1);
    newImages.splice(targetIndex, 0, draggedItem);
    setValue('images', newImages, { shouldValidate: true });
    setDraggedIndex(null);
  };
  
  const handleDragEnd = () => setDraggedIndex(null);

  const onSuggestTags = async () => {
    const title = watch('title');
    const description = watch('description');
    if (!title || !description) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Please provide a title and description before suggesting tags.' });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const result = await handleSuggestTags({ title, description });
      setSuggestedTags(result.tags);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Suggestion Failed', description: error.message });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const addTag = (tag: string) => {
    const current = watch('tags') || [];
    if (!current.includes(tag)) {
      setValue('tags', [...current, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', (watch('tags') || []).filter(t => t !== tag));
  };


  if (isFormLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  const Step1 = (
    <div className="space-y-4">
        <div>
        <Label htmlFor="category">Category</Label>
        <Controller
            name="category"
            control={control}
            render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={!user}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                {categoriesData.map(cat => <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>)}
                </SelectContent>
            </Select>
            )}
        />
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        <div>
        <Label>Location</Label>
            <Controller
            name="location"
            control={control}
            render={({ field }) => (
                <LocationModal onSelect={(town, lga) => setValue('location', `${town}, ${lga}`, { shouldValidate: true })} >
                    <Button type="button" variant="outline" className="w-full justify-between font-normal" disabled={!user}>
                        <span>{field.value || "Select a location"}</span>
                        {field.value ? (
                        <X className="h-4 w-4" onClick={(e) => { e.stopPropagation(); setValue('location', '', { shouldValidate: true }); }} />
                        ) : (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        )}
                    </Button>
                </LocationModal>
            )}
            />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>
    </div>
  );
  
  const Step2 = (
     <fieldset disabled={!user} className="space-y-4">
        <div>
        <Label htmlFor="title">Ad Title</Label>
        <Input id="title" placeholder="e.g., Clean Toyota Camry 2019" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe your item in detail" {...register('description')} rows={5}/>
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

         <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="tags">Search Tags</Label>
            <Button type="button" variant="outline" size="sm" onClick={onSuggestTags} disabled={isSuggestingTags}>
              {isSuggestingTags ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Suggest Tags
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Add keywords buyers might use to search for your item.</p>
          <div className="p-3 border rounded-md min-h-[40px] flex flex-wrap gap-2">
            {currentTags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-base">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
             <Input 
                id="tags"
                className="flex-1 border-none shadow-none focus-visible:ring-0 h-auto p-0"
                placeholder={currentTags.length === 0 ? "e.g., used car, sedan..." : ""}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const newTag = e.currentTarget.value.trim();
                        if (newTag) {
                            addTag(newTag);
                            e.currentTarget.value = '';
                        }
                    }
                }}
             />
          </div>
          {suggestedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedTags.map(tag => (
                <button key={tag} type="button" onClick={() => addTag(tag)} disabled={currentTags.includes(tag)}>
                  <Badge variant={currentTags.includes(tag) ? "outline" : "default"} className="cursor-pointer hover:bg-primary/80">
                    + {tag}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>


        <div>
            <Label htmlFor="price">Price (&#8358;)</Label>
            <Input id="price" type="number" placeholder="e.g., 50000" {...register('price')} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <div>
        <Label htmlFor="file-upload">
          {mode === 'edit' ? 'Upload new photos to replace current ones.' : 'Add photos (1-10).'}
        </Label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imagePreviews.map((src, index) => (
                <div 
                    key={src} 
                    className={cn( "relative group aspect-square rounded-md border-2 transition-all cursor-grab hover:border-primary", draggedIndex === index && "opacity-50" )}
                    draggable onDragStart={(e) => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, index)} onDragEnd={handleDragEnd}
                >
                    <Image src={src} alt={`preview ${index}`} fill className="rounded-md object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                        <X className="h-3 w-3" />
                    </button>
                    {index === 0 && <Badge variant="secondary" className="absolute bottom-1 left-1">Main</Badge>}
                </div>
            ))}
            {images.length < 10 && (
                <div onClick={() => !isCompressing && fileInputRef.current?.click()} className={cn("flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input aspect-square text-center transition-colors", isCompressing ? "cursor-not-allowed bg-muted/50" : "cursor-pointer hover:border-primary/70")}>
                    {isCompressing ? <Loader2 className="h-8 w-8 text-muted-foreground animate-spin"/> : <FileImage className="h-8 w-8 text-gray-400" />}
                    <span className="mt-2 text-sm text-muted-foreground">{isCompressing ? "Processing..." : "Add"}</span>
                </div>
            )}
        </div>
        <input ref={fileInputRef} id="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/png, image/jpeg, image/webp"/>
        {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images.message as React.ReactNode}</p>}
        {mode === 'edit' && adToEdit && (!images || images.length === 0) && (
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground">Current photos:</p>
            <div className="flex gap-2 mt-2">
              {adToEdit.images.map(img => <Image key={img} src={img} alt="Current ad photo" width={64} height={64} className="rounded-md object-cover"/>)}
            </div>
          </div>
        )}
        </div>
        {mode === 'create' && (
          <div>
            <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                    <div className="flex items-start space-x-3">
                    <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} className="mt-1"/>
                    <div>
                        <Label htmlFor="terms">I agree to the <Link href="/terms" className="text-primary hover:underline" target="_blank">Terms and Conditions</Link></Label>
                        {errors.terms && <p className="text-sm text-destructive">{errors.terms.message}</p>}
                    </div>
                    </div>
                )}
            />
          </div>
        )}
    </fieldset>
  );

  return (
    <Card>
      <CardHeader>
        <Progress value={step * 50} className="mb-4" />
        <CardTitle>Step {step}: {step === 1 ? 'Category & Location' : 'Details & Photos'}</CardTitle>
        <CardDescription>
          {step === 1 ? 'Tell us what you are selling and where.' : 'Provide details and photos for your ad.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!user && (
            <Alert variant="destructive" className="mb-6">
                <AlertTitle>You are not logged in!</AlertTitle>
                <AlertDescription>
                    Please log in or create an account to post an ad. This ensures we can contact you about your listing and helps keep our community safe.
                </AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 ? Step1 : Step2}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting || !user}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : <div />}
            
            {step < 2 ? (
              <Button type="button" onClick={nextStep} disabled={isSubmitting || !user}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || isCompressing || !user}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : (mode === 'create' ? 'Submit Ad' : 'Update Ad')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
