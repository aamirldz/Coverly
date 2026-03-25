import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#FA7000",
          light: "#FF8C33",
          dark: "#D45F00",
          glow: "rgba(250, 112, 0, 0.15)",
        },
        dark: {
          DEFAULT: "#FFFFFF",
          card: "#F5F5F5",
          border: "#E5E5E5",
          hover: "#EEEEEE",
        },
        text: {
          primary: "#111111",
          secondary: "#555555",
          muted: "#999999",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        badge: {
          new: "#FA7000",
          bestseller: "#D4A017",
          forher: "#EC4899",
          lowstock: "#EF4444",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Playfair Display", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        "card": "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 12px 40px rgba(250, 112, 0, 0.12)",
        "glow": "0 0 30px rgba(250, 112, 0, 0.25)",
      },
      borderRadius: {
        "card": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
