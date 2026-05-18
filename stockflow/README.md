# StockFlow MVP

🔗 **Live Deployment Link:** [https://wexa-ai-assignment-eosin.vercel.app/auth/login](https://wexa-ai-assignment-eosin.vercel.app/auth/login)

Welcome to the StockFlow project directory! This is the main application code built with Next.js 13, SQLite (Prisma ORM), Tailwind CSS, and custom JWT authentication.

## 🚀 How to Run Locally

### Prerequisites
- **Node.js:** `v16.20.0` or higher (Fully optimized and tested on `v16.20.2`)

First, ensure you are inside this directory:
```bash
cd stockflow
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
SQLite is used for absolute simplicity. To sync the database schema and generate the Prisma Client, run:
```bash
npx prisma db push
```

### 3. Run Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** (or http://localhost:3001 if port 3000 is occupied) in your browser to view the application.

---

## 🛠️ Features Implemented

1. **Auth & Multi-Tenancy:**
   - Secure Signup & Login utilizing bcrypt-hashed passwords.
   - Captures Organization Name upon signup.
   - JWT-based authentication stored in secure HTTP-only cookies.
   - strict data isolation scoped by `organizationId`.

2. **Dashboard Overview:**
   - Real-time aggregation of Total Products and Total Units in Stock.
   - Live "Low Stock Items" notification table that links directly to editing individual product stock.

3. **Products Catalog:**
   - Add, View, Edit, and Delete products.
   - Product details include SKU, Name, Description, Quantity on Hand, Cost Price, Selling Price, and custom Low Stock thresholds.
   - Interactive search filter to query by SKU or Product Name.
   - Inline **Quick Stock Adjustment** (+ Add or - Remove custom amounts of inventory) in the edit form.

4. **Settings:**
   - Custom field to configure the Organization's default Low Stock Threshold.
   - Any product without a specific threshold dynamically falls back to this global default.

## 📂 Tech Stack
- **Framework:** Next.js 13 (App Router & TS)
- **Database:** SQLite via Prisma ORM
- **Authentication:** Custom JWT via cookie sessions (`jsonwebtoken` Node 16 compliant)
- **Styling:** Custom Tailwind CSS (Premium Dark Theme layout)
- **Icons:** Lucide React
