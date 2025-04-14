import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Montserrat", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["Open Sans", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        status: {
          "not-started": "hsl(var(--not-started))",
          "in-progress": "hsl(var(--in-progress))",
          "completed": "hsl(var(--completed))",
        },
        roadmap: {
          dark: "#0A0F1C",
          neon: "#10F3AF",
          violet: "#6D28D9",
          blue: "#38BDF8",
          yellow: "#FFB020",
          green: "#22C55E",
          electric: "#00E5FF",
          cyber: "#00FFC8",
          slate: "#1E293B",
          graphite: "#334155",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px 0 rgba(var(--primary-rgb), 0.5)" },
          "50%": { boxShadow: "0 0 15px 5px rgba(var(--primary-rgb), 0.7)" }
        },
        "pulse-glow-blue": {
          "0%, 100%": { boxShadow: "0 0 5px 0 rgba(var(--blue-rgb), 0.5)" },
          "50%": { boxShadow: "0 0 15px 5px rgba(var(--blue-rgb), 0.7)" }
        },
        "pulse-glow-yellow": {
          "0%, 100%": { boxShadow: "0 0 5px 0 rgba(var(--yellow-rgb), 0.5)" },
          "50%": { boxShadow: "0 0 15px 5px rgba(var(--yellow-rgb), 0.7)" }
        },
        "pulse-glow-green": {
          "0%, 100%": { boxShadow: "0 0 5px 0 rgba(var(--green-rgb), 0.5)" },
          "50%": { boxShadow: "0 0 15px 5px rgba(var(--green-rgb), 0.7)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        "morph-to-line": {
          "0%": { borderRadius: "0.75rem", height: "auto" },
          "100%": { borderRadius: "9999px", height: "0.25rem" },
        },
        "morph-to-card": {
          "0%": { borderRadius: "9999px", height: "0.25rem" },
          "100%": { borderRadius: "0.75rem", height: "auto" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" }
        },
        "rotate-in": {
          "0%": { transform: "rotate(-10deg) scale(0.95)", opacity: "0" },
          "100%": { transform: "rotate(0deg) scale(1)", opacity: "1" }
        },
        "circuit-pulse": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.03)" }
        },
        "data-flow": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "module-appear": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "tech-breathe": {
          "0%, 100%": { boxShadow: "0 0 5px 2px rgba(var(--primary-rgb), 0.3)" },
          "50%": { boxShadow: "0 0 15px 5px rgba(var(--primary-rgb), 0.6)" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow-blue": "pulse-glow-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow-yellow": "pulse-glow-yellow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow-green": "pulse-glow-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "morph-to-line": "morph-to-line 0.5s ease-out forwards",
        "morph-to-card": "morph-to-card 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out",
        "scale-out": "scale-out 0.3s ease-out",
        "rotate-in": "rotate-in 0.5s ease-out",
        "circuit-pulse": "circuit-pulse 4s ease-in-out infinite",
        "data-flow": "data-flow 8s linear infinite",
        "module-appear": "module-appear 0.6s ease-out forwards",
        "tech-breathe": "tech-breathe 3s infinite",
      },
      boxShadow: {
        'glow': '0 0 10px 0 rgba(var(--primary-rgb), 0.3)',
        'glow-lg': '0 0 20px 5px rgba(var(--primary-rgb), 0.4)',
        'neo': '5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.07)',
        'inner-glow': 'inset 0 0 15px 0 rgba(var(--primary-rgb), 0.2)',
      },
      backgroundImage: {
        'gradient-tech': 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.05) 0%, rgba(var(--secondary-rgb), 0.05) 100%)',
        'circuit-pattern': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtOGgtMnYtNGgxMnY0aC0ydjhoMnY0aC0ydjRoLTh2LTR6bTAgMGgydjRoLTJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
