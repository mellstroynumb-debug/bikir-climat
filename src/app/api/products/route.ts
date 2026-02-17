import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/db'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const filters = {
    category_id: sp.get('category_id') ?? undefined,
    category_slug: sp.get('category') ?? undefined,
    brand: sp.get('brand') ?? undefined,
    search: sp.get('search') ?? undefined,
    in_stock: sp.get('in_stock') === 'true' ? true : undefined,
  }
  return NextResponse.json(getProducts(filters))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, brand, category_id } = body
    if (!title || !brand || !category_id) {
      return NextResponse.json({ error: 'title, brand, category_id are required' }, { status: 400 })
    }
    const product = createProduct({
      title,
      brand,
      description: body.description ?? '',
      category_id,
      price_pmr: body.price_pmr ?? null,
      old_price_pmr: body.old_price_pmr ?? null,
      price_md: body.price_md ?? null,
      old_price_md: body.old_price_md ?? null,
      images: body.images ?? [],
      specs: body.specs ?? [],
      stock_status: body.stock_status ?? true,
      sort_order: body.sort_order ?? 0,
    })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
