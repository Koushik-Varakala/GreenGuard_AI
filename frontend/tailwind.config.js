/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#0a0a0f',
          dark: '#1a1a2e',
          blue: '#16213e',
          deep: '#0f3460',
        },
        emerald: {
          dark: '#064e3b',
          medium: '#047857',
          light: '#10b981',
        },
        neon: {
          green: '#00ff88',
          cyan: '#00d9ff',
          teal: '#00ffd9',
          blue: '#0080ff',
          purple: '#8b5cf6',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'energy-flow': 'energyFlow 2s linear infinite',
        'cosmic-pulse': 'cosmicPulse 20s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon-green': '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88',
        'neon-cyan': '0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff',
        'cosmic': '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 217, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
