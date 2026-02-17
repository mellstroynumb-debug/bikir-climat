import { NextResponse } from 'next/server'
import { createProduct, generateId, getProducts } from '@/lib/db'
import type { ProductImage, ProductSpec } from '@/lib/types'

const SPEC_GROUPS: Record<string, string> = {
  'Основные': 'sg-main',
  'Производительность': 'sg-performance',
  'Диапазон рабочих температур': 'sg-temperature',
  'Диаметр труб': 'sg-pipes',
  'Размеры': 'sg-dimensions',
  'Размеры и вес': 'sg-dimensions',
}

const CATEGORY_MAP: Record<string, string> = {
  'invertornye': 'cat-invertornye',
  'on-off': 'cat-on-off',
  'multisplit': 'cat-multisplit',
}

type ParsedProduct = {
  title: string
  brand: string
  category: string
  description: string
  price_pmr: number | null
  old_price_pmr: number | null
  price_md: number | null
  old_price_md: number | null
  stock_status: boolean
  images: string[]
  specs: Record<string, Record<string, string>>
}

export async function POST(request: Request) {
  try {
    const { products, category_override } = await request.json() as {
      products: ParsedProduct[]
      category_override?: string
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'No products provided' }, { status: 400 })
    }

    const existing = getProducts()
    const imported: string[] = []

    for (let idx = 0; idx < products.length; idx++) {
      const p = products[idx]

      // Determine category
      const catKey = category_override || p.category
      const categoryId = CATEGORY_MAP[catKey] || 'cat-invertornye'

      // Transform specs
      const specs: ProductSpec[] = []
      let specOrder = 0
      for (const [groupName, groupSpecs] of Object.entries(p.specs || {})) {
        const groupId = SPEC_GROUPS[groupName] || 'sg-main'
        for (const [specName, specValue] of Object.entries(groupSpecs)) {
          specs.push({
            id: generateId(),
            group_id: groupId,
            name: specName,
            value: String(specValue),
            sort_order: specOrder++,
          })
        }
      }

      // Transform images
      const images: ProductImage[] = (p.images || []).map((filename: string, imgIdx: number) => ({
        id: generateId(),
        url: `/images/products/${filename}`,
        sort_order: imgIdx,
      }))

      createProduct({
        title: p.title,
        brand: p.brand || 'Unknown',
        description: p.description || '',
        category_id: categoryId,
        price_pmr: p.price_pmr,
        old_price_pmr: p.old_price_pmr,
        price_md: p.price_md,
        old_price_md: p.old_price_md,
        images,
        specs,
        stock_status: p.stock_status ?? true,
        sort_order: existing.length + idx,
      })

      imported.push(p.title)
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      titles: imported,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
