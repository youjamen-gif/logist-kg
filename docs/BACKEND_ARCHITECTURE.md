BACKEND_ARCHITECTURE.md — Logist.kg

Документ описывает архитектуру backend платформы Logist.kg.

Он определяет:

структуру серверного приложения

правила модулей NestJS

слой бизнес-логики

работу с базой данных

безопасность

взаимодействие с frontend

масштабируемость системы

Этот документ является обязательным стандартом для AI и разработчиков.

1. Основной принцип backend

Backend — единственный источник бизнес-логики платформы.

Frontend не должен:

принимать критические решения

проверять права доступа

рассчитывать бизнес-состояния

выполнять операции с данными напрямую

Все важные операции должны выполняться на backend.

2. Технологический стек backend

Основные технологии сервера:

Технология	Назначение
NestJS	основной backend framework
TypeScript	строгая типизация
PostgreSQL	основная база данных
Prisma	ORM
Redis	кеш / очереди / rate limiting
JWT	авторизация
Socket.IO	realtime
S3 / MinIO	файловое хранилище

Backend должен быть полностью независим от Firebase.

3. Архитектурный стиль

Backend построен на:

Modular Monolith

Это означает:

код разбит на доменные модули

каждый модуль автономен

модули взаимодействуют через сервисы

нет жёстких циклических зависимостей

Это позволяет:

сохранить простоту

обеспечить масштабируемость

легко выделять микросервисы в будущем при необходимости

4. Основные уровни backend

Backend разделён на несколько уровней.

Controller Layer
↓
Service Layer
↓
Data Access Layer (Prisma)
↓
Database (PostgreSQL)
5. Controller Layer

Controllers отвечают только за:

обработку HTTP запросов

проверку DTO

вызов сервисов

возврат ответа

Контроллер не должен содержать бизнес-логику.

Пример:

@Controller('freights')
export class FreightsController {

  constructor(private freightsService: FreightsService) {}

  @Get()
  findAll(@Query() dto: FilterFreightsDto) {
    return this.freightsService.findAll(dto)
  }

}
6. Service Layer

Services содержат:

бизнес-логику

правила доступа

операции с сущностями

orchestration нескольких операций

Service — сердце backend.

Пример:

async createFreight(userId: string, dto: CreateFreightDto) {

  const freight = await this.prisma.freight.create({
    data: {
      ...dto,
      ownerId: userId
    }
  })

  await this.notificationsService.notifyNewFreight(freight)

  return freight
}
7. Data Access Layer

В Logist.kg используется Prisma.

Прямые SQL запросы допустимы только если:

Prisma не покрывает кейс

критична производительность

требуется сложная аналитика

AI не должен хаотично писать SQL.

8. Основные доменные модули

Backend делится на следующие ключевые модули.

auth
users
freights
vehicles
bids
orders
notifications
chat
verification
admin
files
audit
payments
9. Auth Module

Отвечает за:

регистрацию

логин

refresh токены

logout

Telegram auth (опционально)

password auth

Основные механизмы:

JWT Access Token
JWT Refresh Token
Token rotation
Guards
10. Users Module

Отвечает за:

профиль пользователя

рейтинг

отзывы

настройки аккаунта

статусы пользователя

Роли пользователя:

guest
driver
shipper
dispatcher
admin
11. Freights Module

Главный модуль платформы.

Отвечает за:

создание груза

поиск грузов

фильтрацию

изменение статусов

Статусы груза:

draft
active
in_progress
completed
cancelled
12. Vehicles Module

Отвечает за:

регистрацию транспорта

редактирование транспорта

связь с водителем

фильтрацию транспорта

13. Bids Module

Отвечает за:

предложения водителей

торги

ставки

Каждая ставка содержит:

price
message
driverId
freightId
status
14. Orders Module

Отвечает за:

подтверждённые перевозки

связь груз ↔ водитель

выполнение заказа

15. Notifications Module

Система уведомлений.

Поддерживает:

in-app
email
telegram
push

Типы уведомлений:

new_bid
bid_accepted
freight_status_changed
new_message
system_alert
16. Chat Module

Отвечает за:

чат между водителем и грузовладельцем

realtime сообщения

историю переписки

Использует:

Socket.IO
17. Verification Module

Отвечает за:

проверку документов водителей

модерацию компаний

подтверждение аккаунтов

18. Admin Module

Административная панель.

Отвечает за:

управление пользователями

модерацию грузов

проверку документов

управление баннерами

системные настройки

19. Files Module

Отвечает за:

загрузку файлов

хранение файлов

выдачу URL

Поддерживает:

S3
MinIO
20. Audit Module

Отвечает за:

журнал действий системы

Примеры:

user_blocked
freight_deleted
document_verified
settings_changed
21. Payments Module (будущее)

Отвечает за:

платные функции

подписки

комиссии

22. DTO стандарт

Каждый endpoint должен использовать DTO.

Типы DTO:

CreateDto
UpdateDto
FilterDto
ResponseDto

Пример:

create-freight.dto.ts
update-freight.dto.ts
filter-freight.dto.ts
freight-response.dto.ts

DTO должны использовать:

class-validator
class-transformer
23. Guards

Backend должен использовать guards для:

JWT authentication
roles
ownership
admin access
24. Ownership проверки

Backend обязан проверять владельца сущности.

Пример:

driver может редактировать только свой транспорт
shipper может редактировать только свои грузы

Frontend не является источником истины.

25. Pagination

Все списки должны поддерживать:

limit
cursor
offset
sorting
filters

AI не должен возвращать неограниченные списки.

26. Индексы БД

Все часто используемые фильтры должны иметь индекс.

Например:

freight.status
freight.origin
freight.destination
freight.createdAt
vehicle.truckType
bid.freightId
27. Realtime

Realtime используется только для:

чат
live уведомления
торги

Не для обычных CRUD операций.

28. Rate limiting

Backend должен защищаться от:

spam
bruteforce
DDoS
29. Error handling

Backend должен использовать централизованную обработку ошибок.

Ошибки должны быть:

предсказуемыми
структурированными
без утечки внутренних данных
30. Ответы API

Ответы должны иметь единый формат.

Пример:

{
  data: ...
}

или

{
  data: ...,
  meta: {
    pagination
  }
}
31. Безопасность

Backend обязан:

hash passwords
validate input
sanitize data
protect endpoints
hide internal data
32. Логирование

Backend должен логировать:

auth events
admin actions
system errors
critical state changes
33. Масштабируемость

Backend должен быть готов к:

10k+ пользователей
100k+ грузов
1000+ realtime соединений
34. Чеклист перед созданием endpoint

AI должен проверить:

существует ли уже похожий endpoint

есть ли DTO

есть ли guard

есть ли ownership check

есть ли pagination

не возвращает ли endpoint лишние поля

35. Главный принцип backend

Backend должен быть:

безопасным
предсказуемым
масштабируемым
простым для поддержки

Если решение:

усложняет архитектуру

нарушает границы модулей

переносит логику во frontend

оно считается неправильным.
