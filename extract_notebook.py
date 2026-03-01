import json

# Load the notebook
with open('Workshop_Preset.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

print(f"Total cells: {len(nb['cells'])}\n")

# Extract all code cells
print("First 10 code cells preview:")
code_count = 0
for i, cell in enumerate(nb['cells']):
    if cell['cell_type'] == 'code':
        code = ''.join(cell['source']).strip()
        if code and code_count < 10:
            print(f"\n=== Cell {i} ===")
            print(code[:300])
            code_count += 1

# Save all code to a file
with open('extracted_code.txt', 'w', encoding='utf-8') as f:
    for i, cell in enumerate(nb['cells']):
        if cell['cell_type'] == 'code':
            code = ''.join(cell['source']).strip()
            if code:
                f.write(f"\n\n{'='*60}\n")
                f.write(f"CELL {i}\n")
                f.write(f"{'='*60}\n\n")
                f.write(code)

print(f"\n\nAll code extracted to 'extracted_code.txt'")
