/** @type {import('tailwindcss').Config} */
const forms = require('@tailwindcss/forms')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { /* primary colors */ },
        secondary: { /* secondary colors */ },
        success: { /* success colors */ },
        warning: { /* warning colors */ },
        danger: { /* danger colors */ },
      },
      boxShadow: {
        'soft-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 2px 10px 0 rgba(0, 0, 0, 0.08)',
        'soft-md': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 6px 20px 0 rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 8px 24px -4px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    forms,
  ],
}
