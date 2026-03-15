# PROJECT_STRUCTURE.md — Logist.kg

Документ описывает **полную структуру проекта платформы Logist.kg**.  
Он используется разработчиками для понимания архитектуры frontend, backend и Firebase.

---

# 1. Общая архитектура

Платформа состоит из 4 частей:

Frontend  
Backend  
Database  
Infrastructure

---

# 2. Технологический стек

Frontend
- Next.js
- React
- Tailwind CSS
- TypeScript

Backend
- Next.js API routes
- Firebase Functions (для фоновых задач)

Database
- Firebase Firestore

Storage
- Firebase Storage

Authentication
- Firebase Authentication

Hosting
- Firebase Hosting

---

# 3. Структура проекта


src

app
page.tsx
layout.tsx

login
register

dashboard

find-cargo
post-cargo

cargo
[id]

profile
driver
company

vehicles

bids

chat

notifications

admin

components
ui
cargo
chat
forms
filters
tables
admin

context
auth-context
theme-context

hooks
useAuth
useUser
useFreights
useBids

lib
firebase
api
queries

services
freightService
bidService
userService
chatService
paymentService

types
user.types.ts
freight.types.ts
bid.types.ts
chat.types.ts

utils
validators
helpers
formatters

styles
globals.css


---

# 4. Firebase структура

Firestore коллекции:


users
drivers
companies
vehicles
freights
bids
reviews
conversations
messages
notifications
subscriptions
payments
ads
banners
reports
audit_logs
system_settings


---

# 5. Firebase Storage


avatars/
driver-documents/
company-documents/
vehicle-documents/
chat-files/
banners/
ads/


---

# 6. API структура


/api/auth
/api/users
/api/drivers
/api/companies
/api/vehicles
/api/freights
/api/bids
/api/reviews
/api/chat
/api/notifications
/api/subscriptions
/api/payments
/api/admin


---

# 7. Основные страницы сайта


/
Главная страница

/find-cargo
Поиск грузов

/post-cargo
Размещение груза

/cargo/[id]
Страница груза

/profile
Профиль пользователя

/vehicles
Мои машины

/bids
Мои отклики

/chat
Сообщения

/notifications
Уведомления

/dashboard
Панель пользователя


---

# 8. Админ панель


/admin
/admin/dashboard
/admin/users
/admin/drivers
/admin/companies
/admin/freights
/admin/bids
/admin/reports
/admin/verification
/admin/chat
/admin/payments
/admin/subscriptions
/admin/ads
/admin/banners
/admin/notifications
/admin/audit-logs
/admin/settings


---

# 9. Роли пользователей

driver  
водитель

shipper  
отправитель груза

dispatcher  
диспетчер

admin  
администратор

---

# 10. Основные бизнес процессы

### Размещение груза

1 пользователь создаёт груз  
2 груз сохраняется в `freights`  
3 груз появляется в поиске

---

### Отклик на груз

1 водитель открывает груз  
2 нажимает откликнуться  
3 создаётся документ в `bids`

---

### Принятие отклика

1 отправитель смотрит отклики  
2 выбирает водителя  
3 статус груза меняется

---

### Чат

1 создаётся conversation  
2 сообщения хранятся в messages

---

### Рейтинг

1 после завершения груза  
2 пользователи оставляют отзыв  
3 обновляется рейтинг

---

# 11. Настройки платформы

Хранятся в:


system_settings/main


Включают:

- соц сети
- тема сайта
- цвета
- шрифты
- настройки аукциона
- лимиты объявлений
- лимиты откликов
- контакты поддержки

---

# 12. Логи системы

Коллекция:


audit_logs


Логируются:

- вход пользователя
- создание груза
- удаление груза
- блокировка пользователя
- изменение настроек
- действия администратора

---

# 13. Безопасность

Используются:

- Firestore security rules
- роли пользователей
- проверка владельца документа
- модерация
- система жалоб

---

# 14. Масштабирование

Для роста платформы используются:

- индексы Firestore
- пагинация
- limit запросы
- минимизация realtime
- кеширование

---

# 15. Основные документы проекта

В репозитории должны быть:


AI_RULES.md
DATABASE_SCHEMA.md
API_SPEC.md
PRODUCT_ROADMAP.md
FIRESTORE_RULES.md
FIRESTORE_INDEXES.md
FIRESTORE_QUERIES.md
FIREBASE_STRUCTURE.md
FIREBASE_COST_RULES.md
ADMIN_PANEL_STRUCTURE.md
PROJECT_STRUCTURE.md


---

# 16. Статус архитектуры

После подготовки этих документов можно переходить к:

1 разработке авторизации  
2 созданию структуры базы  
3 разработке поиска грузов  
4 разработке откликов  
5 разработке админ панели