/**
 * Tailwind config — a thin mapping onto src/styles/tokens.css.
 *
 * Nothing here declares a value of its own. Every entry points at a custom
 * property so the token file stays the single source of truth. Colors go
 * through `rgb(var(--x) / <alpha-value>)` so opacity modifiers compose.
 *
 * Replaces the inline `tailwind.config` the Stitch import shipped in a <script>
 * tag alongside the CDN runtime compiler.
 */

/** Build a token-backed color that supports Tailwind's `/opacity` syntax. */
const c = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: c('surface'),
          dim: c('surface-dim'),
          bright: c('surface-bright'),
          'container-lowest': c('surface-container-lowest'),
          'container-low': c('surface-container-low'),
          container: c('surface-container'),
          'container-high': c('surface-container-high'),
          'container-highest': c('surface-container-highest'),
          variant: c('surface-variant'),
          tint: c('surface-tint'),
        },
        'on-surface': { DEFAULT: c('on-surface'), variant: c('on-surface-variant') },
        'inverse-surface': c('inverse-surface'),
        'inverse-on-surface': c('inverse-on-surface'),
        background: c('background'),
        'on-background': c('on-background'),

        primary: { DEFAULT: c('primary'), container: c('primary-container'), fixed: c('primary-fixed'), 'fixed-dim': c('primary-fixed-dim') },
        'on-primary': { DEFAULT: c('on-primary'), container: c('on-primary-container'), fixed: c('on-primary-fixed'), 'fixed-variant': c('on-primary-fixed-variant') },
        'inverse-primary': c('inverse-primary'),

        secondary: { DEFAULT: c('secondary'), container: c('secondary-container'), fixed: c('secondary-fixed'), 'fixed-dim': c('secondary-fixed-dim') },
        'on-secondary': { DEFAULT: c('on-secondary'), container: c('on-secondary-container'), fixed: c('on-secondary-fixed'), 'fixed-variant': c('on-secondary-fixed-variant') },

        tertiary: { DEFAULT: c('tertiary'), container: c('tertiary-container'), fixed: c('tertiary-fixed'), 'fixed-dim': c('tertiary-fixed-dim') },
        'on-tertiary': { DEFAULT: c('on-tertiary'), container: c('on-tertiary-container'), fixed: c('on-tertiary-fixed'), 'fixed-variant': c('on-tertiary-fixed-variant') },

        outline: { DEFAULT: c('outline'), variant: c('outline-variant') },
        error: { DEFAULT: c('error'), container: c('error-container') },
        'on-error': { DEFAULT: c('on-error'), container: c('on-error-container') },

        ivory: c('ivory'),
        parchment: c('parchment'),
        'gold-muted': c('gold-muted'),
        glass: c('glass'),
      },

      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },

      // Each entry carries its own line-height, weight and tracking, so a single
      // `text-*` class fully expresses one named style from the design system.
      // The fluid entries retire the fixed 84px hero that never shrank.
      fontSize: {
        'display-hero': ['var(--text-display-hero-fluid)', {
          lineHeight: 'var(--leading-display-hero)',
          letterSpacing: 'var(--tracking-display-hero)',
          fontWeight: 'var(--weight-display-hero)',
        }],
        'headline-lg': ['var(--text-headline-lg-fluid)', {
          lineHeight: 'var(--leading-headline-lg)',
          fontWeight: 'var(--weight-headline-lg)',
        }],
        'headline-md': ['var(--text-headline-md-fluid)', {
          lineHeight: 'var(--leading-headline-md)',
          fontWeight: 'var(--weight-headline-md)',
        }],
        'headline-sm': ['var(--text-headline-sm)', {
          lineHeight: 'var(--leading-headline-sm)',
          fontWeight: 'var(--weight-headline-sm)',
        }],
        'body-lg': ['var(--text-body-lg)', {
          lineHeight: 'var(--leading-body-lg)',
          fontWeight: 'var(--weight-body-lg)',
        }],
        'body-md': ['var(--text-body-md)', {
          lineHeight: 'var(--leading-body-md)',
          fontWeight: 'var(--weight-body-md)',
        }],
        'label-caps': ['var(--text-label-caps)', {
          lineHeight: 'var(--leading-label-caps)',
          letterSpacing: 'var(--tracking-label-caps)',
          fontWeight: 'var(--weight-label-caps)',
        }],
        quote: ['var(--text-quote-fluid)', {
          lineHeight: 'var(--leading-quote)',
          fontWeight: 'var(--weight-quote)',
        }],
      },

      spacing: {
        '3xs': 'var(--space-3xs)',
        '2xs': 'var(--space-2xs)',
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        gutter: 'var(--space-gutter)',
        'margin-mobile': 'var(--space-margin-mobile)',
        'margin-desktop': 'var(--space-margin-desktop)',
        'section-gap': 'var(--space-section-gap)',
        'section-gap-mobile': 'var(--space-section-gap-mobile)',
      },

      maxWidth: { 'container-max': 'var(--space-container-max)' },

      height: {
        'media-sm': 'var(--size-media-sm)',
        'media-md': 'var(--size-media-md)',
        'media-lg': 'var(--size-media-lg)',
      },

      // Restored from the design system. The import had this scale shifted one
      // step down with `full` clamped to 0.75rem.
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-DEFAULT)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        'ambient-sm': 'var(--shadow-ambient-sm)',
        ambient: 'var(--shadow-ambient)',
        'ambient-lg': 'var(--shadow-ambient-lg)',
        glass: 'var(--shadow-glass)',
        none: 'none',
      },

      backdropBlur: { glass: 'var(--glass-blur)' },

      zIndex: {
        behind: 'var(--z-behind)',
        base: 'var(--z-base)',
        raised: 'var(--z-raised)',
        sticky: 'var(--z-sticky)',
        nav: 'var(--z-nav)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
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
        exit: 'var(--duration-exit)',
        conditional: 'var(--duration-conditional)',
        media: 'var(--duration-media)',
        entrance: 'var(--duration-entrance)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
