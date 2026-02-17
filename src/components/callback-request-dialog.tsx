'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { CallbackRequestForm, type CallbackFormData } from './callback-request-form'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/store/useStore'
import { sendTelegramNotification } from '@/app/actions/telegram'
import { useState } from 'react'

interface CallbackRequestDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function CallbackRequestDialog({ isOpen, onOpenChange }: CallbackRequestDialogProps) {
  const { toast } = useToast()
  const { region } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async (formData: CallbackFormData) => {
    setIsSubmitting(true)
    try {
      const currency = region

      const newOrderData = {
        customer_name: formData.customerName,
        phone: formData.phone,
        address: 'Заявка на обратный звонок',
        items: [],
        total_price: 0,
        currency,
        status: 'new' as const,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderData),
      })
      const savedOrder = await res.json()

      await sendTelegramNotification(
        savedOrder.id,
        { ...newOrderData, createdAt: new Date().toISOString() },
        [],
        'callback'
      )

      toast({ title: 'Заявка принята!', description: 'Мы скоро с вами свяжемся.' })
      onOpenChange(false)
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error)
      toast({ title: 'Ошибка', description: 'Не удалось отправить заявку.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{'Заказать звонок'}</DialogTitle>
          <DialogDescription>
            {'Оставьте свои контакты, и наш менеджер перезвонит вам в ближайшее время для консультации.'}
          </DialogDescription>
        </DialogHeader>
        <CallbackRequestForm onSave={handleSave} onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}
