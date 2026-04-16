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
        // Digital Arboretum — core palette
        primary: "#006565",
        "primary-container": "#008080",
        "on-primary": "#ffffff",
        "on-primary-container": "#e0f4f4",

        secondary: "#5d5c74",
        "secondary-container": "#e2e0fc",
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#1a1a2e",

        tertiary: "#156820",
        "tertiary-container": "#338236",
        "tertiary-fixed": "#a3f69c",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#f0fdf0",

        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",

        // Surface hierarchy (No-Line Rule)
        surface: "#f9f9fb",
        "surface-container-low": "#f3f3f5",
        "surface-container": "#ededef",
        "surface-container-high": "#e7e7e9",
        "surface-container-highest": "#e1e1e3",
        "surface-container-lowest": "#ffffff",

        // Text
        "on-surface": "#1a1a2e",
        "on-surface-variant": "#44475a",
        "outline-variant": "#bdc9c8",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
        md: "12px",
      },
      boxShadow: {
        ambient: "0 12px 40px rgba(26, 28, 29, 0.06)",
        glow: "0 0 20px rgba(0, 101, 101, 0.15)",
      },
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
