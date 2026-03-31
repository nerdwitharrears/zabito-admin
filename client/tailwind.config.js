/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#185FA5',
        'status-green': '#3B6D11',
        'status-red': '#993C1D',
        'status-amber': '#854F0B',
        surface: {
          light: '#f5f5f5',
          dark: '#1e1e1e',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
