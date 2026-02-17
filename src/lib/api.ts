import type { Category, Product, SpecGroup, Order } from './types'

const BASE = ''

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

/* ── Categories ── */
export const fetchCategories = () => fetchJSON<Category[]>('/api/categories')
export const fetchCategory = (id: string) => fetchJSON<Category>(`/api/categories/${id}`)
export const createCategory = (data: Partial<Category>) =>
  fetchJSON<Category>('/api/categories', { method: 'POST', body: JSON.stringify(data) })
export const updateCategory = (id: string, data: Partial<Category>) =>
  fetchJSON<Category>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteCategory = (id: string) =>
  fetchJSON<{ ok: boolean }>(`/api/categories/${id}`, { method: 'DELETE' })

/* ── Products ── */
export const fetchProducts = (params?: Record<string, string>) => {
  const sp = new URLSearchParams(params)
  return fetchJSON<Product[]>(`/api/products?${sp.toString()}`)
}
export const fetchProduct = (id: string) => fetchJSON<Product>(`/api/products/${id}`)
export const createProduct = (data: Partial<Product>) =>
  fetchJSON<Product>('/api/products', { method: 'POST', body: JSON.stringify(data) })
export const updateProduct = (id: string, data: Partial<Product>) =>
  fetchJSON<Product>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProduct = (id: string) =>
  fetchJSON<{ ok: boolean }>(`/api/products/${id}`, { method: 'DELETE' })

/* ── Spec Groups ── */
export const fetchSpecGroups = () => fetchJSON<SpecGroup[]>('/api/spec-groups')
export const createSpecGroup = (data: Partial<SpecGroup>) =>
  fetchJSON<SpecGroup>('/api/spec-groups', { method: 'POST', body: JSON.stringify(data) })
export const updateSpecGroup = (id: string, data: Partial<SpecGroup>) =>
  fetchJSON<SpecGroup>(`/api/spec-groups/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteSpecGroup = (id: string) =>
  fetchJSON<{ ok: boolean }>(`/api/spec-groups/${id}`, { method: 'DELETE' })

/* ── Orders ── */
export const fetchOrders = () => fetchJSON<Order[]>('/api/orders')
export const createOrder = (data: Partial<Order>) =>
  fetchJSON<Order>('/api/orders', { method: 'POST', body: JSON.stringify(data) })
export const updateOrderStatus = (id: string, status: string) =>
  fetchJSON<Order>(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) })
export const deleteOrder = (id: string) =>
  fetchJSON<{ ok: boolean }>(`/api/orders/${id}`, { method: 'DELETE' })

/* ── File Upload ── */
export async function uploadImage(file: File, folder = 'products'): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.url
}
