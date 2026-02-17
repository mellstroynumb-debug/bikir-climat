'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const orderSchema = z.object({
  customer_name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  phone: z.string().min(5, 'Введите корректный номер телефона'),
  address: z.string().min(5, 'Адрес должен содержать не менее 5 символов'),
})

type OrderFormData = z.infer<typeof orderSchema>

interface QuickOrderFormProps {
  onSave: (data: OrderFormData) => void
  onCancel: () => void
}

export function QuickOrderForm({ onSave, onCancel }: QuickOrderFormProps) {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { customer_name: '', phone: '', address: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 pt-2">
        <FormField control={form.control} name="customer_name" render={({ field }) => (
          <FormItem>
            <FormLabel>{'Ваше имя'}</FormLabel>
            <FormControl><Input placeholder="Иван" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel>{'Номер телефона'}</FormLabel>
            <FormControl><Input placeholder="+373 777 12345" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem>
            <FormLabel>{'Адрес доставки'}</FormLabel>
            <FormControl><Input placeholder="г. Тирасполь, ул. Ленина, 1" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>{'Отмена'}</Button>
          <Button type="submit">{'Заказать'}</Button>
        </div>
      </form>
    </Form>
  )
}
