# UI Guidelines & Responsiveness

This document defines the UI/UX standards, design principles, and responsive behavior required for the application.
Compliance ensures a consistent, accessible, and intuitive user experience across all devices.

## 1. Visual Design Principles

### 1.1. Color System

The application uses a **6-level color palette** to ensure visual hierarchy and accessibility.

| Level | Usage                       | Background Color Example (Light Theme) |
| :---- | :-------------------------- | :------------------------------------- |
| 50    | Backgrounds, subtle borders | `#FAFBFC`                              |
| 100   | Cards, panels               | `#F1F5F9`                              |
| 200   | Borders, dividers           | `#CBD5E1`                              |
| 300   | Interactive states          | `#94A3B8`                              |
| 400   | Primary action color        | `#6366F1`                              |
| 500   | Text primary                | `#0F172A`                              |
| 600   | Text disabled               | `#64748B`                              |

### 1.2. Typography

- **Font Family:** `Inter`, system-ui fallback.
- **Scale:** Modular scale (1.25 ratio) for sizes.
- **Hierarchy:**
  - `h1`: 32px / 800
  - `h2`: 28px / 700
  - `h3`: 24px / 600
  - `Body`: 16px / 400
  - `Label`: 14px / 500

### 1.3. Spacing

All spacing is built on an 8-pixel grid system:

- `4px` (xs): Tight spacing (icons, captions)
- `8px` (sm): Form labels, list items
- `16px` (md): Component padding
- `24px` (lg): Section margins
- `32px` (xl): Page gutters

### 1.4. Interactive States

- **Default:** Standard state
- **Hover:** Background changes at 10% opacity
- **Focus:** 2px solid ring with `#6366F1` color
- **Disabled:** 40% opacity, no hover

## 2. Component UI Patterns

### 2.1. Cards

- **AuctionCard:** 16px padding, 8px border-radius, subtle shadow on hover
- **BidRow:** Alternating background (#F8FAFC / white)

### 2.2. Forms

- Labels always positioned above the input field
- Error messages appear below the field in 14px text
- Success indicators appear as a 16px green checkmark icon

### 2.3. Modals

- Always centered
- Maximum width: 500px
- Close button in top-right corner (16px icon)
- 24px close button padding

### 2.4. Tables

- Sticky header
- Row height: 56px
- No borders (use alternating bg colors)
- Empty state: centered text with 48px icon

### 2.5. Lists

- Clear visual hierarchy with 8px item padding
- Use badges for status indicators (e.g., `status-bid-open`: green)
- Action buttons always on the right (if present)

## 3. Responsive Design Guidelines

### 3.1. Breakpoints

| Screen Size | Width         | Device Types           | Layout Changes  |
| :---------- | :------------ | :--------------------- | :-------------- |
| **Mobile**  | < 640px       | Phones                 | 1-column layout |
| **Tablet**  | 641 - 1024px  | Tablets, small laptops | 1-2 columns     |
| **Desktop** | 1025 - 1280px | Laptops, desktops      | 2-3 columns     |
| **Wide**    | > 1280px      | Large desktops         | 3-4 columns     |

### 3.2. Mobile-First Approach

- Start with 1-column layout
- Add flex-wrap for cards
- Use CSS Grid with `auto-fit` for responsive grids
- Keep navigation as bottom tab bar on mobile

### 3.3. Touch Targets

- Minimum 44x44px for any interactive element
- 16px padding for buttons on touch devices
- Prevent scroll-jacking on touch devices

## 4. Accessibility Standards (WCAG 2.1 AA)

### 4.1. Color Contrast

- **Text:** Minimum 4.5:1 contrast ratio against background
- **Interactive elements:** Minimum 3:1 contrast ratio for hover state

### 4.2. Keyboard Navigation

- All interactive elements must be reachable via `Tab`
- Visual focus indicator (2px outline) must be visible
- Trap focus inside modals

### 4.3. ARIA Attributes

- Use `aria-label` for icon-only buttons
- Use `aria-live="polite"` for dynamic content updates (e.g., bid updates)
- Use `role="alert"` for error toasts

## 5. Animation & Microinteractions

### 5.1. Timing Functions

- **Entrance:** `ease-out` (0.3s)
- **Exit:** `ease-in` (0.2s)
- **Hover:** `ease-out` (0.15s) with color lightening/darkening

### 5.2. Motion Principles

- **Purpose:** Always provide user feedback
- **Subtle:** Avoid excessive complexity
- **Directional:** Align with user expectations (e.g., expanding list opens downward)

### 5.3. Component Examples

- **Modal open:** Fade in (from 0 to 1 opacity) + scale (from 0.9 to 1 transform)
- **Button press:** 0.1s scale down
- **Toast:** Slide in from top-right, stay 5s, slide out

## 6. Testing Visual Consistency

### 6.1. Chromatic/Storybook

- Document every component state in Storybook
- Use visual regression testing to detect unintended color changes
- Run tests against light/dark mode if applicable

### 6.2. Manual Testing Checklist

- [ ] Text remains legible on all screens
- [ ] No horizontal scroll on mobile
- [ ] All interactive elements have adequate touch target
- [ ] Colorblind simulator test passes for status indicators
