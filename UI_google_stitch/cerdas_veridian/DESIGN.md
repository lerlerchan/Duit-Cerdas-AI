# Design System Strategy: The Financial Sanctuary

## 1. Overview & Creative North Star
**Creative North Star: The Digital Arboretum**

This design system moves beyond the cold, utilitarian nature of traditional fintech. We are building a "Digital Arboretum"—a space that feels like a premium, quiet sanctuary where wealth is grown, not just managed. By blending the precision of "Apple-style" minimalism with organic, botanical metaphors, we create a signature experience that feels both authoritative and life-giving.

The UI rejects the rigid, boxy constraints of standard dashboards. Instead, we use **intentional asymmetry**, **tonal layering**, and **expansive breathing room** to guide the eye. We don't just display data; we curate an environment where financial health is visualized through the lens of nature and ancient wisdom (BaZi).

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is anchored in the stability of `Deep Navy` and the vitality of `Teal`. To achieve a high-end editorial feel, we treat color as light and atmosphere rather than just paint.

### The "No-Line" Rule
**Explicit Instruction:** Sectioning via 1px solid borders is strictly prohibited. Physical boundaries must be defined solely through background color shifts or tonal transitions. 
*   *Implementation:* Use `surface-container-low` for a background section, and place `surface-container-lowest` cards on top of it. The contrast between `#f3f3f5` and `#ffffff` is enough to define the edge without the "cheap" look of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-translucent sheets. 
*   **Base:** `surface` (#f9f9fb)
*   **Level 1 (Sections):** `surface-container-low` (#f3f3f5)
*   **Level 2 (Cards/Interaction):** `surface-container-lowest` (#ffffff)
*   **Level 3 (Floating/Overlays):** Glassmorphism using `primary-container` at 10% opacity with a 20px backdrop blur.

### Signature Textures
Avoid flat `primary` fills for large areas. Use a subtle linear gradient (Top-Left to Bottom-Right) from `primary` (#006565) to `primary-container` (#008080) to add "soul" and depth to CTAs and Hero headers.

---

## 3. Typography: The Editorial Voice
We use **Inter** (or **SF Pro**) to convey a sense of modern precision. The hierarchy is designed to feel like a high-end financial journal.

*   **Display (The Statement):** Use `display-md` for portfolio totals. The generous size allows the number to act as a hero visual element.
*   **Headlines (The Anchor):** Use `headline-sm` for section titles. Pair these with high letter-spacing (tracking) for a premium, airy feel.
*   **Body (The Content):** `body-md` is the workhorse. Maintain a line height of at least 1.5 to ensure readability and "breathability."
*   **Labels (The Metadata):** `label-md` should often be used in All-Caps with `secondary` (#5d5c74) coloring to differentiate data points from narrative text.

---

## 4. Elevation & Depth: Tonal Layering
In this system, elevation is a function of light, not shadows.

*   **The Layering Principle:** Depth is achieved by stacking `surface-container` tiers. A `surface-container-highest` element should only be used for the most critical interactive components (like a bottom sheet handle or a high-priority alert).
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use an ultra-diffused shadow: `box-shadow: 0 12px 40px rgba(26, 28, 29, 0.06)`. The shadow should feel like a soft glow of occlusion, not a dark drop-shadow.
*   **Glassmorphism:** Use for navigation bars and floating action buttons. 
    *   *Recipe:* Background: `rgba(255, 255, 255, 0.7)`; Backdrop-filter: `blur(12px)`; Border: `1px solid rgba(255, 255, 255, 0.3)`.
*   **The Ghost Border:** If a boundary is strictly required for accessibility, use `outline-variant` (#bdc9c8) at 15% opacity.

---

## 5. Specialized Components

### Wealth Garden (Gamification)
Instead of progress bars, use **Growth Tokens**.
*   **Visuals:** Use the `tertiary` (#156820) and `tertiary-fixed` (#a3f69c) tokens. 
*   **The Sprout:** A small, 12px rounded chip with a subtle green gradient.
*   **The Bloom:** Reserved for milestones. Uses `primary` teal with a `tertiary` glow effect.

### BaZi-Vulnerability Scales (Risk Level)
To visualize risk without breaking the minimalist aesthetic, use **Chromatic Fluency**.
*   **Low Risk (Green):** Use `tertiary-container` (#338236). It’s softer and more "botanical" than a standard neon green.
*   **Moderate Risk (Yellow):** Use a custom desaturated gold (mixing `secondary` and `on-tertiary-container`).
*   **High Risk (Red):** Use `error` (#ba1a1a). 
*   **Interaction:** These should appear as "Soft Pills"—12px rounded indicators with a 10% opacity fill of their respective color and 100% opacity text.

### Input Fields & Cards
*   **Inputs:** Minimalist under-lines or subtle `surface-container-high` fills. Forbid 4-sided boxes unless they are in a "Focus" state.
*   **Cards:** Strictly forbid dividers. Use vertical spacing (1.5rem to 2rem) to separate content blocks within a card.
*   **Buttons:** 
    *   *Primary:* `primary-container` (#008080) with `on-primary` (#ffffff) text. 
    *   *Secondary:* `secondary-container` (#e2e0fc) with `on-secondary-fixed` (#1a1a2e).
    *   *Shape:* 12px (`md`) or Full (`9999px`) for a more "pill" like Apple aesthetic.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a functional element. If in doubt, add 8px more padding.
*   **DO** use "Primary Teal" as a highlight, not a dominant background.
*   **DO** ensure that botanical icons (Wealth Garden) feel high-fidelity and monoline, matching the weight of the typography.

### Don't
*   **DON’T** use pure black (#000000). Always use `on-secondary-fixed` (#1a1a2e) for deep blacks to maintain the "Navy" sophisticated undertone.
*   **DON’T** use standard Material Design ripples. Use subtle opacity shifts (1.0 to 0.8) for tap states to mimic a high-end glass feel.
*   **DON’T** crowd the BaZi scales. They are "vulnerability cues"—they should feel like a gentle warning, not a flashing alarm.