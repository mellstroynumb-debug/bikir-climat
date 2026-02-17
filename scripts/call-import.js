// This script calls the import API endpoint on the local dev server
// The API route has access to the project filesystem

const parsedProducts = PARSED_DATA_PLACEHOLDER;

async function main() {
  const urls = [
    'http://localhost:3000/api/import-products',
    'http://localhost:3001/api/import-products',
  ];

  for (const url of urls) {
    try {
      console.log(`Trying ${url}...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: parsedProducts,
          category_override: 'invertornye'
        }),
      });
      const data = await res.json();
      console.log('Result:', JSON.stringify(data, null, 2));
      return;
    } catch (e) {
      console.log(`Failed on ${url}: ${e.message}`);
    }
  }
  console.log('Could not reach the dev server on any port');
}

main();
