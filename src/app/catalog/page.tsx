'use client';

import ProductList from "@/components/product-list";
import type { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function CatalogPage() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => query(collection(firestore, 'products')), [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-16">
        <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Каталог товаров</h1>
            <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
                Все наши кондиционеры и услуги в одном месте.
            </p>
        </div>

        {isLoading && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        
        {products && <ProductList products={products} />}

        {!isLoading && (!products || products.length === 0) && (
            <p className="text-center text-muted-foreground">Товары пока не добавлены.</p>
        )}
      </div>
    </div>
  );
}
