# AUTH_FLOW.md — Logist.kg

## 1. Goal

Build authentication without Firebase using backend-controlled security.

Auth must support:
- registration
- login
- logout
- access token
- refresh token
- role-based access
- protected routes
- admin access control

---

## 2. Auth stack

Frontend:
- Next.js

Backend:
- NestJS

Database:
- PostgreSQL

Auth method:
- JWT Access Token
- Refresh Token

Password storage:
- bcrypt password hashing

---

## 3. Registration flow

## Step 1
User opens registration page.

Fields:
- name
- phone
- email
- password
- role

Allowed roles:
- driver
- shipper
- dispatcher

Admin cannot be created from public registration.

---

## Step 2
Frontend sends request:

```http
POST /api/auth/register
