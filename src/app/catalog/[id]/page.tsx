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
import { ShoppingCart, Loader2, Wrench, Heart, Scale } from 'lucide-react';
import { QuickOrderDialog } from '@/components/quick-order-dialog';
import { useState, useMemo, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProductList from '@/components/product-list';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const specLabels: Record<string, string> = {
  inverter: 'Инвертор',
  power_btu: 'Мощность (BTU)',
  area_sq_m: 'Площадь (м²)',
  brand: 'Бренд',
  cooling_power_w: 'Мощность охлаждения (Вт)',
  heating_power_w: 'Мощность обогрева (Вт)',
  energy_class: 'Класс энергоэффективности',
  noise_indoor_db: 'Уровень шума (вн. блок, дБ)',
  refrigerant: 'Тип хладагента',
  wifi: 'Подключение к Wi-Fi',
  features: 'Дополнительные функции',
  heating_min_temp: 'Мин. t для обогрева (°С)',
};


export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();
  const productRef = useMemoFirebase(() => firestore && id ? doc(firestore, 'products', id) : null, [firestore, id]);
  const { data: product, isLoading } = useDoc<Product>(productRef);

  const productsCollection = useMemoFirebase(() => firestore ? query(collection(firestore, 'products')) : null, [firestore]);
  const { data: allProducts } = useCollection<Product>(productsCollection);
  
  // Fetch the installation service
  const installationServiceRef = useMemoFirebase(() => firestore ? doc(firestore, 'products', 'service-aesthetic-montaj') : null, [firestore]);
  const { data: installationService, isLoading: isServiceLoading } = useDoc<Product>(installationServiceRef);


  const { region, addToCart, toggleFavorite, isFavorite, toggleCompare, isCompared } = useStore();
  const { toast } = useToast();
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [addInstallation, setAddInstallation] = useState(false);

  // State for Carousel API
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index, false); // false for instant scroll
  }

  const similarProducts = useMemo(() => {
    if (!product || !allProducts) return [];

    const currentArea = Number(product.specs.area_sq_m) || 0;
    const currentPrice = region === 'PMR' ? product.price_pmr : product.price_md;

    if (!currentPrice) return []; // Don't show similar if current product has no price for the region

    return allProducts
      .filter(p => 
        p.id !== product.id && 
        p.category === 'cond' && // Only show other conditioners
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

  if (isLoading || isServiceLoading) {
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

  const installationPrice = installationService ? (region === 'PMR' ? installationService.price_pmr : installationService.price_md) : null;


  const handleAddToCart = () => {
    addToCart(product);
    let toastMessage = product.title;
    if (addInstallation && installationService) {
        addToCart(installationService);
        toastMessage += ` + ${installationService.title}`;
    }
    toast({
      title: "Добавлено в корзину",
      description: toastMessage,
    });
  };

  const handleFavoriteToggle = () => {
    if (!product) return;
    toggleFavorite(product);
    toast({ title: isFavorite(product.id) ? 'Удалено из избранного' : 'Добавлено в избранное', description: product.title });
  }

  const handleCompareToggle = () => {
      if (!product) return;
      toggleCompare(product);
      toast({ title: isCompared(product.id) ? 'Удалено из сравнения' : 'Добавлено к сравнению', description: product.title });
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="w-full flex flex-col gap-4">
             <Carousel className="w-full" setApi={setApi}>
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
            
             {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                  {product.images.map((img, index) => (
                      <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={cn(
                              "aspect-square relative rounded-md overflow-hidden border-2 transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                              index === current ? "border-primary" : "border-transparent"
                          )}
                          aria-label={`Переключить на изображение ${index + 1}`}
                      >
                          <Image
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 20vw, 10vw"
                          />
                      </button>
                  ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold font-headline mt-1">{product.title}</h1>
            
            <div className="mt-2">
              {product.stockStatus ? (
                <Badge variant="default">В наличии</Badge>
              ) : (
                <Badge variant="destructive">Нет в наличии</Badge>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {price && (
                 <span className="text-3xl font-extrabold text-primary">
                    {new Intl.NumberFormat('ru-RU').format(price)} {currency}
                 </span>
              )}
              {oldPrice && price && oldPrice > price && (
                <span className="text-xl text-muted-foreground line-through">
                  {new Intl.NumberFormat('ru-RU').format(oldPrice)} {currency}
                </span>
              )}
            </div>

            {product.category === 'cond' && installationService && installationPrice && (
                 <div className="mt-6 border-t pt-6">
                    <div className="flex items-center space-x-3 rounded-lg border p-4">
                        <Checkbox id="installation" checked={addInstallation} onCheckedChange={(checked) => setAddInstallation(checked as boolean)} />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="installation" className="font-semibold cursor-pointer flex items-center">
                                <Wrench className="h-4 w-4 mr-2" />
                                {installationService.title}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                               {installationService.description}
                            </p>
                        </div>
                        <p className="font-semibold text-primary whitespace-nowrap ml-auto">
                            + {new Intl.NumberFormat('ru-RU').format(installationPrice)} {currency}
                        </p>
                    </div>
                </div>
            )}
            
            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                  <Button size="lg" onClick={handleAddToCart} disabled={!product.stockStatus}>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Добавить в корзину
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleFavoriteToggle} aria-label="Добавить в избранное" className="transition-colors hover:bg-red-50 hover:text-red-500">
                      <Heart className={cn("h-5 w-5", isFavorite(product.id) && "fill-red-500 text-red-500")} />
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleCompareToggle} aria-label="Добавить к сравнению" className="transition-colors hover:bg-blue-50 hover:text-blue-600">
                      <Scale className={cn("h-5 w-5", isCompared(product.id) && "text-primary")} />
                  </Button>
              </div>
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
                   <div className="grid grid-cols-2 gap-4 px-6 py-3">
                      <dt className="text-sm font-medium text-muted-foreground">Бренд</dt>
                      <dd className="text-sm font-semibold">{String(product.brand)}</dd>
                    </div>
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
