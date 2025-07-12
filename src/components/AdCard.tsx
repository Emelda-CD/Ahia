
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ShieldCheck } from 'lucide-react';
import type { Ad } from '@/lib/listings-data';
import { formatPrice } from '@/lib/formatPrice';

export default function AdCard(ad: Ad) {
  const { id, title, price, location, image, data_ai_hint, verified } = ad;
  
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
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="font-semibold text-lg leading-snug truncate mb-2">{title}</h3>
          
          <div className="flex-grow" />

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span>{location}</span>
          </div>

          <p className="text-xl font-bold text-primary mb-3">
             {formatPrice(price)}
          </p>

          <div className="flex flex-wrap gap-2 items-center text-xs">
            {verified && <Badge variant="secondary" className="bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
