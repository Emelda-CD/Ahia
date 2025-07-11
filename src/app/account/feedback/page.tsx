
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2 } from 'lucide-react';
import { submitFeedback } from '@/lib/firebase/actions';

const feedbackSchema = z.object({
  rating: z.string().nonempty({ message: 'Please select a rating.' }),
  comment: z.string().min(10, { message: 'Please provide at least 10 characters of feedback.' }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitFeedback({
        userId: user.uid,
        rating: parseInt(data.rating, 10),
        comment: data.comment,
      });
      toast({
        title: 'Feedback Submitted!',
        description: 'Thank you for helping us improve Ahia.',
        className: 'bg-green-100 text-green-800'
      });
      form.reset();
      setSelectedRating(0);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not submit your feedback. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Feedback</h1>
      <p className="text-muted-foreground">We value your opinion. Let us know how we can improve.</p>

      <Card>
        <CardHeader>
          <CardTitle>Share Your Experience</CardTitle>
          <CardDescription>Your feedback is vital for us to make Ahia better for everyone.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>How would you rate your experience?</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      rating <= (hoverRating || selectedRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onMouseEnter={() => setHoverRating(rating)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      setSelectedRating(rating);
                      form.setValue('rating', String(rating), { shouldValidate: true });
                    }}
                  />
                ))}
              </div>
               <input type="hidden" {...form.register('rating')} />
               {form.formState.errors.rating && <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">What can we improve?</Label>
              <Textarea
                id="comment"
                placeholder="Tell us about your experience, what you liked, or what went wrong."
                rows={6}
                {...form.register('comment')}
              />
              {form.formState.errors.comment && <p className="text-sm text-destructive">{form.formState.errors.comment.message}</p>}
            </div>
            
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Feedback
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
