'use client'

import { Scale, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'
import { ScrollArea } from '../ui/scroll-area'

function getFirstImageUrl(images: any): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) return null
  const first = images[0]
  if (typeof first === 'string') return first
  if (first?.url) return first.url
  return null
}

export function ComparePopover() {
  const { compare, removeFromCompare, getCompareCount } = useStore()
  const count = getCompareCount()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
          <div className="relative">
            <Scale className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </div>
          <span className="sr-only md:not-sr-only">{'Сравнить'}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">{'Сравнение'}</h4>
            <p className="text-sm text-muted-foreground">
              {count > 0 ? `Товаров: ${count}` : 'Нет товаров для сравнения'}
            </p>
          </div>
          {count > 0 && (
            <>
              <ScrollArea className="h-[250px] pr-4">
                <div className="grid gap-4">
                  {compare.map((item) => {
                    const imgSrc = getFirstImageUrl(item.images)
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        {imgSrc ? (
                          <Image src={imgSrc} alt={item.title} width={64} height={64} className="h-16 w-16 rounded-md object-cover border shrink-0" />
                        ) : (
                          <div className="h-16 w-16 rounded-md border bg-secondary shrink-0" />
                        )}
                        <div className="flex-1">
                          <Link href={`/catalog/${item.id}`} className="text-sm font-medium leading-tight line-clamp-2 hover:text-primary">{item.title}</Link>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeFromCompare(item.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
              <Separator />
              <Button asChild><Link href="/compare">{'Сравнить товары'}</Link></Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
