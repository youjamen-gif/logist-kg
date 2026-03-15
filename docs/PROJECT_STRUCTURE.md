PROJECT_STRUCTURE.md — Logist.kg
1. Goal

This document describes the final project structure of Logist.kg after moving away from Firebase.

Main stack:

Frontend: Next.js

Backend: NestJS

Database: PostgreSQL

ORM: Prisma

Storage: MinIO / S3

Cache: Redis

Realtime: Socket.IO

2. Root project structure
logist-kg/
│
├── frontend/                  # Next.js frontend
├── backend/                   # NestJS backend
├── database/                  # Prisma schema, migrations, seeds
├── docs/                      # Architecture and technical docs
├── storage/                   # Local development storage configs
├── scripts/                   # Helper scripts
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
3. docs structure
docs/
├── BACKEND_ARCHITECTURE.md
├── DATABASE_SCHEMA_SQL.md
├── AUTH_FLOW.md
├── API_SPEC_BACKEND.md
├── PROJECT_STRUCTURE.md
├── STORAGE_ARCHITECTURE.md
├── REALTIME_ARCHITECTURE.md
├── DEPLOYMENT.md
└── ROADMAP.md

Purpose:

BACKEND_ARCHITECTURE.md — backend overview

DATABASE_SCHEMA_SQL.md — business entities and tables

AUTH_FLOW.md — JWT and auth logic

API_SPEC_BACKEND.md — backend endpoints

PROJECT_STRUCTURE.md — folder map

STORAGE_ARCHITECTURE.md — files and object storage

REALTIME_ARCHITECTURE.md — chat and live events

DEPLOYMENT.md — deployment plan

ROADMAP.md — development stages

4. frontend structure

Frontend is built with Next.js App Router.

frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── find-cargo/
│   │   │   ├── cargo/[id]/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── contact/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── my-freights/
│   │   │   ├── my-bids/
│   │   │   ├── vehicles/
│   │   │   ├── chat/
│   │   │   ├── notifications/
│   │   │   └── settings/
│   │   │
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   ├── admin/users/
│   │   │   ├── admin/freights/
│   │   │   ├── admin/reports/
│   │   │   ├── admin/verification/
│   │   │   ├── admin/banners/
│   │   │   ├── admin/ads/
│   │   │   ├── admin/settings/
│   │   │   └── admin/audit-logs/
│   │   │
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── cargo/
│   │   ├── bid/
│   │   ├── chat/
│   │   ├── notification/
│   │   ├── admin/
│   │   └── shared/
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-system-settings.ts
│   │   ├── use-notifications.ts
│   │   └── use-debounce.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── freights.ts
│   │   │   ├── bids.ts
│   │   │   ├── vehicles.ts
│   │   │   ├── chat.ts
│   │   │   ├── notifications.ts
│   │   │   ├── admin.ts
│   │   │   └── settings.ts
│   │   │
│   │   ├── constants/
│   │   ├── helpers/
│   │   ├── validators/
│   │   └── types/
│   │
│   ├── context/
│   │   ├── auth-context.tsx
│   │   └── app-context.tsx
│   │
│   └── middleware.ts
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.js
├── tailwind.config.ts
└── .env.local
5. frontend responsibilities

Frontend handles:

UI rendering

forms

filters

dashboards

admin pages

route protection on UI level

API calls to backend

realtime socket connection

local state management

Frontend must not handle:

permission enforcement as source of truth

direct database access

direct auth security logic

secure file storage logic

All critical business logic must stay in backend.

6. backend structure

Backend is built with NestJS modular architecture.

backend/
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── configuration.ts
│   │   ├── env.validation.ts
│   │   └── constants.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── enums/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── interfaces/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   └── utils/
│   │
│   ├── auth/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── auth.types.ts
│   │
│   ├── users/
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── drivers/
│   │   ├── dto/
│   │   ├── drivers.controller.ts
│   │   ├── drivers.service.ts
│   │   └── drivers.module.ts
│   │
│   ├── companies/
│   │   ├── dto/
│   │   ├── companies.controller.ts
│   │   ├── companies.service.ts
│   │   └── companies.module.ts
│   │
│   ├── vehicles/
│   │   ├── dto/
│   │   ├── vehicles.controller.ts
│   │   ├── vehicles.service.ts
│   │   └── vehicles.module.ts
│   │
│   ├── freights/
│   │   ├── dto/
│   │   ├── freights.controller.ts
│   │   ├── freights.service.ts
│   │   └── freights.module.ts
│   │
│   ├── bids/
│   │   ├── dto/
│   │   ├── bids.controller.ts
│   │   ├── bids.service.ts
│   │   └── bids.module.ts
│   │
│   ├── conversations/
│   │   ├── dto/
│   │   ├── conversations.controller.ts
│   │   ├── conversations.service.ts
│   │   └── conversations.module.ts
│   │
│   ├── messages/
│   │   ├── dto/
│   │   ├── messages.controller.ts
│   │   ├── messages.service.ts
│   │   └── messages.module.ts
│   │
│   ├── notifications/
│   │   ├── dto/
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   └── notifications.module.ts
│   │
│   ├── reviews/
│   │   ├── dto/
│   │   ├── reviews.controller.ts
│   │   ├── reviews.service.ts
│   │   └── reviews.module.ts
│   │
│   ├── reports/
│   │   ├── dto/
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── reports.module.ts
│   │
│   ├── uploads/
│   │   ├── dto/
│   │   ├── uploads.controller.ts
│   │   ├── uploads.service.ts
│   │   └── uploads.module.ts
│   │
│   ├── banners/
│   │   ├── dto/
│   │   ├── banners.controller.ts
│   │   ├── banners.service.ts
│   │   └── banners.module.ts
│   │
│   ├── ads/
│   │   ├── dto/
│   │   ├── ads.controller.ts
│   │   ├── ads.service.ts
│   │   └── ads.module.ts
│   │
│   ├── settings/
│   │   ├── dto/
│   │   ├── settings.controller.ts
│   │   ├── settings.service.ts
│   │   └── settings.module.ts
│   │
│   ├── payments/
│   │   ├── dto/
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payments.module.ts
│   │
│   ├── subscriptions/
│   │   ├── dto/
│   │   ├── subscriptions.controller.ts
│   │   ├── subscriptions.service.ts
│   │   └── subscriptions.module.ts
│   │
│   ├── admin/
│   │   ├── dto/
│   │   ├── admin-users.controller.ts
│   │   ├── admin-freights.controller.ts
│   │   ├── admin-reports.controller.ts
│   │   ├── admin-settings.controller.ts
│   │   ├── admin-banners.controller.ts
│   │   ├── admin-ads.controller.ts
│   │   ├── admin-audit-logs.controller.ts
│   │   ├── admin.service.ts
│   │   └── admin.module.ts
│   │
│   ├── realtime/
│   │   ├── gateways/
│   │   │   ├── chat.gateway.ts
│   │   │   ├── notifications.gateway.ts
│   │   │   └── auctions.gateway.ts
│   │   ├── realtime.module.ts
│   │   └── realtime.service.ts
│   │
│   ├── redis/
│   │   ├── redis.module.ts
│   │   └── redis.service.ts
│   │
│   ├── audit/
│   │   ├── audit.service.ts
│   │   └── audit.module.ts
│   │
│   └── health/
│       ├── health.controller.ts
│       └── health.module.ts
│
├── test/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env
└── .env.example
7. backend module responsibilities
auth

Handles:

register

login

refresh token

logout

forgot password

reset password

/auth/me

users

Handles:

own profile

public profile

profile updates

drivers

Handles:

driver extended profile

driver documents

driver-specific information

companies

Handles:

company / shipper profile

legal information

company documents

vehicles

Handles:

driver vehicles

vehicle CRUD

vehicle ownership checks

freights

Handles:

freight CRUD

search

filtering

pagination

freight status logic

bids

Handles:

bid creation

accept / reject

bid ownership and visibility

conversations + messages

Handles:

chat structure

participants

messages

read access

notifications

Handles:

user notifications

read / unread state

reports

Handles:

complaints

moderation reports

uploads

Handles:

document/image uploads

object storage integration

deletion rules

banners + ads

Handles:

public promotional blocks

admin CRUD

settings

Handles:

public platform settings

admin system settings

admin

Handles:

moderation

user blocking

freight moderation

reports management

audit access

realtime

Handles:

websocket gateways

live chat

instant notifications

auction live events

audit

Handles:

critical action logs

8. database structure

Database uses Prisma.

database/
└── prisma/
    ├── schema.prisma
    ├── seed.ts
    └── migrations/

Detailed structure:

database/
│
└── prisma/
    ├── schema.prisma
    ├── seed.ts
    ├── seeds/
    │   ├── admin.seed.ts
    │   ├── settings.seed.ts
    │   └── demo-data.seed.ts
    └── migrations/

Purpose:

schema.prisma — all models

seed.ts — main seed entry

seeds/ — separate seed scripts

migrations/ — generated Prisma migrations

9. storage structure

For development, storage can be described locally.

storage/
├── minio/
│   ├── buckets.md
│   └── policy-example.json
└── uploads-example/

Recommended buckets:

avatars

driver-documents

company-documents

vehicle-documents

chat-files

banners

ads

Important rule:
database stores only metadata, not file binaries.

10. scripts structure
scripts/
├── dev/
├── db/
├── seed/
└── deploy/

Examples:

development launch helpers

database reset scripts

migration helpers

deployment scripts

11. environment files

Root:

.env.example

Frontend:

frontend/.env.local

Backend:

backend/.env
backend/.env.example

Typical backend env variables:

PORT=
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=
JWT_REFRESH_EXPIRES=
REDIS_URL=
S3_ENDPOINT=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=
CORS_ORIGIN=

Typical frontend env variables:

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_SOCKET_URL=
12. route grouping principle
Public routes

Accessible without login:

homepage

freight search

freight details

login

register

contact

public settings

banners

ads

Protected routes

Accessible only for authenticated users:

dashboard

profile

my freights

my bids

vehicles

chat

notifications

Admin routes

Accessible only for admins:

admin dashboard

admin users

admin freights

admin reports

admin banners

admin ads

admin settings

admin audit logs

13. naming conventions
Files

Use kebab-case or Nest standard naming:

Examples:

auth.service.ts

freights.controller.ts

admin-users.controller.ts

Types / classes

Use PascalCase:

CreateFreightDto

UpdateProfileDto

JwtAuthGuard

Variables

Use camelCase:

userId

freightStatus

refreshTokenHash

Database models

Use singular model names in Prisma:

User

Freight

Bid

API endpoints

Use plural resource names:

/api/freights

/api/vehicles

/api/reports

14. development order

Recommended implementation order:

Stage 1

Core foundation:

project folders

env files

NestJS setup

Prisma setup

PostgreSQL connection

auth module

users module

Stage 2

Core business:

freights

vehicles

bids

Stage 3

Communication:

conversations

messages

notifications

realtime gateways

Stage 4

Moderation and platform control:

reports

admin

settings

banners

ads

audit logs

Stage 5

Commercial logic:

subscriptions

payments

promotions

15. migration from Firebase principle

Current Firebase-based logic should be replaced gradually.

Replacement path:

remove Firebase Auth usage

replace Firestore reads/writes with backend REST API

replace Firebase Storage with S3/MinIO

replace realtime listeners with Socket.IO

move settings logic to backend

remove all Firebase SDK code from frontend

Important:
Do not rewrite everything at once.
Move module by module.

16. final project principle

The platform must be structured so that:

frontend is responsible only for UI and API interaction

backend is the single source of truth

database is relational and scalable

files live outside the database

realtime is separated from standard CRUD

admin logic is isolated and protected

the project no longer depends on Firebase

17. minimal starting version

If you want the fastest real start, begin with this minimum:

frontend/
backend/
database/prisma/
docs/

And inside backend first create only:

auth/
users/
freights/
bids/
vehicles/
prisma/
common/
main.ts
app.module.ts

That is enough to launch the first working independent version.
