import fs from 'fs'
import path from 'path'
import type { Category, Product, ProductImage, ProductSpec, SpecGroup, Order, OrderItem } from './types'

/* ──────────────────────────────────────────────
   JSON-file database.
   Each "table" lives in /data/<name>.json.
   Works on any Node.js server, no external deps.
   ────────────────────────────────────────────── */

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJSON<T>(file: string): T[] {
  ensureDir()
  const fp = path.join(DATA_DIR, file)
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, '[]', 'utf-8')
    return []
  }
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8')) as T[]
  } catch {
    return []
  }
}

function writeJSON<T>(file: string, data: T[]) {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8')
}

/* ── helpers ── */
export function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
}

/* ════════════════════════════════════
   CATEGORIES
   ════════════════════════════════════ */

const CAT_FILE = 'categories.json'

export function getCategories(): Category[] {
  const cats = readJSON<Category>(CAT_FILE).sort((a, b) => a.sort_order - b.sort_order)
  const products = getProductsRaw()
  return cats.map(c => ({
    ...c,
    product_count: products.filter(p => p.category_id === c.id).length,
  }))
}

export function getCategoryById(id: string): Category | undefined {
  return readJSON<Category>(CAT_FILE).find(c => c.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return readJSON<Category>(CAT_FILE).find(c => c.slug === slug)
}

export function createCategory(cat: Omit<Category, 'id' | 'product_count'>): Category {
  const cats = readJSON<Category>(CAT_FILE)
  const newCat: Category = { ...cat, id: generateId() }
  cats.push(newCat)
  writeJSON(CAT_FILE, cats)
  return newCat
}

export function updateCategory(id: string, data: Partial<Category>): Category | null {
  const cats = readJSON<Category>(CAT_FILE)
  const idx = cats.findIndex(c => c.id === id)
  if (idx === -1) return null
  cats[idx] = { ...cats[idx], ...data, id }
  writeJSON(CAT_FILE, cats)
  return cats[idx]
}

export function deleteCategory(id: string): boolean {
  const cats = readJSON<Category>(CAT_FILE)
  const filtered = cats.filter(c => c.id !== id)
  if (filtered.length === cats.length) return false
  writeJSON(CAT_FILE, filtered)
  return true
}

/* ════════════════════════════════════
   SPEC GROUPS
   ════════════════════════════════════ */

const SG_FILE = 'spec-groups.json'

export function getSpecGroups(): SpecGroup[] {
  return readJSON<SpecGroup>(SG_FILE).sort((a, b) => a.sort_order - b.sort_order)
}

export function createSpecGroup(sg: Omit<SpecGroup, 'id'>): SpecGroup {
  const groups = readJSON<SpecGroup>(SG_FILE)
  const newSG: SpecGroup = { ...sg, id: generateId() }
  groups.push(newSG)
  writeJSON(SG_FILE, groups)
  return newSG
}

export function updateSpecGroup(id: string, data: Partial<SpecGroup>): SpecGroup | null {
  const groups = readJSON<SpecGroup>(SG_FILE)
  const idx = groups.findIndex(g => g.id === id)
  if (idx === -1) return null
  groups[idx] = { ...groups[idx], ...data, id }
  writeJSON(SG_FILE, groups)
  return groups[idx]
}

export function deleteSpecGroup(id: string): boolean {
  const groups = readJSON<SpecGroup>(SG_FILE)
  const filtered = groups.filter(g => g.id !== id)
  if (filtered.length === groups.length) return false
  writeJSON(SG_FILE, filtered)
  return true
}

/* ════════════════════════════════════
   PRODUCTS  (raw = without joined data)
   ════════════════════════════════════ */

type ProductRaw = {
  id: string
  title: string
  brand: string
  description: string
  category_id: string
  price_pmr: number | null
  old_price_pmr: number | null
  price_md: number | null
  old_price_md: number | null
  images: ProductImage[]
  specs: ProductSpec[]
  stock_status: boolean
  sort_order: number
  created_at: string
}

const PROD_FILE = 'products.json'

function getProductsRaw(): ProductRaw[] {
  return readJSON<ProductRaw>(PROD_FILE)
}

function enrichProduct(p: ProductRaw): Product {
  const cat = getCategoryById(p.category_id)
  const specGroups = getSpecGroups()
  return {
    ...p,
    category_name: cat?.name ?? '',
    category_slug: cat?.slug ?? '',
    specs: (p.specs || []).map(s => ({
      ...s,
      group_name: specGroups.find(g => g.id === s.group_id)?.name ?? '',
    })),
  }
}

export function getProducts(filters?: {
  category_id?: string
  category_slug?: string
  brand?: string
  search?: string
  in_stock?: boolean
}): Product[] {
  let products = getProductsRaw()

  if (filters?.category_id) {
    products = products.filter(p => p.category_id === filters.category_id)
  }
  if (filters?.category_slug) {
    const cat = getCategoryBySlug(filters.category_slug)
    if (cat) products = products.filter(p => p.category_id === cat.id)
  }
  if (filters?.brand) {
    products = products.filter(p => p.brand.toLowerCase() === filters.brand!.toLowerCase())
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    products = products.filter(p =>
      p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    )
  }
  if (filters?.in_stock) {
    products = products.filter(p => p.stock_status)
  }

  return products.sort((a, b) => a.sort_order - b.sort_order).map(enrichProduct)
}

export function getProductById(id: string): Product | undefined {
  const raw = getProductsRaw().find(p => p.id === id)
  return raw ? enrichProduct(raw) : undefined
}

export function createProduct(data: Omit<ProductRaw, 'id' | 'created_at'>): Product {
  const products = getProductsRaw()
  const newProd: ProductRaw = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  products.push(newProd)
  writeJSON(PROD_FILE, products)
  return enrichProduct(newProd)
}

export function updateProduct(id: string, data: Partial<ProductRaw>): Product | null {
  const products = getProductsRaw()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return null
  products[idx] = { ...products[idx], ...data, id }
  writeJSON(PROD_FILE, products)
  return enrichProduct(products[idx])
}

export function deleteProduct(id: string): boolean {
  const products = getProductsRaw()
  const filtered = products.filter(p => p.id !== id)
  if (filtered.length === products.length) return false
  writeJSON(PROD_FILE, filtered)
  return true
}

/* ════════════════════════════════════
   ORDERS
   ════════════════════════════════════ */

const ORD_FILE = 'orders.json'

export function getOrders(): Order[] {
  return readJSON<Order>(ORD_FILE).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getOrderById(id: string): Order | undefined {
  return readJSON<Order>(ORD_FILE).find(o => o.id === id)
}

export function createOrder(data: Omit<Order, 'id' | 'created_at' | 'status'>): Order {
  const orders = readJSON<Order>(ORD_FILE)
  const newOrder: Order = {
    ...data,
    id: generateId(),
    status: 'new',
    created_at: new Date().toISOString(),
  }
  orders.push(newOrder)
  writeJSON(ORD_FILE, orders)
  return newOrder
}

export function updateOrderStatus(id: string, status: 'new' | 'done'): Order | null {
  const orders = readJSON<Order>(ORD_FILE)
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], status }
  writeJSON(ORD_FILE, orders)
  return orders[idx]
}

export function deleteOrder(id: string): boolean {
  const orders = readJSON<Order>(ORD_FILE)
  const filtered = orders.filter(o => o.id !== id)
  if (filtered.length === orders.length) return false
  writeJSON(ORD_FILE, filtered)
  return true
}
