'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useStore } from '@/store/useStore';
import type { Product } from '@/lib/types';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SearchDialog({ isOpen, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => firestore ? query(collection(firestore, 'products')) : null, [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const { region } = useStore();
  const currency = region === 'PMR' ? 'руб.' : 'лей';

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!products || !searchTerm) {
      return [];
    }
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      // Small delay to prevent search term from disappearing before navigation
      setTimeout(() => setSearchTerm(''), 150);
    }
  }, [isOpen]);

  const handleSelect = (path: string) => {
    router.push(path);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl gap-0 p-0">
        <div className="flex items-center px-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground"/>
          <Input
            type="text"
            placeholder="Поиск по названию товара..."
            className="w-full h-12 border-0 shadow-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="py-4 overflow-y-auto max-h-[70vh]">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin"/>
            </div>
          )}
          {!isLoading && searchTerm && filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground p-8">Ничего не найдено.</p>
          )}
          {!isLoading && !searchTerm && (
             <p className="text-center text-muted-foreground p-8">Начните вводить название товара.</p>
          )}
          
          <ul className="divide-y">
            {filteredProducts.map((product) => {
              const price = region === 'PMR' ? product.price_pmr : product.price_md;
              return (
                <li key={product.id}>
                    <button onClick={() => handleSelect(`/catalog/${product.id}`)} className="w-full text-left p-4 hover:bg-accent transition-colors flex items-center gap-4">
                        <Image
                            src={product.images[0]}
                            alt={product.title}
                            width={50}
                            height={50}
                            className="rounded-md object-cover border"
                        />
                        <div className="flex-1">
                            <p className="font-semibold">{product.title}</p>
                            {price && <p className="text-sm text-primary">{new Intl.NumberFormat('ru-RU').format(price)} {currency}</p>}
                        </div>
                    </button>
                </li>
              )
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
