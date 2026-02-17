'use client'

import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { ImageIcon, Loader2 } from 'lucide-react'
import type { Category } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function CategoryGrid() {
  const { data: categories, isLoading } = useSWR<Category[]>('/api/categories', fetcher)

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center font-sans mb-12 text-balance">
          Кондиционеры
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !categories || categories.length === 0 ? (
          <p className="text-center text-muted-foreground">Категории пока не добавлены.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                href={`/catalog?category=${category.slug}`}
                key={category.id}
                className="group block"
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                  <CardContent className="p-0 text-center flex flex-col h-full">
                    <div className="relative aspect-[4/3] w-full">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted rounded-md">
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="mt-auto p-4 pt-3">
                      <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {(category.product_count ?? 0) > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Товаров: {category.product_count}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
