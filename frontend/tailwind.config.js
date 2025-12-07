/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--fg)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-text)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--color-text)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted)",
        border: "var(--border)",
        input: "var(--color-card)",
        ring: "var(--primary)",
        destructive: "hsl(0 84% 60%)",
        "destructive-foreground": "#ffffff",
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        card: '0.5rem',
        button: '0.375rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms'
      },
      fontSize: {
        body: ['16px', { lineHeight: '1.6' }],
      },
      fontWeight: {
        heading: '600',
      }
    }
  },
  plugins: [require('daisyui'), require("tailwindcss-animate")],
  daisyui: {
    themes: false,
    darkTheme: false,
  }
}