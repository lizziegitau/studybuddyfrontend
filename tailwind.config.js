/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#9381FF",
        secondary: "#B8B8FF",
        background: "#FFEEDD",
        accent: "#F8F7FF",
        highlight: "#FFD8BE",
      },
    },
  },
  plugins: [],
}

