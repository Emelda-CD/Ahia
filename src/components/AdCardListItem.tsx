
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShieldCheck, CheckCircle, Flame, BadgeCheck } from 'lucide-react';
import type { Listing } from '@/lib/listings-data';

export default function AdCardListItem(ad: Listing) {
  const { id, title, price, location, image, data_ai_hint, verifiedSeller, propertyVerified, verifiedID, rating, views, contacts, description } = ad;

  const isPopular = (views || 0) > 500 || (contacts || 0) > 50;

  return (
    <Link href={`/listings/${id}`} className="group">
      <Card className="overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg hover:bg-muted/50">
        <div className="relative w-full md:w-60 h-48 md:h-auto flex-shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            data-ai-hint={data_ai_hint}
          />
           {isPopular && <Badge variant="destructive" className="absolute top-2 right-2"><Flame className="w-3 h-3 mr-1"/> Popular</Badge>}
        </div>
        <CardContent className="p-4 flex flex-col justify-between w-full">
            <div>
              <h3 className="font-semibold text-lg leading-snug mb-1 group-hover:text-primary">{title}</h3>
               <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>{location.town}, {location.lga}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description || ''}</p>
            </div>
          
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-auto">
                <div className="flex flex-wrap gap-2 items-center text-xs">
                    {verifiedSeller && <Badge variant="secondary" className="bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1" /> Seller Verified</Badge>}
                    {propertyVerified && <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Property Verified</Badge>}
                    {verifiedID && <Badge variant="secondary" className="bg-purple-100 text-purple-800"><BadgeCheck className="w-3 h-3 mr-1" /> ID Verified</Badge>}
                    {rating && rating >= 4 && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Star className="w-3 h-3 mr-1" /> {rating.toFixed(1)} Stars</Badge>}
                </div>
                <p className="text-xl font-bold text-primary whitespace-nowrap">
                    {typeof price === 'number' ? `₦${price.toLocaleString()}` : price}
                </p>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}
