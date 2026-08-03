# Component Inventory

This document provides a comprehensive catalog of React components, organized by their responsibility and architectural layer. This inventory ensures component reusability and prevents duplication of logic.

---

## 1. Shared Components (Atoms & Molecules)
**Location:** `src/shared/ui`  
**Description:** Pure, stateless, and highly reusable UI elements. They have no knowledge of business logic or API calls. They receive all data and callbacks via `props`.

### 1.1. Base Atoms (Low-level)
*   `Button`: Standard button with different variants (`primary`, `secondary`, `outline`, `ghost`) and sizes (`sm`, `md`, `lg`).
*   `Input`: Standard text input with states (`default`, `focus`, `error`, `disabled`).
*   `Badge`: Small status indicators (e.g., `status: open`, `status: closed`, `priority: high`).
*   `Icon`: Wrapper for SVG icons (using `lucide-react` or similar).
*   `Typography`: Standardized text styles (`h1`, `h2`, `body`, `caption`, `label`).
*   `Skeleton`: Placeholder for loading states to prevent layout shift.
*   `Separator`: Horizontal or vertical dividers.

### 1.2. Molecules (Intermediate)
*   `FormInput`: An `Input` combined with a `<label>` and error message display.
*   `Modal/Dialog`: Overlay container for focused user interaction.
*   `Toast/Snackbar`: Floating notification container.
*   `Pagination`: Component for navigating through result pages.

---

## 2. Entity Components (Business Models)
**Location:** `src/entities/[entity-name]/ui`  
**Description:** Components that represent a specific business entity. They are aware of the domain data structure (e.g., `Auction`, `Bid`, `User`).

### 2.1. Auction Entity
*   `AuctionCard`: A summary card displayed in the list view (contains: image, title, current price, status badge, timer).
*   `AuctionDetails`: A large layout component for the detail page (contains: description, full history, image gallery).
*   `BidHistoryList`: A list displaying individual `Bid` entities.

### 2.2. Bid Entity
*   `BidRow`: A single row in the bidding history table/list (contains: bidder name, amount, timestamp).
*   `PriceDisplay`: Specialized typography for currency formatting (e.g., `$1,200.00`).

---

## 3. Feature Components (User Actions)
**Location:** `src/features/[feature-name]/ui`  
**Description:** Components that encapsulate a specific user action or business capability. These components often interact with **TanStack Query** (mutations) and contain the "business logic" of a user task.

### 3.1. Bidding Features
*   `PlaceBidForm`: The actual form used to submit a new bid. Includes validation logic and the mutation trigger.
*   `BidList`: A "smart" list component that handles fetching the specific bid history for an auction via a custom hook.

### 3.2. Search & Filter Features
*   `AuctionFilters`: A collection of filter inputs (price range, cargo type) that updates the **URL State**.
*   `SearchInput`: A specialized input that triggers URL updates as the user types (with debouncing).

---

## 4. Widget Components (Complex Blocks)
**Location:** `src/widgets`  
**Description:** Large, self-contained blocks that combine multiple features and entities to form a significant section of the page.

*   `AuctionGrid`: Combines `AuctionCard` (entities) with `AuctionFilters` (features) and `Pagination` (shared).
*   `AuctionHeader`: Combines `AuctionDetails` (entities) with a `PlaceBidForm` (features).

---

## 5. Component Summary Matrix

| Layer | Component Name | Complexity | Logic Type | Example Prop/Data |
| :--- | :--- | :--- | :--- | :--- |
| **Shared** | `Button` | Low | UI-only | `variant`, `onClick` |
| **Shared** | `Modal` | Medium | UI-only | `isOpen`, `onClose` |
| **Entity** | `AuctionCard` | Medium | Data-driven | `auction: AuctionData` |
| **Feature** | `PlaceBidForm` | High | Business/API | `onSuccess`, `auctionId` |
| **Feature** | `AuctionFilters` | High | URL/Search | `onFilterChange` |
| **Widget** | `AuctionGrid` | High | Orchestration | N/A (Combines many) |

---

## 6. Component Development Rules

1.  **Strict Prop Typing:** All components must have defined TypeScript interfaces.
2.  **No Business Logic in Shared:** `src/shared/ui` must never import anything from `src/entities`, `src/features`, or `src/widgets`.
3.  **Composition over Configuration:** Prefer passing components as props (e.g., `<Modal renderFooter={<Button />} />`) rather than passing massive configuration objects.
4.  **Single Responsibility:** A component should do one thing. If a `Button` also tries to handle an API call, it's no longer a `Button`; it's a `Feature`.

