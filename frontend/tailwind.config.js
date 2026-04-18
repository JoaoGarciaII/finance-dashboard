/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#060606',
        panel: '#0f0f0f',
        panelSoft: '#151515',
        line: '#242424',
        gold: '#D4A24C',
        amberSoft: '#9F6B20',
        text: '#F5F2EA',
        muted: '#A19A90',
        success: '#27c281',
        danger: '#ff6b6b'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(212,162,76,0.12), 0 10px 40px rgba(0,0,0,0.38)',
        gold: '0 8px 30px rgba(212,162,76,0.12)'
      },
      backgroundImage: {
        premium: 'radial-gradient(circle at top right, rgba(212,162,76,0.16), transparent 28%), radial-gradient(circle at bottom left, rgba(159,107,32,0.1), transparent 30%)'
      }
    },
  },
  plugins: [],
}
