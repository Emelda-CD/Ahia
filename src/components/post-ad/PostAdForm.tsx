
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { FileImage, Loader2, X, MapPin, Sparkles, ArrowLeft, Trash2 } from 'lucide-react';
import { categoriesData } from '@/lib/categories-data';
import { LocationModal } from '@/components/common/LocationModal';
import { cn } from '@/lib/utils';
import { uploadFile } from '@/lib/firebase/storage';
import { createAd, updateAd, getAdById, saveDraft, getDraft, deleteDraft } from '@/lib/firebase/actions';
import { Badge } from '../ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import type { Ad } from '@/lib/listings-data';
import { handleSuggestTags, handleSuggestDetails } from '@/app/post-ad/actions';
import imageCompression from 'browser-image-compression';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useDebouncedCallback } from 'use-debounce';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

// Base schema with common fields
const baseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.preprocess((val) => Number(String(val).replace(/,/g, '')), z.number().min(1, "Price must be at least 1")),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  tags: z.array(z.string()).optional(),
  
  // Optional fields for different categories
  type: z.enum(['Sale', 'Rent']).optional(),
  rentalPeriod: z.enum(['per_day', 'per_week', 'per_month']).optional(),
  plotSize: z.preprocess(val => Number(val) || undefined, z.number().optional()),
  plotMeasurementUnit: z.string().optional(),
  rooms: z.preprocess(val => Number(val) || undefined, z.number().optional()),
  toilets: z.preprocess(val => Number(val) || undefined, z.number().optional()),
  furnished: z.enum(['Yes', 'No']).optional(),
  condition: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.preprocess(val => Number(val) || undefined, z.number().optional()),
  fashionType: z.enum(['Male', 'Female']).optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  brand: z.string().optional(),
  storage: z.string().optional(),
  serviceType: z.string().optional(),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract']).optional(),
  position: z.string().optional(),
  company: z.string().optional(),
  experience: z.string().optional(),
  salary: z.preprocess(val => Number(String(val).replace(/,/g, '')) || undefined, z.number().optional()),
});

// Create mode needs terms and at least one image file.
const createSchema = baseSchema.extend({
  images: z.array(z.instanceof(File))
    .min(1, 'Please upload at least 1 photo.')
    .max(10, 'You can upload a maximum of 10 photos.'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
}).superRefine((data, ctx) => {
    // This refinement runs for all categories
    if (data.type === 'Rent' && !data.rentalPeriod) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Rental period is required for rental items.', path: ['rentalPeriod'] });
    }

    // Category-specific refinements
    switch (data.category) {
        case 'Land':
            if (!data.plotSize) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Plot size is required', path: ['plotSize'] });
            if (!data.plotMeasurementUnit) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Measurement unit is required', path: ['plotMeasurementUnit'] });
            break;
        case 'Real Estate':
            if (!data.rooms) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Number of rooms is required', path: ['rooms'] });
            if (!data.toilets) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Number of toilets is required', path: ['toilets'] });
            break;
        case 'Vehicles':
        case 'Phones & Tablets':
        case 'Electronics':
        case 'Fashion':
             if (!data.condition) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Condition is required', path: ['condition'] });
             break;
        case 'Jobs':
            if (!data.jobType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Job type is required', path: ['jobType']});
            break;
    }
});

// Edit mode makes images optional and doesn't require terms checkbox
const editSchema = baseSchema.extend({
  images: z.array(z.instanceof(File)).optional(),
  terms: z.boolean().optional(),
}).superRefine((data, ctx) => {
    // This refinement runs for all categories
    if (data.type === 'Rent' && !data.rentalPeriod) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Rental period is required for rental items.', path: ['rentalPeriod'] });
    }
    
    // Category-specific refinements
    switch (data.category) {
        case 'Land':
            if (!data.plotSize) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Plot size is required', path: ['plotSize'] });
            if (!data.plotMeasurementUnit) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Measurement unit is required', path: ['plotMeasurementUnit'] });
            break;
        case 'Real Estate':
            if (!data.rooms) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Number of rooms is required', path: ['rooms'] });
            if (!data.toilets) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Number of toilets is required', path: ['toilets'] });
            break;
        case 'Vehicles':
        case 'Phones & Tablets':
        case 'Electronics':
        case 'Fashion':
             if (!data.condition) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Condition is required', path: ['condition'] });
             break;
        case 'Jobs':
            if (!data.jobType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Job type is required', path: ['jobType']});
            break;
    }
});


type AdFormValues = z.infer<typeof baseSchema>;

const AISuggestionDialog = ({ onSuggest }: { onSuggest: (keywords: string) => void }) => {
    const [keywords, setKeywords] = useState('');
    const [open, setOpen] = useState(false);

    const handleSuggest = () => {
        onSuggest(keywords);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Suggest with AI
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Suggest Title & Description</DialogTitle>
                    <DialogDescription>
                        Enter a few keywords about your item, and our AI will write a title and description for you.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g., blue toyota camry 2019, leather seats"
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSuggest} disabled={!keywords.trim()}>
                        Generate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function PostAdForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [adToEdit, setAdToEdit] = useState<Ad | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const form = useForm<AdFormValues>({
    resolver: zodResolver(mode === 'create' ? createSchema : editSchema),
    defaultValues: {
      terms: mode === 'edit' ? true : false,
      images: [],
      tags: [],
    }
  });

  const { register, handleSubmit, control, setValue, watch, formState: { errors }, reset, trigger, getValues } = form;

  // Check for draft on load
  useEffect(() => {
    const editAdId = searchParams.get('edit');
    if (editAdId && user) {
        setMode('edit');
        const fetchAd = async () => {
            setIsFormLoading(true);
            try {
                const ad = await getAdById(editAdId);
                if (ad && ad.userId === user.uid) {
                    setAdToEdit(ad);
                    reset({ ...ad, terms: true, images: [] });
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
    } else if (user && mode === 'create') {
        const checkForDraft = async () => {
            const draft = await getDraft(user.uid);
            if (draft) {
                setShowDraftDialog(true);
            } else {
                setIsFormLoading(false); // No draft, enable form
            }
        };
        checkForDraft();
    } else {
       setIsFormLoading(false); // Not logged in or in edit mode without ID
    }
  }, [user, mode, searchParams, reset, router, toast]);

  const handleRestoreDraft = async () => {
    if (!user) return;
    setIsRestoring(true);
    setShowDraftDialog(false);
    const draft = await getDraft(user.uid);
    if (draft) {
        try {
            const { step: savedStep, values } = draft;
            reset(values);
            if (savedStep) {
                setStep(savedStep);
            }
            toast({ title: 'Draft Restored', description: 'You can continue where you left off.' });
        } catch (e) {
            console.error("Failed to parse or restore draft:", e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not restore draft.' });
            await deleteDraft(user.uid);
        }
    }
    setIsFormLoading(false); // Enable form after restoration
    setIsRestoring(false);
  };
  
  const handleStartNew = async () => {
      if (user) {
          await deleteDraft(user.uid);
      }
      reset({ terms: false, images: [], tags: [] });
      setStep(1);
      setShowDraftDialog(false);
      setIsFormLoading(false); // Enable form
  };

  const watchedValues = watch();
  
  const debouncedSaveDraft = useDebouncedCallback(async (dataToSave, currentStep) => {
    if (mode === 'create' && user && !isFormLoading && !showDraftDialog && !isRestoring) {
      const draftData = {
        values: { ...dataToSave, images: [] }, // Don't save files in Firestore
        step: currentStep,
      };
      await saveDraft(user.uid, draftData);
    }
  }, 2000); // Debounce for 2 seconds

  useEffect(() => {
    debouncedSaveDraft(watchedValues, step);
  }, [watchedValues, step, debouncedSaveDraft]);


  const images = watch('images') || [];
  const imagePreviews = useMemo(() => images.map(file => URL.createObjectURL(file)), [images]);
  const currentTags = watch('tags') || [];
  const selectedCategoryName = watch('category');
  const selectedCategory = useMemo(() => categoriesData.find(c => c.name === selectedCategoryName), [selectedCategoryName]);
  const selectedType = watch('type');


  const onSubmit = async (data: AdFormValues) => {
    setIsSubmitting(true);
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
        setIsSubmitting(false);
        return;
    }

    try {
      let imageUrls: string[] = adToEdit?.images || [];
      if (data.images && data.images.length > 0) {
        const uploadedUrls = await Promise.all(
          data.images.map(imageFile => uploadFile(imageFile, `ads/${user.uid}`))
        );
        imageUrls = uploadedUrls;
      }

      const adPayload: Partial<Ad> = {
        ...data,
        userId: user.uid,
        images: imageUrls,
        image: imageUrls[0] || adToEdit?.image || '', // Ensure there's a primary image
        data_ai_hint: '', // Can be generated or left empty
      };

      if (mode === 'create') {
        if (imageUrls.length === 0) {
          toast({ variant: 'destructive', title: 'Image Upload Required', description: 'Please upload at least one image.' });
          setIsSubmitting(false);
          return;
        }
        await createAd(adPayload as any); // Cast to any to bypass strict initial type
        await deleteDraft(user.uid); // Clear draft on successful submission
        toast({ title: 'Ad Submitted!', description: 'Your ad is now pending review.', className: 'bg-green-100 text-green-800' });
        router.push('/account/my-ads');
      } else if (mode === 'edit' && adToEdit) {
        await updateAd(adToEdit.id, user.uid, adPayload);
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
    setIsSuggesting(true);
    try {
      const result = await handleSuggestTags({ title, description });
      setSuggestedTags(result.tags);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Suggestion Failed', description: error.message });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSuggestDetails = async (keywords: string) => {
      const category = watch('category');
      const subcategory = watch('subcategory');
      if (!category || !subcategory) {
          toast({ variant: 'destructive', title: 'Missing Info', description: 'Please select a category and subcategory first.' });
          return;
      }
      setIsSuggesting(true);
      try {
          const result = await handleSuggestDetails({ keywords, category, subcategory });
          setValue('title', result.title, { shouldValidate: true });
          setValue('description', result.description, { shouldValidate: true });
          toast({ title: 'Content Generated!', description: 'Title and description have been filled in.' });
      } catch (error: any) {
          toast({ variant: 'destructive', title: 'Suggestion Failed', description: error.message });
      } finally {
          setIsSuggesting(false);
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
  
  const handleNextStep = async () => {
    let fieldsToValidate: (keyof AdFormValues)[] = [];
    if (step === 1) {
        fieldsToValidate = ['category', 'subcategory', 'location'];
    } else if (step === 2) {
        fieldsToValidate = ['title', 'description'];
        switch (watch('category')) {
            case 'Land': fieldsToValidate.push('plotSize', 'plotMeasurementUnit'); break;
            case 'Real Estate': fieldsToValidate.push('rooms', 'toilets'); break;
            case 'Vehicles':
            case 'Phones & Tablets':
            case 'Electronics':
            case 'Fashion': fieldsToValidate.push('condition'); break;
            case 'Jobs': fieldsToValidate.push('jobType'); break;
        }
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => s + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(s => s - 1);
  };
  
  const getStepInfo = () => {
    switch (step) {
        case 1: return { title: 'Category & Location', description: 'First, select a category and location for your ad.', progress: 33 };
        case 2: return { title: 'Ad Details', description: 'Provide the main details for your item.', progress: 66 };
        case 3: return { title: 'Photos & Final Details', description: 'Add photos and pricing to publish your ad.', progress: 100 };
        default: return { title: '', description: '', progress: 0 };
    }
  }
  
  const currentStepInfo = getStepInfo();

  const renderDynamicFields = () => {
    if (!selectedCategory) return null;

    return (
      <div className="space-y-4 pt-4 border-t">
        {['Real Estate', 'Land'].includes(selectedCategory.name) && (
          <div>
            <Label>Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sale" id="sale" />
                    <Label htmlFor="sale">For Sale</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Rent" id="rent" />
                    <Label htmlFor="rent">For Rent</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        )}

        {selectedType === 'Rent' && (
          <div>
            <Label>Rental Period</Label>
            <Controller name="rentalPeriod" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_day">Per Day</SelectItem>
                  <SelectItem value="per_week">Per Week</SelectItem>
                  <SelectItem value="per_month">Per Month</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.rentalPeriod && <p className="text-destructive text-sm mt-1">{errors.rentalPeriod.message}</p>}
          </div>
        )}

        {selectedCategory.name === 'Land' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plotSize">Plot Size</Label>
              <Input id="plotSize" type="number" {...register('plotSize')} />
              {errors.plotSize && <p className="text-destructive text-sm mt-1">{errors.plotSize.message}</p>}
            </div>
            <div>
              <Label>Unit</Label>
               <Controller name="plotMeasurementUnit" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqm">sqm</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              {errors.plotMeasurementUnit && <p className="text-destructive text-sm mt-1">{errors.plotMeasurementUnit.message}</p>}
            </div>
          </div>
        )}

        {selectedCategory.name === 'Real Estate' && (
           <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rooms">Bedrooms</Label>
              <Input id="rooms" type="number" {...register('rooms')} />
              {errors.rooms && <p className="text-destructive text-sm mt-1">{errors.rooms.message}</p>}
            </div>
             <div>
              <Label htmlFor="toilets">Bathrooms</Label>
              <Input id="toilets" type="number" {...register('toilets')} />
              {errors.toilets && <p className="text-destructive text-sm mt-1">{errors.toilets.message}</p>}
            </div>
           </div>
        )}

        {['Vehicles', 'Fashion', 'Phones & Tablets', 'Electronics'].includes(selectedCategory.name) && (
          <div>
            <Label>Condition</Label>
             <Controller name="condition" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Nigerian Used">Nigerian Used</SelectItem>
                  <SelectItem value="Foreign Used">Foreign Used</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.condition && <p className="text-destructive text-sm mt-1">{errors.condition.message}</p>}
          </div>
        )}
        
        {selectedCategory.name === 'Vehicles' && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input id="make" {...register('make')} placeholder="e.g., Toyota"/>
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...register('model')} placeholder="e.g., Camry"/>
            </div>
             <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" {...register('year')} placeholder="e.g., 2019"/>
            </div>
          </div>
        )}

        {selectedCategory.name === 'Jobs' && (
           <div className="space-y-4">
             <div>
                <Label>Job Type</Label>
                <Controller name="jobType" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                       <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
                {errors.jobType && <p className="text-destructive text-sm mt-1">{errors.jobType.message}</p>}
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" {...register('company')} placeholder="e.g., Ahia Inc."/>
              </div>
               <div>
                <Label htmlFor="salary">Salary (Monthly, Optional)</Label>
                <Input id="salary" type="number" {...register('salary')} placeholder="e.g., 150000"/>
              </div>
           </div>
        )}
      </div>
    );
  };


  return (
    <>
      <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Continue your draft?</DialogTitle>
            <DialogDescription>
              We found a saved draft of an ad you were working on. Would you like to continue editing it or start a new one?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between gap-2">
             <Button variant="ghost" className="flex items-center gap-2" onClick={handleStartNew}>
              <Trash2 className="h-4 w-4" /> Discard and Start New
            </Button>
            <Button onClick={handleRestoreDraft}>Continue Draft</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <Progress value={currentStepInfo.progress} className="w-full mb-4" />
          <CardTitle>{currentStepInfo.title} (Step {step} of 3)</CardTitle>
          <CardDescription>{currentStepInfo.description}</CardDescription>
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
          
              <fieldset disabled={!user || isSubmitting || isSuggesting || isFormLoading} className="space-y-4">
                  {step === 1 && (
                      <div className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                  <Label htmlFor="category">Category</Label>
                                  <Controller name="category" control={control} render={({ field }) => (
                                      <Select onValueChange={(value) => { field.onChange(value); setValue('subcategory', ''); }} value={field.value}>
                                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                          <SelectContent>
                                          {categoriesData.map(cat => <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>)}
                                          </SelectContent>
                                      </Select>
                                  )} />
                                  {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
                              </div>
                              <div>
                                  <Label>Subcategory</Label>
                                  <Controller name="subcategory" control={control} render={({ field }) => (
                                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                                          <SelectTrigger><SelectValue placeholder="Select a subcategory" /></SelectTrigger>
                                          <SelectContent>
                                              {selectedCategory?.subcategories.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                                          </SelectContent>
                                      </Select>
                                  )} />
                                  {errors.subcategory && <p className="text-destructive text-sm mt-1">{errors.subcategory.message}</p>}
                              </div>
                          </div>

                          <div>
                              <Label>Location</Label>
                              <Controller name="location" control={control} render={({ field }) => (
                                  <LocationModal onSelect={(town, lga) => setValue('location', `${town}, ${lga}`, { shouldValidate: true })} >
                                      <Button type="button" variant="outline" className="w-full justify-between font-normal">
                                          <span>{field.value || "Select a location"}</span>
                                          {field.value ? (
                                          <X className="h-4 w-4" onClick={(e) => { e.stopPropagation(); setValue('location', '', { shouldValidate: true }); }} />
                                          ) : (
                                          <MapPin className="h-4 w-4 text-muted-foreground" />
                                          )}
                                      </Button>
                                  </LocationModal>
                              )} />
                              {errors.location && <p className="text-destructive text-sm mt-1">{errors.location.message}</p>}
                          </div>
                      </div>
                  )}

                  {step === 2 && (
                      <div className="space-y-4">
                          <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Ad Details</h3>
                              {isSuggesting ? (
                                  <Button type="button" variant="outline" size="sm" disabled>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Generating...
                                  </Button>
                              ) : (
                                  <AISuggestionDialog onSuggest={onSuggestDetails} />
                              )}
                          </div>

                          <div>
                              <Label htmlFor="title">Ad Title</Label>
                              <Input id="title" placeholder="e.g., Clean Toyota Camry 2019" {...register('title')} />
                              {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                          </div>
                          
                          <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea id="description" placeholder="Describe your item in detail" {...register('description')} rows={5}/>
                              {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
                          </div>

                          {renderDynamicFields()}
                      </div>
                  )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  {step === 3 && (
                      <div className="space-y-6">
                          <div>
                              <Label htmlFor="price">Price (&#8358;)</Label>
                              <Input id="price" type="number" placeholder="e.g., 50000" {...register('price')} />
                              {errors.price && <p className="text-destructive text-sm mt-1">{errors.price.message}</p>}
                          </div>
                          
                          <div>
                              <Label htmlFor="file-upload">
                                  {mode === 'edit' ? 'Upload new photos' : 'Add photos (1-10)'}
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
                              {errors.images && <p className="text-destructive text-sm mt-2">{errors.images.message as React.ReactNode}</p>}
                              {mode === 'edit' && adToEdit && (!images || images.length === 0) && (
                              <div className="mt-4">
                                  <p className="text-sm font-medium text-muted-foreground">Current photos:</p>
                                  <div className="flex gap-2 mt-2">
                                  {adToEdit.images.map(img => <Image key={img} src={img} alt="Current ad photo" width={64} height={64} className="rounded-md object-cover"/>)}
                                  </div>
                              </div>
                              )}
                          </div>

                          <div>
                              <div className="flex justify-between items-center mb-2">
                                  <Label htmlFor="tags">Search Tags (Optional)</Label>
                                  <Button type="button" variant="outline" size="sm" onClick={onSuggestTags} disabled={isSuggesting}>
                                  {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
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
                          
                          {mode === 'create' && (
                          <div>
                            <Controller
                                control={control}
                                name="terms"
                                render={({ field }) => (
                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id="terms"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            ref={field.ref}
                                        />
                                        <div>
                                            <Label htmlFor="terms" className="text-muted-foreground">
                                                I agree to the <Link href="/terms" className="text-primary hover:underline" target="_blank">Terms and Conditions</Link>
                                            </Label>
                                            {errors.terms && <p className="text-sm text-destructive mt-1">{errors.terms.message}</p>}
                                        </div>
                                    </div>
                                )}
                            />
                          </div>
                          )}
                           <div className="mt-8 flex justify-end gap-4">
                              {step > 1 && (
                                  <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
                                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                  </Button>
                              )}
                             
                                  <Button type="submit" size="lg" disabled={isSubmitting || isCompressing || !user || isFormLoading}>
                                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : (mode === 'create' ? 'Submit Ad' : 'Update Ad')}
                                  </Button>
                            
                          </div>
                      </div>
                      
                  )}
                  </form>
              </fieldset>

              <div className="mt-8 flex justify-end gap-4">
                  {step > 1 && (
                      <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                  )}
                  {step < 3 && (
                      <Button type="button" size="lg" onClick={handleNextStep}>
                          Next
                      </Button>
                  )}
              </div>
        </CardContent>
      </Card>
    </>
  );
}

    