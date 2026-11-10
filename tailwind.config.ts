import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050C08",
        panel: "#0D1813",
        panelAlt: "#11221B",
        gold: {
          DEFAULT: "#FFB800",
          light: "#FFE500",
          dark: "#D99B00",
          glow: "rgba(255, 184, 0, 0.25)",
        },
        iqGreen: {
          DEFAULT: "#00E676",
          light: "#22C55E",
          dark: "#00A844",
          glow: "rgba(0, 230, 118, 0.25)",
        },
        profit: "#00E676",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glowGold: "0 0 30px rgba(255, 184, 0, 0.22)",
        glowGreen: "0 0 30px rgba(0, 230, 118, 0.22)",
        glowDouble: "0 0 35px rgba(255, 184, 0, 0.15), 0 0 50px rgba(0, 230, 118, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
