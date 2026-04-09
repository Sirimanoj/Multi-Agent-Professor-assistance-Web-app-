/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#5D3FD3",
        "secondary": "#7C3AED",
        "accent": "#C084FC",
        "surface-container-lowest": "#ffffff",
        "background": "#FDFDFF",
      },
      fontFamily: {
        "headline": ["Newsreader", "serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"]
      },
      boxShadow: {
        'luminous': '0 10px 40px -10px rgba(93, 63, 211, 0.12), 0 0 20px -5px rgba(93, 63, 211, 0.05)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'soft-3d': 'inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 10px 30px -5px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
