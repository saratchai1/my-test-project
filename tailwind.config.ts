import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wellness: {
          50: "#f1faf6",
          100: "#dff3e8",
          200: "#bce6d0",
          300: "#8fd3b1",
          400: "#5cba8c",
          500: "#36a06d",
          600: "#258257",
          700: "#1f6848",
          800: "#1c533a",
          900: "#184530",
        },
        sky: {
          50: "#f0f7fb",
          100: "#dbecf5",
          500: "#3a8fb7",
          600: "#2a7398",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(31, 104, 72, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
