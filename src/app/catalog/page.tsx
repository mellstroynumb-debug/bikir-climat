'use client';

import { useState, useMemo } from 'react';
import ProductList from "@/components/product-list";
import type { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';

export default function CatalogPage() {
  const firestore = useFirestore();
  const { region } = useStore();
  const productsCollection = useMemoFirebase(() => firestore ? query(collection(firestore, 'products')) : null, [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsCollection);

  const [sortOrder, setSortOrder] = useState('default');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const availableBrands = useMemo(() => {
    if (!products) return [];
    const brands = products.map(p => p.brand).filter(Boolean);
    return [...new Set(brands)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];
    
    // Price filter for current region
    filtered = filtered.filter(p => {
        const price = region === 'PMR' ? p.price_pmr : p.price_md;
        return price !== null && price > 0;
    });

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stockStatus);
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Sorting
    const getPrice = (p: Product) => region === 'PMR' ? p.price_pmr : p.price_md;
    
    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => (getPrice(a) ?? 0) - (getPrice(b) ?? 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (getPrice(b) ?? 0) - (getPrice(a) ?? 0));
        break;
      default:
        // You can add a default sort, e.g., by popularity or creation date if available
        break;
    }

    return filtered;
  }, [products, sortOrder, selectedBrands, inStockOnly, region]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-16">
        <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Каталог товаров</h1>
            <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
                Все наши кондиционеры и услуги в одном месте.
            </p>
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Фильтры</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="sort-order">Сортировка</Label>
                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                    <SelectTrigger id="sort-order" className="w-full mt-2">
                                        <SelectValue placeholder="По умолчанию" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">По умолчанию</SelectItem>
                                        <SelectItem value="price-asc">По возрастанию цены</SelectItem>
                                        <SelectItem value="price-desc">По убыванию цены</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <Separator />

                             {availableBrands.length > 0 && (
                                <div>
                                    <Label>Бренды</Label>
                                    <div className="space-y-2 mt-2">
                                        {availableBrands.map(brand => (
                                            <div key={brand} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`brand-${brand}`}
                                                    checked={selectedBrands.includes(brand)}
                                                    onCheckedChange={() => handleBrandChange(brand)}
                                                />
                                                <Label htmlFor={`brand-${brand}`} className="font-normal cursor-pointer">{brand}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             )}
                             
                            <Separator />

                            <div>
                               <div className="flex items-center justify-between">
                                 <Label htmlFor="in-stock">Только в наличии</Label>
                                 <Switch
                                    id="in-stock"
                                    checked={inStockOnly}
                                    onCheckedChange={setInStockOnly}
                                />
                               </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Product List */}
                <main className="lg:col-span-3">
                    {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 ? (
                        <ProductList products={filteredAndSortedProducts} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-secondary/30 rounded-lg py-20">
                            <p className="font-semibold text-lg">Товары не найдены</p>
                            <p className="text-muted-foreground text-sm mt-1">Попробуйте изменить или сбросить фильтры.</p>
                        </div>
                    )}
                </main>
            </div>
        )}

        {!isLoading && (!products || products.length === 0) && (
            <p className="text-center text-muted-foreground">Товары пока не добавлены.</p>
        )}
      </div>
    </div>
  );
}
