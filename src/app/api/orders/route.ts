import { NextResponse } from 'next/server'
import { getOrders, createOrder } from '@/lib/db'

export async function GET() {
  return NextResponse.json(getOrders())
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer_name, phone, items, total_price, currency } = body
    if (!customer_name || !phone || !items?.length) {
      return NextResponse.json({ error: 'customer_name, phone and items are required' }, { status: 400 })
    }
    const order = createOrder({
      customer_name,
      phone,
      address: body.address ?? '',
      items,
      total_price: total_price ?? 0,
      currency: currency ?? 'PMR',
    })
    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
