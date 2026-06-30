/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-bg':    '#0d0e12',
        'brand-card':  '#1f242e',
        'brand-green': '#39ff14',
        'brand-cyan':  '#00f0ff',
        'brand-muted': '#7a8499',
      },
      fontFamily: {
        sans:  ['Vazirmatn', 'Tahoma', 'system-ui', 'sans-serif'],
        vazir: ['Vazirmatn', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      // Custom box-shadow utilities for neon glows
      boxShadow: {
        'glow-green': '0 0 8px #39ff14, 0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.19)',
        'glow-cyan':  '0 0 8px #00f0ff, 0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.19)',
        'glow-green-lg': '0 0 16px #39ff14, 0 0 40px rgba(57,255,20,0.8), 0 0 70px rgba(57,255,20,0.38)',
        'glow-cyan-lg':  '0 0 16px #00f0ff, 0 0 40px rgba(0,240,255,0.8), 0 0 70px rgba(0,240,255,0.5)',
      },
      // Custom keyframe animations
      keyframes: {
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 8px #39ff14, 0 0 20px rgba(57,255,20,0.5)' },
          '50%':       { boxShadow: '0 0 16px #39ff14, 0 0 40px rgba(57,255,20,0.8), 0 0 70px rgba(57,255,20,0.38)' },
        },
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 8px #00f0ff, 0 0 20px rgba(0,240,255,0.5)' },
          '50%':       { boxShadow: '0 0 16px #00f0ff, 0 0 40px rgba(0,240,255,0.8), 0 0 70px rgba(0,240,255,0.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scan-line': {
          '0%':   { top: '-10%' },
          '100%': { top: '110%' },
        },
      },
      animation: {
        'pulse-green': 'pulse-green 2.5s ease-in-out infinite',
        'pulse-cyan':  'pulse-cyan 2.5s ease-in-out infinite',
        'float':       'float 4s ease-in-out infinite',
        'fade-in-up':  'fade-in-up 0.7s ease both',
        'scan-line':   'scan-line 1.2s linear',
      },
    },
  },
  plugins: [],
}
