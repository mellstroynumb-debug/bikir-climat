'use client';

import React, { useState } from 'react';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ProductDialog } from './product-dialog';
import { ProductTable } from './product-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderTable } from './order-table';
import { useToast } from '@/hooks/use-toast';

export function AdminDashboard() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const productsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const { data: products, isLoading, error } = useCollection<Product>(productsCollection);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleSeedDatabase = () => {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "База данных не доступна.",
      });
      return;
    }
    
    import('@/lib/seed-data')
      .then(module => {
        const productsToSeed = module.productsToSeed;
        for (const product of productsToSeed) {
          const { id, ...productData } = product;
          const docRef = doc(firestore, 'products', id);
          setDocumentNonBlocking(docRef, productData);
        }
        toast({
          title: "Загрузка данных запущена",
          description: `${productsToSeed.length} товаров добавляются в базу данных.`,
        });
      })
      .catch(err => {
        console.error("Failed to load seed data", err);
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить тестовые данные.",
        });
      });
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <div className="flex gap-2">
            <Button onClick={handleSeedDatabase} variant="outline">Загрузить тестовые данные</Button>
            <Button onClick={handleAddNew}>Добавить товар</Button>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-6">
          <ProductTable products={products || []} onEdit={handleEdit} />
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
          <OrderTable />
        </TabsContent>
      </Tabs>

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
      />
    </div>
  );
}
