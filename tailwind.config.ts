import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--cream)",
        surface: "var(--white)",
        surface2: "var(--parchment)",
        primary: "var(--sage-dark)",
        text: {
          primary: "var(--charcoal)",
          muted: "var(--warm)",
        },
        cream: "var(--cream)",
        parchment: "var(--parchment)",
        sage: {
          light: "var(--sage-light)",
          DEFAULT: "var(--sage)",
          dark: "var(--sage-dark)",
        },
        gold: {
          light: "var(--gold-light)",
          DEFAULT: "var(--gold)",
        },
        rose: {
          light: "var(--rose-light)",
          DEFAULT: "var(--rose)",
        },
        charcoal: "var(--charcoal)",
        warm: "var(--warm)",
        white: "var(--white)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        syne: ["var(--font-cormorant)", "Georgia", "serif"],
        inter: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "spin-slower": "spin 12s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "float": "float 5s ease-in-out infinite",
        "blob": "blob 8s ease-in-out infinite",
        "marquee": "marquee 22s linear infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-16px) rotate(2deg)" },
        },
        blob: {
          "0%, 100%": { borderRadius: "60% 40% 55% 45%/50% 60% 40% 50%" },
          "33%": { borderRadius: "45% 55% 40% 60%/60% 40% 55% 45%" },
          "66%": { borderRadius: "55% 45% 60% 40%/45% 55% 45% 55%" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
