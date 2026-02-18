import fs from 'fs'

// Use absolute path since sandbox runs from /home/user/
const sourceFile = '/vercel/share/v0-project/scripts/gree-inverter-data.json'
const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'))

console.log(`Loaded ${sourceData.length} GREE inverter products from JSON`)
console.log('Sending to import API...')

// Send via HTTP to the running dev server
const BASE_URL = 'http://localhost:3000'

const resp = await fetch(`${BASE_URL}/api/import-products`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    products: sourceData,
    category_override: 'invertornye',
  }),
})

const result = await resp.json()

if (resp.ok) {
  console.log(`Successfully imported ${result.imported} products!`)
  if (result.titles) {
    result.titles.forEach(t => console.log(`  - ${t}`))
  }
} else {
  console.error('Import failed:', result.error || result)
}
