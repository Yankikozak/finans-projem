import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: "#05060a",
          surface: "#0c0e14",
          card: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.08)",
          accent: "#00e5a0",
          accent2: "#3b82f6",
          danger: "#ff4d6d",
          warn: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 229, 160, 0.15)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(ellipse at top, rgba(0,229,160,0.12), transparent 50%)",
        "mesh": "linear-gradient(135deg, #05060a 0%, #0a1628 50%, #05060a 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
