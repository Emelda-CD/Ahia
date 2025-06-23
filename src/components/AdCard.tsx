
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShieldCheck, CheckCircle, Flame } from 'lucide-react';
import type { Listing } from '@/lib/listings-data';

export default function AdCard(ad: Listing) {
  const { id, title, price, location, image, data_ai_hint, verifiedSeller, propertyVerified, rating, views, contacts } = ad;
  
  const isPopular = (views || 0) > 500 || (contacts || 0) > 50;

  return (
    <Link href={`/listings/${id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={data_ai_hint}
          />
           {isPopular && <Badge variant="destructive" className="absolute top-2 right-2"><Flame className="w-3 h-3 mr-1"/> Popular</Badge>}
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg leading-snug truncate mb-2">{title}</h3>
          
          <div className="flex-grow" />

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{location.town}, {location.lga}</span>
          </div>

          <p className="text-xl font-bold text-primary mb-3">
             {typeof price === 'number' ? `₦${price.toLocaleString()}` : price}
          </p>

          <div className="flex flex-wrap gap-2 items-center text-xs">
            {verifiedSeller && <Badge variant="secondary" className="bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1" /> Seller Verified</Badge>}
            {propertyVerified && <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Property Verified</Badge>}
            {rating && rating >= 4 && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Star className="w-3 h-3 mr-1" /> {rating.toFixed(1)} Stars</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
