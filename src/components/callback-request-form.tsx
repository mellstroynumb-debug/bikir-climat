'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const callbackSchema = z.object({
  customerName: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().min(5, 'Введите корректный номер телефона'),
});

export type CallbackFormData = z.infer<typeof callbackSchema>;

interface CallbackRequestFormProps {
  onSave: (data: CallbackFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CallbackRequestForm({ onSave, onCancel, isSubmitting }: CallbackRequestFormProps) {
  const form = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      customerName: '',
      phone: '',
    },
  });

  const onSubmit = (data: CallbackFormData) => {
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ваше имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер телефона</FormLabel>
              <FormControl>
                <Input placeholder="+373 777 12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправляем...' : 'Отправить'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
