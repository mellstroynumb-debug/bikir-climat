'use client'

import { useStore } from '@/store/useStore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Scale } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/lib/types'

function getFirstImageUrl(images: any): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) return null
  const first = images[0]
  if (typeof first === 'string') return first
  if (first?.url) return first.url
  return null
}

export default function ComparePage() {
  const { compare, region } = useStore()
  const currency = region === 'PMR' ? 'руб.' : 'лей'

  if (compare.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Scale className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">{'Нет товаров для сравнения'}</h1>
        <p className="mt-2 text-muted-foreground">{'Добавьте товары, чтобы сравнить их характеристики.'}</p>
        <Button asChild className="mt-6"><Link href="/catalog">{'Перейти в каталог'}</Link></Button>
      </div>
    )
  }

  // Aggregate all spec names across products
  const allSpecNames = Array.from(
    new Set(compare.flatMap(p => (p.specs || []).map((s: any) => typeof s === 'object' ? s.name : s)))
  ).filter(Boolean)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-sans text-balance">{'Сравнение товаров'}</h1>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-semibold">{'Характеристика'}</TableHead>
              {compare.map(product => {
                const imgSrc = getFirstImageUrl(product.images)
                return (
                  <TableHead key={product.id} className="w-[250px] p-2">
                    <Link href={`/catalog/${product.id}`} className="flex flex-col items-center text-center gap-2">
                      {imgSrc && <Image src={imgSrc} alt={product.title} width={100} height={100} className="rounded-md object-contain border" />}
                      <span className="font-semibold text-foreground hover:text-primary text-sm">{product.title}</span>
                    </Link>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-secondary/50">
              <TableCell className="font-semibold">{'Цена'}</TableCell>
              {compare.map(product => {
                const price = region === 'PMR' ? product.price_pmr : product.price_md
                return (
                  <TableCell key={product.id} className="font-bold text-lg text-primary text-center">
                    {price ? `${new Intl.NumberFormat('ru-RU').format(price)} ${currency}` : 'N/A'}
                  </TableCell>
                )
              })}
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-muted-foreground">{'Бренд'}</TableCell>
              {compare.map(product => (
                <TableCell key={product.id} className="text-center text-sm">{product.brand || '—'}</TableCell>
              ))}
            </TableRow>
            {allSpecNames.map(specName => (
              <TableRow key={specName}>
                <TableCell className="font-semibold text-muted-foreground">{specName}</TableCell>
                {compare.map(product => {
                  const spec = (product.specs || []).find((s: any) => typeof s === 'object' && s.name === specName)
                  const value = spec ? (spec as any).value : '—'
                  return (
                    <TableCell key={product.id} className="text-center text-sm">{value || '—'}</TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
