# BACKEND_ARCHITECTURE.md — Logist.kg

## 1. Goal

Build Logist.kg as an independent platform without Firebase dependency.

---

## 2. Core Stack

Frontend:
- Next.js
- TypeScript
- Tailwind CSS

Backend:
- NestJS
- TypeScript

Database:
- PostgreSQL

ORM:
- Prisma

Authentication:
- JWT
- Refresh Tokens

Storage:
- MinIO or Amazon S3

Realtime:
- Socket.IO

Cache:
- Redis

Background Jobs:
- Cron / Queue workers

---

## 3. Backend Modules

- auth
- users
- drivers
- companies
- vehicles
- freights
- bids
- chats
- messages
- notifications
- reviews
- reports
- banners
- ads
- settings
- subscriptions
- payments
- admin

---

## 4. Responsibilities

### Frontend
- UI
- forms
- dashboards
- filters
- admin pages

### Backend
- business logic
- authentication
- authorization
- validation
- database access
- file handling
- realtime communication

### Database
- users
- freights
- bids
- messages
- reports
- settings
- payments

---

## 5. Auth Strategy

- register with email/password
- login returns access token + refresh token
- role-based access control
- protected admin endpoints
- document ownership checks

---

## 6. Storage Strategy

Files stored in:
- avatars/
- driver-documents/
- company-documents/
- vehicle-documents/
- chat-files/
- banners/
- ads/

Database stores only:
- fileUrl
- filePath
- fileType
- fileSize

---

## 7. Realtime Strategy

Socket.IO used for:
- private chat
- admin-user support chat
- notifications
- auction mini-chat

---

## 8. Security

- JWT auth
- refresh token rotation
- role guards
- ownership guards
- request validation
- rate limiting
- audit logging

---

## 9. Scalability

- PostgreSQL indexes
- Redis caching
- pagination
- queue workers
- file storage outside backend container

---

## 10. Migration Principle

Old Firebase logic must be replaced gradually:
1. auth
2. database queries
3. storage
4. realtime
5. settings
6. admin tools
