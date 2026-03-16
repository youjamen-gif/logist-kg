# AI_DEVELOPMENT_PROMPT.md — Logist.kg

Этот документ является основной инструкцией для AI, который участвует в разработке платформы Logist.kg.

AI должен использовать этот документ перед генерацией любого кода.

Документ описывает:

- архитектуру платформы
- правила разработки
- правила API
- правила безопасности
- правила структуры проекта

AI обязан соблюдать эти правила.

---

# 1. Контекст проекта

Logist.kg — это логистическая платформа для поиска грузов и транспорта.

Платформа соединяет:

```text
drivers
shippers
dispatchers
admins

Основная функция платформы:

грузовладельцы публикуют грузы
водители находят грузы
водители делают ставки
грузовладелец выбирает перевозчика
создаётся перевозка
2. Технологический стек

Frontend:

Next.js
TypeScript
Tailwind CSS

Backend:

NestJS
TypeScript
Prisma ORM
PostgreSQL
Redis
Socket.IO

Storage:

S3 / MinIO
3. Архитектура системы

Архитектура проекта:

Client
↓
Frontend (Next.js)
↓
REST API
↓
Backend (NestJS)
↓
PostgreSQL / Redis / Storage

Frontend отвечает только за UI.

Backend отвечает за:

бизнес логику

безопасность

доступ к данным

4. Основные модули backend

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

Каждый модуль содержит:

controller
service
dto
guards
serializers

AI не должен смешивать модули.

5. Структура backend модуля

Каждый backend модуль должен иметь структуру:

module
├── module.controller.ts
├── module.service.ts
├── module.module.ts
├── dto
├── serializers
6. API правила

Все API находятся под:

/api/v1

API должен быть:

REST
predictable
versioned
secure
7. Формат ответа API

Успешный ответ:

{
  "data": {}
}

Список:

{
  "data": [],
  "meta": {
    "pagination": {}
  }
}

Ошибка:

{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
8. Авторизация

Платформа использует:

JWT access token
JWT refresh token

Защищённые endpoints требуют:

Authorization: Bearer <token>
9. Роли пользователей
guest
driver
shipper
dispatcher
admin

AI обязан учитывать роли при создании API.

10. Ownership правила

Backend обязан проверять владельца ресурса.

Примеры:

driver может редактировать только свой vehicle
shipper может редактировать только свой freight
11. Pagination правила

Все списки должны поддерживать:

limit
offset

AI не должен возвращать большие списки без pagination.

12. DTO правила

Каждый endpoint должен иметь DTO:

Create DTO
Update DTO
Query DTO

DTO используются для:

validation
transformation
type safety
13. Безопасность

Backend обязан:

валидировать входящие данные
проверять роли
проверять ownership
ограничивать rate limit
14. Работа с файлами

Файлы загружаются через:

/files/upload

Файлы хранятся в:

S3 / MinIO

База хранит только metadata.

15. Admin правила

Admin endpoints находятся в:

/admin/*

Admin функции должны:

логироваться
иметь confirm
проверять роль admin
16. Audit logging

Следующие действия должны записываться:

login
admin actions
user blocking
document verification
settings change
17. Frontend правила

Frontend отвечает за:

UI
forms
API calls
routing

Frontend не должен:

содержать бизнес-логику
проверять безопасность
18. Правила генерации кода AI

Перед генерацией кода AI обязан:

проверить архитектуру

проверить API_SPEC

проверить DATABASE_SCHEMA

определить модуль

определить DTO

19. AI не должен

AI не должен:

ломать архитектуру
создавать случайные endpoints
игнорировать DTO
игнорировать безопасность
дублировать код
20. Правила изменения базы данных

Если изменяется база данных:

AI обязан:

обновить DATABASE_SCHEMA.md
обновить DATABASE_SCHEMA_SQL.md
создать Prisma migration
21. Правила добавления новых функций

Перед добавлением функции AI должен:

проверить существующие endpoints
проверить документацию
убедиться что функция не дублируется
22. Правила масштабируемости

Каждое решение должно учитывать рост платформы:

100k пользователей
100k грузов
1000+ realtime соединений
23. Правила читаемости кода

Код должен быть:

понятным
модульным
предсказуемым
24. Главный принцип

AI должен писать код так, как если бы он был частью большой production системы.

Если решение:

ломает архитектуру
игнорирует безопасность
обходит backend

оно считается неправильным.
