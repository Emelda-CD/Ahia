
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import FeedbackCard from '@/components/account/FeedbackCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitFeedback } from '@/lib/firebase/actions';
import { useToast } from '@/hooks/use-toast';


// Mock data for received feedback - in a real app, this would be fetched from Firestore
const mockReceivedFeedback = [
  {
    id: '1',
    fromUser: 'Chinedu O.',
    rating: 5,
    comment: 'Great seller! The Toyota Camry was exactly as described. Very smooth transaction.',
    date: new Date('2024-07-20T10:00:00Z'),
    adTitle: 'Clean Toyota Camry 2019'
  },
  {
    id: '2',
    fromUser: 'Nkechi E.',
    rating: 4,
    comment: 'The iPhone was in good condition, but communication could have been a bit faster. Overall, a positive experience.',
    date: new Date('2024-07-18T15:30:00Z'),
    adTitle: 'Slightly Used iPhone 14'
  },
  {
    id: '3',
    fromUser: 'Samuel A.',
    rating: 5,
    comment: 'Excellent service. Very helpful and patient during the inspection. Highly recommend this seller!',
    date: new Date('2024-07-15T09:00:00Z'),
    adTitle: 'Honda CR-V 2018'
  }
];

const feedbackFormSchema = z.object({
  type: z.string().min(1, { message: 'Please select a feedback type.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function FeedbackPage() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(mockReceivedFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
  });

  const averageRating = (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1);

  const onInternalFeedbackSubmit = async (data: FeedbackFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitFeedback({
        userId: user.uid,
        rating: 0, // Not applicable for internal feedback
        comment: `Type: ${data.type}\nMessage: ${data.message}`,
      });
      toast({
        title: 'Feedback Sent!',
        description: "Thank you for helping us improve Ahia.",
      });
      form.reset();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not send your feedback. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Feedback</h1>
        <p className="text-muted-foreground">See what buyers are saying about you and your items.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Seller Rating</CardTitle>
          <CardDescription>This is your average rating based on all feedback received.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
            <div className="flex items-center text-4xl font-bold">
                {averageRating}
                <Star className="w-8 h-8 ml-2 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-muted-foreground">from {feedback.length} review{feedback.length !== 1 && 's'}</p>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Reviews</h2>
        {feedback.length > 0 ? (
            feedback.map(item => <FeedbackCard key={item.id} {...item} />)
        ) : (
            <Card>
                <CardContent className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No feedback yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">When buyers leave feedback, it will appear here.</p>
                </CardContent>
            </Card>
        )}
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Private Feedback to Ahia Team</CardTitle>
          <CardDescription>Have a suggestion or a bug to report? Let us know!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onInternalFeedbackSubmit)} className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="type">Feedback Type</Label>
                <Select onValueChange={(value) => form.setValue('type', value)} value={form.watch('type')}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="bug_report">Bug Report</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="praise">Praise</SelectItem>
                  </SelectContent>
                </Select>
                 {form.formState.errors.type && <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" {...form.register('message')} placeholder="Tell us more..." />
                 {form.formState.errors.message && <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>}
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit Feedback
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
