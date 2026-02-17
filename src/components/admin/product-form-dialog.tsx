'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useToast } from '@/hooks/use-toast'
import { Plus, X, Upload, GripVertical } from 'lucide-react'
import type { Category, Product, ProductImage, ProductSpec, SpecGroup } from '@/lib/types'
import * as api from '@/lib/api'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  categories: Category[]
  onSaved: () => void
}

type LocalImage = {
  id: string
  url: string
  sort_order: number
  file?: File
  isNew?: boolean
}

type LocalSpec = {
  id: string
  group_id: string
  name: string
  value: string
  sort_order: number
}

function generateLocalId() {
  return 'tmp-' + Math.random().toString(36).slice(2, 9)
}

export function ProductFormDialog({ open, onOpenChange, product, categories, onSaved }: Props) {
  const { data: specGroups } = useSWR<SpecGroup[]>('/api/spec-groups', fetcher)
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [pricePmr, setPricePmr] = useState('')
  const [oldPricePmr, setOldPricePmr] = useState('')
  const [priceMd, setPriceMd] = useState('')
  const [oldPriceMd, setOldPriceMd] = useState('')
  const [stockStatus, setStockStatus] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)
  const [images, setImages] = useState<LocalImage[]>([])
  const [specs, setSpecs] = useState<LocalSpec[]>([])

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        setTitle(product.title)
        setBrand(product.brand)
        setDescription(product.description || '')
        setCategoryId(product.category_id)
        setPricePmr(product.price_pmr?.toString() ?? '')
        setOldPricePmr(product.old_price_pmr?.toString() ?? '')
        setPriceMd(product.price_md?.toString() ?? '')
        setOldPriceMd(product.old_price_md?.toString() ?? '')
        setStockStatus(product.stock_status)
        setSortOrder(product.sort_order)
        setImages(product.images?.map(img => ({ ...img })) || [])
        setSpecs(product.specs?.map(s => ({ id: s.id, group_id: s.group_id, name: s.name, value: s.value, sort_order: s.sort_order })) || [])
      } else {
        setTitle('')
        setBrand('')
        setDescription('')
        setCategoryId(categories[0]?.id || '')
        setPricePmr('')
        setOldPricePmr('')
        setPriceMd('')
        setOldPriceMd('')
        setStockStatus(true)
        setSortOrder(0)
        setImages([])
        setSpecs([])
      }
    }
  }, [open, product, categories])

  /* ── Image handling ── */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages: LocalImage[] = files.map((file, i) => ({
      id: generateLocalId(),
      url: URL.createObjectURL(file),
      sort_order: images.length + i,
      file,
      isNew: true,
    }))
    setImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  /* ── Specs handling ── */
  const addSpec = (groupId: string) => {
    setSpecs(prev => [
      ...prev,
      { id: generateLocalId(), group_id: groupId, name: '', value: '', sort_order: prev.filter(s => s.group_id === groupId).length },
    ])
  }

  const updateSpec = (id: string, field: 'name' | 'value', value: string) => {
    setSpecs(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const removeSpec = (id: string) => {
    setSpecs(prev => prev.filter(s => s.id !== id))
  }

  /* ── Save ── */
  const handleSave = async () => {
    if (!title.trim() || !brand.trim() || !categoryId) {
      toast({ variant: 'destructive', title: 'Заполните название, бренд и категорию' })
      return
    }

    setSaving(true)
    try {
      // Upload new images
      const finalImages: ProductImage[] = []
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        if (img.isNew && img.file) {
          const url = await api.uploadImage(img.file, 'products')
          finalImages.push({ id: img.id, url, sort_order: i })
        } else {
          finalImages.push({ id: img.id, url: img.url, sort_order: i })
        }
      }

      // Filter out empty specs
      const finalSpecs: ProductSpec[] = specs
        .filter(s => s.name.trim() && s.value.trim())
        .map((s, i) => ({
          ...s,
          sort_order: i,
        }))

      const data = {
        title: title.trim(),
        brand: brand.trim(),
        description: description.trim(),
        category_id: categoryId,
        price_pmr: pricePmr ? parseFloat(pricePmr) : null,
        old_price_pmr: oldPricePmr ? parseFloat(oldPricePmr) : null,
        price_md: priceMd ? parseFloat(priceMd) : null,
        old_price_md: oldPriceMd ? parseFloat(oldPriceMd) : null,
        stock_status: stockStatus,
        sort_order: sortOrder,
        images: finalImages,
        specs: finalSpecs,
      }

      if (product) {
        await api.updateProduct(product.id, data)
        toast({ title: 'Товар обновлен' })
      } else {
        await api.createProduct(data)
        toast({ title: 'Товар создан' })
      }
      onSaved()
    } catch {
      toast({ variant: 'destructive', title: 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const groups = specGroups || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{product ? 'Редактировать товар' : 'Новый товар'}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)] px-6">
          <div className="space-y-6 pb-6">
            {/* Basic info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Основная информация
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Название *</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Кондиционер GREE..." />
                </div>
                <div className="space-y-2">
                  <Label>Бренд *</Label>
                  <Input value={brand} onChange={e => setBrand(e.target.value)} placeholder="GREE" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Категория *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Описание товара..." />
              </div>
            </div>

            <Separator />

            {/* Prices */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Цены
              </h3>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>Цена ПМР</Label>
                  <Input type="number" value={pricePmr} onChange={e => setPricePmr(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Старая ПМР</Label>
                  <Input type="number" value={oldPricePmr} onChange={e => setOldPricePmr(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Цена МД</Label>
                  <Input type="number" value={priceMd} onChange={e => setPriceMd(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Старая МД</Label>
                  <Input type="number" value={oldPriceMd} onChange={e => setOldPriceMd(e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Status and sort */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={stockStatus} onCheckedChange={setStockStatus} />
                <Label>В наличии</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label>Сортировка:</Label>
                <Input
                  type="number"
                  className="w-20"
                  value={sortOrder}
                  onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <Separator />

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Фотографии
              </h3>
              <div className="flex flex-wrap gap-3">
                {images.map(img => (
                  <div key={img.id} className="group relative h-24 w-24 overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={img.url}
                      alt="Product"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-0.5 text-center">
                      <GripVertical className="mx-auto h-3 w-3 text-white" />
                    </div>
                  </div>
                ))}
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Нажмите + чтобы добавить фото. Первое фото будет главным.
              </p>
            </div>

            <Separator />

            {/* Specs by group */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Характеристики
              </h3>
              {groups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Нет групп характеристик. Создайте их в настройках.
                </p>
              ) : (
                <Accordion type="multiple" defaultValue={groups.map(g => g.id)} className="space-y-2">
                  {groups.map(group => {
                    const groupSpecs = specs.filter(s => s.group_id === group.id)
                    return (
                      <AccordionItem key={group.id} value={group.id} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-sm font-medium py-3">
                          {group.name} ({groupSpecs.length})
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-4">
                          {groupSpecs.map(spec => (
                            <div key={spec.id} className="flex items-center gap-2">
                              <Input
                                value={spec.name}
                                onChange={e => updateSpec(spec.id, 'name', e.target.value)}
                                placeholder="Параметр"
                                className="flex-1"
                              />
                              <Input
                                value={spec.value}
                                onChange={e => updateSpec(spec.id, 'value', e.target.value)}
                                placeholder="Значение"
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 text-destructive"
                                onClick={() => removeSpec(spec.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addSpec(group.id)}
                            className="w-full"
                          >
                            <Plus className="mr-2 h-3 w-3" /> Добавить параметр
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 border-t p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : product ? 'Сохранить изменения' : 'Создать товар'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
