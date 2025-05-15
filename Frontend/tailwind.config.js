/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1', // Indigo
          hover: '#4f46e5',
          light: '#a5b4fc',
          dark: '#4338ca',
        },
        secondary: {
          DEFAULT: '#ec4899', // Pink
          hover: '#db2777',
          light: '#fbcfe8',
        },
        accent: {
          DEFAULT: '#8b5cf6', // Violet
          hover: '#7c3aed',
          light: '#ddd6fe',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        error: '#ef4444',   // Red
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px rgba(0,0,0,0.75)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropFilter: {
        'glass': 'blur(4px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
}
