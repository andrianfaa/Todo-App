/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
      },
      colors: ({ colors }) => ({
        ...colors,
        primary: {
          DEFAULT: "#005FF9",
          light: "#85B3FC",
          dark: "#0043AE",
        },
      }),
    },
  },
  plugins: [],
};