/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#07030e', 900: '#130a2c', 800: '#1d0f45' },
        panel: { DEFAULT: '#170d36', 2: '#100828' },
        vel: {
          border: '#372761',
          violet: '#7c3aed',
          cyan: '#22d3ee',
          gold: '#ffd23f',
          muted: '#a99bd0',
          dim: '#7c6daa',
          pink: '#ff2e92',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'slide-up': 'slideUp 0.25s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pop': 'pop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        cursorBlink: {
          '0%,49%': { borderColor: '#7c3aed' },
          '50%,100%': { borderColor: 'transparent' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pop: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(167,139,250,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,.04) 1px,transparent 1px)",
      },
      backgroundSize: {
        'grid': '44px 44px',
      },
    },
  },
  plugins: [],
}
