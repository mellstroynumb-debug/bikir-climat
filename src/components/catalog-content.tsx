'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import ProductList from '@/components/product-list'
import type { Product, Category } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useStore } from '@/store/useStore'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function CatalogContent() {
  const { region } = useStore()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')
  const categorySlug = searchParams.get('category')

  const { data: products, isLoading } = useSWR<Product[]>('/api/products', fetcher)
  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher)

  const [sortOrder, setSortOrder] = useState('default')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all')

  const availableBrands = useMemo(() => {
    if (!products) return []
    let filtered = products
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = categories?.find(c => c.slug === selectedCategory)
      if (cat) filtered = filtered.filter(p => p.category_id === cat.id)
    }
    const brands = filtered.map(p => p.brand).filter(Boolean)
    return [...new Set(brands)]
  }, [products, selectedCategory, categories])

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return []
    let filtered = [...products]

    if (selectedCategory && selectedCategory !== 'all') {
      const cat = categories?.find(c => c.slug === selectedCategory)
      if (cat) filtered = filtered.filter(p => p.category_id === cat.id)
    }

    if (searchQuery) {
      const searchWords = searchQuery.toLowerCase().split(' ').filter(Boolean)
      if (searchWords.length > 0) {
        filtered = filtered.filter(p => {
          const text = p.title.toLowerCase()
          return searchWords.every(word => text.includes(word))
        })
      }
    }

    filtered = filtered.filter(p => {
      const price = region === 'PMR' ? p.price_pmr : p.price_md
      return price !== null && price > 0
    })

    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock_status)
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }

    const getPrice = (p: Product) => region === 'PMR' ? p.price_pmr : p.price_md

    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => (getPrice(a) ?? 0) - (getPrice(b) ?? 0))
        break
      case 'price-desc':
        filtered.sort((a, b) => (getPrice(b) ?? 0) - (getPrice(a) ?? 0))
        break
      default:
        break
    }

    return filtered
  }, [products, sortOrder, selectedBrands, inStockOnly, region, searchQuery, selectedCategory, categories])

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-16">
        <div className="text-center mb-12">
          {searchQuery ? (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-sans text-balance">{'Результаты поиска'}</h1>
              <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
                {'По запросу: '}<span className="font-bold text-foreground">{searchQuery}</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-sans text-balance">{'Каталог товаров'}</h1>
              <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
                {'Все наши кондиционеры в одном месте.'}
              </p>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{'Фильтры'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categories && categories.length > 0 && (
                    <div>
                      <Label htmlFor="category-filter">{'Категория'}</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger id="category-filter" className="w-full mt-2">
                          <SelectValue placeholder="Все категории" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{'Все категории'}</SelectItem>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label htmlFor="sort-order">{'Сортировка'}</Label>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger id="sort-order" className="w-full mt-2">
                        <SelectValue placeholder="По умолчанию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">{'По умолчанию'}</SelectItem>
                        <SelectItem value="price-asc">{'По возрастанию цены'}</SelectItem>
                        <SelectItem value="price-desc">{'По убыванию цены'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {availableBrands.length > 0 && (
                    <div>
                      <Label>{'Бренды'}</Label>
                      <div className="space-y-2 mt-2">
                        {availableBrands.map(brand => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => handleBrandChange(brand)}
                            />
                            <Label htmlFor={`brand-${brand}`} className="font-normal cursor-pointer">{brand}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="in-stock">{'Только в наличии'}</Label>
                      <Switch
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={setInStockOnly}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <main className="lg:col-span-3">
              {filteredAndSortedProducts.length > 0 ? (
                <ProductList products={filteredAndSortedProducts} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-secondary/30 rounded-lg py-20">
                  <p className="font-semibold text-lg">{'Товары не найдены'}</p>
                  <p className="text-muted-foreground text-sm mt-1">{'Попробуйте изменить поисковой запрос или сбросить фильтры.'}</p>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}
