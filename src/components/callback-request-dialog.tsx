'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CallbackRequestForm, type CallbackFormData } from './callback-request-form';
import { collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/store/useStore';
import { sendTelegramNotification } from '@/app/actions/telegram';
import { useState } from 'react';

interface CallbackRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CallbackRequestDialog({ isOpen, onOpenChange }: CallbackRequestDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { region } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: CallbackFormData) => {
    if (!firestore) {
        toast({ title: 'Ошибка', description: 'База данных не инициализирована.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
      const currency = region === 'PMR' ? 'PMR' : 'MD';
      
      const newOrderData = {
          ...formData,
          address: 'Заявка на обратный звонок', // Placeholder
          items: [],
          totalPrice: 0,
          currency: currency,
          status: 'new' as const,
          createdAt: serverTimestamp(),
      };

      const ordersCollection = collection(firestore, 'orders');
      const newOrderRef = await addDocumentNonBlocking(ordersCollection, newOrderData);

      const serializableOrderData = {
        ...newOrderData,
        createdAt: Timestamp.now().toJSON() 
      }

      await sendTelegramNotification(newOrderRef.id, serializableOrderData, [], 'callback');

      toast({ title: 'Заявка принята!', description: 'Мы скоро с вами свяжемся.' });
      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Заказать звонок</DialogTitle>
          <DialogDescription>
            Оставьте свои контакты, и наш менеджер перезвонит вам в ближайшее время для консультации.
          </DialogDescription>
        </DialogHeader>
        <CallbackRequestForm 
            onSave={handleSave} 
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
