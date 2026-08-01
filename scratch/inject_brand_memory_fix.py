import re

file_path = 'c:/Users/rbsar/Downloads/HACK/frontend/src/pages/Dashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the double import
content = content.replace("import BrandMemoryView from '../components/BrandMemoryView';\nimport BrandMemoryView from '../components/BrandMemoryView';", "import BrandMemoryView from '../components/BrandMemoryView';")

# Add the render logic
if "{activeTab === 'brand-memory' && <BrandMemoryView selectedCompany={selectedCompany} />}" not in content:
    # Use regex to find activeTab === 'command-center' and insert before it
    pattern = r"(\{\s*activeTab === 'command-center'\s*&&\s*\()"
    replacement = r"{activeTab === 'brand-memory' && <BrandMemoryView selectedCompany={selectedCompany} />}\n\n          \1"
    content = re.sub(pattern, replacement, content, count=1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
