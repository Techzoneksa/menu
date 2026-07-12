# ماهر كيف | Maher Kaif

<div dir="rtl">

**قائمة رقمية تفاعلية بالكود الضوئي (QR) لمقهى ماهر كيف**

</div>

A digital QR-enabled menu for Maher Kaif coffee shop — built with Next.js, Supabase, and Tailwind CSS.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16 | React framework (App Router) |
| **TypeScript** | 5+ | Type-safe development |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Supabase** | Latest | Backend (Database, Auth, Storage) |
| **Zod** | v4 | Server-side validation |
| **Lucide Icons** | Latest | Icon library |
| **QRCode.react** | Latest | QR code generation |
| **next/font** | Built-in | Optimized font loading |

---

## Features

- 📱 **Responsive Mobile-First Design** — Optimized for all screen sizes
- 🌐 **Bilingual Support** — Arabic & English with cookie-based SSR
- 📷 **QR Code Menu Access** — Customers scan and view instantly
- 🍽️ **Dynamic Menu Categories** — Organized food & drink sections
- 🖼️ **Image Support** — High-quality item photos via Supabase Storage
- 🏷️ **Promotions & Offers** — Featured badges on menu items
- 🔐 **Admin Dashboard** — Full CRUD for menu management
- 🔑 **Role-Based Access Control** — Admin-only via `admin_users` table + `is_admin()` RPC
- 🔄 **Password Reset** — Email-based password recovery via Supabase Auth
- ⚡ **Server Actions** — All admin CRUD goes through server-side validation
- 🌙 **Dark/Light Mode** — Theme support with system preference detection
- 🔄 **Real-time Updates** — Cache revalidation on admin changes

---

## Architecture

### Security Model

```
Client → Server Action → requireAdmin() → getUser() + rpc('is_admin') → DB
```

- **RLS Policies** — All tables enforce `public.is_admin()` check (SECURITY DEFINER)
- **Server Actions** — No direct client-side Supabase mutations in admin
- **Zod Validation** — All inputs validated server-side with trim, max length, URL safety
- **Middleware** — Session refresh + redirect to login for unauthenticated admin access

### Database Tables

| Table | Purpose |
|---|---|
| `menu_categories` | Menu categories with bilingual names |
| `menu_products` | Menu items with pricing and availability |
| `product_variants` | Size/variant pricing (e.g., 10pc vs 20pc mini-pancake) |
| `addon_groups` | Addon groups (e.g., Dessert Add-ons) |
| `addon_items` | Individual addon items with pricing |
| `product_addon_links` | Many-to-many: products ↔ addon groups |
| `banners` | Home page banner slider |
| `settings` | Key-value store for cafe configuration |
| `admin_users` | Admin role mapping (user_id → admin) |

### Storage Buckets

| Bucket | Purpose |
|---|---|
| `menu-images` | Product photos (admin write, public read) |
| `category-images` | Category covers (admin write, public read) |
| `banner-images` | Banner slider images (admin write, public read) |
| `site-assets` | Logo, favicon (admin write, public read) |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)
- Git

### Step 1: Clone & Install

```bash
git clone <repo-url>
cd maher-kaif
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon key**

### Step 3: Run Migrations

In Supabase SQL Editor, run in order:

1. `src/supabase/migrations/001_initial_schema.sql`
2. `src/supabase/migrations/002_storage_buckets.sql`
3. `src/supabase/migrations/003_admin_rbac.sql`

### Step 4: Seed Database

Run `src/supabase/seed.sql` in SQL Editor.

### Step 5: Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://maher.jaadsa.com
```

**Production Note:** The `NEXT_PUBLIC_SITE_URL` must be set to `https://maher.jaadsa.com` in production. In local development, you may use `http://localhost:3000`.

### Step 5b: Configure Supabase Auth URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

| Field | Value |
|---|---|
| **Site URL** | `https://maher.jaadsa.com/` |
| **Redirect URLs** | `https://maher.jaadsa.com/reset-password` |

### Step 6: Run

```bash
npm run dev
```

---

## إنشاء أول مستخدم مدير
## Create the First Admin User

After setting up the database and environment variables, create the first admin user:

### 1. Create user in Supabase Authentication

1. Go to **Supabase Dashboard → Authentication → Users → Add user**
2. Enter email and password
3. Enable **Auto Confirm**
4. Click **Create User**

### 2. Grant admin role

Run this SQL in **SQL Editor** (replace the email with your admin email):

```sql
INSERT INTO public.admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'admin@maherkaif.com';
```

### 3. Verify

```sql
SELECT au.user_id, u.email
FROM public.admin_users au
JOIN auth.users u ON u.id = au.user_id;
```

You should see your admin email listed. Now you can sign in at `/admin/login`.

---

## Routes

| Route | Description | Access |
|---|---|---|
| `/` | Public menu (homepage) | Public |
| `/admin/login` | Admin login | Public |
| `/admin` | Admin dashboard | Admin Only |
| `/admin/categories` | Manage categories | Admin Only |
| `/admin/products` | Manage products | Admin Only |
| `/admin/addons` | Manage addon groups/items | Admin Only |
| `/admin/banners` | Manage banners | Admin Only |
| `/admin/settings` | Site settings | Admin Only |
| `/admin/qr` | QR code display | Admin Only |
| `/admin/system-check` | System diagnostics | Admin Only |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (webpack) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## Project Structure

```
maher-kaif/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (SSR lang/dir, next/font)
│   │   ├── globals.css             # Tailwind + font CSS variables
│   │   ├── page.tsx              # Main menu (homepage)
│   │   ├── loading.tsx           # Loading state
│   │   ├── error.tsx             # Error state with retry
│   │   └── admin/
│   │       ├── layout.tsx          # Admin server layout
│   │       ├── page.tsx            # Dashboard
│   │       ├── login/page.tsx      # Login with rate limiting
│   │       ├── actions.ts          # Dashboard stats
│   │       ├── categories/
│   │       │   ├── page.tsx        # Category management
│   │       │   └── actions.ts      # Server actions
│   │       ├── products/
│   │       │   ├── page.tsx        # Product management
│   │       │   └── actions.ts      # Server actions
│   │       ├── addons/
│   │       │   ├── page.tsx        # Addon management
│   │       │   └── actions.ts      # Server actions
│   │       ├── banners/
│   │       │   ├── page.tsx        # Banner management
│   │       │   └── actions.ts      # Server actions
│   │       ├── settings/
│   │       │   ├── page.tsx        # Settings management
│   │       │   └── actions.ts      # Server actions
│   │       └── qr/
│   │           ├── page.tsx        # QR display
│   │           └── actions.ts      # Server actions
│   ├── components/
│   │   ├── menu/
│   │   │   ├── LanguageContext.tsx  # Bilingual support + cookie
│   │   │   ├── ThemeContext.tsx     # Dark/light mode
│   │   │   ├── MenuProviders.tsx   # Combined providers
│   │   │   ├── ProductCard.tsx     # Product display
│   │   │   ├── BannerSlider.tsx    # Banner carousel
│   │   │   ├── BackToTop.tsx       # Scroll to top button
│   │   │   └── CafeIdentity.tsx    # Cafe branding
│   │   └── admin/
│   │       ├── AdminClientLayout.tsx  # Admin shell
│   │       ├── AdminHeader.tsx        # Admin header
│   │       └── ImageUploader.tsx      # Image upload component
│   ├── lib/
│   │   ├── auth/
│   │   │   └── admin.ts            # requireAdmin() with is_admin() RPC
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser client
│   │   │   ├── server.ts           # Server client
│   │   │   └── middleware.ts       # Session + redirect middleware
│   │   ├── validation/
│   │   │   └── index.ts            # Zod schemas
│   │   └── search.ts               # Arabic/English search normalization
│   └── supabase/
│       ├── migrations/
│       │   ├── 001_initial_schema.sql
│       │   ├── 002_storage_buckets.sql
│       │   └── 003_admin_rbac.sql
│       └── seed.sql
├── .env.example
├── .env.local                       # (git-ignored)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Troubleshooting

### Admin login not working

1. Verify admin user exists in Supabase Authentication
2. Verify admin is in `admin_users` table: `SELECT * FROM admin_users;`
3. Check that `is_admin()` function exists and is `SECURITY DEFINER`

### Build fails

```bash
npm run build -- --webpack
```

Uses webpack fallback when SWC binary is unavailable.

### RLS blocking admin operations

Ensure `003_admin_rbac.sql` migration was run. Check policies:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## License

This project is proprietary. All rights reserved to Maher Kaif Coffee Shop.

---

**Built with ☕ for Maher Kaif Coffee Shop**
