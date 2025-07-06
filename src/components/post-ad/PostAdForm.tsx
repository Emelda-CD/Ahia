
"use client";

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { FileImage, ArrowLeft, ArrowRight, Loader2, X, MapPin } from 'lucide-react';
import { categoriesData } from '@/lib/categories-data';
import { LocationModal } from '@/components/common/LocationModal';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/lib/firebase/storage';
import { createAd } from '@/lib/firebase/actions';
import { Badge } from '../ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const adSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Price must be a positive number')),
  images: z.array(z.instanceof(File))
    .min(1, 'Please upload at least 1 photo.')
    .max(10, 'You can upload a maximum of 10 photos.'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function PostAdForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      terms: false,
      category: '',
      location: '',
      images: []
    }
  });

  const { register, handleSubmit, control, trigger, setValue, watch, formState: { errors } } = form;

  const images = watch('images') || [];
  const imagePreviews = useMemo(() => images.map(file => URL.createObjectURL(file)), [images]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof AdFormValues)[];
    if (step === 1) {
      fieldsToValidate = ['category', 'location'];
    } else {
      fieldsToValidate = ['title', 'description', 'price', 'images', 'terms'];
    }
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: AdFormValues) => {
    setIsSubmitting(true);
    
    // Although the form is disabled, this is an extra check.
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to post an ad.' });
        setIsSubmitting(false);
        return;
    }

    try {
        const imageUrls = await Promise.all(
            data.images.map(imageFile => uploadFile(imageFile, `ads/${user.uid}`))
        );

        if (imageUrls.length === 0) {
            toast({ variant: 'destructive', title: 'Image Upload Failed', description: 'Could not upload your images. Please try again.' });
            setIsSubmitting(false);
            return;
        }
        
        const adData = {
            title: data.title,
            description: data.description,
            category: data.category,
            price: data.price,
            location: data.location,
            images: imageUrls,
            image: imageUrls[0], // Use first image as main
            data_ai_hint: '', // Can be generated or left empty
            userID: user.uid,
        };

        await createAd(adData);

        toast({
          title: 'Ad Submitted!',
          description: 'Your ad has been successfully submitted for review.',
          className: 'bg-green-100 border-green-300 text-green-800'
        });

        router.push('/account');

    } catch (error) {
        console.error("Error creating ad:", error);
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'An unexpected error occurred. Please try again.' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleFiles = (files: FileList | null) => {
    if (files) {
      const allowedTypes = ['image/jpeg', 'image/png'];
      const newFiles = Array.from(files)
        .filter(file => allowedTypes.includes(file.type));

      if (newFiles.length !== files.length) {
          toast({
              variant: 'destructive',
              title: 'Invalid File Type',
              description: 'Please upload only .jpg or .png files.'
          })
      }
        
      const currentImages = watch('images') || [];
      const updatedImages = [...currentImages, ...newFiles].slice(0, 10);
      setValue('images', updatedImages, { shouldValidate: true });
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

  const Step1 = (
    <div className="space-y-4">
        <div>
        <Label htmlFor="category">Category</Label>
        <Controller
            name="category"
            control={control}
            render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!user}>
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
            <Label htmlFor="price">Price (&#8358;)</Label>
            <Input id="price" type="number" placeholder="e.g., 50000" {...register('price')} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <div>
        <Label htmlFor="file-upload">Add photos (1-10). Drag to reorder. First is main.</Label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imagePreviews.map((src, index) => (
                <div 
                    key={src} 
                    className={cn(
                        "relative group aspect-square rounded-md border-2 transition-all cursor-grab hover:border-primary",
                        draggedIndex === index && "opacity-50"
                    )}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                >
                    <Image src={src} alt={`preview ${index}`} fill className="rounded-md object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                        <X className="h-3 w-3" />
                    </button>
                    {index === 0 && <Badge variant="secondary" className="absolute bottom-1 left-1">Main</Badge>}
                </div>
            ))}
            {images.length < 10 && (
                <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input aspect-square text-center cursor-pointer transition-colors hover:border-primary/70">
                    <FileImage className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-muted-foreground">Add</span>
                </div>
            )}
        </div>
        <input ref={fileInputRef} id="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/png, image/jpeg"/>
        {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images.message as React.ReactNode}</p>}
        </div>
        <div>
        <Controller
            name="terms"
            control={control}
            render={({ field }) => (
                <div className="flex items-start space-x-3">
                <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} className="mt-1"/>
                <div>
                    <Label htmlFor="terms">I agree to the <Link href="/terms" className="text-primary hover:underline" target="_blank">Terms and Conditions</Link></Label>
                    {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
                </div>
                </div>
            )}
        />
        </div>
    </fieldset>
  );

  return (
    <Card>
      <CardHeader>
        <Progress value={(step / 2) * 100} className="mb-4" />
        <CardTitle>Step {step}: {step === 1 ? 'Category & Location' : 'Details & Submission'}</CardTitle>
        <CardDescription>
          {step === 1 ? 'Tell us what you are selling and where.' : 'Provide details about your item and post your ad.'}
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
          {step === 1 && Step1}
          {step === 2 && Step2}

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
              <Button type="submit" disabled={isSubmitting || !user}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Submit Ad'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
