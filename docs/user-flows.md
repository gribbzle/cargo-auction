# User Flows & Edge Cases

This document outlines the primary user journeys and identifies critical edge cases to ensure a robust and seamless user
experience.

---

## 1. Primary User Flows

### 1.1. Browsing & Discovery

**Goal:** User finds a specific auction via filters.

1. **Entry:** User lands on the Auction Dashboard.
2. **Interaction:** User applies filters (e.g., Cargo Type: "Refrigerated", Min Price: "5000").
3. **State Change:** URL search parameters are updated via **TanStack Router**.
4. **Data Fetching:** **TanStack Query** detects parameter change and fetches new data.
5. **Outcome:** User sees a filtered list of auctions matching the criteria.

### 1.2. Auction Detail View

**Goal:** User views detailed information about a specific lot.

1. **Action:** User clicks on an auction card from the list.
2. **Navigation:** URL changes to `/auctions/:uuid`.
3. **Data Fetching:** Application fetches detailed auction info and the current list of bids.
4. **Outcome:** User sees the auction description, images, current price, and bidding history.

### 1.3. Placing a Bid (The Critical Path)

**Goal:** User successfully places a higher bid.

1. **Action:** User opens the "Place Bid" modal/form on the auction detail page.
2. **Input:** User enters an amount greater than the current price + step size.
3. **Validation:** **Zod** validates the input format and business rules.
4. **Submission:** User clicks "Submit". A **TanStack Query Mutation** is triggered.
5. **Processing:** API request is sent $\to$ Mock Server (MSW) updates the auction state.
6. **Re-sync:** Mutation triggers `invalidateQueries` for the auction details and bid history.
7. **Outcome:** The UI instantly updates with the new current price and the user's bid at the top of the list.

---

## 2. Edge Cases & Error Handling

### 2.1. Bidding Logic & Concurrency

| Scenario                  | User Action                                                                           | Expected System Behavior                                                                                                           |
| :------------------------ | :------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Outbid Race Condition** | Two users bid simultaneously. User A's bid is accepted, but User B's bid is rejected. | User B receives a toast notification: "Price has changed. Please enter a higher amount." The input field clears/updates.           |
| **Invalid Bid Amount**    | User enters an amount equal to or less than the current price + step.                 | **Zod** prevents submission; "Bid must be higher than current price + step" error appears under the input.                         |
| **Auction Expired**       | User opens a detail page for an auction that just closed.                             | The system detects the `status: 'closed'` from the API; the "Place Bid" button is disabled/hidden; "Auction Ended" badge is shown. |

### 2.2. Network & Data Issues

| Scenario                 | User Action                                          | Expected System Behavior                                                                                                                  |
| :----------------------- | :--------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Network Interruption** | User is bidding while losing internet connection.    | **TanStack Query** handles the retry logic. If it fails, a "Connection lost. Retrying..." toast appears.                                  |
| **API Error (500)**      | User submits a bid, but the server returns an error. | The mutation's `onError` handler triggers a toast: "Something went wrong. Please try again." The UI does not enter an inconsistent state. |
| **Empty Search Results** | User applies filters that match no auctions.         | Display a clear "No auctions found for these filters" message with a "Clear Filters" button.                                              |

### 2.3. URL & Navigation

| Scenario          | User Action                                                                   | Expected System Behavior                                                                               |
| :---------------- | :---------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Malformed URL** | User manually edits the URL with an invalid UUID (e.g., `/auctions/abc-123`). | **Zod** validation fails $\to$ Router redirects to a 404 page or the main dashboard.                   |
| **Deep Linking**  | User shares a URL with specific filters applied.                              | The application parses the URL parameters and immediately renders the filtered list (no loading jump). |

---

## 3. User Experience (UX) Requirements Summary

- **Optimistic UI:** For critical actions (like bidding), consider using `onMutate` in TanStack Query to update the UI
  _before_ the server responds, providing an "instant" feel (only if business logic allows).
- **Loading States:** Use Skeletons for initial page loads and subtle progress bars/spinners for mutations.
- **Feedback Loop:** Every significant user action (Submit, Delete, Filter) must have a visual confirmation
  (Success/Error Toast) or a clear change in UI state.
