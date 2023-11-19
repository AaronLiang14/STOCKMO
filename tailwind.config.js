/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        indexImage: "url('./src/pages/Home/indexBG.png')",
      },
    },
  },
  plugins: [],
};
