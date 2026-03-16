# API_SPEC_BACKEND.md — Logist.kg

Документ описывает целевой backend API платформы Logist.kg.

Это основной контракт между frontend и backend.

Документ фиксирует:

- структуру endpoint'ов
- формат запросов и ответов
- правила пагинации
- правила фильтрации
- правила авторизации
- разделение public / private / admin API

---

# 1. Общие правила API

API Logist.kg строится по принципам:

- REST-first
- предсказуемые URL
- единые форматы ответов
- строгая типизация DTO
- backend как единственный источник истины
- обязательные проверки доступа на сервере
- pagination-first для списков

---

# 2. Base URL

```text
/api/v1

Все endpoint'ы должны быть версионируемыми.

3. Формат успешного ответа
3.1 Без пагинации
{
  "data": {}
}
3.2 Со списком
{
  "data": [],
  "meta": {
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 245,
      "hasNext": true
    }
  }
}
4. Формат ошибки
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": []
  }
}
5. Авторизация

Защищённые endpoint'ы требуют заголовок:

Authorization: Bearer <access_token>
6. Основные роли
guest
driver
shipper
dispatcher
admin
7. Основные группы API
/auth
/users
/freights
/vehicles
/bids
/orders
/chats
/messages
/notifications
/files
/reviews
/verification
/admin
/system
/health
8. AUTH API
8.1 POST /auth/register

Регистрация пользователя.

Access

Public

Request
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "name": "Аман Исаев",
  "phone": "+996509139129",
  "role": "driver"
}
Response
{
  "data": {
    "accessToken": "jwt_access",
    "refreshToken": "jwt_refresh",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "driver",
      "name": "Аман Исаев",
      "phone": "+996509139129",
      "status": "active",
      "documentsVerified": false
    }
  }
}
8.2 POST /auth/login

Логин по email и паролю.

Access

Public

Request
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
Response
{
  "data": {
    "accessToken": "jwt_access",
    "refreshToken": "jwt_refresh",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "driver",
      "name": "Аман Исаев"
    }
  }
}
8.3 POST /auth/telegram

Вход через Telegram.

Access

Public

Request
{
  "id": "telegram_user_id",
  "first_name": "Aman",
  "last_name": "Isaev",
  "username": "aman_user",
  "photo_url": "https://...",
  "auth_date": 1710000000,
  "hash": "telegram_hash"
}
Response
{
  "data": {
    "accessToken": "jwt_access",
    "refreshToken": "jwt_refresh",
    "user": {
      "id": "uuid",
      "role": "driver"
    }
  }
}
8.4 POST /auth/refresh

Обновление access token.

Access

Public with valid refresh token

Request
{
  "refreshToken": "jwt_refresh"
}
Response
{
  "data": {
    "accessToken": "new_jwt_access",
    "refreshToken": "new_jwt_refresh"
  }
}
8.5 POST /auth/logout

Выход из системы.

Access

Authenticated

Request
{
  "refreshToken": "jwt_refresh"
}
Response
{
  "data": {
    "success": true
  }
}
8.6 GET /auth/me

Текущий пользователь.

Access

Authenticated

Response
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "driver",
    "name": "Аман Исаев",
    "phone": "+996509139129",
    "status": "active",
    "documentsVerified": false,
    "rating": 4.8,
    "reviewsCount": 24
  }
}
8.7 POST /auth/change-password

Смена пароля.

Access

Authenticated

Request
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
Response
{
  "data": {
    "success": true
  }
}
9. USERS API
9.1 GET /users/profile

Получение собственного профиля.

Access

Authenticated

Response
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "driver",
    "name": "Аман Исаев",
    "phone": "+996509139129",
    "status": "active",
    "documentsVerified": false,
    "rating": 4.8,
    "reviewsCount": 24
  }
}
9.2 PATCH /users/profile

Обновление своего профиля.

Access

Authenticated

Request
{
  "name": "Новое имя",
  "phone": "+996700000000"
}
Response
{
  "data": {
    "id": "uuid",
    "name": "Новое имя",
    "phone": "+996700000000"
  }
}
9.3 GET /users/:id/public

Публичный профиль пользователя.

Access

Public

Response
{
  "data": {
    "id": "uuid",
    "name": "Иван Петров",
    "role": "driver",
    "rating": 4.9,
    "reviewsCount": 11
  }
}
9.4 DELETE /users/profile

Мягкое удаление своего аккаунта.

Access

Authenticated

Response
{
  "data": {
    "success": true
  }
}
10. FREIGHTS API
10.1 GET /freights

Список грузов.

Access

Public

Query params
status
originCity
destinationCity
truckType
loadingDateFrom
loadingDateTo
auction
minPrice
maxPrice
limit
offset
sortBy
sortOrder
Response
{
  "data": [
    {
      "id": "uuid",
      "title": "Груз Бишкек → Ош",
      "originCity": "Бишкек",
      "destinationCity": "Ош",
      "weight": 20,
      "truckType": "tent",
      "price": 55000,
      "auction": false,
      "status": "active",
      "loadingDate": "2026-03-20T10:00:00Z",
      "vehiclesRequired": 1,
      "vehiclesAssigned": 0,
      "createdAt": "2026-03-17T12:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "limit": 20,
      "offset": 0,
      "total": 182,
      "hasNext": true
    }
  }
}
10.2 GET /freights/:id

Детали груза.

Access

Public

Response
{
  "data": {
    "id": "uuid",
    "title": "Груз Бишкек → Ош",
    "description": "Стройматериалы",
    "originCity": "Бишкек",
    "originCountry": "Кыргызстан",
    "destinationCity": "Ош",
    "destinationCountry": "Кыргызстан",
    "weight": 20,
    "volume": 82,
    "truckType": "tent",
    "price": 55000,
    "auction": false,
    "status": "active",
    "vehiclesRequired": 1,
    "vehiclesAssigned": 0,
    "loadingDate": "2026-03-20T10:00:00Z",
    "owner": {
      "id": "uuid",
      "name": "Компания А",
      "rating": 4.7
    }
  }
}
10.3 POST /freights

Создание груза.

Access

Authenticated

Roles

shipper, dispatcher, admin

Request
{
  "title": "Груз Бишкек → Ош",
  "description": "Стройматериалы",
  "originCity": "Бишкек",
  "originCountry": "Кыргызстан",
  "destinationCity": "Ош",
  "destinationCountry": "Кыргызстан",
  "weight": 20,
  "volume": 82,
  "truckType": "tent",
  "price": 55000,
  "auction": false,
  "vehiclesRequired": 1,
  "loadingDate": "2026-03-20T10:00:00Z"
}
Response
{
  "data": {
    "id": "uuid",
    "status": "draft"
  }
}
10.4 PATCH /freights/:id

Редактирование своего груза.

Access

Authenticated

Roles

shipper, dispatcher, admin

Rules

только владелец или admin

нельзя произвольно менять завершённый заказ

Request
{
  "title": "Обновлённый груз",
  "price": 60000,
  "auction": true
}
Response
{
  "data": {
    "id": "uuid",
    "title": "Обновлённый груз",
    "price": 60000,
    "auction": true
  }
}
10.5 POST /freights/:id/publish

Публикация груза.

Access

Authenticated

Roles

shipper, dispatcher, admin

Response
{
  "data": {
    "id": "uuid",
    "status": "active"
  }
}
10.6 POST /freights/:id/cancel

Отмена груза.

Access

Authenticated

Roles

shipper, dispatcher, admin

Response
{
  "data": {
    "id": "uuid",
    "status": "cancelled"
  }
}
10.7 GET /freights/my

Список своих грузов.

Access

Authenticated

Roles

shipper, dispatcher, admin

Query params
status
limit
offset
sortBy
sortOrder
10.8 DELETE /freights/:id

Мягкое удаление груза.

Access

Authenticated

Roles

shipper, dispatcher, admin

Rules

только владелец или admin

нельзя удалить груз с активным заказом

Response
{
  "data": {
    "success": true
  }
}
11. VEHICLES API
11.1 GET /vehicles

Публичный список транспорта.

Access

Public

Query params
truckType
minCapacity
maxCapacity
originCity
limit
offset
sortBy
sortOrder
11.2 GET /vehicles/:id

Детали транспорта.

Access

Public

11.3 POST /vehicles

Создание транспорта.

Access

Authenticated

Roles

driver, admin

Rules

для driver может требоваться documentsVerified = true

Request
{
  "plateNumber": "01KG123ABC",
  "trailerNumber": "TR9988",
  "truckType": "tent",
  "capacity": 20,
  "volume": 82,
  "dimensions": "13.6 x 2.45 x 2.7"
}
11.4 PATCH /vehicles/:id

Редактирование своего транспорта.

Access

Authenticated

Roles

driver, admin

Rules

только владелец или admin

11.5 GET /vehicles/my

Список своего транспорта.

Access

Authenticated

Roles

driver, admin

11.6 DELETE /vehicles/:id

Удаление транспорта.

Access

Authenticated

Roles

driver, admin

Rules

только владелец или admin

нельзя удалить транспорт, привязанный к активной перевозке

12. BIDS API
12.1 GET /freights/:freightId/bids

Список ставок по грузу.

Access

Authenticated

Roles

shipper, dispatcher, admin

Rules

только владелец груза или admin

12.2 POST /freights/:freightId/bids

Создание ставки.

Access

Authenticated

Roles

driver, admin

Rules

только на active freight

нельзя ставку на свой груз

можно ограничить одной активной ставкой на водителя

Request
{
  "price": 53000,
  "message": "Готов забрать завтра утром"
}
Response
{
  "data": {
    "id": "uuid",
    "status": "pending",
    "price": 53000
  }
}
12.3 PATCH /bids/:id

Редактирование своей ставки.

Access

Authenticated

Roles

driver, admin

Rules

только автор или admin

только если ставка ещё не accepted/rejected

12.4 POST /bids/:id/withdraw

Отзыв ставки.

Access

Authenticated

Roles

driver, admin

Response
{
  "data": {
    "id": "uuid",
    "status": "withdrawn"
  }
}
12.5 POST /bids/:id/accept

Принятие ставки.

Access

Authenticated

Roles

shipper, dispatcher, admin

Rules

только владелец груза или admin

создаётся order

обновляются статусы bid/freight

Response
{
  "data": {
    "bidId": "uuid",
    "orderId": "uuid",
    "bidStatus": "accepted"
  }
}
12.6 POST /bids/:id/reject

Отклонение ставки.

Access

Authenticated

Roles

shipper, dispatcher, admin

12.7 GET /bids/my

Список своих ставок.

Access

Authenticated

Roles

driver, admin

Query params
status
limit
offset
sortBy
sortOrder
13. ORDERS API
13.1 GET /orders/my

Список моих перевозок.

Access

Authenticated

Roles

driver, shipper, dispatcher, admin

Rules

для driver: свои как водитель

для shipper/dispatcher: свои как заказчик

admin: любые

13.2 GET /orders/:id

Детали перевозки.

Access

Authenticated

Rules

участник заказа или admin

13.3 POST /orders/:id/start

Начать перевозку.

Access

Authenticated

Roles

driver, admin

Rules

только назначенный водитель или admin

Response
{
  "data": {
    "id": "uuid",
    "status": "in_transit"
  }
}
13.4 POST /orders/:id/complete

Завершить перевозку.

Access

Authenticated

Roles

driver, shipper, dispatcher, admin

Rules

по бизнес-логике можно разделить confirm delivery и final complete

Response
{
  "data": {
    "id": "uuid",
    "status": "delivered"
  }
}
13.5 POST /orders/:id/cancel

Отмена перевозки.

Access

Authenticated

Roles

shipper, dispatcher, admin

14. CHATS API
14.1 GET /chats

Список чатов текущего пользователя.

Access

Authenticated

Response
{
  "data": [
    {
      "id": "uuid",
      "freightId": "uuid",
      "lastMessage": {
        "text": "Добрый день",
        "createdAt": "2026-03-17T13:00:00Z"
      },
      "unreadCount": 2
    }
  ]
}
14.2 POST /chats

Создание чата.

Access

Authenticated

Request
{
  "freightId": "uuid",
  "participantUserId": "uuid"
}
Rules

чат возможен только при допустимом бизнес-контексте

нельзя создать чат самому с собой

нельзя создавать хаотичные чаты вне связанного объекта

14.3 GET /chats/:id

Детали чата.

Access

Authenticated

Rules

только участник чата или admin

15. MESSAGES API
15.1 GET /chats/:chatId/messages

Сообщения чата.

Access

Authenticated

Rules

только участник чата или admin

Query params
limit
cursor
beforeMessageId
15.2 POST /chats/:chatId/messages

Отправка сообщения.

Access

Authenticated

Rules

только участник чата или admin

Request
{
  "text": "Здравствуйте, готов обсудить детали"
}
Response
{
  "data": {
    "id": "uuid",
    "chatId": "uuid",
    "senderUserId": "uuid",
    "text": "Здравствуйте, готов обсудить детали",
    "createdAt": "2026-03-17T13:00:00Z"
  }
}
15.3 POST /chats/:chatId/read

Отметить сообщения как прочитанные.

Access

Authenticated

Request
{
  "lastReadMessageId": "uuid"
}
16. NOTIFICATIONS API
16.1 GET /notifications

Список уведомлений.

Access

Authenticated

Query params
isRead
type
limit
offset
16.2 POST /notifications/:id/read

Отметить уведомление как прочитанное.

Access

Authenticated

16.3 POST /notifications/read-all

Отметить все уведомления как прочитанные.

Access

Authenticated

16.4 DELETE /notifications/:id

Удаление уведомления.

Access

Authenticated

17. FILES API
17.1 POST /files/upload

Загрузка файла.

Access

Authenticated

Request

multipart/form-data

Fields
file
entityType
entityId
category
Response
{
  "data": {
    "id": "uuid",
    "url": "https://storage/...",
    "mimeType": "image/jpeg",
    "size": 123456,
    "originalName": "passport.jpg"
  }
}
17.2 GET /files/:id

Получение метаданных файла.

Access

Authenticated

Rules

только владелец связанной сущности

или admin

или публичный доступ, если файл помечен как публичный тип

17.3 DELETE /files/:id

Удаление файла.

Access

Authenticated

18. REVIEWS API
18.1 POST /orders/:orderId/reviews

Создание отзыва по заказу.

Access

Authenticated

Roles

driver, shipper, dispatcher, admin

Rules

только участник заказа

один отзыв на заказ на сторону по заданной бизнес-модели

Request
{
  "toUserId": "uuid",
  "rating": 5,
  "comment": "Отличная работа"
}
18.2 GET /users/:userId/reviews

Список отзывов пользователя.

Access

Public

Query params
limit
offset
sortBy
sortOrder
19. VERIFICATION API
19.1 GET /verification/my-documents

Список своих документов.

Access

Authenticated

19.2 POST /verification/documents

Загрузка документа на проверку.

Access

Authenticated

Request

multipart/form-data

Fields
file
type
Allowed type values
passport
driver_license
company_registration
vehicle_documents
19.3 DELETE /verification/documents/:id

Удаление своего документа до решения модерации.

Access

Authenticated

20. ADMIN API

Все /admin/* endpoint'ы доступны только роли:

admin
20.1 GET /admin/users

Список пользователей.

Query params
role
status
search
limit
offset
sortBy
sortOrder
20.2 GET /admin/users/:id

Детали пользователя.

20.3 PATCH /admin/users/:id

Редактирование пользователя администратором.

Request
{
  "role": "driver",
  "status": "blocked",
  "documentsVerified": false
}
20.4 POST /admin/users/:id/block

Блокировка пользователя.

20.5 POST /admin/users/:id/unblock

Разблокировка пользователя.

20.6 GET /admin/freights

Список всех грузов.

Query params
status
ownerUserId
search
limit
offset
sortBy
sortOrder
20.7 GET /admin/freights/:id

Детали груза.

20.8 POST /admin/freights/:id/hide

Скрытие груза.

20.9 POST /admin/freights/:id/restore

Восстановление груза.

20.10 GET /admin/vehicles

Список транспорта.

20.11 GET /admin/bids

Список ставок.

20.12 GET /admin/orders

Список заказов.

20.13 GET /admin/verification/documents

Список документов на проверку.

Query params
status
type
userId
limit
offset
20.14 POST /admin/verification/documents/:id/approve

Подтверждение документа.

Response
{
  "data": {
    "id": "uuid",
    "status": "approved"
  }
}
20.15 POST /admin/verification/documents/:id/reject

Отклонение документа.

Request
{
  "reason": "Документ нечитаем"
}
20.16 GET /admin/reviews

Список отзывов.

20.17 GET /admin/notifications/system

Системные уведомления и шаблоны.

20.18 GET /admin/audit-logs

Журнал действий.

Query params
actorUserId
action
entityType
entityId
dateFrom
dateTo
limit
offset
20.19 GET /admin/settings

Системные настройки.

20.20 PATCH /admin/settings

Изменение системных настроек.

Request
{
  "maintenanceMode": false,
  "driverVerificationRequired": true,
  "bidEditWindowMinutes": 15
}
20.21 GET /admin/banners

Список баннеров.

20.22 POST /admin/banners

Создание баннера.

Request
{
  "title": "Весенняя акция",
  "imageFileId": "uuid",
  "link": "https://logist.kg/promo",
  "isActive": true,
  "sortOrder": 1
}
20.23 PATCH /admin/banners/:id

Редактирование баннера.

20.24 DELETE /admin/banners/:id

Удаление баннера.

20.25 GET /admin/ads

Список рекламы.

20.26 POST /admin/ads

Создание рекламы.

20.27 PATCH /admin/ads/:id

Редактирование рекламы.

20.28 DELETE /admin/ads/:id

Удаление рекламы.

21. SYSTEM API
21.1 GET /system/public-settings

Публичные настройки платформы.

Access

Public

Response
{
  "data": {
    "maintenanceMode": false,
    "supportEmail": "admin@logist.kg",
    "supportPhone": "+996509139129"
  }
}
21.2 GET /system/banners

Активные баннеры.

Access

Public

21.3 GET /system/ads

Активная реклама.

Access

Public

22. HEALTH API
22.1 GET /health

Проверка работоспособности сервиса.

Access

Public

Response
{
  "data": {
    "status": "ok"
  }
}
23. Правила пагинации

Все endpoint'ы списков обязаны поддерживать хотя бы один из вариантов:

Offset pagination
limit
offset
Cursor pagination
limit
cursor

Для admin-таблиц по умолчанию допустим limit + offset.

Для чатов и сообщений предпочтительнее cursor-based пагинация.

24. Правила фильтрации

Фильтры должны быть:

явными

документированными

типизированными

безопасными

Backend не должен принимать неограниченные динамические фильтры без DTO.

25. Правила сортировки

Общий формат:

sortBy
sortOrder=asc|desc

Разрешённые поля сортировки должны быть ограничены DTO.

26. Правила доступа
Public

Доступно без токена.

Authenticated

Нужен валидный access token.

Role-protected

Нужен access token + допустимая роль.

Ownership-protected

Нужен access token + допустимая роль + владение сущностью.

Admin-only

Только admin.

27. Правила статусов HTTP
Успешные
200 OK
201 Created
204 No Content
Ошибки клиента
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
Ошибки сервера
500 Internal Server Error
28. Правила безопасности API

Backend обязан:

валидировать все входящие DTO

проверять роль

проверять ownership

не возвращать скрытые внутренние поля

ограничивать rate limit на auth и spam-sensitive endpoint'ах

логировать критичные admin и auth операции

защищать file upload endpoints

29. Что нельзя возвращать в API

Backend не должен возвращать:

passwordHash

внутренние refresh token значения

закрытые moderation notes без права доступа

внутренние admin-only поля в public endpoints

лишние ORM поля без сериализации

30. Сериализация ответов

Каждый модуль должен контролировать response model.

Нельзя просто отдавать наружу сырой ORM-объект без фильтрации и нормализации.

31. Правила для AI при добавлении новых endpoint'ов

AI обязан проверить:

нет ли уже похожего endpoint'а

соответствует ли путь общей логике REST

есть ли DTO для body/query/params

есть ли правильный guard

есть ли ownership check

есть ли пагинация для списка

документирован ли новый endpoint в этом файле

не дублирует ли endpoint существующий use case

32. Финальный принцип

API Logist.kg должно быть:

стабильным

предсказуемым

безопасным

удобным для frontend

удобным для AI-генерации кода

масштабируемым

Если endpoint:

дублирует уже существующий

нарушает role model

обходит ownership checks

возвращает сырые внутренние данные

не документирован

он считается плохим и не должен использоваться как стандарт.
