/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true, // Centers the container by default
        padding: "1rem", // Adds default padding to the container
      },
    },
  },
  plugins: [],
};
