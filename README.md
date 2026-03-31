# Zabito Admin

Hostel management system for 8 hostels in Anna Nagar, Chennai.

## Setup

```bash
# From the project root (Zabito App/)

# 1. Install server dependencies
npm install

# 2. Install client dependencies
cd client && npm install && cd ..

# 3. Seed the database with all 8 hostels + sample data
npm run seed

# 4. Start both server and client
npm run dev
```

Open **http://localhost:5173**

---

## Tech stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts |
| Backend  | Node.js + Express                 |
| Database | SQLite via built-in `node:sqlite` |
| Routing  | React Router v6                   |

## Server: `http://localhost:3001`
## Client: `http://localhost:5173`

---

## Features

- **Dashboard** — Stats, hostel occupancy bar chart, revenue vs expenses chart, rent collection %, upcoming vacancies timeline
- **Bed lookup** — Live search/filter with full tenant detail slide panel, rent marking
- **Tenants** — Add / manage / check-out tenants; full history
- **Money** — Expense tracking (17 categories) + Investment tracking with Muthu/Naveen splits
- **Settings** — Add/edit hostels, rooms, and beds dynamically (fully scalable)
- **Dark/Light mode** — Toggle saved in localStorage
