'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, ImageIcon, Search } from 'lucide-react'
import type { Category, Product } from '@/lib/types'
import * as api from '@/lib/api'
import { ProductFormDialog } from './product-form-dialog'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function ProductManager() {
  const { data: products, mutate } = useSWR<Product[]>('/api/products', fetcher)
  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher)
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.deleteProduct(deleteId)
      toast({ title: 'Товар удален' })
      mutate()
    } catch {
      toast({ variant: 'destructive', title: 'Ошибка удаления' })
    }
    setDeleteId(null)
  }

  const handleSaved = () => {
    mutate()
    setDialogOpen(false)
  }

  /* Filtered products */
  const filtered = (products || []).filter(p => {
    if (filterCategory !== 'all' && p.category_id !== filterCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Товары ({filtered.length})</CardTitle>
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Добавить товар
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или бренду..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              {categories?.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product list */}
        {!products ? (
          <p className="text-muted-foreground">Загрузка...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">Нет товаров.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map(product => {
              const mainImage = product.images?.[0]?.url
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {mainImage ? (
                      <Image src={mainImage} alt={product.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{product.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{product.brand}</span>
                      {product.category_name && (
                        <Badge variant="outline" className="text-xs">{product.category_name}</Badge>
                      )}
                      <Badge variant={product.stock_status ? 'default' : 'secondary'} className="text-xs">
                        {product.stock_status ? 'В наличии' : 'Нет'}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm">
                      {product.price_pmr != null && (
                        <span>{product.price_pmr} руб.</span>
                      )}
                      {product.price_md != null && (
                        <span className="text-muted-foreground">{product.price_md} лей</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editing}
        categories={categories || []}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
