/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Aptos",
          "Segoe UI Variable Text",
          "Segoe UI",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Aptos Display",
          "Segoe UI Variable Display",
          "Segoe UI",
          "Inter",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        ink: "#143956",
        graphite: "#205984",
        steel: "#b3c5d4",
        platinum: "#f2f7fb",
        amber: "#9fd6f5",
        gold: "#cfeeff",
        sun: "#b96532",
        petrol: "#28709d",
        signal: "#a61b1b",
      },
      boxShadow: {
        premium: "0 24px 70px rgba(12, 45, 73, 0.30)",
        glow: "0 0 0 1px rgba(159, 214, 245, 0.17), 0 18px 56px rgba(42, 112, 162, 0.17)",
      },
      backgroundImage: {
        "fine-grid":
          "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
        "metal-line": "linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.055))",
      },
    },
  },
  plugins: [],
};
