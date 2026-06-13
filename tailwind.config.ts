import type { Config } from "tailwindcss";

/**
 * Design tokens — "Forno" theme.
 * Mirrors the token set intended for the Figma design-system file
 * (Design System – Claude Code / High-fidelity).
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        flour: "#FFF7EE",      // app background — warm flour white
        cocoa: "#2B1A10",      // primary ink
        crumb: "#A1846C",      // muted text
        marinara: "#F4730C",   // brand accent (chip / FAB gradient)
        roast: "#C15702",      // deeper accent — price + rating stars
        ember: "#FFA52E",      // accent gradient end
        walnut: { 700: "#6B4226", 800: "#54331D", 900: "#3E2414" }, // plate wood
        basil: "#3E7C3A",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        plate: "0 24px 48px -16px rgba(62, 36, 20, 0.45)",
        pizza: "0 18px 30px -12px rgba(43, 26, 16, 0.40)",
        fab: "0 10px 24px -6px rgba(244, 115, 12, 0.55)",
      },
    },
  },
  plugins: [],
} satisfies Config;
