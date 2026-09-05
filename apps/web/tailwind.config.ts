import type { Config } from "tailwindcss";

// Mirrors the basePath logic in next.config.js exactly. A raw CSS url(...)
// baked in here at Tailwind's build time is NOT rewritten by Next's asset
// prefixing the way next/image and next/link srcs are — so without this
// prefix, this background 404s on the deployed GitHub Pages site (which is
// served from /pbaginternational/...) even though it loads fine locally
// where the basePath is empty. This was the main reason the site's textured
// background disappeared once deployed.
const basePath = process.env.GITHUB_ACTIONS ? "/pbaginternational" : "";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D0D0D", // Deep cinematic black
        surface: "#2A1910", // Dark traditional earth/brown
        surfaceAlt: "#4A291A", // Lighter earth tone
        primary: {
          DEFAULT: "#B33924", // Deep rich traditional red
          dark: "#822617",
          light: "#E06D4D",
        },
        gold: "#D4AF37", // Cinematic gold
        coral: "#E64A19",
        emerald: "#2E7D32",
        cream: "#F9F6F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #822617 0%, #B33924 45%, #D4AF37 100%)",
        "brand-gradient-alt": "linear-gradient(135deg, #D4AF37 0%, #E64A19 60%, #B33924 100%)",
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(179,57,36,0.35), transparent 60%)",
        "african-pattern": `url('${basePath}/images/theme/pattern_background.webp')`,
      },
      boxShadow: {
        glow: "0 0 40px rgba(179,57,36,0.35)",
        "glow-gold": "0 0 40px rgba(212,175,55,0.30)",
        "dance-glow": "0 0 20px rgba(230,74,25,0.6), 0 0 40px rgba(212,175,55,0.4)",
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
          "75%": { transform: "rotate(2deg) scale(0.98)", borderColor: "#3B82F6" },
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
