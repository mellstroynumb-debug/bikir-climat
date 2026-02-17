'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { useToast } from '@/hooks/use-toast'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import type { Category } from '@/lib/types'
import * as api from '@/lib/api'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яё]/gi, (char) => {
      const map: Record<string, string> = {
        а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
        з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
        п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
        ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
      }
      return map[char.toLowerCase()] ?? char
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function CategoryManager() {
  const { data: categories, mutate } = useSWR<Category[]>('/api/categories', fetcher)
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', sort_order: 0 })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', sort_order: (categories?.length ?? 0) * 10 })
    setImageFile(null)
    setImagePreview(null)
    setDialogOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order })
    setImageFile(null)
    setImagePreview(cat.image)
    setDialogOpen(true)
  }

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: editing ? prev.slug : slugify(name),
    }))
  }

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }, [])

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast({ variant: 'destructive', title: 'Заполните название и slug' })
      return
    }
    setSaving(true)
    try {
      let imageUrl = editing?.image ?? null
      if (imageFile) {
        imageUrl = await api.uploadImage(imageFile, 'categories')
      }

      if (editing) {
        await api.updateCategory(editing.id, { ...form, image: imageUrl })
        toast({ title: 'Категория обновлена' })
      } else {
        await api.createCategory({ ...form, image: imageUrl })
        toast({ title: 'Категория создана' })
      }
      mutate()
      setDialogOpen(false)
    } catch {
      toast({ variant: 'destructive', title: 'Ошибка сохранения' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.deleteCategory(deleteId)
      toast({ title: 'Категория удалена' })
      mutate()
    } catch {
      toast({ variant: 'destructive', title: 'Ошибка удаления' })
    }
    setDeleteId(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Категории</CardTitle>
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Добавить
        </Button>
      </CardHeader>
      <CardContent>
        {!categories ? (
          <p className="text-muted-foreground">Загрузка...</p>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground">Нет категорий. Создайте первую.</p>
        ) : (
          <div className="space-y-3">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{cat.name}</p>
                  <p className="text-sm text-muted-foreground">
                    /{cat.slug} -- {cat.product_count ?? 0} товаров
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Редактировать категорию' : 'Новая категория'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Инверторные кондиционеры"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={form.slug}
                onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="invertornye-kondicionery"
              />
            </div>
            <div className="space-y-2">
              <Label>Порядок сортировки</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={e =>
                  setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Изображение</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized={imagePreview.startsWith('blob:')}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Сохранение...' : editing ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Товары в этой категории останутся без категории.
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
