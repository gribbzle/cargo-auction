# State Management Strategy

This document defines how the application manages different types of state. To ensure scalability, predictability, and
performance, we follow a strict separation of concerns based on the nature of the data.

## 1. State Classification Matrix

| State Type       | Responsibility                                     | Primary Tool        | Persistence       |
| :--------------- | :------------------------------------------------- | :------------------ | :---------------- |
| **Server State** | Data fetched from API (auctions, bets, etc.)       | **TanStack Query**  | Cache (in-memory) |
| **UI State**     | Transient UI status (modals, drawers, sidebars)    | **Zustand**         | In-memory         |
| **URL State**    | Shareable/Browser state (filters, pagination, IDs) | **TanStack Router** | Browser URL       |
| **Form State**   | Uncommitted user input (bet price, login info)     | **React Hook Form** | In-memory         |

---

## 2. Server State (TanStack Query)

**Owner of all data originating from the backend.**

### Rules:

- **No duplication:** Never copy data from a TanStack Query cache into a Zustand store.
- **Key Strategy:** Use structured, hierarchical query keys to allow precise invalidation.
  - `['auctions', 'list', { filters }]`
  - `['auctions', 'detail', auctionUuid]`
  - `['auctions', 'bets', auctionUuid, { all }]`
- **Invalidation:** Successful mutations must trigger `queryClient.invalidateQueries` to ensure the UI stays
  synchronized with the backend.
- **Prefetching:** Use `queryClient.prefetchQuery` on user intent (e.g., hover on an auction card) to optimize UX.

### Implementation Flow:

`UI Component` $\to$ `Custom Hook (useAuctionQuery)` $\to$ `API Function` $\to$ `TanStack Query Cache` $\to$
`Backend/MSW`.

---

## 3. UI State (Zustand)

**Owner of "Global UI" state—logic that doesn't belong to a specific component but affects multiple parts of the
interface.**

### Use Cases:

- Mobile navigation drawer visibility (open/closed).
- Global notification/toast triggers (if not handled by component-local state).
- Transient UI preferences (e.g., preferred view mode: list vs grid, if not in URL).

### Rules:

- **Keep it slim:** Avoid storing domain data (like auction objects) in Zustand.
- **Local is better:** If a piece of state is only used by one component and its immediate children, use `useState`
  instead of Zustand.

### Implementation Flow:

`Component` $\to$ `Zustand Store (useUIStore)` $\to$ `State Action/Value`.

---

## 4. URL State (TanStack Router + Zod)

**Owner of the "Single Source of Truth" for filters and navigation.**

### Use Cases:

- Search queries and filters (price range, cargo type).
- Current page number/pagination.
- Selected auction UUID in the details view.

### Rules:

- **Shareability:** Any state that should be bookmarkable or shareable via a link **must** be in the URL.
- **Validation:** Use **Zod** to parse and validate search parameters. If a user manually enters an invalid filter in
  the URL, the application must fallback to default values gracefully.

### Implementation Flow:

`URL Search Params` $\to$ `TanStack Router` $\to$ `Zod Validation` $\to$ `TanStack Query (via Search Params)`.

---

## 5. Form State (React Hook Form + Zod)

**Owner of "Dirty" data—information currently being typed by the user but not yet sent to the server.**

### Use Cases:

- The "Place a Bid" form.
- Registration/Login forms.

### Rules:

- **Validation:** All business constraints (e.g., `bid_amount > current_price`, `step_size` compliance) must be
  validated using **Zod** schemas passed to React Hook Form.
- **Decoupling:** Form state must not affect the global UI state or server cache until the `onSubmit` event is
  successfully triggered.

### Implementation Flow:

`User Input` $\to$ `React Hook Form` $\to$ `Zod Validation` $\to$ `Mutation (TanStack Query)` $\to$ `Backend`.

---

## 6. Summary of Data Flow

The following diagram illustrates how data flows through the state layers during a typical "Place a Bid" action:

1. **User** enters a price in a **React Hook Form**.
2. **Zod** validates the input format.
3. **React Hook Form** submits the data via a **TanStack Query Mutation**.
4. The **Mutation** calls the **API**.
5. **MSW** (Mock Service Worker) updates its internal **Mutable Store**.
6. Upon success, **TanStack Query** invalidates the `['auctions', 'detail', uuid]` and `['auctions', 'bets', uuid]`
   queries.
7. The **UI** automatically re-fetches and re-renders with the new auction price and the new bet history.
