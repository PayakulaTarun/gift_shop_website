# 🎁 GiftStudio — Premium Personalized Gifts

GiftStudio is a beautifully crafted e-commerce platform for personalized, custom gifting experiences. From LED photo frames to 3D crystal engravings, wooden nameplates, and photo keychains — every product is unique and customizable.

## 🚀 Live Demo

> Deployed on Vercel — connect your repo to get instant deployments.

## ✨ Features

- 🛒 **Shopping Cart** — Add, update quantity, and remove items with persistence via `localStorage`
- 🔍 **Search** — Instant product search across the full catalog
- 🎨 **Customization** — Each product has a unique personalization prompt for engraving, names, dates etc.
- 📱 **WhatsApp Checkout** — Order placed via a pre-filled WhatsApp message with full order details
- 🏪 **Shop Page** — Browse all products, filter by category
- 📦 **Product Detail Page** — Detailed view with features, rating, customization input, and quantity selector
- 🌙 **Luxury Dark Theme** — Premium glassmorphism UI with gold accents

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — Lightning-fast build tool
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible UI component library
- **Framer Motion** — Smooth animations
- **React Router DOM** — Client-side routing
- **Sonner** — Toast notifications
- **TanStack React Query** — Data fetching

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
git clone https://github.com/PayakulaTarun/gift_shop_website.git
cd gift_shop_website
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

## 📂 Project Structure

```
src/
├── assets/          # Product & category images
├── components/      # Reusable UI components
│   ├── home/        # Landing page sections
│   ├── ui/          # shadcn/ui base components
│   ├── CartSheet    # Slide-out shopping cart
│   ├── SearchDialog # Global search modal
│   └── Navbar       # Site navigation
├── context/         # CartContext — global state
├── data/            # products.ts — full product catalog
├── hooks/           # useScrollReveal, useCart
└── pages/           # Index, Shop, Product, NotFound
```

## 🚀 Deployment

Connect this repo to [Vercel](https://vercel.com) for automatic deployments on every push.

Build command: `npm run build`  
Output directory: `dist`
