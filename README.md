# 🎁 GiftStudio — Premium Personalized Gifts (Full-Stack)

GiftStudio is a beautifully crafted e-commerce platform for personalized, custom gifting experiences. This version is built with a modern Full-Stack architecture featuring a Hono backend, PostgreSQL database, and a React + Vite frontend.

## 🚀 Live Demo

> Deployed on Vercel — connect your repo to get instant deployments for both Frontend & Backend.

## ✨ Features

- 🛒 **Server-Backed Cart** — Guest carts (localStorage) merge seamlessly with server-side storage upon login.
- 🔐 **Secure Authentication** — JWT-based authentication with Login/Register flows.
- 📦 **Order Management** — Full order lifecycle from placement via WhatsApp to status tracking in user history.
- 👔 **Admin Dashboard** — Platform analytics, inventory management (CRUD), and master order controls.
- 🎨 **Customization** — Each product has a unique personalization prompt for engraving, names, dates etc.
- 🌙 **Luxury Dark Theme** — Premium glassmorphism UI with gold accents.

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** (Animations)
- **TanStack React Query** (Data Syncing)

### Backend
- **Hono** (Server Framework)
- **Drizzle ORM** (Database Access)
- **PostgreSQL** (Database)
- **JWT** (Security)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (Local or hosted like Neon/Supabase)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/PayakulaTarun/gift_shop_website.git
   cd gift_shop_website
   ```

2. **Install dependencies (Root + Backend)**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Update your DATABASE_URL and JWT_SECRET in .env
   ```

4. **Initialize Database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run Development Mode (Monorepo)**
   ```bash
   npm run dev:all
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:3001](http://localhost:3001)

## 📂 Project Structure

```
.
├── frontend/             # @giftstudio/frontend (React + Vite)
│   ├── src/             # Application source
│   ├── public/          # Static assets
│   └── components.json  # shadcn/ui configuration
├── backend/              # @giftstudio/backend (Hono)
│   ├── src/db/          # Schema, Migrations, Seeds
│   ├── src/routes/      # API Endpoints
│   └── src/middleware/  # Auth guards, Error handlers
├── package.json          # Workspace Root
└── vercel.json           # Monorepo deployment config
```

## 🚀 Deployment on Vercel

This project is configured as an NPM Workspace. Vercel will automatically detect the root `package.json`.

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, and `VITE_API_URL` (optional if using relative /api) in Vercel project settings.

---
Crafted with ❤️ for the Gifting Excellence.
