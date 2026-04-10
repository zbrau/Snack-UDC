# Snack UDC

A web-based ordering app for the cafeteria of the Universidad de Colima (UDC). Students can order food from their device, pay with virtual balance, and pick up their order without waiting in line.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | Main framework |
| **Vite** | Bundler and dev server |
| **Firebase / Firestore** | Real-time database and authentication |
| **Tailwind CSS** | Styling (via CDN in dev, Vite build in prod) |
| **Lucide React** | Icons |

---

## Features

### For the user
- **Authentication** — Sign up and log in with campus selection
- **Menu** — Browse dishes by category (Breakfast, Lunch, Snacks, Drinks, Healthy) with real-time search
- **Variants** — Choose a dish variant before adding to cart
- **Item notes** — Special instructions per dish (e.g. "no onions")
- **Cart** — Order management with pickup time (now, break, or custom)
- **Dual payment** — Pay with **Ucol Coins** (virtual balance) or **cash** on pickup
- **Cross-campus orders** — Browse and order from any campus menu
- **Order tracking** — Active orders screen with pickup code and real-time status
- **History** — Review past orders with item details
- **Rewards** — Loyalty points system; earn 200 pts and get `-100 UC` discount
- **Recharges** — Request Ucol Coins top-up via code
- **Favorites** — Mark favorite dishes for quick access
- **Profile** — Customizable avatar, recharge history, account info
- **Dark/light mode** — Persistent theme toggle
- **PWA** — Installable on mobile as a native app

### For the administrator
- **Campus selection** — Admin chooses which campus to manage
- **Active orders** — Kitchen-style view with real-time cards; mark as Ready or Delivered
- **Customer name** — Each order shows who placed it and their home campus
- **History** — Table of all completed or cancelled orders
- **Recharges** — Approve balance top-up requests by code
- **Menu management** — Create, edit, and delete dishes (name, price, category, image, variants)
- **Statistics** — Dashboard with:
  - Orders of the day and delivered count
  - Total daily revenue
  - Breakdown by payment method (Coins vs Cash)
  - Top 5 most-ordered dishes (progress bars)
  - Order status for the day (Pending / Ready / Delivered)

---

## Project Structure

```
apera2.0/
├── App.tsx                  # Root component — global state, business logic, and routing
├── types.ts                 # TypeScript types (MenuItem, Order, CartItem, etc.)
├── constants.ts             # Initial menu data and campus list
├── index.tsx                # Entry point
├── index.html               # Base HTML with PWA meta
├── components/
│   ├── AdminScreen.tsx      # Full admin panel
│   ├── Cart.tsx             # Side cart with notes and checkout
│   ├── FoodItem.tsx         # Dish card with variants and favorites
│   ├── AIAssistant.tsx      # AI assistant (Google GenAI)
│   ├── RechargeModal.tsx    # Recharge request modal
│   ├── HelpModal.tsx        # Help and support modal
│   └── RechargeHistory.tsx  # User recharge history
├── vite.config.ts
└── package.json
```

---

## Data Model (Firestore)

### `users/{email}`
```ts
{ name, email, balance, school, loyaltyPoints, avatar?, rechargeHistory[] }
```

### `orders/{id}`
```ts
{ id, userId, userName, userSchool, school, items[], total, subtotal, discount,
  paymentMethod, status, pickupTime, pickupCode, date, timestamp, pointsEarned }
```

### `menuItems/{id}`
```ts
{ id, name, description, price, category, image, school, varieties[], prepTime, calories? }
```

### `pendingRecharges/{id}`
```ts
{ id, userId, amount, code, status, timestamp }
```

---

## Installation and Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

---

## Deployment

The project is configured for **Vercel**.

| Field | Value |
|---|---|
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Environment Variables

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_GEMINI_API_KEY=...
```

---

## Supported Campuses

The app covers all campuses of the **Universidad de Colima** organized by location, configured in `constants.ts`.
