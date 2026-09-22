/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg:      '#0a0a0f',
          surface: '#12121a',
          card:    '#1a1a2e',
          border:  '#2a2a4a',
          primary: '#6366f1',
          accent:  '#a855f7',
          cyan:    '#06b6d4',
          gold:    '#f59e0b',
          green:   '#10b981',
          red:     '#ef4444',
          text:    '#e2e8f0',
          muted:   '#64748b',
        }
      },
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        body:    ['"Rajdhani"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'scan':       'scan 3s linear infinite',
        'flicker':    'flicker 0.15s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #6366f1, 0 0 10px #6366f1' },
          '50%':      { boxShadow: '0 0 20px #6366f1, 0 0 40px #6366f1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'scan': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
        'glow-radial':  'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      }
    }
  },
  plugins: []
};
