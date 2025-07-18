/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "heart-red": "#E63946",
        "deep-navy": "#1D3557",
        "soft-white": "#F1FAEE",
        "sky-blue": "#457B9D",
        "mint-green": "#A8DADC",
        "sun-gold": "#FFB703",
        "slate-gray": "#495057",
        "light-gray": "#E5E5E5",
        charcoal: "#22223B",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "Nunito", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
