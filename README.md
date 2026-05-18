# StockFlow MVP

🔗 **Live Deployment Link:** [https://vercel.com/murali-irj/wexa-ai-assignment](https://vercel.com/murali-irj/wexa-ai-assignment)

Welcome to the StockFlow MVP codebase! This project is a multi-tenant inventory management system built with Next.js 13, SQLite (Prisma ORM), Tailwind CSS, and custom JWT authentication.

## 🚀 How to Run the App Locally

### Prerequisites
- **Node.js:** `v16.20.0` or higher (Fully optimized and tested on `v16.20.2`)

The project is built inside the `stockflow` subdirectory. To start the application, please run the following commands in your terminal:

### Step 1: Navigate to the `stockflow` directory
```bash
cd stockflow
```

### Step 2: Run the Development Server
```bash
npm run dev
```

The app will start on **http://localhost:3000** (or http://localhost:3001 if port 3000 is already in use). Open your browser and navigate to the address shown in the terminal!

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 13 (App Router & TS)
- **Database:** SQLite via Prisma ORM (quick setup, zero configuration)
- **Authentication:** Custom JWT-based authentication via HTTP-only session cookies (Node.js 16 compatible)
- **Styling:** Premium dark-themed Tailwind CSS layout with a glassmorphism feel and ambient gradient glows.
- **Icons:** Lucide React

## 📦 In-Scope Features (MVP)
1. **Multi-tenant Signup & Login:** Captures Organization Name upon sign up. Scopes all inventory and users privately by organization.
2. **Dashboard Overview:** Shows Total Products, Total Quantity in Stock, and Low Stock Alerts.
3. **Products CRUD:** 
   - Add/edit products with Name, SKU, Description, Qty, Cost Price, Selling Price, and custom Low Stock Threshold.
   - Client-side search by name/SKU.
   - Quick Stock Adjustment controls (`+ Add` or `- Remove` quantities) directly inside the edit form.
4. **Settings:** Toggle and set a global default Low Stock Threshold.
