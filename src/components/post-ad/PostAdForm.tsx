
"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { handleSuggestTags } from '@/app/post-ad/actions';
import { Sparkles, Tag, FileImage, ArrowLeft, ArrowRight, Loader2, X, MapPin, Wallet } from 'lucide-react';
import { categoriesData } from '@/lib/categories-data';
import { LocationModal } from '@/components/common/LocationModal';
import { boostPlans } from '@/lib/boost-plans-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const adSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  location: z.string().min(1, 'Location is required'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive('Price must be a positive number')),
  negotiable: z.boolean().default(false),
  condition: z.enum(['new', 'used']),
  phone: z.string().min(10, 'A valid phone number is required'),
  tags: z.array(z.string()).optional(),
  images: z.array(z.instanceof(File))
    .min(2, '📸 Add at least 2 photos. Drag to reorder. The first photo is your main image.')
    .max(20, 'Advert should contain from 2 to 20 images.'),
  socialLink: z.string().url().optional().or(z.literal('')),
  promotion: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function PostAdForm() {
  const [step, setStep] = useState(1);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
        negotiable: false,
        condition: 'used',
        terms: false,
        category: '',
        subcategory: '',
        location: '',
        promotion: 'none',
        images: []
    }
  });

  const { register, handleSubmit, control, trigger, getValues, setValue, watch, formState: { errors } } = form;

  const selectedCategory = watch('category');
  const locationValue = watch('location');
  const selectedPromotion = watch('promotion');
  const images = watch('images') || [];
  
  const imagePreviews = useMemo(() => images.map(file => URL.createObjectURL(file)), [images]);
  
  const walletBalance = 550; 
  
  const selectedPlan = boostPlans.find(p => p.id === selectedPromotion);
  const insufficientBalance = selectedPlan && selectedPlan.price > walletBalance;

  useEffect(() => {
    if (selectedCategory) {
      const category = categoriesData.find(c => c.name === selectedCategory);
      setSubcategories(category ? category.subcategories : []);
      setValue('subcategory', '');
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, setValue]);
  
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['category', 'subcategory', 'location', 'socialLink']);
    } else if (step === 2) {
      isValid = await trigger(['title', 'description', 'price', 'phone', 'condition', 'images']);
    }
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: AdFormValues) => {
     if (data.promotion && data.promotion !== 'none') {
        const plan = boostPlans.find(p => p.id === data.promotion);
        if (plan && plan.price > walletBalance) {
            toast({
                variant: 'destructive',
                title: 'Cannot Submit Ad',
                description: 'Please fund your wallet or choose a different boost option.',
            });
            return;
        }
    }
    console.log({...data, tags});
    toast({
      title: 'Ad Submitted!',
      description: 'Your ad has been successfully submitted for review.',
      className: 'bg-green-100 border-green-300 text-green-800'
    });
  };

  const onSuggest = async () => {
    const title = getValues('title');
    const description = getValues('description');
    if (!title || !description) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a title and description first.',
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await handleSuggestTags({ title, description });
      setSuggestedTags(result.tags);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not generate suggestions. Please try again.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
        setTags([...tags, tag]);
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }
  
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
        
      const currentImages = getValues('images') || [];
      const updatedImages = [...currentImages, ...newFiles].slice(0, 20);
      setValue('images', updatedImages, { shouldValidate: true });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDragOverUpload = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsUploading(true);
  };

  const handleDragLeaveUpload = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsUploading(false);
  };

  const handleDropUpload = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsUploading(false);
    handleFiles(event.dataTransfer.files);
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    const currentImages = getValues('images') || [];
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove);
    setValue('images', updatedImages, { shouldValidate: true });
  };
  
  // Drag and Drop reordering logic
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const currentImages = getValues('images');
    const newImages = [...currentImages];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedItem);
    
    setValue('images', newImages, { shouldValidate: true });
    setDraggedIndex(null);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };


  return (
    <Card>
      <CardHeader>
        <Progress value={(step / 3) * 100} className="mb-4" />
        <CardTitle>Step {step}: {step === 1 ? 'Category & Location' : step === 2 ? 'Product Details' : 'Boost Your Ad'}</CardTitle>
        <CardDescription>
          {step === 1 ? 'Tell us what you are selling and where.' : step === 2 ? 'Provide details about your item.' : 'Get up to 10x more views by boosting your ad.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Label htmlFor="subcategory">Subcategory</Label>
                <Controller
                  name="subcategory"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                      <SelectTrigger><SelectValue placeholder="Select a subcategory" /></SelectTrigger>
                      <SelectContent>
                        {subcategories.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory.message}</p>}
              </div>
              <div>
                <Label>Location</Label>
                 <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                        <LocationModal onSelect={(town) => setValue('location', town, { shouldValidate: true })}>
                            <Button type="button" variant="outline" className="w-full justify-between font-normal">
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
              <div>
                <Label htmlFor="socialLink">Social Link (Optional)</Label>
                <Input id="socialLink" placeholder="https://instagram.com/your-brand" {...register('socialLink')} />
                 {errors.socialLink && <p className="text-red-500 text-sm">{errors.socialLink.message}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
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
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-sm py-1 pl-3 pr-2">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                <X className="h-3 w-3"/>
                            </button>
                        </Badge>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={onSuggest} disabled={isSuggesting}>
                    {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                    Suggest with AI
                </Button>
                {suggestedTags.length > 0 && 
                    <div className="mt-2 p-2 bg-secondary/50 rounded-md">
                        <p className="text-sm font-medium mb-2">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map(tag => <Button type="button" size="sm" variant="outline" key={tag} onClick={() => addTag(tag)}>{tag}</Button>)}
                        </div>
                    </div>
                }
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (&#8358;)</Label>
                  <Input id="price" type="number" placeholder="e.g., 50000" {...register('price')} />
                   {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>
                <div>
                   <Label htmlFor="phone">Phone Number</Label>
                   <Input id="phone" placeholder="e.g., 08012345678" {...register('phone')} />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="flex items-center gap-8">
                 <Controller
                    name="condition"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <Label>Condition</Label>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="new" id="new" /><Label htmlFor="new">New</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="used" id="used" /><Label htmlFor="used">Used</Label></div>
                        </RadioGroup>
                    )}
                    />
                <Controller
                  name="negotiable"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox id="negotiable" checked={field.value} onCheckedChange={field.onChange} />
                      <Label htmlFor="negotiable">Price is negotiable</Label>
                    </div>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="file-upload">📸 Add at least 2 photos. Drag to reorder. The first photo is your main image.</Label>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {imagePreviews.map((src, index) => (
                        <div 
                            key={src} 
                            className={cn(
                                "relative group aspect-square rounded-md border-2 transition-all cursor-grab hover:border-primary",
                                draggedIndex === index && "opacity-50 scale-95"
                            )}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            <Image
                                src={src}
                                alt={`preview ${index}`}
                                fill
                                className="rounded-md object-cover"
                                style={{ pointerEvents: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                            >
                                <X className="h-3 w-3" />
                            </button>
                            {index === 0 && <Badge variant="secondary" className="absolute bottom-1 left-1">Title Photo</Badge>}
                        </div>
                    ))}
                    
                    {images.length < 20 && (
                        <div
                            onDragOver={handleDragOverUpload}
                            onDragLeave={handleDragLeaveUpload}
                            onDrop={handleDropUpload}
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-input aspect-square text-center cursor-pointer transition-colors",
                                isUploading ? "border-primary bg-primary/10" : "hover:border-primary/70"
                            )}
                        >
                            <FileImage className="h-8 w-8 text-gray-400" />
                            <span className="mt-2 text-sm text-muted-foreground">Add photo</span>
                        </div>
                    )}
                </div>

                {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images.message}</p>}
                
                <div className="text-sm text-muted-foreground mt-4 space-y-3 bg-secondary/50 p-4 rounded-md">
                    <h4 className="font-bold text-base text-foreground">📸 Image Upload Guide:</h4>
                    <p>✅ You can upload at least <strong>2 photos</strong> for this ad.</p>
                    <p className="font-semibold mt-2">🔁 To change the photo order:</p>
                    <ul className="list-none pl-4 space-y-1">
                        <li>👉 Tap and <strong>hold</strong> any photo</li>
                        <li>👉 Then <strong>drag it</strong> to your desired position</li>
                        <li>👉 The photo at the top will become your <strong>main display image</strong></li>
                    </ul>
                    <p className="mt-2">💡 <strong>Example:</strong> To make a different photo appear first, just drag it to the top of the list.</p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                        <p>📂 <strong>Supported formats:</strong> .jpg and .png</p>
                        <p>📷 Clear photos help buyers trust your ad!</p>
                    </div>
                </div>

                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/png, image/jpeg"/>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
                 <div className="space-y-2">
                    <Label>Wallet Balance</Label>
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                        <Wallet className="h-7 w-7"/>
                        <span>₦{walletBalance.toLocaleString()}</span>
                    </div>
                </div>
              
                <Controller
                    name="promotion"
                    control={control}
                    render={({ field }) => (
                    <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value}
                        className="space-y-4"
                    >
                        <Label className="text-base font-semibold">Boost Your Ad (Optional)</Label>
                        
                        {boostPlans.map((plan) => (
                        <Label 
                            key={plan.id}
                            htmlFor={plan.id}
                            className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                        >
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <div className="flex-1">
                                <p className="font-bold">{plan.name}</p>
                                <p className="text-sm text-muted-foreground">Get more visibility for {plan.duration_days} days.</p>
                            </div>
                            <p className="text-lg font-semibold">₦{plan.price.toLocaleString()}</p>
                        </Label>
                        ))}

                        <Label 
                            htmlFor="none"
                            className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                        >
                            <RadioGroupItem value="none" id="none" />
                            <div className="flex-1">
                                <p className="font-bold">No Boost</p>
                                <p className="text-sm text-muted-foreground">I'll post my ad without any promotion for now.</p>
                            </div>
                        </Label>
                    </RadioGroup>
                    )}
                />

                {insufficientBalance && (
                    <Alert variant="destructive">
                    <AlertTitle>Insufficient Funds</AlertTitle>
                    <AlertDescription className="flex justify-between items-center">
                        <span>You do not have enough balance to purchase this boost.</span>
                        <Button size="sm" variant="secondary">Fund Wallet</Button>
                    </AlertDescription>
                    </Alert>
                )}
              
              <div>
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                     <div className="flex items-start space-x-3">
                        <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} className="mt-1"/>
                        <div>
                            <Label htmlFor="terms">I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a></Label>
                            {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
                        </div>
                     </div>
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : <div />}
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={insufficientBalance}>Submit Ad</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
