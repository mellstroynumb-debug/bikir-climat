'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuickOrderForm } from './quick-order-form';
import type { Product, Order } from '@/lib/types';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import { sendTelegramNotification } from '@/app/actions/telegram';

interface QuickOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  product: Product;
}

export function QuickOrderDialog({ isOpen, onOpenChange, product }: QuickOrderDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { region } = useStore();

  const handleSave = async (formData: Pick<Order, 'customerName' | 'phone' | 'address'>) => {
    try {
      const price = region === 'PMR' ? product.price_pmr : product.price_md;
      const currency = region === 'PMR' ? 'PMR' : 'MD';

      if (price === null || price === undefined) {
          toast({ title: 'Ошибка', description: 'Цена для этого региона не указана.', variant: 'destructive' });
          return;
      }
      
      const newOrderData = {
          ...formData,
          items: [product.id],
          totalPrice: price,
          currency: currency,
          status: 'new' as const,
          createdAt: serverTimestamp(),
      };

      const ordersCollection = collection(firestore, 'orders');
      const newOrderRef = await addDoc(ordersCollection, newOrderData);

      // We need to pass a serializable version of the order to the server action.
      // The `serverTimestamp` is not serializable until it's written and read back.
      // So we'll pass the plain data and let the action know what happened.
      const serializableOrderData = {
        ...newOrderData,
        createdAt: Timestamp.now().toJSON() // Send a serializable timestamp
      }

      await sendTelegramNotification(newOrderRef.id, serializableOrderData, [{ title: product.title, quantity: 1 }], 'quick');

      toast({ title: 'Заказ успешно оформлен!', description: 'Мы скоро с вами свяжемся.' });
      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось оформить заказ.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Быстрый заказ</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
            Вы заказываете: <span className="font-semibold text-foreground">{product.title}</span>. 
            Просто оставьте свои контакты, и мы вам перезвоним.
        </p>
        <QuickOrderForm onSave={handleSave} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
