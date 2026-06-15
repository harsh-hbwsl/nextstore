# NextStore 🛒

NextStore is a modern, responsive, full-stack E-Commerce application built using the Next.js 14 App Router, TypeScript, and Tailwind CSS.

## 🌟 Features

*   **Next.js 14 App Router:** Leveraging Server Components, Server-Side Rendering (SSR), and Static Site Generation (SSG).
*   **FakeStore API Integration:** Dynamically fetches products, categories, and handles Search Engine Optimization (SEO).
*   **Global State Management:** Uses React Context API for managing the shopping cart globally across components.
*   **Admin Dashboard:** Includes a functional admin panel to add products and view the inventory using Next.js API Routes.
*   **Search & Filtering:** Real-time client-side search and category filtering.
*   **Responsive UI:** Fully responsive design built entirely with Tailwind CSS and modern micro-animations.

## 🚀 Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** `lucide-react`
*   **Data Source:** [FakeStore API](https://fakestoreapi.com)

## 🛠️ Installation & Setup

1. **Clone or Download the Repository:**
   Navigate into the project directory:
   ```bash
   cd nextstore
   ```

2. **Install Dependencies:**
   Ensure you are using **Node.js v18.17.0 or higher**.
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

```
nextstore/
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── admin/           # Admin dashboard and product management
│   │   ├── api/             # Backend API routes
│   │   ├── products/        # Product listing and dynamic detail pages
│   │   ├── globals.css      # Global Tailwind styles
│   │   ├── layout.tsx       # Root layout wrapping the app
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable UI components (Header, Cards, Forms)
│   ├── context/             # React Context for global state (CartContext)
│   └── types/               # TypeScript interfaces and types
├── public/                  # Static assets
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Project dependencies and scripts
```

## 📝 Usage Guide

*   **Home Page (`/`):** View featured products and shop by category.
*   **Products Page (`/products`):** Browse all products, search by keywords, and filter by category.
*   **Product Detail (`/products/[id]`):** View detailed information about a specific product. Pages are statically generated for speed.
*   **Admin Dashboard (`/admin`):** Access the admin panel.
*   **Add Product (`/admin/add-product`):** Fill out the form to add a custom product to the store. *(Note: Data is saved to an in-memory array and will reset upon server restart).*

