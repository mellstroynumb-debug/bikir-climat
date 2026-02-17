'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Ruler, RefreshCw, Heart, Scale } from 'lucide-react'
import { useState } from 'react'

import type { Product } from '@/lib/types'
import { useStore } from '@/store/useStore'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useToast } from '@/hooks/use-toast'
import { QuickOrderDialog } from './quick-order-dialog'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

/* helper: find spec value by key name */
function getSpecValue(product: Product, name: string): string | undefined {
  const spec = product.specs?.find(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  )
  return spec?.value
}

export function ProductCard({ product }: ProductCardProps) {
  const { region, addToCart, toggleFavorite, isFavorite, toggleCompare, isCompared } = useStore()
  const { toast } = useToast()
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)

  const price = region === 'PMR' ? product.price_pmr : product.price_md
  const oldPrice = region === 'PMR' ? product.old_price_pmr : product.old_price_md
  const currency = region === 'PMR' ? 'руб.' : 'лей'
  const mainImage = product.images?.[0]?.url

  if (price === null || price === 0) {
    return null
  }

  const areaSpec = getSpecValue(product, 'Площадь (м²)') || getSpecValue(product, 'area_sq_m')
  const inverterSpec = getSpecValue(product, 'Инвертор') || getSpecValue(product, 'inverter')

  const handleAddToCart = () => {
    addToCart(product)
    toast({ title: 'Товар добавлен в корзину', description: product.title })
  }

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product)
    toast({
      title: isFavorite(product.id) ? 'Удалено из избранного' : 'Добавлено в избранное',
      description: product.title,
    })
  }

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(product)
    toast({
      title: isCompared(product.id) ? 'Удалено из сравнения' : 'Добавлено к сравнению',
      description: product.title,
    })
  }

  return (
    <>
      <div className="bg-card border rounded-lg overflow-hidden shadow-sm h-full flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl group">
        <Link href={`/catalog/${product.id}`} className="flex flex-col flex-grow">
          <div className="relative aspect-square w-full">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-contain p-4"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">Нет фото</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/70 hover:bg-background transition-colors"
                onClick={handleFavoriteToggle}
              >
                <Heart className={cn('h-4 w-4', isFavorite(product.id) && 'fill-red-500 text-red-500')} />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/70 hover:bg-background transition-colors"
                onClick={handleCompareToggle}
              >
                <Scale className={cn('h-4 w-4', isCompared(product.id) && 'text-primary')} />
              </Button>
            </div>
            {product.stock_status ? (
              <Badge className="absolute top-3 left-3" variant="default">В наличии</Badge>
            ) : (
              <Badge className="absolute top-3 left-3" variant="destructive">Нет в наличии</Badge>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-base leading-tight h-10 group-hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>

            <div className="mt-2 flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {areaSpec && (
                <div className="flex items-center gap-1.5" title={`Рекомендуемая площадь: до ${areaSpec} м\u00B2`}>
                  <Ruler className="h-3.5 w-3.5" />
                  <span>до {areaSpec} м\u00B2</span>
                </div>
              )}
              {inverterSpec && (
                <div className="flex items-center gap-1.5" title={`Инвертор: ${inverterSpec}`}>
                  <RefreshCw className="h-3 w-3" />
                  <span>{inverterSpec === 'Да' ? 'Инвертор' : 'On/Off'}</span>
                </div>
              )}
            </div>

            <div className="flex-grow" />

            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-2xl font-extrabold text-primary">
                {new Intl.NumberFormat('ru-RU').format(price)} {currency}
              </p>
              {oldPrice && oldPrice > price && (
                <p className="text-base font-medium text-muted-foreground line-through">
                  {new Intl.NumberFormat('ru-RU').format(oldPrice)} {currency}
                </p>
              )}
            </div>
          </div>
        </Link>
        <div className="p-4 pt-0">
          <div className="border-t pt-4 space-y-2">
            <Button className="w-full" onClick={handleAddToCart} disabled={!product.stock_status}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              В корзину
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsQuickOrderOpen(true)}
              disabled={!product.stock_status}
            >
              Быстрый заказ
            </Button>
          </div>
        </div>
      </div>
      <QuickOrderDialog
        isOpen={isQuickOrderOpen}
        onOpenChange={setIsQuickOrderOpen}
        product={product}
      />
    </>
  )
}
