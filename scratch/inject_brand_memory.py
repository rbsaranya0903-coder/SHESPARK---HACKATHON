import re

with open('c:/Users/rbsar/Downloads/HACK/frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import if missing
import_stmt = "import BrandMemoryView from '../components/BrandMemoryView';"
if import_stmt not in content:
    content = content.replace("import BrandDNAView from '../components/BrandDNAView';", f"import BrandDNAView from '../components/BrandDNAView';\n{import_stmt}")

# Add render logic right above activeTab === 'command-center'
render_logic = "{activeTab === 'brand-memory' && <BrandMemoryView selectedCompany={selectedCompany} />}\n\n          {activeTab === 'command-center' && ("
if "activeTab === 'brand-memory'" not in content:
    content = content.replace("{activeTab === 'command-center' && (", render_logic)
elif "<BrandMemoryView" not in content:
    # If the user or I somehow had "activeTab === 'brand-memory'" but not the component
    content = content.replace("{activeTab === 'command-center' && (", render_logic)

with open('c:/Users/rbsar/Downloads/HACK/frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
