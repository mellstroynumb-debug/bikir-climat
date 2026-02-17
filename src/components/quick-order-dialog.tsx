'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { QuickOrderForm } from './quick-order-form'
import type { Product, Order } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/store/useStore'
import { sendTelegramNotification } from '@/app/actions/telegram'

interface QuickOrderDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  product: Product
}

export function QuickOrderDialog({ isOpen, onOpenChange, product }: QuickOrderDialogProps) {
  const { toast } = useToast()
  const { region } = useStore()

  const handleSave = async (formData: Pick<Order, 'customer_name' | 'phone' | 'address'>) => {
    try {
      const price = region === 'PMR' ? product.price_pmr : product.price_md
      const currency = region

      if (price === null || price === undefined) {
        toast({ title: 'Ошибка', description: 'Цена для этого региона не указана.', variant: 'destructive' })
        return
      }

      const newOrder = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        items: [{
          id: crypto.randomUUID(),
          order_id: '',
          product_id: product.id,
          product_title: product.title,
          quantity: 1,
          price,
        }],
        total_price: price,
        currency,
        status: 'new' as const,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      })
      const savedOrder = await res.json()

      await sendTelegramNotification(
        savedOrder.id,
        { ...newOrder, createdAt: new Date().toISOString() },
        [{ title: product.title, quantity: 1 }],
        'quick'
      )

      toast({ title: 'Заказ успешно оформлен!', description: 'Мы скоро с вами свяжемся.' })
      onOpenChange(false)
    } catch (error) {
      console.error('Ошибка оформления заказа:', error)
      toast({ title: 'Ошибка', description: 'Не удалось оформить заказ.', variant: 'destructive' })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{'Быстрый заказ'}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          {'Вы заказываете: '}<span className="font-semibold text-foreground">{product.title}</span>{'. Просто оставьте свои контакты, и мы вам перезвоним.'}
        </p>
        <QuickOrderForm onSave={handleSave} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
