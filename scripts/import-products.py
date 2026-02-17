import json
import os
import uuid
from datetime import datetime

# Debug: find where we are
print(f"CWD: {os.getcwd()}")
print(f"CWD contents: {os.listdir('.')}")

# Try to find the project root by searching for known markers
search_roots = [
    '/vercel/share/v0-project',
    '/vercel/path0',
    os.getcwd(),
    '.',
]

project_root = None
for root in search_roots:
    if os.path.isfile(os.path.join(root, 'scripts', 'parsed-daikin.json')):
        project_root = root
        print(f"Found project root at: {root}")
        break
    elif os.path.isfile(os.path.join(root, 'parsed-daikin.json')):
        project_root = os.path.dirname(root) if root != '.' else '.'
        print(f"Found parsed file directly at: {root}")
        break

if project_root is None:
    # Last resort: walk the filesystem
    for dirpath, dirnames, filenames in os.walk('/vercel'):
        if 'parsed-daikin.json' in filenames:
            project_root = os.path.dirname(dirpath)
            print(f"Found via walk: {os.path.join(dirpath, 'parsed-daikin.json')}")
            break

if project_root is None:
    print("ERROR: Could not find project root")
    # Try listing /vercel contents
    try:
        for item in os.listdir('/vercel'):
            print(f"  /vercel/{item}")
            sub = os.path.join('/vercel', item)
            if os.path.isdir(sub):
                for subitem in os.listdir(sub)[:10]:
                    print(f"    /vercel/{item}/{subitem}")
    except Exception as e:
        print(f"Error listing /vercel: {e}")
    exit(1)

# Read source data
source_file = os.path.join(project_root, 'scripts', 'parsed-daikin.json')
with open(source_file, 'r', encoding='utf-8') as f:
    parsed = json.load(f)
print(f"Read {len(parsed)} products from {source_file}")

# Read existing products
prod_file = os.path.join(project_root, 'data', 'products.json')
existing = []
try:
    with open(prod_file, 'r', encoding='utf-8') as f:
        existing = json.load(f)
    print(f"Existing products: {len(existing)}")
except FileNotFoundError:
    os.makedirs(os.path.dirname(prod_file), exist_ok=True)
    print("No existing products file, will create new one")

# Spec group mapping
SPEC_GROUPS = {
    'Основные': 'sg-main',
    'Производительность': 'sg-performance',
    'Диапазон рабочих температур': 'sg-temperature',
    'Диаметр труб': 'sg-pipes',
    'Размеры': 'sg-dimensions',
    'Размеры и вес': 'sg-dimensions',
}

# Transform products
new_products = []
for idx, p in enumerate(parsed):
    pid = str(uuid.uuid4())[:12]

    # Transform specs from nested dict to flat array
    specs = []
    spec_order = 0
    for group_name, group_specs in (p.get('specs') or {}).items():
        group_id = SPEC_GROUPS.get(group_name, 'sg-main')
        for spec_name, spec_value in group_specs.items():
            specs.append({
                'id': f"spec-{pid}-{spec_order}",
                'group_id': group_id,
                'name': spec_name,
                'value': str(spec_value),
                'sort_order': spec_order,
            })
            spec_order += 1

    # Transform images from filename array to object array
    images = []
    for img_idx, filename in enumerate(p.get('images') or []):
        images.append({
            'id': f"img-{pid}-{img_idx}",
            'url': f"/images/products/{filename}",
            'sort_order': img_idx,
        })

    # ALL these products are Daikin inverter (parser had "multisplit" by mistake)
    product = {
        'id': f"prod-{pid}",
        'title': p['title'],
        'brand': p.get('brand', 'Daikin'),
        'description': p.get('description', ''),
        'category_id': 'cat-invertornye',
        'price_pmr': p.get('price_pmr'),
        'old_price_pmr': p.get('old_price_pmr'),
        'price_md': p.get('price_md'),
        'old_price_md': p.get('old_price_md'),
        'images': images,
        'specs': specs,
        'stock_status': p.get('stock_status', True),
        'sort_order': len(existing) + idx,
        'created_at': datetime.now().isoformat() + 'Z',
    }
    new_products.append(product)

# Merge and write
all_products = existing + new_products
with open(prod_file, 'w', encoding='utf-8') as f:
    json.dump(all_products, f, ensure_ascii=False, indent=2)

print(f"\nDone! Imported {len(new_products)} new products.")
print(f"Total products now: {len(all_products)}")
print(f"Sample product: {new_products[0]['title']}")
print(f"Sample images: {[img['url'] for img in new_products[0]['images'][:2]]}")
