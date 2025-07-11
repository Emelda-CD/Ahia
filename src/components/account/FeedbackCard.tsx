
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Star, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { format } from 'date-fns'

interface FeedbackCardProps {
    fromUser: string;
    rating: number;
    comment: string;
    date: Date;
    adTitle: string;
}

export default function FeedbackCard({ fromUser, rating, comment, date, adTitle }: FeedbackCardProps) {

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={`https://placehold.co/100x100.png?text=${fromUser.charAt(0)}`} data-ai-hint="person face" />
                            <AvatarFallback>{fromUser.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{fromUser}</p>
                            <p className="text-sm text-muted-foreground">Regarding: <span className="font-medium text-foreground">{adTitle}</span></p>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                         <p className="mt-1">{format(date, "PPP")}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground italic">"{comment}"</p>
            </CardContent>
        </Card>
    )
}
