# API_SPEC_BACKEND.md — Logist.kg

## 1. Goal

This document defines the backend API for Logist.kg using:

- NestJS
- PostgreSQL
- JWT authentication
- role-based access control

Base URL example:

```http
/api

2. Roles

Supported roles:

driver

shipper

dispatcher

admin

3. Authentication
POST /api/auth/register

Register a new user.

Allowed roles:

driver

shipper

dispatcher

Request body:

{
  "name": "Ali",
  "phone": "+996500000000",
  "email": "ali@example.com",
  "password": "StrongPassword123",
  "role": "driver"
}

Response:

{
  "user": {
    "id": "uuid",
    "name": "Ali",
    "email": "ali@example.com",
    "phone": "+996500000000",
    "role": "driver"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}

Access:

public

POST /api/auth/login

Login user.

Request body:

{
  "email": "ali@example.com",
  "password": "StrongPassword123"
}

Response:

{
  "user": {
    "id": "uuid",
    "name": "Ali",
    "email": "ali@example.com",
    "role": "driver"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}

Access:

public

POST /api/auth/refresh

Refresh access token.

Request:

refresh token cookie or body

Response:

{
  "accessToken": "new_jwt_access_token"
}

Access:

authenticated by refresh token

POST /api/auth/logout

Logout current user.

Response:

{
  "message": "Logged out successfully"
}

Access:

authenticated

GET /api/auth/me

Get current authenticated user.

Response:

{
  "id": "uuid",
  "name": "Ali",
  "email": "ali@example.com",
  "phone": "+996500000000",
  "role": "driver",
  "phoneVerified": false,
  "documentsVerified": false,
  "status": "active"
}

Access:

authenticated

POST /api/auth/forgot-password

Request password reset.

Request body:

{
  "email": "ali@example.com"
}

Response:

{
  "message": "Password reset instructions sent if account exists"
}

Access:

public

POST /api/auth/reset-password

Reset password using token.

Request body:

{
  "token": "reset_token",
  "newPassword": "NewStrongPassword123"
}

Response:

{
  "message": "Password updated successfully"
}

Access:

public with valid reset token

4. Users
GET /api/users/me

Alias for authenticated user profile.

Access:

authenticated

GET /api/users/:id

Get public user profile.

Response:

{
  "id": "uuid",
  "name": "Ali",
  "role": "driver",
  "rating": 4.8,
  "reviewsCount": 12,
  "documentsVerified": true
}

Access:

authenticated

PATCH /api/users/me

Update own base profile.

Request body:

{
  "name": "Ali Updated",
  "phone": "+996500000001"
}

Response:

{
  "message": "Profile updated successfully"
}

Access:

authenticated

PATCH /api/users/:id/status

Update user status.

Request body:

{
  "status": "blocked"
}

Access:

admin

PATCH /api/users/:id/role

Change user role.

Request body:

{
  "role": "dispatcher"
}

Access:

admin

5. Driver Profiles
GET /api/drivers/me

Get own driver profile.

Access:

driver

POST /api/drivers/me

Create driver profile.

Request body:

{
  "passportNumber": "ID123456",
  "truckType": "tent",
  "capacity": 20,
  "notes": "Experienced driver"
}

Access:

driver

PATCH /api/drivers/me

Update own driver profile.

Access:

driver

GET /api/drivers/:userId

Get driver public profile.

Access:

authenticated

6. Company Profiles
GET /api/companies/me

Get own company profile.

Access:

shipper

dispatcher

admin

POST /api/companies/me

Create company profile.

Request body:

{
  "companyName": "Logist KG LLC",
  "legalAddress": "Bishkek",
  "inn": "123456789",
  "okpo": "987654321"
}

Access:

shipper

dispatcher

PATCH /api/companies/me

Update own company profile.

Access:

shipper

dispatcher

admin

GET /api/companies/:userId

Get company public profile.

Access:

authenticated

7. Vehicles
GET /api/vehicles/my

Get current driver's vehicles.

Access:

driver

POST /api/vehicles

Create vehicle.

Request body:

{
  "plateNumber": "B123ABC",
  "trailerNumber": "TR456KG",
  "truckType": "tent",
  "capacity": 20,
  "dimensions": "13.6 x 2.45 x 2.7"
}

Access:

driver

GET /api/vehicles/:id

Get vehicle by id.

Access:

owner

admin

PATCH /api/vehicles/:id

Update own vehicle.

Access:

owner

admin

DELETE /api/vehicles/:id

Delete own vehicle.

Access:

owner

admin

8. Freights
GET /api/freights

Get freight list with filters.

Query params:

originCity

destinationCity

originCountry

destinationCountry

weightFrom

weightTo

truckType

loadingDate

consolidation

status

page

limit

Example:

GET /api/freights?originCity=Bishkek&destinationCity=Almaty&truckType=tent&page=1&limit=20

Response:

{
  "items": [],
  "page": 1,
  "limit": 20,
  "total": 120
}

Access:

public or authenticated depending on product policy

GET /api/freights/:id

Get freight details.

Access:

public or authenticated depending on product policy

POST /api/freights

Create freight.

Request body:

{
  "originCity": "Bishkek",
  "destinationCity": "Almaty",
  "originCountry": "KG",
  "destinationCountry": "KZ",
  "weight": 10000,
  "dimensions": "12x2.5x2.7",
  "price": 50000,
  "currency": "KGS",
  "loadingDate": "2026-03-20",
  "description": "Construction materials",
  "documentsRequired": true,
  "consolidation": false,
  "truckType": "tent",
  "trucksNeeded": 2,
  "isAuction": true
}

Access:

shipper

dispatcher

admin

PATCH /api/freights/:id

Update own freight.

Access:

owner

admin

DELETE /api/freights/:id

Delete or soft-delete freight.

Access:

owner

admin

PATCH /api/freights/:id/status

Update freight status.

Request body:

{
  "status": "completed"
}

Access:

owner

admin

POST /api/freights/:id/view

Increment freight view count.

Access:

public or authenticated

GET /api/freights/my/list

Get current user's freights.

Access:

shipper

dispatcher

admin

9. Bids
GET /api/bids/my

Get current driver's bids.

Access:

driver

POST /api/bids

Create bid.

Request body:

{
  "freightId": "uuid",
  "price": 47000,
  "message": "Can load tomorrow"
}

For auction freight, message can be optional.

Access:

driver

GET /api/bids/freight/:freightId

Get bids for a freight.

Access:

freight owner

admin

GET /api/bids/:id

Get bid details.

Access:

bid owner

freight owner

admin

PATCH /api/bids/:id

Update own bid.

Access:

bid owner

admin

PATCH /api/bids/:id/status

Accept or reject bid.

Request body:

{
  "status": "accepted"
}

Access:

freight owner

admin

DELETE /api/bids/:id

Cancel or delete bid.

Access:

bid owner

admin

10. Conversations
GET /api/conversations/my

Get current user's conversations.

Access:

authenticated

POST /api/conversations

Create conversation.

Request body:

{
  "type": "freight_chat",
  "freightId": "uuid",
  "participantIds": ["user_uuid_1", "user_uuid_2"]
}

Access:

authenticated

GET /api/conversations/:id

Get one conversation.

Access:

participant

admin

GET /api/conversations/:id/messages

Get conversation messages with pagination.

Query params:

page

limit

Access:

participant

admin

11. Messages
POST /api/messages

Send message.

Request body:

{
  "conversationId": "uuid",
  "messageText": "Hello"
}

Access:

participant

admin

PATCH /api/messages/:id

Edit own message if allowed by product rules.

Access:

sender

admin

DELETE /api/messages/:id

Delete own message or moderate message.

Access:

sender

admin

12. Notifications
GET /api/notifications/my

Get current user's notifications.

Query params:

page

limit

isRead

Access:

authenticated

PATCH /api/notifications/:id/read

Mark notification as read.

Access:

owner

PATCH /api/notifications/read-all

Mark all notifications as read.

Access:

authenticated

POST /api/notifications/system

Send system notification.

Request body:

{
  "userId": "uuid",
  "title": "Verification approved",
  "message": "Your documents were approved",
  "type": "system"
}

Access:

admin

internal service

13. Reviews
POST /api/reviews

Create review.

Request body:

{
  "toUserId": "uuid",
  "freightId": "uuid",
  "rating": 5,
  "comment": "Reliable partner"
}

Access:

authenticated users involved in completed freight

GET /api/reviews/user/:userId

Get reviews for user.

Access:

public or authenticated

DELETE /api/reviews/:id

Delete review if moderation needed.

Access:

admin

14. Reports
POST /api/reports

Create complaint/report.

Request body:

{
  "targetEntityType": "freight",
  "targetEntityId": "uuid",
  "reportType": "spam",
  "message": "Suspicious listing"
}

Access:

authenticated

GET /api/reports

Get reports list.

Query params:

status

page

limit

Access:

admin

GET /api/reports/:id

Get report details.

Access:

admin

PATCH /api/reports/:id/status

Update report status.

Request body:

{
  "status": "resolved",
  "moderatorComment": "Spam removed"
}

Access:

admin

15. Banners
GET /api/banners

Get active banners.

Access:

public

POST /api/banners

Create banner.

Request body:

{
  "title": "Promo Banner",
  "imageUrl": "https://...",
  "link": "https://...",
  "isActive": true,
  "sortOrder": 1
}

Access:

admin

PATCH /api/banners/:id

Update banner.

Access:

admin

DELETE /api/banners/:id

Delete banner.

Access:

admin

16. Ads
GET /api/ads

Get active ads.

Access:

public

POST /api/ads

Create ad.

Request body:

{
  "title": "Top Ad",
  "imageUrl": "https://...",
  "link": "https://...",
  "isActive": true,
  "startsAt": "2026-03-20T00:00:00Z",
  "endsAt": "2026-04-20T00:00:00Z"
}

Access:

admin

PATCH /api/ads/:id

Update ad.

Access:

admin

DELETE /api/ads/:id

Delete ad.

Access:

admin

17. System Settings
GET /api/settings/public

Get public system settings.

Possible response:

{
  "siteTheme": "light",
  "primaryColor": "#000000",
  "fontFamily": "Inter",
  "siteTitle": "Logist.kg",
  "heroTitle": "Find and post freight",
  "heroSubtitle": "All logistics in one system",
  "socialLinks": {
    "telegram": "https://t.me/..."
  },
  "supportContacts": {
    "email": "admin@logist.kg",
    "phone": "+996509139129"
  }
}

Access:

public

GET /api/settings/admin

Get full settings.

Access:

admin

PATCH /api/settings/admin

Update platform settings.

Access:

admin

18. Subscriptions
GET /api/subscriptions/my

Get own subscriptions.

Access:

authenticated

POST /api/subscriptions

Create subscription order.

Request body:

{
  "planName": "premium"
}

Access:

authenticated

PATCH /api/subscriptions/:id/status

Update subscription status.

Access:

admin

payment webhook service

19. Payments
GET /api/payments/my

Get own payment history.

Access:

authenticated

POST /api/payments/create

Create payment request.

Request body:

{
  "subscriptionId": "uuid",
  "amount": 1000,
  "currency": "KGS",
  "paymentMethod": "bank_card"
}

Access:

authenticated

POST /api/payments/webhook

Payment provider webhook endpoint.

Access:

payment provider

protected by signature

GET /api/payments

Get payments list.

Access:

admin

finance manager if such role is added later

20. Admin
GET /api/admin/dashboard

Get admin dashboard stats.

Example response:

{
  "usersCount": 1000,
  "driversCount": 600,
  "shippersCount": 300,
  "activeFreightsCount": 120,
  "reportsCount": 5,
  "pendingVerificationCount": 18
}

Access:

admin

GET /api/admin/users

Get users list with filters.

Query params:

role

status

search

page

limit

Access:

admin

GET /api/admin/freights

Get freights list with moderation filters.

Access:

admin

GET /api/admin/reports

Get moderation reports.

Access:

admin

GET /api/admin/verifications

Get users waiting for verification.

Access:

admin

PATCH /api/admin/users/:id/verify-documents

Verify user documents.

Request body:

{
  "documentsVerified": true
}

Access:

admin

PATCH /api/admin/users/:id/verify-phone

Verify user phone.

Request body:

{
  "phoneVerified": true
}

Access:

admin

PATCH /api/admin/users/:id/block

Block user.

Request body:

{
  "status": "blocked"
}

Access:

admin

PATCH /api/admin/freights/:id/block

Block freight.

Access:

admin

PATCH /api/admin/freights/:id/activate

Activate freight.

Access:

admin

21. Audit Logs
GET /api/audit-logs

Get audit logs.

Query params:

userId

action

entityType

page

limit

Access:

admin

22. Files / Storage
POST /api/files/upload

Upload file.

Used for:

avatars

driver documents

company documents

vehicle documents

chat files

banners

ads

Response:

{
  "fileUrl": "https://storage/.../file.jpg",
  "filePath": "avatars/file.jpg",
  "fileType": "image/jpeg",
  "fileSize": 123456
}

Access:

authenticated

admin depending on folder rules

DELETE /api/files

Delete file.

Request body:

{
  "filePath": "avatars/file.jpg"
}

Access:

owner

admin

23. Realtime / Socket events

Socket.IO events are not classic REST endpoints but should be documented.

chat:join

Join conversation room.

Payload:

{
  "conversationId": "uuid"
}
chat:message

Send realtime message.

Payload:

{
  "conversationId": "uuid",
  "messageText": "Hello"
}
notification:new

Server emits notification event.

Payload:

{
  "id": "uuid",
  "type": "new_bid",
  "title": "New bid",
  "message": "A driver sent a bid"
}
24. Common response format

Recommended success format:

{
  "success": true,
  "data": {}
}

Recommended error format:

{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email"]
  }
}
25. Common rules

All list endpoints should support:

pagination

filtering

sorting where needed

All protected endpoints must check:

JWT validity

user role

ownership when needed

All critical actions should write logs to:

audit_logs

26. Final principle

Backend API must be:

independent from Firebase

role-safe

ownership-safe

scalable

ready for future mobile app and external integrations
