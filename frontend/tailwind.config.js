/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }, // %50 çünkü içerik iki kez kopyalanacak
        },
        slideDown: {
          "0%": { transform: "translateY(-30px) scale(0.95)", opacity: "0" },
          "60%": { transform: "translateY(10px) scale(1.02)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        fadeInDown: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-60px) scale(1.02)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        slideOutRight: {
          "0%": { opacity: "1", transform: "translateX(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateX(60px) scale(0.98)" },
        },
        toastFadeIn: {
          "0%": { opacity: "0", transform: "translateX(60px) scale(1.02)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        errorToastFadeIn: {
          "0%": { opacity: "0", transform: "translateX(-60px)" },
          "100%": { opacity: "1", transform: "translateX(0) " },
        },
        cartBounce: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "25%": { transform: "scale(1.3)", opacity: "1" },
          "50%": { transform: "scale(0.95)", opacity: "0.95" },
          "75%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        slideDown: "slideDown 1.4s ease-in-out",
        slideInLeft: "slideInLeft 1.2s ease-out forwards",
        slideOutRight: "slideOutRight 1s ease-in forwards",
        toastFadeIn: "toastFadeIn 0.6s ease-in-out",
        errorToastFadeIn: "errorToastFadeIn 0.6s ease-in-out",
        fadeInDown: "fadeInDown 0.4s ease-out forwards",
        fadeInLeft: "fadeInLeft 0.2s ease-out forwards",
        cartBounce: "cartBounce 500ms ease-out",
      },
    },
  },
  plugins: [],
};
