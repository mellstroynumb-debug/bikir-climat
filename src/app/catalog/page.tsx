import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CatalogContent from '@/components/catalog-content';

function CatalogFallback() {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogContent />
    </Suspense>
  );
}
