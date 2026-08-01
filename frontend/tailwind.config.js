/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--bg-main)',
          card: 'var(--bg-card)',
          input: 'var(--bg-input)',
          border: 'var(--border-color)',
          'border-subtle': 'var(--border-subtle)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'accent-primary': 'var(--accent-primary)',
          'accent-secondary': 'var(--accent-secondary)',
          
          'success-bg': 'var(--success-bg)',
          'success-text': 'var(--success-text)',
          'success-border': 'var(--success-border)',
          
          'warning-bg': 'var(--warning-bg)',
          'warning-text': 'var(--warning-text)',
          'warning-border': 'var(--warning-border)',
          
          'danger-bg': 'var(--danger-bg)',
          'danger-text': 'var(--danger-text)',
          'danger-border': 'var(--danger-border)',
        }
      }
    },
  },
  plugins: [],
}
