import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#120B23",
        surface: "#1B1130",
        surfaceAlt: "#241640",
        primary: {
          DEFAULT: "#7C3AED",
          dark: "#5B21B6",
          light: "#A78BFA",
        },
        gold: "#F5B400",
        coral: "#FB5D5D",
        emerald: "#22C55E",
        cream: "#FCF7F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #5B21B6 0%, #7C3AED 45%, #FB5D5D 100%)",
        "brand-gradient-alt": "linear-gradient(135deg, #F5B400 0%, #FB5D5D 60%, #7C3AED 100%)",
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.35), transparent 60%)",
        "african-pattern": "url('/images/brand/kikuyu-theme-1.jpg')",
      },
      boxShadow: {
        glow: "0 0 40px rgba(124,58,237,0.35)",
        "glow-gold": "0 0 40px rgba(245,180,0,0.30)",
        "dance-glow": "0 0 20px rgba(251,93,93,0.6), 0 0 40px rgba(245,180,0,0.4)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-40px) scale(1.08)" },
          "66%": { transform: "translate(-24px,20px) scale(0.95)" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        dance: {
          "0%, 100%": { transform: "rotate(-2deg) scale(1.02)", borderColor: "#F5B400" },
          "25%": { transform: "rotate(2deg) scale(0.98)", borderColor: "#FB5D5D" },
          "50%": { transform: "rotate(-2deg) scale(1.02)", borderColor: "#22C55E" },
          "75%": { transform: "rotate(2deg) scale(0.98)", borderColor: "#7C3AED" },
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
        shimmer: "shimmer 2.4s linear infinite",
        blob: "blob 12s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
        dance: "dance 0.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
