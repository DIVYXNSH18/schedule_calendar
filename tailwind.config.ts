import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        calendar: {
          surface: "#f7f9ff",
          "surface-container-lowest": "#ffffff",
          "surface-container-low": "#f1f5ff",
          "surface-container": "#eaf0fb",
          "surface-container-high": "#e2eaf8",
          line: "#d7deea",
          primary: "#0b57d0",
          "primary-container": "#d8e2ff",
          "on-primary-container": "#001a41",
          secondary: "#006a6a",
          "secondary-container": "#bbebea",
          tertiary: "#8c1d5d",
          "tertiary-container": "#ffd8e8",
          amber: "#a65f00",
          "amber-container": "#ffddb0",
        },
      },
      boxShadow: {
        create:
          "0 3px 8px rgba(60,64,67,0.16), 0 1px 3px rgba(60,64,67,0.22)",
        "create-hover": "0 8px 18px rgba(60,64,67,0.18), 0 3px 8px rgba(60,64,67,0.14)",
        "m3-container": "0 1px 2px rgba(60,64,67,0.10), 0 2px 8px rgba(60,64,67,0.08)",
        "m3-lifted": "0 12px 32px rgba(60,64,67,0.18), 0 4px 12px rgba(60,64,67,0.12)",
      },
      keyframes: {
        "m3-enter": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "m3-pop": {
          "0%": { transform: "scale(0.94)" },
          "70%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "m3-enter": "m3-enter 240ms cubic-bezier(0.2, 0, 0, 1)",
        "m3-pop": "m3-pop 280ms cubic-bezier(0.2, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
