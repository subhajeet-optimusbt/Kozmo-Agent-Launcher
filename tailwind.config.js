export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 6s linear infinite",
        "spin-reverse": "spin-reverse 4s linear infinite",
        core: "core 2.5s ease-in-out infinite",
      },
      keyframes: {
        "spin-reverse": {
          to: { transform: "rotate(-360deg)" },
        },
        core: {
          "0%, 100%": {
            transform: "scale(1)",
            filter: "brightness(1)",
          },
          "50%": {
            transform: "scale(1.15)",
            filter: "brightness(1.2)",
          },
        },
      },
    },
  },
  plugins: [],
};
