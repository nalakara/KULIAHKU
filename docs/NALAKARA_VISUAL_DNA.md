# Nalakara Generic Visual DNA

## Purpose

This document defines the **generic visual DNA of Nalakara**.

It is a reusable visual foundation for Nalakara products, applications, prototypes, dashboards, tools, and digital experiences.

The purpose is **not to make every Nalakara product look identical**. Instead, it establishes a shared visual language covering color, typography, spacing, controls, layout, surface treatment, and component geometry while allowing each product to develop its own visual personality when required.

This document supports both:

* **Dark Mode**
* **Light Mode**

Dark and light modes are treated as two expressions of the same visual system, not as two unrelated themes.

---

# 1. DESIGN PHILOSOPHY

Nalakara interfaces should generally communicate:

* Professional
* Modern
* Technical
* Calm
* Precise
* Information-oriented
* Visually restrained

The interface should prioritize **clarity and usability over decoration**.

The visual system should feel designed rather than heavily styled.

Avoid unnecessary:

* gradients
* ornamental effects
* excessive shadows
* oversized typography
* excessive corner rounding
* visual noise
* decorative elements without functional purpose

---

# 2. COLOR SYSTEM

Nalakara uses a **semantic color system** rather than assigning colors directly to individual components.

Colors should be understood through their roles:

* Canvas
* Surface
* Elevated Surface
* Primary Text
* Secondary Text
* Muted Text
* Border
* Interactive
* Accent
* Status

This allows the same visual language to work across both dark and light interfaces.

---

# 2.1 DARK MODE

Dark Mode is the primary reference expression of the Nalakara visual DNA.

### Text

* Primary Text: `#e5e6e9`
* Secondary Text: `#a3a3a3`
* High-Emphasis Text: `#ffffff`

### Core Surfaces

* Base Background: `#0a0a0a`
* Primary Surface: `#111111`
* Secondary Surface: `#181818`
* Elevated Surface: `#262626`

### Borders

* Subtle Border: `#262626`
* Standard Border: `#333333`

### Controls

* Control Background: `rgb(38, 38, 38)`
* Control Hover: `#333333`

### Usage

`#e5e6e9` should be the default interface text.

`#a3a3a3` should be used for secondary information, metadata, hints, and supporting labels.

`#ffffff` should be reserved for high-emphasis information and important interface hierarchy.

Dark surfaces should remain close to neutral black/charcoal rather than becoming strongly tinted.

---

# 2.2 LIGHT MODE

Light Mode should not simply invert the dark palette.

Instead, it should preserve the same principles of:

* restrained contrast
* neutral surfaces
* compact information density
* clear hierarchy
* subtle separation

### Text

* Primary Text: `#202124`
* Secondary Text: `#5f6368`
* High-Emphasis Text: `#111111`

### Core Surfaces

* Base Background: `#f7f7f7`
* Primary Surface: `#ffffff`
* Secondary Surface: `#f1f1f1`
* Elevated Surface: `#ffffff`

### Borders

* Subtle Border: `#e5e5e5`
* Standard Border: `#d4d4d4`

### Controls

* Control Background: `#f1f1f1`
* Control Hover: `#e7e7e7`

### Usage

`#202124` should be the default interface text.

`#5f6368` should be used for secondary information, metadata, hints, and supporting labels.

`#111111` should be reserved for high-emphasis content.

Light Mode should avoid pure-white canvases everywhere. The distinction between the page background and component surfaces should create a subtle spatial hierarchy.

---

# 2.3 COLOR RELATIONSHIP

Dark Mode and Light Mode should maintain equivalent semantic relationships.

| Semantic Role      | Dark Mode | Light Mode |
| ------------------ | --------- | ---------- |
| Canvas             | `#0a0a0a` | `#f7f7f7`  |
| Primary Surface    | `#111111` | `#ffffff`  |
| Secondary Surface  | `#181818` | `#f1f1f1`  |
| Elevated Surface   | `#262626` | `#ffffff`  |
| Primary Text       | `#e5e6e9` | `#202124`  |
| Secondary Text     | `#a3a3a3` | `#5f6368`  |
| High-Emphasis Text | `#ffffff` | `#111111`  |
| Subtle Border      | `#262626` | `#e5e5e5`  |
| Standard Border    | `#333333` | `#d4d4d4`  |
| Control Background | `#262626` | `#f1f1f1`  |

The exact colors may be extended by individual products, but the **semantic relationship should remain intact**.

---

# 3. TYPOGRAPHY

## Font Family

### Primary Font

`Inter`

Use Inter as the primary interface typeface.

### Secondary Font

`ui-sans-serif`

Use the system sans-serif stack as fallback or secondary typographic family.

## Type Scale

* H1: `16px`
* H2: `20px`
* Body Text: `14px`

Typography should prioritize:

* clarity
* compact information density
* strong hierarchy
* excellent readability
* restrained visual contrast

Do not automatically increase typography size simply to create visual impact.

Hierarchy should also be created through:

* weight
* spacing
* contrast
* position
* grouping

---

# 4. BUTTONS & CONTROLS

Buttons should follow a compact, functional interface language.

## Button 1 — Minimal

* Border Radius: `8px`
* Padding: `8px`

Use for simple actions and compact controls.

## Button 2 — Compact

* Background: `rgb(38, 38, 38)` in Dark Mode
* Background: `#f1f1f1` in Light Mode
* Border Radius: `8px`
* Padding: `6px 10px`

Use for secondary actions, compact controls, filters, and utility actions.

## Button 3 — Standard

* Background: `rgb(38, 38, 38)` in Dark Mode
* Background: `#f1f1f1` in Light Mode
* Border Radius: `8px`
* Padding: `10px 12px`

Use for standard interface actions.

### Control Principles

Controls should feel:

* compact
* deliberate
* functional
* modern
* unobtrusive

Avoid oversized controls or decorative interaction patterns.

---

# 5. LAYOUT SYSTEM

Use modern responsive layout primitives.

## Primary Layout Methods

Use:

* CSS Flexbox
* CSS Grid

Choose the layout method according to the structure of the interface.

Do not force a single layout technique across the entire application.

## Container

* Maximum Container Width: `1280px`

Content should generally remain within a centered maximum-width container when a constrained workspace is appropriate.

Interfaces may intentionally use wider or full-width layouts when the product context requires it.

---

# 6. SPACING SYSTEM

## Base Unit

`8px`

Use an 8px spacing rhythm as the fundamental spacing unit.

Preferred spacing values include:

* `4px`
* `8px`
* `16px`
* `24px`
* `32px`
* `40px`
* `48px`

Smaller values may be used when required for optical alignment or compact controls.

Spacing should create a consistent rhythm across:

* sections
* cards
* forms
* navigation
* lists
* buttons
* panels
* dialogs
* dashboards

---

# 7. BORDER RADIUS

Use a restrained radius system:

* `4px`
* `6px`
* `8px`

### Recommended Usage

* `4px` — small structural elements
* `6px` — medium components
* `8px` — buttons, cards, panels, and interactive elements

Avoid excessive use of pill-shaped components unless the interaction specifically requires them.

---

# 8. SURFACE & ELEVATION

Nalakara should use **subtle surface differentiation** rather than heavy shadows.

## Dark Mode

Depth should primarily be communicated through:

1. Surface color
2. Border
3. Position
4. Spacing
5. Very subtle elevation

Avoid strong drop shadows against dark backgrounds.

## Light Mode

Depth should primarily be communicated through:

1. Surface color
2. Border
3. Spacing
4. Position
5. Subtle shadow where necessary

Shadows should remain soft and restrained.

The goal is to make hierarchy visible without making the interface look ornamental.

---

# 9. CARDS & PANELS

Cards and panels are important structural elements in Nalakara interfaces.

They should generally use:

* restrained backgrounds
* subtle borders
* `6px` or `8px` radius
* consistent internal padding
* clear content hierarchy

Cards should not automatically look like floating objects.

Use a card only when grouping information or actions improves comprehension.

Avoid excessive card nesting.

---

# 10. VISUAL HIERARCHY

Hierarchy should primarily be established through:

1. Typography
2. Contrast
3. Spacing
4. Position
5. Surface differentiation
6. Component geometry

Do not rely on color alone to communicate hierarchy or state.

Important information should receive stronger emphasis through a combination of typography, spacing, contrast, and placement.

---

# 11. ICONOGRAPHY

Icons should follow a simple, functional visual language.

Prefer:

* clean line icons
* consistent stroke weight
* compact proportions
* recognizable metaphors

Avoid decorative iconography that competes with content.

Icons should support comprehension rather than become visual decoration.

---

# 12. DATA-DENSE INTERFACES

Nalakara products may contain dashboards, analytical views, tables, metrics, logs, technical information, or domain-specific data.

The visual DNA should support relatively high information density without becoming visually chaotic.

Prioritize:

* alignment
* grouping
* whitespace
* consistent column structure
* clear labels
* restrained contrast
* predictable interaction patterns

Do not solve information density by simply reducing font size.

---

# 13. RESPONSIVE DESIGN

The visual DNA must work across:

* desktop
* laptop
* tablet
* mobile

Responsive behavior should preserve:

* visual hierarchy
* information architecture
* interaction clarity

Do not simply shrink desktop layouts.

Components may:

* reflow
* stack
* collapse
* simplify
* change navigation patterns

when required by smaller screens.

---

# 14. ACCESSIBILITY

Visual consistency must not compromise accessibility.

Ensure:

* sufficient text contrast
* clear interactive states
* visible focus states
* meaningful labels
* non-color-dependent status communication
* adequate touch targets

Both Dark Mode and Light Mode must remain usable in realistic working conditions.

---

# 15. PRODUCT-SPECIFIC EXTENSIONS

Nalakara Generic Visual DNA is a **foundation, not a template**.

Individual products may introduce:

* product-specific accent colors
* specialized components
* different information densities
* domain-specific visualization
* unique interaction patterns
* product-specific branding

These additions should remain compatible with the underlying Nalakara visual language.

A product may develop its own personality without breaking the shared visual grammar.

---

# 16. DESIGN PRINCIPLE

The core principle is:

> **Different products. Shared visual language. Consistent Nalakara identity.**

Nalakara products should feel related without feeling cloned.

The system should provide enough consistency that a user can recognize the underlying design philosophy, while still allowing each product to communicate the character of its own domain.

---

# 17. GENERIC GENERATION PROMPT

Use the following prompt when generating a new Nalakara interface with AI:

> Generate a modern website UI using the **Nalakara Generic Visual DNA**.
>
> Treat this design system as the shared visual foundation of the interface.
>
> **Theme Support**
>
> * Support both Dark Mode and Light Mode.
> * Treat both modes as expressions of the same visual language.
> * Do not simply invert colors between modes.
>
> **Typography**
>
> * Primary Font: Inter
> * Secondary Font: ui-sans-serif
> * H1: 16px
> * H2: 20px
> * Body Text: 14px
>
> **Dark Mode**
>
> * Canvas: `#0a0a0a`
> * Primary Surface: `#111111`
> * Secondary Surface: `#181818`
> * Elevated Surface: `#262626`
> * Primary Text: `#e5e6e9`
> * Secondary Text: `#a3a3a3`
> * High-Emphasis Text: `#ffffff`
> * Subtle Border: `#262626`
> * Standard Border: `#333333`
> * Control Background: `rgb(38, 38, 38)`
>
> **Light Mode**
>
> * Canvas: `#f7f7f7`
> * Primary Surface: `#ffffff`
> * Secondary Surface: `#f1f1f1`
> * Elevated Surface: `#ffffff`
> * Primary Text: `#202124`
> * Secondary Text: `#5f6368`
> * High-Emphasis Text: `#111111`
> * Subtle Border: `#e5e5e5`
> * Standard Border: `#d4d4d4`
> * Control Background: `#f1f1f1`
>
> **Buttons**
>
> * Minimal Button: radius 8px, padding 8px
> * Compact Button: radius 8px, padding 6px 10px
> * Standard Button: radius 8px, padding 10px 12px
>
> **Layout**
>
> * Use CSS Flexbox and CSS Grid appropriately.
> * Maximum container width: 1280px.
> * Base spacing unit: 8px.
> * Border radius: 4px, 6px, 8px.
>
> **Visual Character**
>
> * Modern
> * Professional
> * Technical
> * Calm
> * Precise
> * Information-oriented
> * Visually restrained
>
> Apply the visual system consistently across typography, spacing, controls, cards, panels, navigation, forms, dialogs, tables, dashboards, and other interface components.
>
> Use surface differentiation, borders, spacing, and subtle elevation instead of excessive shadows or decorative effects.
>
> Do not introduce unnecessary gradients, oversized typography, excessive rounding, ornamental effects, or visual noise.
>
> Preserve the product's own identity and domain-specific requirements while maintaining compatibility with the Nalakara visual language.
>
> Generate clean, maintainable HTML/CSS or React/Tailwind components.

---

# 18. IMPLEMENTATION RULE

When implementing the Nalakara Visual DNA in a real application, prefer **semantic design tokens** over hard-coded colors throughout the component layer.

For example:

```css
:root {
  --color-bg: #f7f7f7;
  --color-surface: #ffffff;
  --color-surface-secondary: #f1f1f1;
  --color-text-primary: #202124;
  --color-text-secondary: #5f6368;
  --color-text-emphasis: #111111;
  --color-border-subtle: #e5e5e5;
  --color-border: #d4d4d4;
}

[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-surface-secondary: #181818;
  --color-surface-elevated: #262626;
  --color-text-primary: #e5e6e9;
  --color-text-secondary: #a3a3a3;
  --color-text-emphasis: #ffffff;
  --color-border-subtle: #262626;
  --color-border: #333333;
}
```

Components should consume semantic tokens rather than directly depending on theme-specific color values.

This allows the visual system to evolve centrally without requiring every component to be rewritten.

---

# 19. FINAL PRINCIPLE

**Nalakara Generic Visual DNA is a visual foundation for an ecosystem, not a visual prison for individual products.**

The system should provide:

**Consistency without sameness.
Structure without rigidity.
Personality without visual chaos.
Professionalism without unnecessary decoration.**

The ultimate objective is for a collection of independently developed Nalakara products to feel as though they belong to the same design ecosystem—even when their domains, workflows, and product personalities are very different.
