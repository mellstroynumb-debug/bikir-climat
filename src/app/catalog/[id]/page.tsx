'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type { Product, SpecGroup } from '@/lib/types'
import Image from 'next/image'
import { useStore } from '@/store/useStore'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Loader2, Heart, Scale, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { QuickOrderDialog } from '@/components/quick-order-dialog'
import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import ProductList from '@/components/product-list'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json())

/* ── Fullscreen Lightbox ── */
function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: { id: string; url: string; sort_order: number }[]
  initialIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(initialIndex)

  const goPrev = useCallback(() => {
    setCurrent((c) => (c > 0 ? c - 1 : images.length - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    setCurrent((c) => (c < images.length - 1 ? c + 1 : 0))
  }, [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [onClose, goPrev, goNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/20 text-background hover:bg-foreground/40 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-foreground/20 text-background hover:bg-foreground/40 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative h-[80vh] w-[90vw] max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[current].url}
          alt={`Image ${current + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-foreground/20 text-background hover:bg-foreground/40 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-foreground/20 px-4 py-1.5 text-sm text-background">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string

  const { data: product, isLoading } = useSWR<Product>(id ? `/api/products/${id}` : null, fetcher)
  const { data: allProducts } = useSWR<Product[]>('/api/products', fetcher)
  const { data: specGroups } = useSWR<SpecGroup[]>('/api/spec-groups', fetcher)

  const { region, addToCart, toggleFavorite, isFavorite, toggleCompare, isCompared } = useStore()
  const { toast } = useToast()
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index, false)
  }

  const groupedSpecs = useMemo(() => {
    if (!product || !specGroups) return []
    const groups = specGroups
      .map(g => ({
        ...g,
        specs: product.specs
          .filter(s => s.group_id === g.id)
          .sort((a, b) => a.sort_order - b.sort_order),
      }))
      .filter(g => g.specs.length > 0)
    return groups
  }, [product, specGroups])

  const similarProducts = useMemo(() => {
    if (!product || !allProducts) return []
    return allProducts
      .filter(p => p.id !== product.id && p.category_id === product.category_id)
      .slice(0, 4)
  }, [product, allProducts])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">{'Товар не найден'}</h1>
        <p className="text-muted-foreground">{'Возможно, он был удален или ссылка неверна.'}</p>
      </div>
    )
  }

  const price = region === 'PMR' ? product.price_pmr : product.price_md
  const oldPrice = region === 'PMR' ? product.old_price_pmr : product.old_price_md
  const currency = region === 'PMR' ? 'руб.' : 'лей'

  const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order)

  const handleAddToCart = () => {
    addToCart(product)
    toast({ title: 'Добавлено в корзину', description: product.title })
  }

  const handleFavoriteToggle = () => {
    toggleFavorite(product)
    toast({
      title: isFavorite(product.id) ? 'Удалено из избранного' : 'Добавлено в избранное',
      description: product.title,
    })
  }

  const handleCompareToggle = () => {
    toggleCompare(product)
    toast({
      title: isCompared(product.id) ? 'Удалено из сравнения' : 'Добавлено к сравнению',
      description: product.title,
    })
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 min-w-0">
          {/* Image Gallery -- smaller container */}
          <div className="w-full min-w-0 max-w-md mx-auto md:max-w-none flex flex-col gap-3">
            <Carousel className="w-full min-w-0" setApi={setApi}>
              <CarouselContent>
                {sortedImages.map((img, index) => (
                  <CarouselItem key={img.id}>
                    <div
                      className="aspect-[4/3] relative bg-muted/30 rounded-lg overflow-hidden cursor-zoom-in group"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.title} - ${index + 1}`}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="h-5 w-5 text-foreground/70" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Arrows inside the carousel, responsive positioning */}
              {sortedImages.length > 1 && (
                <>
                  <button
                    onClick={() => api?.scrollPrev()}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border bg-background/80 shadow-sm hover:bg-background transition-colors disabled:opacity-50"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => api?.scrollNext()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border bg-background/80 shadow-sm hover:bg-background transition-colors disabled:opacity-50"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </Carousel>

            {sortedImages.length > 1 && (
              <div className="w-full min-w-0 overflow-x-auto scrollbar-hide md:overflow-x-visible">
                <div className="flex gap-1.5 w-max md:w-full md:grid md:grid-cols-5">
                  {sortedImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => handleThumbnailClick(index)}
                      className={cn(
                        'relative rounded-md overflow-hidden border-2 transition flex-shrink-0 w-14 h-14 md:w-auto md:h-auto md:aspect-square focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        index === current ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                      )}
                      aria-label={`Switch to image ${index + 1}`}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 56px, 8vw"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold font-sans mt-1 text-balance">{product.title}</h1>

            <div className="mt-2">
              {product.stock_status ? (
                <Badge variant="default">{'В наличии'}</Badge>
              ) : (
                <Badge variant="destructive">{'Нет в наличии'}</Badge>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {price ? (
                <span className="text-3xl font-extrabold text-primary">
                  {new Intl.NumberFormat('ru-RU').format(price)} {currency}
                </span>
              ) : null}
              {oldPrice && price && oldPrice > price ? (
                <span className="text-xl text-muted-foreground line-through">
                  {new Intl.NumberFormat('ru-RU').format(oldPrice)} {currency}
                </span>
              ) : null}
            </div>

            <div className="mt-4 pt-4 border-t space-y-2 sm:mt-6 sm:pt-6 sm:space-y-3">
              <div className="flex gap-2">
                <Button size="default" className="flex-1 sm:flex-none sm:flex-grow" onClick={handleAddToCart} disabled={!product.stock_status}>
                  <ShoppingCart className="mr-1.5 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">{'В корзину'}</span>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleFavoriteToggle}
                  aria-label="Add to favorites"
                  className="h-10 w-10 flex-shrink-0 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Heart className={cn('h-4 w-4', isFavorite(product.id) && 'fill-red-500 text-red-500')} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCompareToggle}
                  aria-label="Add to compare"
                  className="h-10 w-10 flex-shrink-0 transition-colors hover:bg-blue-50 hover:text-blue-600"
                >
                  <Scale className={cn('h-4 w-4', isCompared(product.id) && 'text-primary')} />
                </Button>
              </div>
              <Button
                size="default"
                variant="secondary"
                className="w-full"
                onClick={() => setIsQuickOrderOpen(true)}
                disabled={!product.stock_status}
              >
                <span className="text-sm sm:text-base">{'Быстрый заказ'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Description and Specs */}
        <div className="mt-12 md:mt-16">
          <Tabs defaultValue="specs">
            <TabsList>
              <TabsTrigger value="specs">{'Характеристики'}</TabsTrigger>
              {product.description && <TabsTrigger value="description">{'Описание'}</TabsTrigger>}
            </TabsList>
            <TabsContent value="specs" className="pt-6">
              {groupedSpecs.length > 0 ? (
                <div className="space-y-6">
                  {groupedSpecs.map(group => (
                    <Card key={group.id}>
                      <div className="px-6 py-3 bg-muted/50 border-b">
                        <h3 className="font-semibold">{group.name}</h3>
                      </div>
                      <div className="divide-y">
                        {group.specs.map(spec => (
                          <div key={spec.id} className="grid grid-cols-2 gap-4 px-6 py-3">
                            <dt className="text-sm font-medium text-muted-foreground">{spec.name}</dt>
                            <dd className="text-sm font-semibold">{spec.value}</dd>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="divide-y">
                    <div className="grid grid-cols-2 gap-4 px-6 py-3">
                      <dt className="text-sm font-medium text-muted-foreground">{'Бренд'}</dt>
                      <dd className="text-sm font-semibold">{product.brand}</dd>
                    </div>
                    {product.specs.map(spec => (
                      <div key={spec.id} className="grid grid-cols-2 gap-4 px-6 py-3">
                        <dt className="text-sm font-medium text-muted-foreground">{spec.name}</dt>
                        <dd className="text-sm font-semibold">{spec.value}</dd>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </TabsContent>
            {product.description && (
              <TabsContent value="description" className="pt-6">
                <Card className="p-6">
                  <div
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                  />
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold font-sans mb-8 text-balance">{'Похожие товары'}</h2>
            <ProductList products={similarProducts} />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={sortedImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <QuickOrderDialog
        isOpen={isQuickOrderOpen}
        onOpenChange={setIsQuickOrderOpen}
        product={product}
      />
    </>
  )
}
