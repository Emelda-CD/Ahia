import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck } from 'lucide-react';
import type { Ad } from '@/lib/listings-data';

export default function AdCardListItem(ad: Ad) {
  const { id, title, price, location, image, data_ai_hint, verified, description } = ad;

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
        </div>
        <CardContent className="p-4 flex flex-col justify-between w-full">
            <div>
              <h3 className="font-semibold text-lg leading-snug mb-1 group-hover:text-primary">{title}</h3>
               <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>{location}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description || ''}</p>
            </div>
          
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-auto">
                <div className="flex flex-wrap gap-2 items-center text-xs">
                    {verified && <Badge variant="secondary" className="bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>}
                </div>
                <p className="text-xl font-bold text-primary whitespace-nowrap">
                    {`₦${price.toLocaleString()}`}
                </p>
            </div>
        </CardContent>
      </Card>
    </Link>
  );
}
