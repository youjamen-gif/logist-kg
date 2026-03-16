# ADMIN_PANEL_STRUCTURE.md — Logist.kg

Документ описывает целевую структуру административной панели платформы Logist.kg.

Это обязательный стандарт для AI и разработчиков, которые создают admin frontend, admin backend и логику модерации.

Документ фиксирует:

- структуру разделов админки
- маршруты admin-панели
- состав страниц
- действия администратора
- правила таблиц, фильтров и карточек
- правила безопасности
- правила аудита

---

# 1. Главный принцип admin-панели

Admin-панель Logist.kg — это отдельный управленческий слой платформы.

Она не должна быть набором случайных страниц.
Она должна быть:

- единой по структуре
- безопасной
- предсказуемой
- быстрой для навигации
- удобной для модерации
- пригодной для масштабирования

Admin-панель предназначена только для роли:

```text
admin

Все проверки доступа должны выполняться на backend.

2. Основные цели admin-панели

Admin-панель должна позволять:

управлять пользователями

модерировать грузы

модерировать транспорт

проверять документы

просматривать ставки и заказы

управлять баннерами и рекламой

просматривать audit logs

менять системные настройки

реагировать на жалобы и инциденты

контролировать жизненно важные части платформы

3. Базовая структура admin routes

Целевая структура frontend admin routes:

/admin
/admin/users
/admin/users/[id]

/admin/freights
/admin/freights/[id]

/admin/vehicles
/admin/vehicles/[id]

/admin/bids
/admin/bids/[id]

/admin/orders
/admin/orders/[id]

/admin/verification
/admin/verification/[id]

/admin/reviews
/admin/reviews/[id]

/admin/reports
/admin/reports/[id]

/admin/audit-logs
/admin/audit-logs/[id]

/admin/banners
/admin/banners/new
/admin/banners/[id]

/admin/ads
/admin/ads/new
/admin/ads/[id]

/admin/settings

AI не должен выносить admin-страницы в другие зоны приложения.

4. Общий layout admin-панели

Все admin pages обязаны использовать единый admin layout.

Состав layout:

admin sidebar

top bar

page header

breadcrumbs

filters area

content area

table/detail area

action bar

confirm modal system

toast/alert system

Sidebar разделы:
Dashboard
Users
Freights
Vehicles
Bids
Orders
Verification
Reviews
Reports
Audit Logs
Banners
Ads
Settings

AI не должен собирать каждую страницу с нуля отдельно.
Нужна единая библиотека admin-компонентов.

5. Общие UI-принципы admin-панели

Все admin pages должны использовать единый стиль:

одинаковые таблицы

одинаковые фильтры

одинаковые статусы

одинаковые action buttons

одинаковые confirm dialogs

одинаковые loading / empty / error states

одинаковые page headers

6. Базовые admin UI-компоненты

Admin UI должен использовать общий набор компонентов:

AdminLayout
AdminSidebar
AdminTopbar
AdminPageHeader
AdminStatCard
AdminTable
AdminFilters
AdminSearchInput
AdminStatusBadge
AdminActionMenu
AdminConfirmDialog
AdminDetailsSection
AdminEmptyState
AdminPagination
AdminDateRangeFilter
AdminEntityHeader
AdminEntityMeta
AdminDangerZone

AI не должен дублировать одинаковую разметку между страницами.

7. Главная страница /admin
Назначение

Обзор состояния платформы.

Блоки:

общее число пользователей

активные грузы

активные заказы

новые ставки

документы на проверке

unread reports / unresolved reports

последние audit events

последние регистрации

последние системные события

Виджеты:
KPI cards
Recent activity table
Moderation queue preview
System alerts block
Действия:

перейти к пользователям

перейти к проверке документов

перейти к жалобам

перейти к audit logs

Главная страница должна показывать только полезную операционную информацию.

8. Раздел USERS
Route
/admin/users
/admin/users/[id]
Задачи раздела

просмотр пользователей

поиск пользователей

фильтрация по роли и статусу

блокировка / разблокировка

просмотр верификации

просмотр связанной активности

Таблица /admin/users

Колонки:

ID
Name
Email
Phone
Role
Status
Documents Verified
Rating
Reviews Count
Created At
Actions
Фильтры:
search
role
status
documentsVerified
dateFrom
dateTo
Действия из таблицы:
View
Edit
Block
Unblock
Open verification
Open orders
Open freights
Детальная страница /admin/users/[id]
Блоки:

основные данные пользователя

роль и статус

телефоны и контакты

признаки верификации

список документов

список грузов пользователя

список транспорта

список ставок

список заказов

отзывы

история admin-действий по пользователю

связанные audit logs

Возможные admin actions:
Change role
Block user
Unblock user
Mark documents verified
Open related documents
View audit logs
Danger zone:

блокировка

смена статуса

ограничение доступа

AI не должен позволять destructive action без подтверждения.

9. Раздел FREIGHTS
Route
/admin/freights
/admin/freights/[id]
Задачи раздела

просмотр всех грузов

модерация проблемных грузов

скрытие / восстановление

просмотр владельца и ставок

контроль статусов

Таблица /admin/freights

Колонки:

ID
Title
Owner
Origin
Destination
Truck Type
Price
Auction
Status
Vehicles Required
Vehicles Assigned
Loading Date
Created At
Actions
Фильтры:
search
status
ownerUserId
originCity
destinationCity
truckType
auction
dateFrom
dateTo
Actions:
View
Hide
Restore
Open owner
Open bids
Open orders
Детальная страница /admin/freights/[id]
Блоки:

основная информация о грузе

маршрут

параметры груза

цена / торг

владелец груза

текущий статус

список ставок

связанные заказы

связанные сообщения / чат при необходимости

audit history

Admin actions:
Hide freight
Restore freight
Force cancel freight
Open shipper profile
Review related bids
10. Раздел VEHICLES
Route
/admin/vehicles
/admin/vehicles/[id]
Задачи раздела

просмотр транспорта

проверка корректности данных

поиск проблемных карточек транспорта

просмотр привязки к водителю и заказам

Таблица

Колонки:

ID
Driver
Plate Number
Trailer Number
Truck Type
Capacity
Volume
Active
Created At
Actions
Фильтры:
search
truckType
driverUserId
isActive
dateFrom
dateTo
Actions:
View
Open driver
Deactivate
Reactivate
Детальная страница
Блоки:

данные транспорта

владелец

связанные документы

связанные заказы

история изменений

audit logs

Actions:
Deactivate vehicle
Reactivate vehicle
Open driver
Open related verification
11. Раздел BIDS
Route
/admin/bids
/admin/bids/[id]
Назначение

Мониторинг ставок и торговой активности.

Таблица

Колонки:

ID
Freight
Driver
Price
Status
Created At
Updated At
Actions
Фильтры:
status
freightId
driverUserId
dateFrom
dateTo
Actions:
View
Open freight
Open driver
Детальная страница
Блоки:

данные ставки

груз

водитель

история статусов

связанный заказ

audit logs

Actions:
Open freight
Open driver
Open order

Admin обычно не должен вручную принимать/отклонять ставки без отдельной бизнес-причины.

12. Раздел ORDERS
Route
/admin/orders
/admin/orders/[id]
Назначение

Контроль подтверждённых перевозок.

Таблица

Колонки:

ID
Freight
Driver
Shipper
Price
Status
Started At
Completed At
Created At
Actions
Фильтры:
status
driverUserId
shipperUserId
dateFrom
dateTo
Actions:
View
Open freight
Open driver
Open shipper
Детальная страница
Блоки:

данные перевозки

связанный груз

водитель

грузовладелец

цена

статусы и timeline

отзывы

audit logs

Actions:
Force cancel order
Open related entities
Review dispute context
13. Раздел VERIFICATION
Route
/admin/verification
/admin/verification/[id]
Назначение

Проверка документов пользователей.

Это один из самых важных модерационных разделов.

Таблица

Колонки:

ID
User
Document Type
Status
Uploaded At
Verified At
Verified By
Actions
Фильтры:
status
type
userId
dateFrom
dateTo
Actions:
View
Approve
Reject
Open user
Детальная страница /admin/verification/[id]
Блоки:

пользователь

тип документа

превью / ссылка на файл

статус проверки

дата загрузки

история решений

предыдущие документы пользователя

audit logs

Основные actions:
Approve document
Reject document
Open user profile
Open all user documents
Обязательные правила:

reject требует reason

approve/reject требует confirm

действие должно логироваться в audit

после решения обновляются связанные признаки верификации пользователя

AI не должен делать мгновенный approve/reject без логирования причины и автора действия.

14. Раздел REVIEWS
Route
/admin/reviews
/admin/reviews/[id]
Назначение

Контроль отзывов и спорных случаев.

Таблица

Колонки:

ID
From User
To User
Order
Rating
Created At
Actions
Фильтры:
rating
fromUserId
toUserId
dateFrom
dateTo
Actions:
View
Open order
Open users
Hide review
Restore review
Детальная страница
Блоки:

текст отзыва

отправитель

получатель

заказ

дата создания

история модерации

audit logs

15. Раздел REPORTS
Route
/admin/reports
/admin/reports/[id]
Назначение

Работа с жалобами, спорами и проблемными кейсами.

Если полноценный reports-модуль ещё не реализован, документ всё равно фиксирует целевую структуру.

Таблица

Колонки:

ID
Type
Reporter
Target Entity Type
Target Entity ID
Status
Priority
Created At
Assigned To
Actions
Фильтры:
status
type
priority
assignedTo
dateFrom
dateTo
Actions:
View
Assign
Mark in review
Resolve
Reject
Open target entity
Open reporter
Детальная страница
Блоки:

содержание жалобы

заявитель

объект жалобы

вложения

статус обработки

внутренние admin notes

связанные объекты

audit trail

Actions:
Assign report
Change status
Resolve report
Reject report
Open related entities
16. Раздел AUDIT LOGS
Route
/admin/audit-logs
/admin/audit-logs/[id]
Назначение

Полный журнал критичных действий в системе.

Таблица

Колонки:

ID
Actor
Action
Entity Type
Entity ID
IP
Created At
Actions
Фильтры:
actorUserId
action
entityType
entityId
dateFrom
dateTo
Actions:
View
Open actor
Open related entity
Детальная страница
Блоки:

actor

action

entity type

entity id

metadata

ip

user agent

timestamp

links to related objects

Audit log должен быть read-only.

AI не должен добавлять ручное редактирование audit logs.

17. Раздел BANNERS
Route
/admin/banners
/admin/banners/new
/admin/banners/[id]
Назначение

Управление баннерами на сайте.

Таблица

Колонки:

ID
Title
Image
Link
Is Active
Sort Order
Starts At
Ends At
Updated At
Actions
Filters:
isActive
dateFrom
dateTo
Actions:
Create
Edit
Activate
Deactivate
Delete
Форма баннера

Поля:

title
imageFileId
link
isActive
sortOrder
startsAt
endsAt
Правила:

должна быть preview зона

должна быть валидация дат

delete должен требовать confirm

18. Раздел ADS
Route
/admin/ads
/admin/ads/new
/admin/ads/[id]
Назначение

Управление рекламными блоками.

Структурно похож на banners.

Таблица

Колонки:

ID
Title
Image
Target URL
Is Active
Sort Order
Starts At
Ends At
Updated At
Actions
Actions:
Create
Edit
Activate
Deactivate
Delete
19. Раздел SETTINGS
Route
/admin/settings
Назначение

Системные настройки платформы.

Группы настроек:
General
Moderation
Auth
Notifications
Platform
Content
Operations
Примеры настроек:
maintenanceMode
driverVerificationRequired
shipperVerificationRequired
bidEditWindowMinutes
maxUploadFileSizeMb
allowedFileTypes
supportEmail
supportPhone
defaultPaginationLimit
UI для settings

Каждая группа настроек должна быть оформлена как отдельный блок.

Для каждого setting нужны:

key

label

description

type

current value

validation

save action

Rules:

критичные настройки требуют confirm

изменения логируются

значения валидируются на backend

нельзя просто отправлять произвольный JSON без whitelist

20. Общие правила admin-таблиц

Все таблицы админки должны поддерживать:

server-side pagination

фильтрацию

сортировку

loading state

empty state

error state

действия по строке

переход в detail view

AI не должен загружать большие admin-таблицы целиком без пагинации.

21. Общие правила фильтров

Фильтры должны быть:

серверными

типизированными

синхронизируемыми с URL при необходимости

одинаковыми по стилю между страницами

Базовые фильтры:

search
status
role
date range
entity relation filters
boolean flags
22. Общие правила действий администратора

Admin actions делятся на:

Safe actions

открыть страницу

посмотреть детали

отфильтровать

перейти по ссылке

State-changing actions

approve

reject

block

unblock

activate

deactivate

hide

restore

update settings

Dangerous actions

delete

force cancel

hard moderation decisions

Для state-changing и dangerous действий требуются:

confirm dialog

backend permission check

success/error feedback

audit log

23. Правила confirm dialogs

Confirm dialog обязателен для:

block
unblock
approve
reject
hide
restore
delete
force cancel
critical settings change

Диалог должен содержать:

название действия

краткое объяснение последствий

entity reference

confirm button

cancel button

Для reject / destructive actions может требоваться reason.

24. Правила detail pages

Каждая detail page должна быть собрана по одинаковому принципу:

Entity header

Main info

Related entities

Activity / history

Audit logs

Action panel

Danger zone

AI не должен делать detail page просто “большим JSON на экране”.

25. Правила статусов и badge-системы

Все статусы должны отображаться единообразно:

user status

freight status

bid status

order status

verification status

report status

active/inactive states

Admin UI должен использовать единый статусный компонент.

26. Правила backend для admin-панели

Каждая admin page должна опираться на отдельные admin endpoints:

/admin/users
/admin/freights
/admin/vehicles
/admin/bids
/admin/orders
/admin/verification
/admin/reviews
/admin/reports
/admin/audit-logs
/admin/banners
/admin/ads
/admin/settings

AI не должен собирать admin-панель на public endpoints.

Admin backend должен:

возвращать расширенные admin-only данные

поддерживать фильтры и пагинацию

логировать критичные действия

проверять роль admin на сервере

27. Правила аудита admin-действий

Следующие действия обязаны логироваться:

user blocked
user unblocked
role changed
document approved
document rejected
freight hidden
freight restored
order force cancelled
settings changed
banner created
banner updated
banner deleted
ad created
ad updated
ad deleted

Каждый audit log должен по возможности содержать:

actor

action

entity type

entity id

previous value

next value

timestamp

ip / user agent при необходимости

28. Правила безопасности admin-панели

Admin-панель должна быть защищена на двух уровнях:

Frontend

скрытие admin routes для не-admin пользователя

redirect при отсутствии роли

корректный logout при 401/403

Backend

обязательный JWT guard

обязательный role guard (admin)

audit logging

validation для всех mutations

Backend является окончательным источником решения.

29. Что нельзя делать в admin-панели

AI не должен:

смешивать admin UI и public UI

использовать public endpoints для модерации

делать destructive actions без confirm

делать state-changing actions без audit log

показывать сырые внутренние объекты без нормализации

копировать одинаковые таблицы на каждой странице

хранить admin-only решения только на frontend

обходить backend permissions ради “удобства”

30. Приоритет реализации admin-панели

Если админка собирается поэтапно, приоритет должен быть таким:

Этап 1
Dashboard
Users
Verification
Freights
Settings
Этап 2
Vehicles
Bids
Orders
Audit Logs
Этап 3
Reviews
Reports
Banners
Ads
31. Чеклист для AI перед созданием admin page

AI обязан проверить:

есть ли уже общий admin layout

используется ли общий AdminPageHeader

используется ли общий AdminTable

есть ли server-side pagination

есть ли filters DTO на backend

есть ли confirm dialog для state-changing action

пишется ли audit log

есть ли detail page для сущности

не дублирует ли новая страница существующую

соответствует ли страница общей архитектуре admin-панели

32. Финальный принцип

Admin-панель Logist.kg должна быть:

строгой

безопасной

системной

расширяемой

удобной для ежедневной операционной работы

Если admin-решение:

не логирует критичные действия

не использует общие компоненты

не имеет серверной пагинации

обходит backend security

создаёт хаос в структуре страниц

оно считается неправильным и не должно использоваться как стандарт.
