/**
 * Tailwind config — a thin mapping onto src/styles/tokens.css.
 * Nothing here declares a value of its own.
 */

const ink = (alphaVar) => `rgb(var(--color-ink) / var(${alphaVar}))`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          soft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
          pale: 'rgb(var(--color-accent-pale) / <alpha-value>)',
        },
        green: {
          DEFAULT: 'rgb(var(--color-green) / <alpha-value>)',
          deep: 'rgb(var(--color-green-deep) / <alpha-value>)',
          soft: 'rgb(var(--color-green-soft) / <alpha-value>)',
          wash: 'rgb(var(--color-green-wash) / <alpha-value>)',
        },
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },

      // Role-named text colours. Prefer these over ink/NN so a contrast change
      // is a one-line token edit rather than a find-and-replace.
      textColor: {
        strong: ink('--text-strong'),
        body: ink('--text-body'),
        muted: ink('--text-muted'),
        faint: ink('--text-faint'),
      },

      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },

      fontSize: {
        hero: ['var(--text-hero)', { lineHeight: 'var(--leading-hero)', letterSpacing: 'var(--tracking-display)' }],
        display: ['var(--text-display)', { lineHeight: 'var(--leading-display)', letterSpacing: 'var(--tracking-display)' }],
        headline: ['var(--text-headline)', { lineHeight: 'var(--leading-headline)', letterSpacing: 'var(--tracking-display)' }],
        title: ['var(--text-title)', { lineHeight: 'var(--leading-title)', letterSpacing: 'var(--tracking-display)' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: 'var(--leading-body)' }],
        'body-md': ['var(--text-body-md)', { lineHeight: 'var(--leading-body)' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: 'var(--leading-body)' }],
        label: ['var(--text-label)', { lineHeight: 'var(--leading-label)', letterSpacing: 'var(--tracking-label)' }],
      },

      spacing: {
        '3xs': 'var(--space-3xs)', '2xs': 'var(--space-2xs)', xs: 'var(--space-xs)',
        sm: 'var(--space-sm)', md: 'var(--space-md)', lg: 'var(--space-lg)',
        xl: 'var(--space-xl)', '2xl': 'var(--space-2xl)', '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)', '5xl': 'var(--space-5xl)',
        gutter: 'var(--space-gutter)',
        'margin-mobile': 'var(--space-margin-mobile)',
        'margin-desktop': 'var(--space-margin-desktop)',
      },

      maxWidth: {
        container: 'var(--space-container-max)',
        nav: 'var(--space-container-nav)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-DEFAULT)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        lift: 'var(--shadow-lift)',
        accent: 'var(--shadow-accent)',
        none: 'none',
      },

      backdropBlur: { glass: 'var(--glass-blur)' },

      zIndex: {
        behind: 'var(--z-behind)', base: 'var(--z-base)', media: 'var(--z-media)',
        content: 'var(--z-content)', sticky: 'var(--z-sticky)', nav: 'var(--z-nav)',
        overlay: 'var(--z-overlay)', modal: 'var(--z-modal)', toast: 'var(--z-toast)',
      },

      transitionTimingFunction: {
        entrance: 'var(--ease-entrance)',
        line: 'var(--ease-line)',
        overshoot: 'var(--ease-overshoot)',
        standard: 'var(--ease-standard)',
      },

      transitionDuration: {
        fast: 'var(--duration-fast)',
        hover: 'var(--duration-hover)',
        zoom: 'var(--duration-card-zoom)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
