
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, MessageSquare, User } from 'lucide-react';
import FeedbackCard from '@/components/account/FeedbackCard';

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


export default function FeedbackPage() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(mockReceivedFeedback);

  const averageRating = (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1);

  return (
    <div className="space-y-6">
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
    </div>
  );
}
