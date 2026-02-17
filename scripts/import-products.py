import json
import os
import random
import time
import string

# Paths - try multiple locations
possible_paths = [
    '/vercel/share/v0-project/scripts/parsed-daikin.json',
    os.path.join(os.path.dirname(os.path.abspath(__file__)), 'parsed-daikin.json'),
    'parsed-daikin.json',
    'scripts/parsed-daikin.json',
]

parsed = None
for p in possible_paths:
    try:
        with open(p, 'r', encoding='utf-8') as f:
            parsed = json.load(f)
        print(f"Found source file at: {p}")
        break
    except FileNotFoundError:
        continue

if parsed is None:
    print("ERROR: Could not find parsed-daikin.json at any expected path")
    print(f"CWD: {os.getcwd()}")
    print(f"Script dir: {os.path.dirname(os.path.abspath(__file__))}")
    # List files in cwd
    for item in os.listdir('.'):
        print(f"  {item}")
    exit(1)

# Try to read existing products
prod_path_options = [
    '/vercel/share/v0-project/data/products.json',
    os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'products.json'),
    'data/products.json',
]

existing = []
prod_file = None
for p in prod_path_options:
    try:
        with open(p, 'r', encoding='utf-8') as f:
            existing = json.load(f)
        prod_file = p
        print(f"Found products file at: {p} ({len(existing)} existing products)")
        break
    except FileNotFoundError:
        continue

if prod_file is None:
    # Default to first option
    prod_file = prod_path_options[0]
    os.makedirs(os.path.dirname(prod_file), exist_ok=True)
    print(f"Will create new products file at: {prod_file}")

# Category mapping
category_map = {
    'invertornye': 'cat-invertornye',
    'on-off': 'cat-on-off',
    'multisplit': 'cat-multisplit',
}

# Spec group mapping
spec_group_map = {
    'Основные': 'sg-main',
    'Производительность': 'sg-performance',
    'Диапазон рабочих температур': 'sg-temperature',
    'Диаметр труб': 'sg-pipes',
    'Размеры': 'sg-dimensions',
    'Размеры и вес': 'sg-dimensions',
}

# ID generator
counter = [0]
def gen_id():
    counter[0] += 1
    rand = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"p{int(time.time())}-{counter[0]}-{rand}"

# Transform products
new_products = []
for idx, p in enumerate(parsed):
    # All products are Daikin inverter (parser had "multisplit" by mistake)
    category_id = category_map['invertornye']

    # Transform specs
    specs = []
    spec_order = 0
    for group_name, group_specs in (p.get('specs') or {}).items():
        group_id = spec_group_map.get(group_name, 'sg-main')
        for spec_name, spec_value in group_specs.items():
            specs.append({
                'id': gen_id(),
                'group_id': group_id,
                'name': spec_name,
                'value': str(spec_value),
                'sort_order': spec_order,
            })
            spec_order += 1

    # Transform images
    images = []
    for img_idx, filename in enumerate(p.get('images') or []):
        images.append({
            'id': gen_id(),
            'url': f'/images/products/{filename}',
            'sort_order': img_idx,
        })

    product = {
        'id': gen_id(),
        'title': p['title'],
        'brand': p.get('brand', 'Daikin'),
        'description': p.get('description', ''),
        'category_id': category_id,
        'price_pmr': p.get('price_pmr'),
        'old_price_pmr': p.get('old_price_pmr'),
        'price_md': p.get('price_md'),
        'old_price_md': p.get('old_price_md'),
        'images': images,
        'specs': specs,
        'stock_status': p.get('stock_status', True),
        'sort_order': len(existing) + idx,
        'created_at': '2026-02-17T12:00:00.000Z',
    }
    new_products.append(product)

# Merge and write
all_products = existing + new_products
with open(prod_file, 'w', encoding='utf-8') as f:
    json.dump(all_products, f, ensure_ascii=False, indent=2)

print(f"\nImported {len(new_products)} products. Total now: {len(all_products)}")
print(f"Categories used: {set(p['category_id'] for p in new_products)}")
print(f"Brands: {set(p['brand'] for p in new_products)}")

# List all images
all_images = [img['url'].replace('/images/products/', '') for p in new_products for img in p['images']]
print(f"\nTotal images referenced: {len(all_images)}")
print(f"First 5: {all_images[:5]}")
