# ARCHITECTURE_DIAGRAM.md — Logist.kg

Этот документ описывает архитектуру платформы Logist.kg на системном уровне.

Он показывает:

- основные компоненты системы
- связи между компонентами
- поток данных
- инфраструктуру
- realtime систему
- хранение данных
- точки безопасности

Документ предназначен для разработчиков и AI, чтобы понимать архитектуру платформы целиком.

---

# 1. Общая архитектура системы

Logist.kg построен по архитектуре:

```text
Client → Frontend → API → Backend → Database / Cache / Storage
2. Высокоуровневая схема
Users
│
▼
Frontend (Next.js)
│
▼
API Layer
│
▼
Backend (NestJS)
│
├── PostgreSQL
├── Redis
├── Object Storage
└── Realtime (Socket.IO)
3. Клиенты системы

Клиентами платформы являются:

Web Browser
Mobile Browser
Future Mobile Apps

Все клиенты работают через Frontend приложение.

4. Frontend слой

Frontend реализован на:

Next.js
TypeScript
Tailwind CSS

Frontend отвечает за:

UI

маршрутизацию

формы

отображение данных

отправку API запросов

Frontend не содержит бизнес-логики.

5. API слой

Frontend взаимодействует с backend через:

REST API

Базовый путь:

/api/v1

Каждый запрос проходит через:

Authentication
Validation
Business Logic
Database Access
6. Backend слой

Backend реализован на:

NestJS
TypeScript
Prisma ORM

Backend состоит из модулей:

auth
users
freights
vehicles
bids
orders
chat
notifications
verification
admin
files
audit
payments

Каждый модуль имеет:

controller
service
dto
guards
serializer
7. Поток запроса

Пример полного цикла запроса:

User
↓
Frontend Page
↓
API Client
↓
HTTP Request
↓
Backend Controller
↓
Service
↓
Prisma ORM
↓
PostgreSQL
↓
Service
↓
Controller
↓
HTTP Response
↓
Frontend UI
8. База данных

Основная база данных:

PostgreSQL

ORM:

Prisma

Основные таблицы:

users
freights
vehicles
bids
orders
messages
notifications
reviews
files
audit_logs
9. Redis

Redis используется для:

rate limiting
caching
session storage
background jobs

Redis не используется как основная база данных.

10. Object Storage

Файлы хранятся в:

S3 / MinIO

В базе данных хранятся только метаданные:

file_id
url
path
mime_type
size
11. Realtime архитектура

Realtime используется для:

чат сообщений
уведомлений
обновления ставок

Технология:

Socket.IO

Схема:

Client
↓
Socket Connection
↓
Socket Gateway
↓
Backend Services
12. Notification flow

Пример отправки уведомления:

Action occurs
↓
Backend Service
↓
Notification Service
↓
Store notification in DB
↓
Send realtime event
↓
Frontend updates UI
13. Chat flow
User sends message
↓
Frontend API
↓
Backend Chat Controller
↓
Chat Service
↓
Save message in DB
↓
Emit Socket Event
↓
Receiver gets message
14. File upload flow
User uploads file
↓
Frontend Form
↓
API /files/upload
↓
Backend File Service
↓
Upload to Storage
↓
Save metadata in DB
↓
Return file URL
15. Admin flow

Admin взаимодействует через:

/admin routes

Frontend:

Admin UI

Backend:

/admin API endpoints

Admin actions записываются в:

audit_logs
16. Безопасность

Основные механизмы безопасности:

JWT authentication
role guards
ownership guards
DTO validation
rate limiting
audit logging

Backend не доверяет frontend.

17. Поток авторизации
User login
↓
Auth API
↓
Generate JWT tokens
↓
Return access + refresh token
↓
Frontend stores token
↓
Authorized requests
18. Масштабируемость

Архитектура рассчитана на:

100k+ пользователей
100k+ грузов
1000+ realtime соединений
19. Возможная будущая инфраструктура

При росте платформы архитектура может расширяться:

CDN
Load Balancer
Microservices
Queue Workers
Analytics Services

Но текущая архитектура — modular monolith.

20. Схема инфраструктуры
Internet
│
▼
CDN (future)
│
▼
Frontend (Next.js)
│
▼
Backend API (NestJS)
│
├── PostgreSQL
├── Redis
├── Object Storage
└── Socket.IO
21. Monitoring

Система должна поддерживать:

error logging
performance monitoring
audit logging
system alerts

Возможные инструменты:

Sentry
Prometheus
Grafana
22. Разделение ответственности
Слой	Ответственность
Frontend	UI и пользовательский интерфейс
Backend	бизнес-логика
Database	хранение данных
Redis	кеш и временные данные
Storage	файлы
Realtime	события
23. Основной принцип архитектуры

Архитектура Logist.kg должна быть:

простая
предсказуемая
масштабируемая
безопасная

Если решение:

нарушает разделение слоёв

переносит логику на frontend

усложняет систему

оно считается неправильным.

24. Финальная схема платформы
Users
│
▼
Frontend (Next.js)
│
▼
REST API
│
▼
Backend (NestJS)
│
├── PostgreSQL
├── Redis
├── Storage
└── Socket.IO

---

Теперь в `docs` у тебя уже есть **почти идеальный архитектурный набор**:


AI_RULES.md
PROJECT_STRUCTURE.md
BACKEND_ARCHITECTURE.md
DATABASE_SCHEMA.md
DATABASE_SCHEMA_SQL.md
AUTH_FLOW.md
API_SPEC_BACKEND.md
ADMIN_PANEL_STRUCTURE.md
DEVELOPMENT_WORKFLOW.md
ARCHITECTURE_DIAGRAM.md
