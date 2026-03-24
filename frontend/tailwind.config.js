/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tremor: {
          brand: {
            faint: '#0f172a',
            muted: '#1e293b',
            subtle: '#38bdf8',
            DEFAULT: '#38bdf8',
            emphasis: '#0ea5e9',
            inverted: '#ffffff',
          },
          background: {
            muted: '#1e293b',
            subtle: '#0f172a',
            DEFAULT: '#ffffff',
            emphasis: '#f8fafc',
          },
          border: {
            DEFAULT: '#e2e8f0',
          },
        },
        'dark-tremor': {
          brand: {
            faint: '#0f172a',
            muted: '#1e293b',
            subtle: '#38bdf8',
            DEFAULT: '#38bdf8',
            emphasis: '#0284c7',
            inverted: '#0f172a',
          },
          background: {
            muted: '#1e293b',
            subtle: '#0f172a',
            DEFAULT: '#0f172a',
            emphasis: '#1e293b',
          },
          border: {
            DEFAULT: '#334155',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'tremor-badge': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      borderRadius: {
        'tremor-small': '0.375rem',
        'tremor-default': '0.5rem',
        'tremor-full': '9999px',
      },
    },
  },
  plugins: [],
};
