import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Use absolute path to match process.cwd() in the Next.js app
const PROJECT_ROOT = '/vercel/share/v0-project'
const DATA_DIR = path.join(PROJECT_ROOT, 'data')
const PROD_FILE = path.join(DATA_DIR, 'products.json')

const SPEC_GROUPS = {
  'Основные': 'sg-main',
  'Производительность': 'sg-performance',
  'Диапазон рабочих температур': 'sg-temperature',
  'Диаметр труб': 'sg-pipes',
  'Размеры': 'sg-dimensions',
  'Размеры и вес': 'sg-dimensions',
}

const CATEGORY_ID = 'cat-invertornye'

function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
}

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Read existing products
let existingProducts = []
if (fs.existsSync(PROD_FILE)) {
  try {
    existingProducts = JSON.parse(fs.readFileSync(PROD_FILE, 'utf-8'))
  } catch {
    existingProducts = []
  }
}

// Read source data
const sourceData = JSON.parse(
  fs.readFileSync(path.join(PROJECT_ROOT, 'scripts', 'gree-inverter-data.json'), 'utf-8')
)

console.log(`Found ${existingProducts.length} existing products`)
console.log(`Importing ${sourceData.length} GREE inverter products...`)

let imported = 0

for (let idx = 0; idx < sourceData.length; idx++) {
  const p = sourceData[idx]

  // Check for duplicates by title
  const exists = existingProducts.some(ep => ep.title === p.title)
  if (exists) {
    console.log(`  SKIP (duplicate): ${p.title}`)
    continue
  }

  // Transform specs
  const specs = []
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
  const images = (p.images || []).map((filename, imgIdx) => ({
    id: generateId(),
    url: `/images/products/${filename}`,
    sort_order: imgIdx,
  }))

  const newProduct = {
    id: generateId(),
    title: p.title,
    brand: p.brand || 'Gree',
    description: p.description || '',
    category_id: CATEGORY_ID,
    price_pmr: p.price_pmr,
    old_price_pmr: p.old_price_pmr,
    price_md: p.price_md,
    old_price_md: p.old_price_md,
    images,
    specs,
    stock_status: p.stock_status ?? true,
    sort_order: existingProducts.length + imported,
    created_at: new Date().toISOString(),
  }

  existingProducts.push(newProduct)
  imported++
  console.log(`  OK: ${p.title}`)
}

// Write back
fs.writeFileSync(PROD_FILE, JSON.stringify(existingProducts, null, 2), 'utf-8')

console.log(`\nDone! Imported ${imported} new products.`)
console.log(`Total products in database: ${existingProducts.length}`)
