import { NextResponse } from 'next/server'
import { getCategories, createCategory } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getCategories())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, slug, image, sort_order } = body
    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }
    const cat = createCategory({ name, slug, image: image ?? null, sort_order: sort_order ?? 0 })
    return NextResponse.json(cat, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
