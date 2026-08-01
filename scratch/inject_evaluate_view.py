import re
import sys

file_path = 'c:/Users/rbsar/Downloads/HACK/frontend/src/pages/Dashboard.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
import_stmt = "import EvaluateContentView from '../components/EvaluateContentView';"
if import_stmt not in content:
    content = content.replace("import BrandMemoryView from '../components/BrandMemoryView';", f"import BrandMemoryView from '../components/BrandMemoryView';\n{import_stmt}")

# Add render logic
render_logic = "{activeTab === 'evaluate' && <EvaluateContentView selectedCompany={selectedCompany} />}\n\n          "
if "activeTab === 'evaluate' && <EvaluateContentView" not in content:
    pattern = r"(\{\s*activeTab === 'command-center'\s*&&\s*\()"
    content = re.sub(pattern, render_logic + r"\1", content, count=1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done")
