
"use client";

import { useState, useEffect } from 'react';
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
import { Sparkles, Tag, FileImage, ArrowLeft, ArrowRight, Loader2, X } from 'lucide-react';
import { categoriesData } from '@/lib/categories-data';

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

  const { toast } = useToast();
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
        negotiable: false,
        condition: 'used',
        terms: false,
        category: '',
        subcategory: ''
    }
  });

  const { register, handleSubmit, control, trigger, getValues, setValue, watch } = form;

  const selectedCategory = watch('category');

  useEffect(() => {
    if (selectedCategory) {
      const category = categoriesData.find(c => c.name === selectedCategory);
      setSubcategories(category ? category.subcategories : []);
      setValue('subcategory', '');
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, setValue]);

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['category', 'subcategory', 'location', 'socialLink']);
    } else if (step === 2) {
      isValid = await trigger(['title', 'description', 'price', 'phone', 'condition']);
    }
    if (isValid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = (data: AdFormValues) => {
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

  return (
    <Card>
      <CardHeader>
        <Progress value={(step / 3) * 100} className="mb-4" />
        <CardTitle>Step {step}: {step === 1 ? 'Category & Location' : step === 2 ? 'Product Details' : 'Promotion'}</CardTitle>
        <CardDescription>
          {step === 1 ? 'Tell us what you are selling and where.' : step === 2 ? 'Provide details about your item.' : 'Boost your ad visibility.'}
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
                {form.formState.errors.category && <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>}
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
                {form.formState.errors.subcategory && <p className="text-red-500 text-sm">{form.formState.errors.subcategory.message}</p>}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Ikeja, Lagos" {...register('location')} />
                 {form.formState.errors.location && <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>}
              </div>
              <div>
                <Label htmlFor="socialLink">Social Link (Optional)</Label>
                <Input id="socialLink" placeholder="https://instagram.com/your-brand" {...register('socialLink')} />
                 {form.formState.errors.socialLink && <p className="text-red-500 text-sm">{form.formState.errors.socialLink.message}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Ad Title</Label>
                <Input id="title" placeholder="e.g., Clean Toyota Camry 2019" {...register('title')} />
                 {form.formState.errors.title && <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your item in detail" {...register('description')} rows={5}/>
                 {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
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
                   {form.formState.errors.price && <p className="text-red-500 text-sm">{form.formState.errors.price.message}</p>}
                </div>
                <div>
                   <Label htmlFor="phone">Phone Number</Label>
                   <Input id="phone" placeholder="e.g., 08012345678" {...register('phone')} />
                    {form.formState.errors.phone && <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>}
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
                <Label>Upload Images</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                    <div className="text-center">
                    <FileImage className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary-dark">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple/>
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
                </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="promotion">Promotion Plan (Optional)</Label>
                <Controller
                    name="promotion"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Select a promotion plan" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Promotion</SelectItem>
                                <SelectItem value="basic">Basic (7 days)</SelectItem>
                                <SelectItem value="premium">Premium (30 days)</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
              </div>
              <div>
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                     <div className="flex items-start space-x-3">
                        <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} className="mt-1"/>
                        <div>
                            <Label htmlFor="terms">I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a></Label>
                            {form.formState.errors.terms && <p className="text-red-500 text-sm">{form.formState.errors.terms.message}</p>}
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
              <Button type="submit">Submit Ad</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
