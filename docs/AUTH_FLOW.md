Этот документ фиксирует полный жизненный цикл авторизации и доступа на платформе Logist.kg.

Он определяет:

регистрацию

login

JWT архитектуру

refresh tokens

роли

guards

доступ к API

безопасность

Это один из самых критичных документов — на него должны опираться:

backend (NestJS auth module)

frontend auth provider

guards

middleware

admin access

API security

Ниже финальная версия для полной замены docs/AUTH_FLOW.md.

AUTH_FLOW.md — Logist.kg

Документ описывает архитектуру авторизации и доступа платформы Logist.kg.

Он определяет:

регистрацию пользователей

процесс входа

JWT архитектуру

refresh token стратегию

роли пользователей

доступ к API

правила безопасности

Этот документ является источником истины для всей системы авторизации.

1. Основной принцип авторизации

Авторизация в Logist.kg должна быть:

безопасной

предсказуемой

масштабируемой

независимой от frontend

Все проверки доступа выполняются на backend.

Frontend отвечает только за:

хранение токена

отправку токена

UI состояния пользователя

2. Методы регистрации

Платформа поддерживает несколько методов регистрации.

Email + Password
Telegram Login

В будущем могут добавиться:

Google OAuth
Apple OAuth

Но базовая система должна работать без сторонних auth-провайдеров.

3. Основной поток регистрации
Шаг 1

Пользователь отправляет:

POST /auth/register
{
  "email": "user@example.com",
  "password": "password",
  "name": "John Doe",
  "phone": "+996..."
}
Шаг 2

Backend выполняет:

проверку email

проверку пароля

хэширование пароля

создание пользователя

Шаг 3

Создаётся запись в таблице:

users
Шаг 4

Backend возвращает:

{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
4. Login flow

Login происходит через:

POST /auth/login

Тело запроса:

{
  "email": "user@example.com",
  "password": "password"
}

Backend выполняет:

поиск пользователя

проверку пароля

проверку статуса аккаунта

Если всё успешно — генерируются токены.

5. JWT архитектура

Система использует два токена:

Access Token
Refresh Token
6. Access Token

Access token:

короткоживущий

используется для API

хранит данные пользователя

Пример payload:

{
  "sub": "user_id",
  "role": "driver",
  "iat": 123456,
  "exp": 123456
}
7. Время жизни токенов
Access Token: 15 минут
Refresh Token: 30 дней
8. Refresh Token

Refresh token используется для получения нового access token.

Endpoint:

POST /auth/refresh

Тело запроса:

{
  "refreshToken": "..."
}

Backend:

проверяет токен

проверяет сессию

выдаёт новый access token

9. Logout

Logout выполняется через:

POST /auth/logout

Backend:

инвалидирует refresh token

удаляет сессию

10. Где хранится refresh token

Refresh tokens хранятся:

httpOnly cookie

или

secure storage

Access token хранится:

memory / client storage
11. Middleware / Guards

Backend использует guards для защиты API.

Основные guards:

JwtAuthGuard
RolesGuard
OwnershipGuard
AdminGuard
12. JwtAuthGuard

Проверяет:

наличие токена

подпись

срок действия

13. RolesGuard

Проверяет:

role пользователя

Пример:

@Roles('admin')
14. OwnershipGuard

Проверяет владельца ресурса.

Например:

driver может редактировать только свой vehicle
shipper может редактировать только свой freight
15. Роли пользователей
guest
driver
shipper
dispatcher
admin
16. Права ролей
guest

Может:

просматривать грузы

просматривать сайт

Не может:

создавать грузы

делать ставки

писать сообщения

driver

Может:

добавлять транспорт

делать ставки

участвовать в перевозках

shipper

Может:

создавать грузы

принимать ставки

создавать перевозки

dispatcher

Может:

управлять перевозками компании

работать с грузами

admin

Может:

управлять пользователями

модерировать документы

управлять платформой

17. Проверка статуса пользователя

Перед выдачей токена backend проверяет:

user.status

Если статус:

blocked
deleted

вход запрещён.

18. Проверка верификации

Некоторые действия требуют:

documents_verified = true

Например:

добавление транспорта
участие в перевозках
19. Admin доступ

Admin endpoints:

/admin/*

Доступ имеют только:

role = admin
20. Frontend auth provider

Frontend использует:

AuthProvider

Он хранит:

user
accessToken
isAuthenticated
role
21. Получение текущего пользователя

Endpoint:

GET /auth/me

Ответ:

{
  "id": "...",
  "email": "...",
  "role": "...",
  "name": "...",
  "phone": "...",
  "documentsVerified": true
}
22. Защита API

Все защищённые endpoints требуют:

Authorization: Bearer <access_token>
23. Rate limiting

Auth endpoints должны иметь защиту от:

bruteforce
spam
24. Password hashing

Пароли хранятся только в виде:

bcrypt hash

Пароли никогда не возвращаются API.

25. Безопасность

Backend обязан:

validate input
sanitize data
check permissions
hide internal fields
26. Telegram login

Telegram login использует:

Telegram Login Widget

Backend проверяет:

подпись Telegram

timestamp

27. Привязка Telegram

Если пользователь уже существует:

telegram_id добавляется к user
28. Сессии

Сессия пользователя может храниться:

redis

Это позволяет:

отзывать refresh tokens

отслеживать активные устройства

29. Audit logging

Auth события должны логироваться:

login
logout
password_change
admin_login
failed_login
30. Ошибки авторизации

Backend должен возвращать:

401 Unauthorized
403 Forbidden
31. Access restrictions

Backend не должен доверять frontend.

Каждый endpoint должен проверять:

token
role
ownership
status
32. Удаление пользователя

Удаление выполняется через:

soft delete
deleted_at
33. Масштабируемость auth

Auth система должна выдерживать:

100k+ пользователей
34. Главный принцип

Auth система должна быть:

безопасной
масштабируемой
простой

Если решение:

переносит auth на frontend

отключает проверки

упрощает безопасность

оно считается неправильным.
