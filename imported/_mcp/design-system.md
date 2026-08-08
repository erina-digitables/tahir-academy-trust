---
name: Liquid Editorial
colors:
  surface: '#fff8f3'
  surface-dim: '#e1d9d0'
  surface-bright: '#fff8f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2e9'
  surface-container: '#f5ede4'
  surface-container-high: '#efe7de'
  surface-container-highest: '#e9e1d8'
  on-surface: '#1e1b16'
  on-surface-variant: '#4e4639'
  inverse-surface: '#34302a'
  inverse-on-surface: '#f8efe6'
  outline: '#7f7667'
  outline-variant: '#d1c5b4'
  surface-tint: '#775a19'
  primary: '#775a19'
  on-primary: '#ffffff'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#e9c176'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#485e8b'
  on-tertiary: '#ffffff'
  tertiary-container: '#8fa5d6'
  on-tertiary-container: '#233a65'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#b0c6f9'
  on-tertiary-fixed: '#001a41'
  on-tertiary-fixed-variant: '#304671'
  background: '#fff8f3'
  on-background: '#1e1b16'
  surface-variant: '#e9e1d8'
  ivory: '#FCFAF5'
  parchment: '#F2EDE4'
  glass-fill: rgba(255, 255, 255, 0.4)
  gold-muted: '#D4B781'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '700'
    lineHeight: 92px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  quote:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  section-gap: 160px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
---

## Brand & Style

This design system establishes a high-end, editorial atmosphere for an educational trust, blending traditional academic authority with contemporary "liquid-glass" aesthetics. The brand personality is scholarly, sophisticated, and transparent, aimed at a community that values both heritage and forward-looking growth.

The visual style is a fusion of **Minimalism** and **Glassmorphism**. It utilizes expansive white space and a rigid underlying grid that is intentionally broken by asymmetrical elements to mimic the layout of luxury design journals. Translucent surfaces and subtle backdrop blurs provide a sense of physical depth and modernity, while high-contrast serif typography maintains a grounded, institutional feel.

## Colors

The palette is rooted in timeless, warm neutrals that evoke high-quality paper and traditional masonry.

- **Primary (Warm Gold):** Reserved for key brand accents, active states, and call-to-action highlights. It represents excellence and the "gold standard" of education.
- **Secondary (Deep Charcoal):** Used exclusively for typography and structural borders to ensure maximum legibility and a sharp, printed-press look.
- **Ivory & Parchment:** These serve as the foundational background layers, providing a warmer, more premium alternative to pure white.
- **Glass Fill:** A semi-transparent white used for frosted overlays, creating the "liquid-glass" effect when placed over imagery or subtle gradients.

## Typography

The typographic strategy relies on the contrast between a sophisticated, high-contrast serif and a clean, modern sans-serif.

Headlines use **Playfair Display** to communicate authority and the editorial narrative. Large "Display" sizes should be used sparingly for hero sections to create visual impact. Body text utilizes **Plus Jakarta Sans**, chosen for its friendly yet professional character and exceptional readability at smaller sizes. 

Special attention is given to `label-caps`, which should be used for section identifiers and breadcrumbs to assist navigation without cluttering the visual hierarchy.

## Layout & Spacing

The layout follows a 12-column fixed grid for desktop, but encourages asymmetrical placement of content blocks. 

- **Generous Whitespace:** Section gaps are intentionally large (160px) to allow content to "breathe" and to signal a premium experience.
- **Asymmetry:** Content should not always center-align. Use offset columns (e.g., a 5-column text block paired with a 7-column empty space or image) to create a magazine-style flow.
- **Fluid Reflow:** On tablet and mobile, the grid collapses to a single column with increased vertical margins, ensuring the editorial feel is maintained through typography and image scaling rather than complex layering.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Glassmorphism** rather than traditional drop shadows.

- **The Base:** The primary background uses the `ivory` or `parchment` tokens.
- **The Glass Layer:** Functional containers (like navigation bars or card overlays) use a `glass-fill` with a `24px` backdrop blur. This allows colors and images from the background to bleed through softly, creating the "liquid" effect.
- **Outlines:** Use very thin (1px), low-contrast borders in `secondary_color` at 10% opacity to define glass edges without breaking the fluid aesthetic.
- **Shadows:** If used, they must be "Ambient Shadows"—extremely diffused (blur > 40px), low opacity (< 5%), and tinted with the primary gold color to suggest warmth.

## Shapes

The shape language is "Soft" yet structured. 

Standard components like buttons and input fields use a `0.25rem` radius to maintain a professional edge. However, large "Liquid-glass" containers and feature imagery can utilize a more pronounced `rounded-lg` (0.5rem) or even `rounded-xl` (0.75rem) to emphasize the fluid, organic nature of the design system. Avoid pill-shaped elements as they conflict with the editorial, structured grid.

## Components

- **Buttons:** Primary buttons are solid `primary_color` with `secondary_color` text. Secondary buttons use a transparent background with a 1px border and a subtle hover state that introduces the glass blur.
- **Chips:** Small, rectangular labels with `label-caps` typography. Use `parchment` backgrounds for subtle categorization.
- **Cards:** Editorial-style cards should have no visible border; instead, use the `glass-fill` background and backdrop blur to separate them from the main surface. Content inside should follow the asymmetrical spacing rules.
- **Input Fields:** Clean, bottom-border-only or very light outlined boxes. Focus states should transition the border color to `primary_color` (Gold).
- **Navigation:** A persistent glassmorphic bar at the top of the viewport. Links use `label-caps` for a refined, minimal look.
- **Lists:** Service lists (e.g., Sanatayn Course) should be separated by thin, full-width dividers in 10% opacity charcoal, emphasizing the verticality of the layout.
