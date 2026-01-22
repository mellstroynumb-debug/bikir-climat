'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './product-form';
import type { Product } from '@/lib/types';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product | null;
}

export function ProductDialog({ isOpen, onOpenChange, product }: ProductDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSave = (formData: any) => {
    if (!firestore) {
        toast({ title: "Ошибка", description: "База данных не инициализирована.", variant: "destructive"});
        return;
    }

    const { id: customId, ...productData } = formData;

    if (product) {
      // Update existing product
      const productRef = doc(firestore, 'products', product.id);
      setDocumentNonBlocking(productRef, productData, { merge: true });
      toast({ title: 'Товар успешно обновлен' });
    } else {
      // Add new product
      if (customId && customId.trim() !== '') {
         const productRef = doc(firestore, 'products', customId);
         setDocumentNonBlocking(productRef, { ...productData, createdAt: serverTimestamp() });
         toast({ title: 'Товар успешно добавлен' });
      } else {
         const productsCollection = collection(firestore, 'products');
         addDocumentNonBlocking(productsCollection, { ...productData, createdAt: serverTimestamp() });
         toast({ title: 'Товар успешно добавлен' });
      }
    }
    onOpenChange(false);
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
