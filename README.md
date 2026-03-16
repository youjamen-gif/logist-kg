# Logist.kg

Logist.kg — это цифровая платформа для поиска грузов и транспорта в Кыргызстане.

Платформа соединяет:

- грузовладельцев (shippers)
- водителей (drivers)
- диспетчеров (dispatchers)

Основная цель сервиса — упростить поиск перевозок, повысить прозрачность рынка логистики и обеспечить безопасное взаимодействие между участниками перевозки.

---

# Основные возможности платформы

Платформа предоставляет:

### Для грузовладельцев
- создание грузов
- публикация грузов
- получение ставок от водителей
- выбор перевозчика
- управление перевозками

### Для водителей
- поиск грузов
- фильтрация заказов
- отправка ставок
- управление транспортом
- участие в перевозках

### Для администраторов
- управление пользователями
- модерация документов
- контроль грузов и ставок
- просмотр audit logs
- управление баннерами и рекламой
- управление системными настройками

---

# Технологический стек

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
React Server Components
Backend
NestJS
TypeScript
Prisma ORM
PostgreSQL
Redis
JWT authentication
Socket.IO
Storage
S3 / MinIO
Архитектура

Logist.kg построен как modular monolith.

Это означает:

один backend сервис

модульная структура

независимые доменные модули

единая база данных

Основные backend модули:

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
Структура репозитория
logist-kg
│
├── frontend
│   └── клиентское приложение (Next.js)
│
├── backend
│   └── серверное приложение (NestJS)
│
├── docs
│   └── архитектурная документация проекта
│
├── scripts
│   └── вспомогательные dev-скрипты
│
├── docker-compose.yml
├── .env.example
└── README.md
Документация проекта

Основные архитектурные документы находятся в папке:

/docs
Основные документы
AI_RULES.md
PROJECT_STRUCTURE.md
BACKEND_ARCHITECTURE.md
DATABASE_SCHEMA.md
DATABASE_SCHEMA_SQL.md
AUTH_FLOW.md
API_SPEC_BACKEND.md
ADMIN_PANEL_STRUCTURE.md

Эти документы определяют:

архитектуру системы

структуру базы данных

API контракт

правила разработки

правила для AI разработки

Принципы разработки

Проект разрабатывается с использованием AI.

Поэтому архитектура строго зафиксирована в документации.

Основные правила:

backend — единственный источник бизнес-логики

frontend отвечает только за UI

API является контрактом между слоями

структура проекта строго определена

безопасность проверяется на backend

все изменения должны быть согласованы с документацией

Запуск проекта
Требования

Перед запуском должны быть установлены:

Node.js 20+
PostgreSQL 15+
Redis
npm или pnpm
Запуск backend
cd backend

npm install

cp .env.example .env

npm run prisma:generate

npm run prisma:migrate

npm run start:dev

Backend запускается по адресу:

http://localhost:3001
Запуск frontend
cd frontend

npm install

cp .env.example .env.local

npm run dev

Frontend запускается по адресу:

http://localhost:3000
Переменные окружения
Backend .env
DATABASE_URL=postgresql://user:password@localhost:5432/logist
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

STORAGE_ENDPOINT=http://localhost:9000
STORAGE_ACCESS_KEY=minio
STORAGE_SECRET_KEY=miniosecret
Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

Frontend не должен хранить секреты.

Prisma

Backend использует Prisma ORM.

Основные команды:

npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
Реaltime

Realtime используется для:

чат сообщений

live уведомлений

обновлений ставок

Технология:

Socket.IO
Безопасность

Платформа использует:

JWT Access Token
JWT Refresh Token
bcrypt password hashing
role guards
ownership guards
rate limiting
audit logging

Backend не доверяет frontend.

Масштабируемость

Архитектура платформы рассчитана на:

100k+ пользователей
100k+ грузов
1000+ realtime соединений
Roadmap платформы

Планируемые функции:

мобильное приложение
карта перевозок
интеграция с платежными системами
страхование перевозок
аналитика рынка
рейтинг перевозчиков
Правила разработки

Перед созданием нового кода разработчик или AI должен:

проверить архитектурную документацию

убедиться, что изменение не ломает структуру

обновить документацию при необходимости

не дублировать существующую логику

соблюдать структуру проекта

Лицензия

Copyright © Logist.kg

Все права защищены.
