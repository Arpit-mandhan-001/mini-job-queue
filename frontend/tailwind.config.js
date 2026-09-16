/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0F766E', // Primary Teal
          accent: '#14B8A6',  // Accent Teal
        },
        slate: {
          dark: '#0F172A',   // Dark Slate
          subtle: '#64748B', // Slate text
        },
        surface: {
          bg: '#F8FAFC',     // Background
          card: '#FFFFFF',   // White cards
          border: '#E2E8F0', // Border
        },
        status: {
          success: '#16A34A', // Success
          warning: '#D97706', // Warning
          error: '#DC2626',   // Error
        },
      },
    },
  },
  plugins: [],
};
