DATABASE_SCHEMA.md — Logist.kg

Документ описывает логическую структуру базы данных платформы Logist.kg.

Он определяет:

сущности системы

отношения между сущностями

основные поля

бизнес-состояния

правила хранения данных

Этот документ является источником истины для Prisma schema и API.

1. Основные принципы БД

База данных платформы:

PostgreSQL

Основные правила:

нормализованная схема

явные связи между таблицами

отсутствие дублирования данных

минимальное использование JSON

индексы для поисковых операций

явные статусы для бизнес-состояний

audit-friendly структура

2. Основные сущности платформы

Главные таблицы системы:

users
user_documents
vehicles
freights
bids
orders
messages
notifications
reviews
audit_logs
files
system_settings
banners
ads
3. USERS

Основная таблица пользователей.

users
поле	тип	описание
id	uuid	уникальный ID
email	string	email
password_hash	string	хэш пароля
role	enum	роль
name	string	имя
phone	string	телефон
phone_verified	boolean	подтверждение телефона
documents_verified	boolean	подтверждение документов
status	enum	статус аккаунта
rating	float	рейтинг
reviews_count	int	количество отзывов
created_at	timestamp	дата регистрации
updated_at	timestamp	обновление
4. USER ROLES
guest
driver
shipper
dispatcher
admin
5. USER STATUS
active
pending_verification
blocked
deleted
6. USER DOCUMENTS

Документы пользователей для проверки.

user_documents
поле	тип
id	uuid
user_id	uuid
type	enum
file_id	uuid
status	enum
uploaded_at	timestamp
verified_at	timestamp

Типы документов:

passport
driver_license
company_registration
vehicle_documents

Статусы:

pending
approved
rejected
7. VEHICLES

Транспорт водителей.

vehicles
поле	тип
id	uuid
driver_user_id	uuid
plate_number	string
trailer_number	string
truck_type	enum
capacity	float
volume	float
dimensions	string
created_at	timestamp
updated_at	timestamp
8. TRUCK TYPES

Типы кузова.

tent
refrigerator
container
flatbed
tank
grain
isothermal
9. FREIGHTS

Основная сущность платформы — груз.

freights
поле	тип
id	uuid
owner_user_id	uuid
title	string
description	text
origin_city	string
origin_country	string
destination_city	string
destination_country	string
weight	float
volume	float
truck_type	enum
price	float
auction	boolean
status	enum
vehicles_required	int
vehicles_assigned	int
loading_date	timestamp
created_at	timestamp
updated_at	timestamp
10. FREIGHT STATUS
draft
active
in_progress
completed
cancelled
expired
11. BIDS

Предложения водителей на груз.

bids
поле	тип
id	uuid
freight_id	uuid
driver_user_id	uuid
price	float
message	text
status	enum
created_at	timestamp
updated_at	timestamp
12. BID STATUS
pending
accepted
rejected
withdrawn
13. ORDERS

Подтверждённая перевозка.

orders
поле	тип
id	uuid
freight_id	uuid
driver_user_id	uuid
shipper_user_id	uuid
bid_id	uuid
price	float
status	enum
started_at	timestamp
completed_at	timestamp
created_at	timestamp
14. ORDER STATUS
pending
confirmed
in_transit
delivered
cancelled
15. MESSAGES

Чат между участниками.

messages
поле	тип
id	uuid
chat_id	uuid
sender_user_id	uuid
text	text
created_at	timestamp
16. CHATS

Диалоги пользователей.

chats
поле	тип
id	uuid
freight_id	uuid
created_at	timestamp
17. NOTIFICATIONS

Уведомления системы.

notifications
поле	тип
id	uuid
user_id	uuid
type	enum
title	string
message	text
read	boolean
created_at	timestamp

Типы уведомлений:

new_bid
bid_accepted
freight_updated
message_received
system_alert
18. REVIEWS

Отзывы между пользователями.

reviews
поле	тип
id	uuid
from_user_id	uuid
to_user_id	uuid
order_id	uuid
rating	int
comment	text
created_at	timestamp
19. FILES

Файлы системы.

files
поле	тип
id	uuid
url	string
path	string
mime_type	string
size	int
original_name	string
uploaded_by	uuid
entity_type	string
entity_id	uuid
created_at	timestamp
20. AUDIT LOGS

Журнал действий системы.

audit_logs
поле	тип
id	uuid
actor_user_id	uuid
action	string
entity_type	string
entity_id	uuid
metadata	json
created_at	timestamp
21. BANNERS

Баннеры на платформе.

banners
поле	тип
id	uuid
title	string
image_file_id	uuid
link	string
active	boolean
created_at	timestamp
22. ADS

Реклама.

ads
поле	тип
id	uuid
title	string
image_file_id	uuid
target_url	string
active	boolean
created_at	timestamp
23. SYSTEM SETTINGS

Настройки системы.

system_settings
поле	тип
key	string
value	json
24. Основные связи таблиц
users → vehicles
users → freights
users → bids
users → reviews
users → notifications

freights → bids
freights → orders
freights → chats

orders → reviews

chats → messages
25. Основные индексы

Обязательные индексы:

freights.status
freights.origin_city
freights.destination_city
freights.loading_date

bids.freight_id
bids.driver_user_id

vehicles.driver_user_id

orders.driver_user_id
orders.shipper_user_id
26. Soft delete

Soft delete применяется только для:

users
freights
orders

Через поле:

deleted_at
27. Pagination

Все списки должны поддерживать:

limit
offset
cursor
sorting
filters
28. Основной принцип БД

База данных должна быть:

простая
нормализованная
предсказуемая
масштабируемая

Если структура БД:

усложняет запросы

дублирует данные

нарушает связи

она считается неправильной и должна быть исправлена.
