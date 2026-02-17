'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'

function getFirstImageUrl(images: any): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) return null
  const first = images[0]
  if (typeof first === 'string') return first
  if (first?.url) return first.url
  return null
}

export default function CartPage() {
  const { cart, region, removeFromCart, increaseQuantity, decreaseQuantity, getCartTotal } = useStore()
  const currency = region === 'PMR' ? 'руб.' : 'лей'
  const total = getCartTotal()

  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  if (!isClient) return null

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">{'Ваша корзина пуста'}</h1>
        <p className="mt-2 text-muted-foreground">{'Самое время добавить что-нибудь.'}</p>
        <Button asChild className="mt-6"><Link href="/catalog">{'Перейти в каталог'}</Link></Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold font-sans mb-8">{'Корзина'}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                {cart.map((item) => {
                  const itemPrice = region === 'PMR' ? item.price_pmr : item.price_md
                  const imgSrc = getFirstImageUrl(item.images)
                  return (
                    <li key={item.id} className="flex items-center p-4 sm:p-6">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={item.title} width={100} height={100} className="rounded-md object-cover border" />
                      ) : (
                        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-md border bg-secondary" />
                      )}
                      <div className="ml-4 mr-auto">
                        <Link href={`/catalog/${item.id}`} className="font-semibold hover:text-primary">{item.title}</Link>
                        <p className="text-muted-foreground text-sm mt-1">
                          {itemPrice ? `${new Intl.NumberFormat('ru-RU').format(itemPrice)} ${currency}` : 'Цена не указана'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 ml-4">
                        <div className="flex items-center border rounded-md">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => decreaseQuantity(item.id)}><Minus className="h-4 w-4" /></Button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => increaseQuantity(item.id)}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>{'Сумма заказа'}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between"><span>{'Товары'}</span><span>{new Intl.NumberFormat('ru-RU').format(total)} {currency}</span></div>
                <div className="flex justify-between"><span>{'Доставка'}</span><span className="text-sm text-muted-foreground">{'Рассчитывается отдельно'}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>{'Итого'}</span><span>{new Intl.NumberFormat('ru-RU').format(total)} {currency}</span></div>
                <Button asChild size="lg" className="w-full mt-4"><Link href="/checkout">{'Перейти к оформлению'}</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
