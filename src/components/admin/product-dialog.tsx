'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductForm } from './product-form';
import type { Product } from '@/lib/types';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product | null;
}

export function ProductDialog({ isOpen, onOpenChange, product }: ProductDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSave = async (formData: Omit<Product, 'id'>) => {
    try {
      if (product) {
        // Update existing product
        const productRef = doc(firestore, 'products', product.id);
        await setDoc(productRef, formData, { merge: true });
        toast({ title: 'Товар успешно обновлен' });
      } else {
        // Add new product
        const productsCollection = collection(firestore, 'products');
        await addDoc(productsCollection, { ...formData, createdAt: serverTimestamp() });
        toast({ title: 'Товар успешно добавлен' });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка сохранения товара:", error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить товар.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Редактировать товар' : 'Добавить товар'}</DialogTitle>
        </DialogHeader>
        
        <ProductForm product={product} onSave={handleSave} onCancel={() => onOpenChange(false)} />

      </DialogContent>
    </Dialog>
  );
}
