# ARCHITECTURE_DIAGRAM.md — Logist.kg

Документ показывает **визуальную архитектуру всей платформы Logist.kg**:  
Frontend → Backend → Firebase → Storage → Admin.

Используется разработчиками для понимания структуры системы.

---

# 1. Общая архитектура


Users
│
▼
Frontend (Next.js)
│
▼
API Layer
│
▼
Firebase Services
│
├ Firestore (Database)
├ Authentication
├ Storage
└ Functions
│
▼
Admin Panel


---

# 2. Архитектура клиента


User Browser
│
▼
Next.js Application
│
├ Pages
├ Components
├ Hooks
├ Context
└ Services


---

# 3. Основные страницы


Home
Find Cargo
Post Cargo
Cargo Details
User Profile
Vehicles
Bids
Chat
Notifications
Dashboard
Admin Panel


---

# 4. Основные компоненты


CargoCard
CargoTable
SearchFilters
BidForm
VehicleForm
ChatWindow
NotificationList
UserProfile
AdminTable


---

# 5. Firebase архитектура


Firebase

├ Authentication
│
├ Firestore
│ ├ users
│ ├ drivers
│ ├ companies
│ ├ vehicles
│ ├ freights
│ ├ bids
│ ├ reviews
│ ├ conversations
│ ├ messages
│ ├ notifications
│ ├ subscriptions
│ ├ payments
│ ├ ads
│ ├ banners
│ ├ reports
│ ├ audit_logs
│ └ system_settings
│
├ Storage
│ ├ avatars
│ ├ driver-documents
│ ├ company-documents
│ ├ vehicle-documents
│ ├ chat-files
│ ├ banners
│ └ ads
│
└ Functions
├ notifications
├ moderation
├ payment-check
└ scheduled-cleanup


---

# 6. Основные бизнес процессы

## Размещение груза


User (shipper)
│
▼
Create Freight Page
│
▼
API /freights/create
│
▼
Firestore
│
▼
freights collection


---

## Отклик водителя


Driver
│
▼
Cargo Page
│
▼
Submit Bid
│
▼
Firestore
│
▼
bids collection


---

## Чат


User A
│
▼
Conversation
│
▼
messages collection
│
▼
User B


---

# 7. Архитектура админ панели


Admin Panel

Dashboard
Users
Drivers
Companies
Freights
Bids
Reports
Verification
Chat Moderation
Payments
Subscriptions
Ads
Banners
Notifications
Audit Logs
System Settings


---

# 8. Поток данных


User Action
│
▼
Frontend Component
│
▼
Service Layer
│
▼
Firebase Query
│
▼
Firestore
│
▼
Response to UI


---

# 9. Безопасность


User
│
▼
Firebase Auth
│
▼
Firestore Rules
│
▼
Database Access


---

# 10. Масштабирование

Для масштабирования используются:


Firestore Indexes
Pagination
Limit queries
Lazy loading
Storage CDN
Caching


---

# 11. Поток уведомлений


Action (Bid / Message / Review)
│
▼
Firestore Write
│
▼
Cloud Function
│
▼
Notification Document
│
▼
User UI


---

# 12. Связи между коллекциями


users
│
├ drivers
│ └ vehicles
│
├ companies
│ └ freights
│ └ bids
│
├ reviews
│
└ conversations
└ messages


---

# 13. Главный принцип архитектуры

Каждая сущность хранится **в отдельной коллекции**.

Нельзя:

- хранить большие массивы
- смешивать разные сущности
- дублировать данные без необходимости
- хранить файлы в Firestore