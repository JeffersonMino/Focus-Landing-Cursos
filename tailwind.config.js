/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        white: "#f2e8d8",
        black: "#070006",
        focus: {
          orange: "#d12d5b",
          amber: "#f2e8d8",
          black: "#070006",
          ink: "#120008",
          graphite: "#1f0711",
          smoke: "#f2e8d8",
          cyan: "#c9a9a2",
          wine: "#2a0612",
          plum: "#4d0b22"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ],
        display: [
          "Manrope",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 0 60px rgba(209, 45, 91, 0.28)"
      },
      backgroundImage: {
        "film-grain": "radial-gradient(circle at 20% 20%, rgba(242,232,216,.08), transparent 28%), linear-gradient(135deg, rgba(209,45,91,.2), transparent 45%)"
      }
    }
  },
  plugins: []
};
