
# API_SPEC.md — Logist.kg

## Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

## Users

GET /api/users/me
GET /api/users/{id}
PATCH /api/users/update

## Drivers

GET /api/drivers/{id}
POST /api/drivers/create

## Companies

GET /api/companies/{id}
POST /api/companies/create
PATCH /api/companies/update

## Vehicles

POST /api/vehicles/create
GET /api/vehicles/driver/{id}
DELETE /api/vehicles/{id}

## Freights

GET /api/freights
GET /api/freights/{id}
POST /api/freights/create
PATCH /api/freights/update
DELETE /api/freights/delete

## Bids

POST /api/bids/create
GET /api/bids/freight/{freightId}
PATCH /api/bids/update

## Reviews

POST /api/reviews/create
GET /api/reviews/user/{userId}

## Chat

POST /api/chat/create
GET /api/chat/{conversationId}
POST /api/chat/message

## Notifications

GET /api/notifications/user/{userId}
PATCH /api/notifications/read

## Admin

GET /api/admin/users
GET /api/admin/freights
POST /api/admin/ban-user
DELETE /api/admin/delete-freight
