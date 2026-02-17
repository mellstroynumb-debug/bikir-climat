import json
import hashlib

# Read the source file content that was copied into the project
# Since the sandbox can't access project files, we embed the transformation logic
# and output the result to stdout for capture

# We'll use a deterministic ID generation based on product title
def make_id(prefix, seed, idx=0):
    h = hashlib.md5(f"{seed}-{idx}".encode()).hexdigest()[:8]
    return f"{prefix}-{h}"

SPEC_GROUPS = {
    'Основные': 'sg-main',
    'Производительность': 'sg-performance',
    'Диапазон рабочих температур': 'sg-temperature',
    'Диаметр труб': 'sg-pipes',
    'Размеры': 'sg-dimensions',
    'Размеры и вес': 'sg-dimensions',
}

# This script just prints the transformation logic as a test
# The actual data will need to be written directly via the Write tool
print("TRANSFORM_READY")
print(f"Spec groups: {json.dumps(SPEC_GROUPS, ensure_ascii=False)}")
