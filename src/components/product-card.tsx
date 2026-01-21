'use client';

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import type { Product } from '@/lib/types';
import { useStore } from '@/store/useStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { QuickOrderDialog } from './quick-order-dialog';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { region, addToCart } = useStore();
  const { toast } = useToast();
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  const price = region === 'PMR' ? product.price_pmr : product.price_md;
  const currency = region === 'PMR' ? 'руб.' : 'лей';

  if (price === null || price === 0) {
    return null; // Don't render card if not available in region
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Товар добавлен в корзину",
      description: product.title,
    });
  };

  return (
    <>
      <div
        className="bg-card border rounded-lg overflow-hidden shadow-sm h-full flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl"
      >
        <div className="relative aspect-square w-full">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
          {product.category === 'cond' && (
            <Badge className="absolute top-3 right-3">Эстетичный монтаж</Badge>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg font-headline truncate">{product.title}</h3>
          <p className="text-muted-foreground text-sm mt-1 flex-grow">{product.description}</p>
          
          <div className="mt-4">
              <p className="text-2xl font-extrabold text-primary">
                  {new Intl.NumberFormat('ru-RU').format(price)} {currency}
              </p>
          </div>

          <div className="mt-4 pt-4 border-t space-y-2">
              <Button className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4"/>
                  В корзину
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => setIsQuickOrderOpen(true)}>
                  Быстрый заказ
              </Button>
          </div>
        </div>
      </div>
      <QuickOrderDialog 
        isOpen={isQuickOrderOpen}
        onOpenChange={setIsQuickOrderOpen}
        product={product}
      />
    </>
  );
}
