/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#f6f6ff",
        highlight: "#E7E7FF",
        primary: {
          DEFAULT: "#474292",
          50: "#B3B0DB",
          100: "#A5A2D5",
          200: "#8A86C8",
          300: "#6F6ABC",
          400: "#554FAE",
          500: "#474292",
          600: "#34316B",
          700: "#211F45",
          800: "#0F0E1E",
        },
        action: {
          DEFAULT: "#32CD32",
          50: "#C6F1C6",
          100: "#B5EDB5",
          200: "#94E594",
          300: "#74DD74",
          400: "#53D553",
          500: "#32CD32",
          600: "#27A027",
          700: "#1C731C",
          800: "#114611",
          900: "#061906",
          950: "#010201",
        },
        progress: {
          100: "#1a9850",
          200: "#1a9850",
          300: "#66bd63",
          400: "#a6d96a",
          500: "#fdae61",
          600: "#f46d43",
          700: "#d73027",
          800: "#a50026",
          900: "#a50026",
        },
      },
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
    },
  },
  plugins: [],
};
