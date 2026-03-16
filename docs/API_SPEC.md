# API_SPEC.md — Logist.kg

Этот документ описывает общую структуру API платформы Logist.kg.

Он предназначен для:

- frontend разработчиков
- backend разработчиков
- AI разработчиков

Документ даёт обзор всех API доменов и принципов построения API.

Полная спецификация endpoint'ов находится в:

docs/API_SPEC_BACKEND.md

---

# 1. Базовый URL API

Все API endpoint'ы находятся под префиксом:


/api/v1


Пример:


/api/v1/auth/login
/api/v1/freights
/api/v1/vehicles


---

# 2. Основные домены API

API разделено на доменные группы.


auth
users
freights
vehicles
bids
orders
chats
messages
notifications
files
reviews
verification
admin
system
health


---

# 3. Общая структура endpoint

API следует REST принципам.

Пример:


GET /freights
GET /freights/:id
POST /freights
PATCH /freights/:id
DELETE /freights/:id


---

# 4. Формат ответа API

## Успешный ответ


{
"data": {}
}


---

## Список


{
"data": [],
"meta": {
"pagination": {}
}
}


---

## Ошибка


{
"error": {
"code": "ERROR_CODE",
"message": "Error description"
}
}


---

# 5. Авторизация

Авторизация осуществляется через JWT.

Запрос должен содержать заголовок:


Authorization: Bearer <access_token>


---

# 6. Роли пользователей

Платформа использует следующие роли:


guest
driver
shipper
dispatcher
admin


Каждый endpoint имеет свои ограничения доступа.

---

# 7. Pagination

Все списковые endpoint'ы должны поддерживать pagination.


limit
offset


Пример:


GET /freights?limit=20&offset=0


---

# 8. Сортировка

Сортировка передаётся параметрами:


sortBy
sortOrder


Пример:


GET /freights?sortBy=createdAt&sortOrder=desc


---

# 9. Фильтрация

Фильтры передаются query параметрами.

Пример:


GET /freights?originCity=Bishkek
GET /freights?truckType=tent
GET /freights?auction=true


---

# 10. Основные группы API

## AUTH


POST /auth/register
POST /auth/login
POST /auth/telegram
POST /auth/refresh
POST /auth/logout
GET /auth/me


---

## USERS


GET /users/profile
PATCH /users/profile
GET /users/:id/public
DELETE /users/profile


---

## FREIGHTS


GET /freights
GET /freights/:id
POST /freights
PATCH /freights/:id
DELETE /freights/:id
POST /freights/:id/publish
POST /freights/:id/cancel
GET /freights/my


---

## VEHICLES


GET /vehicles
GET /vehicles/:id
POST /vehicles
PATCH /vehicles/:id
DELETE /vehicles/:id
GET /vehicles/my


---

## BIDS


GET /freights/:freightId/bids
POST /freights/:freightId/bids
PATCH /bids/:id
POST /bids/:id/withdraw
POST /bids/:id/accept
POST /bids/:id/reject
GET /bids/my


---

## ORDERS


GET /orders/my
GET /orders/:id
POST /orders/:id/start
POST /orders/:id/complete
POST /orders/:id/cancel


---

## CHATS


GET /chats
POST /chats
GET /chats/:id


---

## MESSAGES


GET /chats/:chatId/messages
POST /chats/:chatId/messages
POST /chats/:chatId/read


---

## NOTIFICATIONS


GET /notifications
POST /notifications/:id/read
POST /notifications/read-all
DELETE /notifications/:id


---

## FILES


POST /files/upload
GET /files/:id
DELETE /files/:id


---

## REVIEWS


POST /orders/:orderId/reviews
GET /users/:userId/reviews


---

## VERIFICATION


GET /verification/my-documents
POST /verification/documents
DELETE /verification/documents/:id


---

## ADMIN


GET /admin/users
GET /admin/users/:id
PATCH /admin/users/:id
POST /admin/users/:id/block
POST /admin/users/:id/unblock

GET /admin/freights
GET /admin/freights/:id

GET /admin/verification/documents
POST /admin/verification/documents/:id/approve
POST /admin/verification/documents/:id/reject

GET /admin/audit-logs

GET /admin/settings
PATCH /admin/settings


---

## SYSTEM


GET /system/public-settings
GET /system/banners
GET /system/ads


---

## HEALTH


GET /health


---

# 11. HTTP статусы

Успешные ответы:


200 OK
201 Created
204 No Content


Ошибки клиента:


400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests


Ошибки сервера:


500 Internal Server Error


---

# 12. Основные принципы API

API Logist.kg должно быть:


предсказуемым
RESTful
типизированным
безопасным
масштабируемым


API не должно:


возвращать внутренние данные
нарушать ownership
обходить role проверки
ломать структуру endpoint'ов


---

# 13. Связанные документы

Подробная спецификация endpoint'ов:


docs/API_SPEC_BACKEND.md


Архитектура backend:


docs/BACKEND_ARCHITECTURE.md


Безопасность:


docs/SECURITY_RULES.md


---

# 14. Главный принцип

API является контрактом между frontend и backend.

Если endpoint:

- не описан в документации
- нарушает архитектуру
- обходит безопасность

он считается неправильным и не должен использоваться.
