import { NextResponse } from 'next/server'
import { getSpecGroups, createSpecGroup } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getSpecGroups())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, sort_order } = body
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    const sg = createSpecGroup({ name, sort_order: sort_order ?? 0 })
    return NextResponse.json(sg, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
