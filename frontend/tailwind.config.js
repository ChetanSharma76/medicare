/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary': "#5f6FFF",
      },
      gridTemplateColumns:{
        'auto' : 'repeat(auto-fill,minmax(150px,1fr))'
      },
      boxShadow: {
        blue: '0 4px 10px rgba(0, 0, 255, 0.5)',
      },
    },
  },
  plugins: [],
}