# Lina’s Deli – Customer & Staff Portal

Lina’s Deli is a full-stack commerce portal that showcases premium charcuterie offerings for customers while giving staff a unified dashboard to manage products, promotions, and incoming orders. The project delivers a modern browsing experience for guests and a streamlined back-office tool for deli managers.

---

## Project Overview

- **What it is:** A React + Spring Boot application that powers both the public-facing deli site and the internal staff console.
- **Problem solved:** Provides a single source of truth for menu data, seasonal promotions, and order processing. Customers can discover products and submit orders, while staff monitor inventory, update listings, and handle pick-up requests.
- **Target users:**
  - **Customers:** Browse curated boards, filter categories, place orders, and explore gallery/contact details.
  - **Staff/Admin:** Authenticate via a secure login, manage catalog content, view order history, and maintain supplier records.

---

## Tech Stack

| Layer      | Technologies                                                                 |
|------------|-------------------------------------------------------------------------------|
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS (v4), React Router DOM 6, Axios, Swiper, Headless UI Dialog, React Toastify, React Easy Crop, React Masonry |
| Backend    | Spring Boot (REST API), Supabase PostgreSQL (via JDBC connection), Axios client with cookie auth |
| Tooling    | ESLint, TypeScript project references, Vite alias (`@ → /src`), Tailwind custom theme |
| Patterns   | Context-based auth (`AuthContext`), modular sections/components, protected staff routes with `<RequireAuth>`, Headless UI modals for accessibility |

---

## Feature Highlights

### Customer Experience

- **Hero carousel & promotions**: Swiper-based hero, optional promo popup modal fetched from `/api/promotions/active`.
- **Menu browsing**: Category tabs, search bar, pagination, modal with ingredient details, allergy and country flags.
- **Ordering flow**: Dedicated order page, box detail view, validated order form with Stripe session handoff.
- **Gallery & Contact**: Masonry photo gallery, Google Maps embed, contact card with consistent branding.
- **Responsive UI**: Tailwind-powered layout, optimized for mobile-first experience with custom spacing and typography utilities.

### Staff/Admin Experience

- **Authentication**: Session-based login, `AuthContext` stores user data, guarded routes redirect unauthenticated users.
- **Dashboard navigation**: Dedicated staff navbar, sidebars for categories, responsive layout for tablets/desktops.
- **Product management**: List view with search, category filter, inline in-stock toggles, add and update forms.
- **Order management**: Status chips, search, pagination, modals for detail view, status update actions.
- **Promotion & supplier tools**: Components for promo badges, modals to add/edit promotions, supplier directory management.

---

## Project Structure

```
fe/
├── public/              # Static assets (logos, icons, hero banners)
├── src/
│   ├── api/             # Axios instance and API helpers
│   ├── auth/            # Auth context/provider + hook
│   ├── components/
│   │   ├── menu/        # Customer menu UI (category tabs, rows, modal)
│   │   ├── staff/       # Staff UI components (nav, modals, utilities)
│   │   └── shared/      # Common components (Navbar, Footer, Pagination)
│   ├── pages/           # Route-level screens (Home, Menu, Order, Staff pages)
│   ├── sections/        # Page sections (home hero/about/order, order flow)
│   ├── assets/          # Local images for cards, hero, etc.
│   ├── type.ts          # Shared TypeScript types/interfaces
│   ├── Layout.tsx       # Route shells (public & staff)
│   └── main.tsx         # App bootstrap
├── vite.config.ts       # Vite + Tailwind + alias configuration
└── package.json
```

---

## Setup Instructions

```bash
# 1. Install dependencies
cd fe
npm install   # or pnpm install / yarn

# 2. Development server
npm run dev   # Starts Vite dev server with HMR (default: http://localhost:5173)

# 3. Production build
npm run build # Runs tsc type-check + Vite build, outputs to fe/dist

# 4. Preview production bundle (optional)
npm run preview
```

### Backend (optional but recommended)

```bash
cd be
./gradlew bootRun   # Requires Java & Gradle wrapper
```

Ensure the backend exposes APIs at the base URL expected by the frontend (`VITE_API_BASE_URL`).

---

## Usage Guide

1. **Customer Journey**
   - Land on `/` to view hero carousel, best menu items, about section, order CTA, and Instagram feed.
   - Navigate to `/menu` to filter by category, search products, open detail modals with allergy info, and paginate through results.
   - Visit `/order` to pick box size, then `/order/:boxType` for detailed info and the validated order form that redirects to payment.

2. **Staff Workflow**
   - Go to `/staff/login`, submit credentials (persisted via `AuthContext` on success).
   - Post-login, use the staff navbar to reach:
     - `/staff/menu`: manage products, add/update entries, toggle stock state.
     - `/staff/order`: monitor incoming orders, filter by status, open modals for full details, update statuses.
     - `/staff/mypage`, `/staff/suppliers`, `/staff/promotion-list`: maintain personal info, supplier contacts, promotions.

---


## Deployment Notes

- Run `npm run build` to generate the static bundle in `fe/dist/`.
- Serve the `dist` folder via any static host (Vercel, Netlify, S3 + CloudFront, etc.).
- Ensure environment variables are supplied at build time or via host-specific configuration.
- Backend can be deployed separately (e.g., AWS Elastic Beanstalk, Render, or a traditional VM) and should expose HTTPS endpoints to the frontend.

---

## Screenshots

_Add illustrative screenshots here:_

- `![Home Hero](docs/screenshots/home-hero.png)`
- `![Menu Grid](docs/screenshots/menu-grid.png)`
- `![Staff Order Dashboard](docs/screenshots/staff-orders.png)`

(Replace placeholders with actual captures.)

---

## License

MIT License. Use, modify, and distribute freely with attribution.

---

Lina’s Deli combines an elegant customer experience with a practical staff hub. For questions or contributions, feel free to open issues or PRs!