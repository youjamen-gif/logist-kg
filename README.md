# Logist.kg

Logist.kg is a logistics platform that connects drivers, shippers, and dispatchers to find and manage freight. Users can post loads, search by route and vehicle type, place bids, communicate through chat, and manage transportation workflows in one system.

---

## Project Status

The project is currently in development.

Main goal of the current stage:
- build a scalable architecture
- keep Firebase costs under control
- prepare the platform for future growth and migration

---

## Main Roles

- **Driver** — finds loads and places bids
- **Shipper** — posts freight and manages bids
- **Dispatcher** — manages transportation workflows
- **Admin** — manages the platform, moderation, and settings

---

## Main Features

- Freight posting
- Freight search with filters
- Driver bids
- User profiles
- Vehicle management
- Chat system
- Notifications
- Reviews and ratings
- Admin panel
- Paid listings
- Ads and subscriptions

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend / Infrastructure
- Firebase
- Firestore
- Firebase Authentication
- Firebase Storage
- Firebase Hosting
- Firebase Functions

---

## Project Structure

```text
logist-kg/
│
├── docs/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── styles/
│
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── storage.rules
│
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── tsconfig.json
