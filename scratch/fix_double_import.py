import re

file_path = 'c:/Users/rbsar/Downloads/HACK/frontend/src/pages/Dashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix double import using regex to handle whitespace/\r\n
pattern = r"import BrandMemoryView from '\.\./components/BrandMemoryView';\s*import BrandMemoryView from '\.\./components/BrandMemoryView';"
content = re.sub(pattern, "import BrandMemoryView from '../components/BrandMemoryView';", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("fixed")
