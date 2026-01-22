'use client';

import { useParams } from 'next/navigation';
import { doc, collection, query } from 'firebase/firestore';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { QuickOrderDialog } from '@/components/quick-order-dialog';
import { useState, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProductList from '@/components/product-list';

const specLabels: Record<string, string> = {
  inverter: 'Инвертор',
  power_btu: 'Мощность (BTU)',
  area_sq_m: 'Площадь (м²)',
  brand: 'Бренд',
  compressor_type: 'Тип компрессора',
  // Add other known keys here for user-friendly display
};


export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const productRef = useMemoFirebase(() => firestore && id ? doc(firestore, 'products', id) : null, [firestore, id]);
  const { data: product, isLoading } = useDoc<Product>(productRef);

  const productsCollection = useMemoFirebase(() => firestore ? query(collection(firestore, 'products')) : null, [firestore]);
  const { data: allProducts } = useCollection<Product>(productsCollection);

  const { region, addToCart } = useStore();
  const { toast } = useToast();
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  const similarProducts = useMemo(() => {
    if (!product || !allProducts) return [];

    const currentArea = Number(product.specs.area_sq_m) || 0;
    const currentPrice = region === 'PMR' ? product.price_pmr : product.price_md;

    if (!currentPrice) return []; // Don't show similar if current product has no price for the region

    return allProducts
      .filter(p => 
        p.id !== product.id && 
        (region === 'PMR' ? p.price_pmr : p.price_md)
      ) // Exclude self & products not priced for the region
      .sort((a, b) => {
        const areaA = Number(a.specs.area_sq_m) || 0;
        const areaB = Number(b.specs.area_sq_m) || 0;
        const priceA = region === 'PMR' ? a.price_pmr : a.price_md;
        const priceB = region === 'PMR' ? b.price_pmr : b.price_md;
        
        const areaDiffA = Math.abs(areaA - currentArea);
        const areaDiffB = Math.abs(areaB - currentArea);
        
        if (areaDiffA !== areaDiffB) {
            return areaDiffA - areaDiffB;
        }

        const priceDiffA = Math.abs((priceA || 0) - (currentPrice || 0));
        const priceDiffB = Math.abs((priceB || 0) - (currentPrice || 0));
        
        return priceDiffA - priceDiffB;
      })
      .slice(0, 4);

  }, [product, allProducts, region]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Товар не найден</h1>
        <p className="text-muted-foreground">Возможно, он был удален или ссылка неверна.</p>
      </div>
    );
  }

  const price = region === 'PMR' ? product.price_pmr : product.price_md;
  const oldPrice = region === 'PMR' ? product.old_price_pmr : product.old_price_md;
  const currency = region === 'PMR' ? 'руб.' : 'лей';

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Товар добавлен в корзину",
      description: product.title,
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="w-full">
             <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden">
                      <div className="aspect-square relative">
                        <Image
                          src={img}
                          alt={`${product.title} - изображение ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold font-headline">{product.title}</h1>
            
            <div className="mt-2">
              {product.stockStatus ? (
                <Badge variant="default">В наличии</Badge>
              ) : (
                <Badge variant="destructive">Нет в наличии</Badge>
              )}
            </div>

            <div className="mt-4">
              {oldPrice && (
                <span className="text-xl text-muted-foreground line-through mr-2">
                  {new Intl.NumberFormat('ru-RU').format(oldPrice)} {currency}
                </span>
              )}
              {price && (
                 <span className="text-3xl font-extrabold text-primary">
                    {new Intl.NumberFormat('ru-RU').format(price)} {currency}
                 </span>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t space-y-3">
              <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!product.stockStatus}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Добавить в корзину
              </Button>
              <Button size="lg" variant="secondary" className="w-full" onClick={() => setIsQuickOrderOpen(true)} disabled={!product.stockStatus}>
                Быстрый заказ
              </Button>
            </div>
          </div>
        </div>

        {/* Description and Specs */}
        <div className="mt-12 md:mt-16">
          <Tabs defaultValue="specs">
            <TabsList>
              <TabsTrigger value="specs">Характеристики</TabsTrigger>
              {product.description && <TabsTrigger value="description">Описание</TabsTrigger>}
            </TabsList>
            <TabsContent value="specs" className="pt-6">
              <Card>
                <div className="divide-y">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-4 px-6 py-3">
                      <dt className="text-sm font-medium text-muted-foreground">{specLabels[key] || key}</dt>
                      <dd className="text-sm font-semibold">{String(value)}</dd>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
            {product.description && (
              <TabsContent value="description" className="pt-6">
                 <Card className="p-6">
                    <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
                 </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8">Похожие товары</h2>
            <ProductList products={similarProducts} />
          </div>
        )}

      </div>
      <QuickOrderDialog
        isOpen={isQuickOrderOpen}
        onOpenChange={setIsQuickOrderOpen}
        product={product}
      />
    </>
  );
}
