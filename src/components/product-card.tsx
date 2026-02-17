'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Scale, Thermometer, Volume2, Wifi, Zap, Wind, Snowflake } from 'lucide-react'
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

/* helper: find spec value by key (partial match, case-insensitive) */
function getSpec(product: Product, keyword: string): string | undefined {
  const spec = product.specs?.find(
    (s) => s.name.toLowerCase().includes(keyword.toLowerCase())
  )
  return spec?.value
}

/* Extract area from spec like "25 (9)" -> "25" */
function extractArea(value: string): string {
  const match = value.match(/^(\d+)/)
  return match ? match[1] : value
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

  // Extract key specs for badges
  const areaRaw = getSpec(product, 'площадь')
  const area = areaRaw ? extractArea(areaRaw) : null
  const compressorType = getSpec(product, 'Тип компрессора')
  const noiseLevel = getSpec(product, 'Уровень шума') || getSpec(product, 'шума дБ')
  const noiseMin = noiseLevel ? noiseLevel.match(/(\d+)/)?.[1] : null
  const wifi = getSpec(product, 'Wi-Fi')
  const energyClass = getSpec(product, 'энергоэффективности') || getSpec(product, 'энергоэффект')
  const coolingPower = getSpec(product, 'охлаждение') || getSpec(product, 'Производительность (охлаждение)')
  const coolingKw = coolingPower ? coolingPower.match(/([\d.]+)/)?.[1] : null
  const tempRange = getSpec(product, 'обогреве')

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
      <div className="bg-card border rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg group">
        <Link href={`/catalog/${product.id}`} className="flex flex-col flex-grow">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full bg-muted/20">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-contain p-3"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">{'Нет фото'}</span>
              </div>
            )}

            {/* Hover actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/80 hover:bg-background shadow-sm transition-colors"
                onClick={handleFavoriteToggle}
              >
                <Heart className={cn('h-4 w-4', isFavorite(product.id) && 'fill-red-500 text-red-500')} />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/80 hover:bg-background shadow-sm transition-colors"
                onClick={handleCompareToggle}
              >
                <Scale className={cn('h-4 w-4', isCompared(product.id) && 'text-primary')} />
              </Button>
            </div>

            {/* Stock badge */}
            {product.stock_status ? (
              <Badge className="absolute top-2 left-2 text-[11px] px-2 py-0.5" variant="default">{'В наличии'}</Badge>
            ) : (
              <Badge className="absolute top-2 left-2 text-[11px] px-2 py-0.5" variant="destructive">{'Нет в наличии'}</Badge>
            )}
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Brand */}
            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{product.brand}</p>

            {/* Title */}
            <h3 className="mt-1 font-semibold text-sm leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>

            {/* Spec badges row */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {area && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <Wind className="h-3 w-3 shrink-0 text-primary" />
                  {'до '}{area}{' м\u00B2'}
                </span>
              )}
              {compressorType && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <Zap className="h-3 w-3 shrink-0 text-primary" />
                  {compressorType}
                </span>
              )}
              {energyClass && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <Snowflake className="h-3 w-3 shrink-0 text-primary" />
                  {energyClass}
                </span>
              )}
              {noiseMin && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <Volume2 className="h-3 w-3 shrink-0 text-primary" />
                  {noiseMin}{' дБ'}
                </span>
              )}
              {wifi === 'Да' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <Wifi className="h-3 w-3 shrink-0 text-primary" />
                  {'Wi-Fi'}
                </span>
              )}
              {coolingKw && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <Thermometer className="h-3 w-3 shrink-0 text-primary" />
                  {coolingKw}{' кВт'}
                </span>
              )}
            </div>

            <div className="flex-grow" />

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-xl font-extrabold text-primary">
                {new Intl.NumberFormat('ru-RU').format(price)} {currency}
              </p>
              {oldPrice && oldPrice > price && (
                <p className="text-sm font-medium text-muted-foreground line-through">
                  {new Intl.NumberFormat('ru-RU').format(oldPrice)} {currency}
                </p>
              )}
            </div>
          </div>
        </Link>

        {/* Actions */}
        <div className="p-3 pt-0">
          <div className="border-t pt-3 flex flex-col gap-1.5">
            <Button className="w-full" size="sm" onClick={handleAddToCart} disabled={!product.stock_status}>
              <ShoppingCart className="mr-1.5 h-4 w-4" />
              {'В корзину'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setIsQuickOrderOpen(true)}
              disabled={!product.stock_status}
            >
              {'Быстрый заказ'}
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
