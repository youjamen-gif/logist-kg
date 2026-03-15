
# DATABASE_SCHEMA.md — Logist.kg

## Core Collections

### users
Fields:
- id
- name
- phone
- email
- role (driver | shipper | dispatcher | admin)
- phoneVerified
- documentsVerified
- rating
- reviewsCount
- createdAt
- status

### drivers
- userId
- passportNumber
- passportPhoto
- vehicles[]
- rating
- reviewsCount

### companies
- name
- phone
- legalAddress
- inn
- okpo
- documents[]
- verified
- rating
- createdAt

### vehicles
- driverId
- plateNumber
- trailerNumber
- truckType
- capacity
- dimensions
- techPassport
- createdAt

### freights
- originCity
- destinationCity
- originCountry
- destinationCountry
- weight
- dimensions
- price
- currency
- loadingDate
- truckType
- consolidation
- documentsRequired
- trucksNeeded
- description
- companyId
- status
- bidsCount
- views
- createdAt

### bids
- freightId
- driverId
- price
- auction
- createdAt

### reviews
- fromUserId
- toUserId
- freightId
- rating
- comment
- createdAt

### conversations
- participants[]
- freightId
- lastMessage
- updatedAt

### messages
- conversationId
- senderId
- text
- createdAt

### notifications
- userId
- type
- read
- createdAt

### subscriptions
- userId
- plan
- startDate
- endDate

### ads
- title
- imageUrl
- link
- active

### banners
- title
- imageUrl
- link
- active

### reports
- userId
- targetId
- type
- message
- status
- createdAt

### audit_logs
- userId
- action
- targetId
- createdAt
