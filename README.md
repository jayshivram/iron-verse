# Poet's Sanctuary

A full-stack poetry portfolio platform for Iron Heist. Nine free collections, a blog, reading progress tracking, and an admin dashboard.

## Stack

- **React 18 + TypeScript** — Vite 5
- **Tailwind CSS 3.4** — OKLCH dark theme, custom KirimomiSwash display font
- **Framer Motion** — animations
- **TanStack React Query v5** — server state
- **Supabase** — PostgreSQL + Auth + Storage + Edge Functions
- **React PDF v7** — in-browser PDF reader
- **TipTap** — rich text editor (admin)

---

## Quick start

### 1. Install dependencies

```bash
cd poets-sanctuary
npm install
```

### 2. Copy assets

```bash
node setup-assets.mjs
```

This copies covers, PDFs, and fonts into `public/`.

### 3. Set environment variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up the database

In the Supabase dashboard → SQL Editor, run:

```
supabase/schema.sql
```

This creates all tables, RLS policies, functions, and seeds all 9 books + 3 blog posts.

### 5. Run

```bash
npm run dev
```

---

## Admin access

Set a user as admin in the database:

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

Then visit `/admin`.

---

## Edge Functions

Deploy with the Supabase CLI:

```bash
supabase functions deploy send-newsletter
supabase functions deploy send-contact-email
```

Set the required secrets:

```bash
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set ADMIN_EMAIL=hello@ironheist.com
```

---

## Build

```bash
npm run build
```

Output: `dist/`

---

## Project structure

```
src/
  components/
    admin/        Admin dashboard components
    blog/         Blog-specific components
    books/        Book grid, PDF viewer, etc.
    home/         Hero, featured books, newsletter
    layout/       Header, footer, breadcrumbs
    ui/           Reusable UI primitives
  contexts/       AuthContext, ThemeContext
  hooks/          Data hooks (useBooks, useBlogPosts, etc.)
  lib/            QueryClient, PDF worker setup
  pages/          Route-level page components
  services/       Supabase service layer
  styles/         Global CSS + font declarations
  types/          TypeScript interfaces
  utils/          Helpers, formatters, constants
supabase/
  schema.sql      Full DB schema + seed data
  functions/      Edge functions (newsletter, contact)
public/
  fonts/          KirimomiSwash TTF files
  images/books/   Book cover WebP files
  images/ui/      Background images
  pdfs/           PDF collection files
```
