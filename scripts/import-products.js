/**
 * Import parsed products into the project's data/products.json format.
 * 
 * Reads from: user_read_only_context/text_attachments/products-7WD84.json
 * Writes to:  data/products.json
 * 
 * Transforms:
 * - category slug -> category_id
 * - nested specs object -> ProductSpec[] with group_id references
 * - image filenames -> ProductImage[] with /images/products/ prefix
 */

const fs = require('fs')
const path = require('path')

const ROOT = '/vercel/share/v0-project'

// ── Read source data ──
const sourceFile = path.join(ROOT, 'scripts', 'parsed-daikin.json')
const parsed = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'))

// ── Read existing products (to append, not overwrite) ──
const prodFile = path.join(ROOT, 'data', 'products.json')
let existing = []
try {
  existing = JSON.parse(fs.readFileSync(prodFile, 'utf-8'))
} catch { existing = [] }

// ── Category mapping (parsed slug -> project category_id) ──
const categoryMap = {
  'invertornye': 'cat-invertornye',
  'on-off': 'cat-on-off',
  'multisplit': 'cat-multisplit',
}

// ── Spec group mapping (parsed group name -> project spec group id) ──
const specGroupMap = {
  'Основные': 'sg-main',
  'Производительность': 'sg-performance',
  'Диапазон рабочих температур': 'sg-temperature',
  'Диаметр труб': 'sg-pipes',
  'Размеры': 'sg-dimensions',
  'Размеры и вес': 'sg-dimensions',
}

// ── Helper: generate unique ID ──
let counter = 0
function genId() {
  counter++
  return Date.now().toString(36) + '-' + counter.toString(36) + '-' + Math.random().toString(36).slice(2, 7)
}

// ── Transform each product ──
const newProducts = parsed.map((p, idx) => {
  // All products in this file are Daikin inverter -- parser had "multisplit" by mistake
  const categoryId = categoryMap['invertornye']

  // Transform specs: { "GroupName": { "SpecName": "value" } } -> ProductSpec[]
  const specs = []
  let specOrder = 0
  for (const [groupName, groupSpecs] of Object.entries(p.specs || {})) {
    const groupId = specGroupMap[groupName] || 'sg-main'
    for (const [specName, specValue] of Object.entries(groupSpecs)) {
      specs.push({
        id: genId(),
        group_id: groupId,
        name: specName,
        value: String(specValue),
        sort_order: specOrder++,
      })
    }
  }

  // Transform images: ["filename.webp"] -> ProductImage[]
  const images = (p.images || []).map((filename, imgIdx) => ({
    id: genId(),
    url: `/images/products/${filename}`,
    sort_order: imgIdx,
  }))

  return {
    id: genId(),
    title: p.title,
    brand: p.brand || 'Daikin',
    description: p.description || '',
    category_id: categoryId,
    price_pmr: p.price_pmr ?? null,
    old_price_pmr: p.old_price_pmr ?? null,
    price_md: p.price_md ?? null,
    old_price_md: p.old_price_md ?? null,
    images,
    specs,
    stock_status: p.stock_status ?? true,
    sort_order: existing.length + idx,
    created_at: new Date().toISOString(),
  }
})

// ── Merge and write ──
const allProducts = [...existing, ...newProducts]
fs.writeFileSync(prodFile, JSON.stringify(allProducts, null, 2), 'utf-8')

console.log(`Imported ${newProducts.length} products. Total now: ${allProducts.length}`)
console.log('Categories used:', [...new Set(newProducts.map(p => p.category_id))])
console.log('Brands:', [...new Set(newProducts.map(p => p.brand))])

// List all image filenames so user knows what to upload
const allImages = newProducts.flatMap(p => p.images.map(i => i.url.replace('/images/products/', '')))
console.log(`\nTotal images referenced: ${allImages.length}`)
console.log('First 5:', allImages.slice(0, 5))
