import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1.5rem', // 24px
      screens: {
        '2xl': '1280px', // max-w-7xl
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Montserrat', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        waveform: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '32px' },
        },
        'waveform-sm': {
          '0%, 100%': { height: '6px' },
          '50%': { height: '20px' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'beam-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        waveform: 'waveform 1.2s ease-in-out infinite',
        'waveform-sm': 'waveform-sm 1s ease-in-out infinite',
        aurora: 'aurora 8s ease infinite',
        'beam-pulse': 'beam-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'float-up': 'float-up 0.6s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      backgroundImage: {
        'mesh-primary': 'radial-gradient(at 40% 20%, hsl(var(--primary) / 0.3) 0px, transparent 50%)',
        'mesh-accent': 'radial-gradient(at 80% 0%, hsl(var(--accent) / 0.25) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 0% 80%, hsl(220 60% 5% / 0.8) 0px, transparent 50%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
