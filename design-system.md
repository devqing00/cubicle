# Oboe Warm Minimal Design System

## Overview
Oboe is an AI-powered conversational interface with a warm, parchment-toned aesthetic. The design uses a near-white warm background (#fcfaf8), muted brown-gray text, and a restrained palette of earthy neutrals. The chat UI is centered with generous whitespace, a pill-shaped input bar at the bottom, and a minimal left sidebar. Typography features Palmore for elegant headers, paired with Lora for body text, creating a warm, editorial tone. The "Sign up for free" CTA uses a soft yellow (#fff1c7) fill, the only accent color in an otherwise monochromatic warm-neutral system.

### Core Interaction Rules
- **Shadows:** No box-shadows or elevation shadows should be used anywhere. Hover states should rely on subtle background color or border color shifts, never translations (`translateY`) or shadow elevation.
- **Header Highlights:** Rather than full-block background colors, highlighted headers use a "marker" effect where a `linear-gradient` applies the highlight color only to the bottom 35-50% of the text.
- **Form Controls:** Text inputs and textareas use an 8px border radius with a light gray border (`#ddd7d5`), darkening to `#aba39c` on focus.
- **Chips / Toggles:** Pill-shaped (32px radius). Selected states use soft pastel backgrounds (Yellow, Blue, Green, Peach, Pink) with matching or removed borders. Unselected states are white with the standard gray border.

## Tailwind v4 Theme
```css
@theme {
  /* Colors */
  --color-surface-base: #fcfaf8;
  --color-oboe-black: #2a2522;
  --color-dark-charcoal: #242929;
  --color-mid-gray-brown: #374151;
  --color-border-warm: #ddd7d5;
  --color-user-bubble: #eee7e2;
  --color-cta-yellow: #fff1c7;
  --color-placeholder-brown: #aba39c;
  --color-pure-white: #ffffff;

  /* Form & Highlight Colors */
  --color-highlight-blue: #d9ebf9;
  --color-highlight-green: #abc6b6;
  --color-chip-yellow: #fef1cc;
  --color-chip-blue: #d9ebf9;
  --color-chip-green: #abc6b6;
  --color-chip-orange: #fac8aa;
  --color-chip-pink: #fab8b0;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 20px;
  --spacing-input-min: 1px;
  --spacing-sidebar-icon: 12px;
  --spacing-sidebar-width: 250px;
  --spacing-sidebar-width-expanded: 258px;
  --spacing-section-gap: 114px;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-pill: 32px;
  --radius-jumbo: 7rem;
  --radius-4xl: 2rem;

  /* Fonts */
  --font-palmore: "Palmore", serif;
  --font-lora: "Lora", serif;
  --font-ui-monospace: "ui-monospace", sans-serif;
}
```

## CSS Variables
```css
:root {
  /* Colors */
  --color-surface-base: #fcfaf8;
  --color-oboe-black: #2a2522;
  --color-dark-charcoal: #242929;
  --color-mid-gray-brown: #374151;
  --color-border-warm: #ddd7d5;
  --color-user-bubble: #eee7e2;
  --color-cta-yellow: #fff1c7;
  --color-placeholder-brown: #aba39c;
  --color-pure-white: #ffffff;

  /* Form & Highlight Colors */
  --color-highlight-blue: #d9ebf9;
  --color-highlight-green: #abc6b6;
  --color-chip-yellow: #fef1cc;
  --color-chip-blue: #d9ebf9;
  --color-chip-green: #abc6b6;
  --color-chip-orange: #fac8aa;
  --color-chip-pink: #fab8b0;

  /* Typography */
  --font-heading-family: Palmore;
  --font-body-default-family: Lora;
  --font-body-default-size: 16px;
  --font-body-default-weight: 400;
  --font-body-default-line-height: 20.8px;
  --font-body-relaxed-family: Lora;
  --font-body-relaxed-size: 16px;
  --font-body-relaxed-weight: 400;
  --font-body-relaxed-line-height: 28px;
  --font-small-light-family: Lora;
  --font-small-light-size: 14px;
  --font-small-light-weight: 300;
  --font-small-light-line-height: 20px;
  --font-caption-light-family: Lora;
  --font-caption-light-size: 12px;
  --font-caption-light-weight: 300;
  --font-caption-light-line-height: 16px;
  --font-micro-label-family: Lora;
  --font-micro-label-size: 10px;
  --font-micro-label-weight: 300;
  --font-micro-label-line-height: 16px;
  --font-micro-label-letter-spacing: 0.5px;
  --font-body-light-family: Lora;
  --font-body-light-size: 16px;
  --font-body-light-weight: 300;
  --font-body-light-line-height: 28px;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 20px;
  --spacing-input-min: 1px;
  --spacing-sidebar-icon: 12px;
  --spacing-sidebar-width: 250px;
  --spacing-sidebar-width-expanded: 258px;
  --spacing-section-gap: 114px;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-pill: 32px;
  --radius-jumbo: 7rem;
  --radius-4xl: 2rem;
}
```
