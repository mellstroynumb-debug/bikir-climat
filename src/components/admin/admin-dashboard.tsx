'use client';

import React, { useMemo, useState } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ProductDialog } from './product-dialog';
import { ProductTable } from './product-table';

export function AdminDashboard() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => collection(firestore, 'products'), [firestore]);
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

  if (isLoading) {
    return <div>Загрузка товаров...</div>;
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <Button onClick={handleAddNew}>Добавить товар</Button>
      </div>

      <ProductTable products={products || []} onEdit={handleEdit} />

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
      />
    </div>
  );
}
