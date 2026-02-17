'use client'

import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, Trash2 } from 'lucide-react'
import type { Order } from '@/lib/types'
import * as api from '@/lib/api'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function OrderManager() {
  const { data: orders, mutate } = useSWR<Order[]>('/api/orders', fetcher)
  const { toast } = useToast()

  const markDone = async (id: string) => {
    try {
      await api.updateOrderStatus(id, 'done')
      toast({ title: 'Заказ выполнен' })
      mutate()
    } catch {
      toast({ variant: 'destructive', title: 'Ошибка' })
    }
  }

  const remove = async (id: string) => {
    try {
      await api.deleteOrder(id)
      toast({ title: 'Заказ удален' })
      mutate()
    } catch {
      toast({ variant: 'destructive', title: 'Ошибка' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заказы</CardTitle>
      </CardHeader>
      <CardContent>
        {!orders ? (
          <p className="text-muted-foreground">Загрузка...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground">Заказов пока нет.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{order.customer_name}</p>
                    <Badge variant={order.status === 'new' ? 'default' : 'secondary'}>
                      {order.status === 'new' ? 'Новый' : 'Выполнен'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {order.status === 'new' && (
                      <Button variant="ghost" size="icon" onClick={() => markDone(order.id)}>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => remove(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Тел: {order.phone} | Адрес: {order.address || '---'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Сумма: {order.total_price} {order.currency === 'PMR' ? 'руб.' : 'лей'}
                </p>
                {order.items && order.items.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Товары: {order.items.map(i => `${i.product_title || i.product_id} x${i.quantity}`).join(', ')}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString('ru')}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
