import re

with open('c:/Users/rbsar/Downloads/HACK/frontend/src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add theme state and toggle logic
state_hooks_replacement = '''  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const [activeTab'''
content = content.replace('  const [activeTab', state_hooks_replacement)

# Import Moon
if 'Moon' not in content:
    content = content.replace('Sun, ', 'Sun, Moon, ')

# Replace the Sun button in the header
sun_button_regex = r'<button className=\"w-8 h-8 rounded-xl[^\"]*?bg-black/40[^\"]*?\">[\s]*<Sun size=\{15\} \/>[\s]*<\/button>'
theme_toggle_button = '''<button onClick={toggleTheme} className=\"w-8 h-8 rounded-xl bg-theme-input border border-theme-border text-theme-text-secondary hover:text-theme-text-primary flex items-center justify-center transition-colors\">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>'''
content = re.sub(sun_button_regex, theme_toggle_button, content)

# General Class Replacements
replacements = {
    'bg-[#0a0604]': 'bg-theme-bg',
    'bg-[#0a0604]/80': 'bg-theme-card',
    'bg-[#0a0604]/60': 'bg-theme-card',
    'bg-black/40': 'bg-theme-card',
    'bg-black/50': 'bg-theme-input',
    'bg-black/60': 'bg-theme-input',
    'text-stone-100': 'text-theme-text-primary',
    'text-stone-200': 'text-theme-text-primary',
    'text-stone-300': 'text-theme-text-primary',
    'text-stone-400': 'text-theme-text-secondary',
    'text-stone-500': 'text-theme-text-secondary',
    'text-stone-600': 'text-theme-text-secondary opacity-70',
    'border-orange-900/20': 'border-theme-border-subtle',
    'border-orange-900/30': 'border-theme-border',
    'border-orange-900/40': 'border-theme-border',
    'border-orange-500/30': 'border-theme-accent-primary/30',
    'border-orange-500/40': 'border-theme-accent-primary/40',
    'text-orange-400': 'text-theme-accent-primary',
    'text-orange-500': 'text-theme-accent-primary',
    'text-amber-400': 'text-theme-accent-secondary',
    'text-amber-500': 'text-theme-accent-secondary',
    'bg-stone-900': 'bg-theme-border',
    'bg-stone-900/80': 'bg-theme-card',
    'bg-white/[0.02]': 'hover:bg-theme-input',
    'bg-white/[0.03]': 'hover:bg-theme-input',
    'bg-white/[0.01]': 'bg-theme-input/50',
    # SVG and status
    'stroke="#f97316"': 'stroke="var(--chart-line)"',
    'fill="rgba(249, 115, 22, 0.25)"': 'fill="var(--radar-your-brand)"',
    'stroke="#f43f5e"': 'stroke="var(--radar-comp-stroke)"',
    'fill="rgba(244, 63, 94, 0.15)"': 'fill="var(--radar-comp)"',
    'stroke="#27272a"': 'stroke="var(--border-color)"',
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': 'bg-theme-success-bg text-theme-success-text border border-theme-success-border',
    'bg-amber-500/10 text-amber-400 border border-amber-500/20': 'bg-theme-warning-bg text-theme-warning-text border border-theme-warning-border',
    'bg-rose-500/10 text-rose-400 border border-rose-500/20': 'bg-theme-danger-bg text-theme-danger-text border border-theme-danger-border',
    'text-emerald-400': 'text-theme-success-text',
    'bg-emerald-500': 'bg-theme-success-text',
    'text-rose-400': 'text-theme-danger-text',
    'bg-rose-500': 'bg-theme-danger-text',
    'bg-rose-950/30 border border-rose-500/30': 'bg-theme-danger-bg border border-theme-danger-border',
}

for old, new in replacements.items():
    content = content.replace(old, new)

area_gradient_regex = r'<defs>.*?<\/defs>'
content = re.sub(area_gradient_regex, '', content, flags=re.DOTALL)
content = content.replace('fill="url(#areaGradient)"', 'fill="var(--chart-fill)"')

with open('c:/Users/rbsar/Downloads/HACK/frontend/src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
