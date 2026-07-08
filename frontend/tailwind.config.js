/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        // font-serif → elegant display font for headings across the app
        serif: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        // font-sans → clean modern body font
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        float: "float 3s ease-in-out infinite",
        "slide-down": "slide-down 0.25s ease-out both",
        kenburns: "kenburns 18s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
}
