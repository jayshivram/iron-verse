/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['KirimomiSwash', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: 'oklch(var(--ink-950) / <alpha-value>)',
          900: 'oklch(var(--ink-900) / <alpha-value>)',
          800: 'oklch(var(--ink-800) / <alpha-value>)',
          700: 'oklch(var(--ink-700) / <alpha-value>)',
          600: 'oklch(var(--ink-600) / <alpha-value>)',
          500: 'oklch(var(--ink-500) / <alpha-value>)',
          400: 'oklch(var(--ink-400) / <alpha-value>)',
          300: 'oklch(var(--ink-300) / <alpha-value>)',
          200: 'oklch(var(--ink-200) / <alpha-value>)',
          100: 'oklch(var(--ink-100) / <alpha-value>)',
          50:  'oklch(var(--ink-50)  / <alpha-value>)',
        },
        amber: {
          950: 'oklch(var(--amber-950) / <alpha-value>)',
          900: 'oklch(var(--amber-900) / <alpha-value>)',
          800: 'oklch(var(--amber-800) / <alpha-value>)',
          700: 'oklch(var(--amber-700) / <alpha-value>)',
          600: 'oklch(var(--amber-600) / <alpha-value>)',
          DEFAULT: 'oklch(var(--amber-500) / <alpha-value>)',
          500: 'oklch(var(--amber-500) / <alpha-value>)',
          400: 'oklch(var(--amber-400) / <alpha-value>)',
          300: 'oklch(var(--amber-300) / <alpha-value>)',
          200: 'oklch(var(--amber-200) / <alpha-value>)',
          100: 'oklch(var(--amber-100) / <alpha-value>)',
          50:  'oklch(var(--amber-50)  / <alpha-value>)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-down': 'fadeDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink.100'),
            a: { color: theme('colors.amber.DEFAULT'), textDecoration: 'none' },
            h1: { color: theme('colors.ink.50') },
            h2: { color: theme('colors.ink.50') },
            h3: { color: theme('colors.ink.100') },
            blockquote: {
              borderLeftColor: theme('colors.amber.DEFAULT'),
              color: theme('colors.ink.200'),
            },
            code: {
              color: theme('colors.amber.300'),
              backgroundColor: theme('colors.ink.800'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      }),
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'paper-texture': "url('/images/ui/paper-texture.webp')",
      },
      boxShadow: {
        'amber-sm': '0 0 12px oklch(65% 0.155 48 / 0.15)',
        'amber-md': '0 0 24px oklch(65% 0.155 48 / 0.25)',
        'amber-lg': '0 0 48px oklch(65% 0.155 48 / 0.30)',
        'ink': '0 4px 24px oklch(8% 0.012 48 / 0.6)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
