export type Region = 'PMR' | 'MD'

/* ── Categories ── */
export type Category = {
  id: string
  name: string
  slug: string
  image: string | null
  sort_order: number
  product_count?: number
}

/* ── Spec groups ── */
export type SpecGroup = {
  id: string
  name: string
  sort_order: number
}

/* ── Product specs ── */
export type ProductSpec = {
  id: string
  group_id: string
  group_name?: string
  name: string
  value: string
  sort_order: number
}

/* ── Product images ── */
export type ProductImage = {
  id: string
  url: string
  sort_order: number
}

/* ── Product ── */
export type Product = {
  id: string
  title: string
  brand: string
  description: string
  category_id: string
  category_name?: string
  category_slug?: string
  price_pmr: number | null
  old_price_pmr: number | null
  price_md: number | null
  old_price_md: number | null
  images: ProductImage[]
  specs: ProductSpec[]
  stock_status: boolean
  sort_order: number
  created_at?: string
}

/* ── Cart ── */
export type CartItem = Product & { quantity: number }

/* ── Order items ── */
export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_title?: string
  quantity: number
  price: number
}

/* ── Orders ── */
export type Order = {
  id: string
  customer_name: string
  phone: string
  address: string
  items: OrderItem[]
  total_price: number
  currency: Region
  status: 'new' | 'done'
  created_at: string
}
