
import { Suspense } from 'react';
import ListingsPageClient from './ListingsPageClient';
import { Loader2 } from 'lucide-react';

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <ListingsPageClient />
    </Suspense>
  );
}
