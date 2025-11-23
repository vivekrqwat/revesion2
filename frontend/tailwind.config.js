/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
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
        // Dark theme colors (existing)
        background: "hsl(215, 22%, 10%)",
        foreground: "hsl(215, 40%, 96%)",

        card: "hsl(215, 20%, 13%)",
        "card-foreground": "hsl(215, 40%, 98%)",

        primary: "hsl(215, 75%, 60%)",
        "primary-foreground": "hsl(215, 30%, 99%)",

        secondary: "hsl(215, 25%, 20%)",
        "secondary-foreground": "hsl(215, 60%, 92%)",

        accent: "hsl(215, 28%, 24%)",
        "accent-foreground": "hsl(215, 60%, 96%)",

        muted: "hsl(215, 20%, 18%)",
        "muted-foreground": "hsl(215, 20%, 70%)",

        popover: "hsl(215, 20%, 12%)",
        input: "hsl(215, 20%, 22%)",

        ring: "hsl(215, 65%, 60%)",
        border: "hsl(215, 23%, 24%)",
        
        destructive: "hsl(0, 84%, 60%)",
        "destructive-foreground": "hsl(0, 0%, 100%)",
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        card: '0.5rem',
        button: '0.375rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
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
    themes: [
      {
        // Light theme
        light: {
          "primary": "#0066CC",
          "secondary": "#616161",
          "accent": "#22c55e",
          "neutral": "#FAFAFA",
          "base-100": "#FFFFFF",
          "base-200": "#FAFAFA",
          "base-300": "#E0E0E0",
          "info": "#3abff8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "0.25rem",
          "--tab-border": "1px",
          "--tab-radius": "0.375rem",
          
          // CSS Variables for light theme
          "--color-primary": "#212121",
          "--color-secondary": "#616161",
          "--color-background": "#FAFAFA",
          "--color-card": "#FFFFFF",
          "--color-border": "#E0E0E0",
        }
      },
      {
        // Dark theme (notehub)
        notehub: {
          "primary": "#facc15",
          "secondary": "#2C2C2C",
          "accent": "#22c55e",
          "neutral": "#1F1D1D",
          "base-100": "#1F1D1D",
          "base-200": "#2C2C2C",
          "base-300": "#3A3A3A",
          "info": "#3abff8",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        }
      }
    ],
    darkTheme: "notehub",
    base: true,
    styled: true,
    utils: true,
    logs: true,
    themeOrder: ["light", "notehub"],
  },
}