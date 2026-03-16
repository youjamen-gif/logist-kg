# DATABASE_SCHEMA_SQL.md — Logist.kg

Документ описывает целевую SQL-структуру базы данных PostgreSQL для платформы Logist.kg.

Это не “примерная схема”, а архитектурный эталон того, как должна выглядеть база данных в SQL-представлении.

Документ нужен для:

- синхронизации Prisma schema и PostgreSQL
- генерации корректных миграций
- понимания таблиц, ограничений и индексов
- сохранения единого стандарта структуры данных

---

# 1. Общие правила SQL-архитектуры

База данных Logist.kg должна быть построена по следующим правилам:

- PostgreSQL как основная СУБД
- UUID как основной тип идентификаторов
- явные foreign key связи
- обязательные индексы для ключевых запросов
- enum-структуры для критичных бизнес-статусов
- `created_at` и `updated_at` почти для всех основных сущностей
- мягкое удаление только там, где это действительно требуется
- минимальное использование JSONB
- отсутствие хранения бинарных файлов в БД

---

# 2. Расширения PostgreSQL

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

Используется для генерации UUID через gen_random_uuid().

3. ENUM TYPES
3.1 user_role
CREATE TYPE user_role AS ENUM (
  'guest',
  'driver',
  'shipper',
  'dispatcher',
  'admin'
);
3.2 user_status
CREATE TYPE user_status AS ENUM (
  'active',
  'pending_verification',
  'blocked',
  'deleted'
);
3.3 verification_status
CREATE TYPE verification_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);
3.4 document_type
CREATE TYPE document_type AS ENUM (
  'passport',
  'driver_license',
  'company_registration',
  'vehicle_documents'
);
3.5 truck_type
CREATE TYPE truck_type AS ENUM (
  'tent',
  'refrigerator',
  'container',
  'flatbed',
  'tank',
  'grain',
  'isothermal'
);
3.6 freight_status
CREATE TYPE freight_status AS ENUM (
  'draft',
  'active',
  'in_progress',
  'completed',
  'cancelled',
  'expired'
);
3.7 bid_status
CREATE TYPE bid_status AS ENUM (
  'pending',
  'accepted',
  'rejected',
  'withdrawn'
);
3.8 order_status
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'in_transit',
  'delivered',
  'cancelled'
);
3.9 notification_type
CREATE TYPE notification_type AS ENUM (
  'new_bid',
  'bid_accepted',
  'freight_updated',
  'message_received',
  'system_alert'
);
4. TABLES
4.1 users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  documents_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status user_status NOT NULL DEFAULT 'active',
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
Ограничения:
ALTER TABLE users
  ADD CONSTRAINT users_rating_check
  CHECK (rating >= 0 AND rating <= 5);

ALTER TABLE users
  ADD CONSTRAINT users_reviews_count_check
  CHECK (reviews_count >= 0);
4.2 files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  path TEXT NOT NULL,
  mime_type VARCHAR(255) NOT NULL,
  size BIGINT NOT NULL,
  original_name TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  entity_type VARCHAR(100),
  entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Ограничения:
ALTER TABLE files
  ADD CONSTRAINT files_size_check
  CHECK (size >= 0);
4.3 user_documents
CREATE TABLE user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  status verification_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ NULL,
  verified_by UUID NULL REFERENCES users(id) ON DELETE SET NULL
);
4.4 vehicles
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plate_number VARCHAR(50) NOT NULL,
  trailer_number VARCHAR(50),
  truck_type truck_type NOT NULL,
  capacity NUMERIC(10,2),
  volume NUMERIC(10,2),
  dimensions VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Ограничения:
ALTER TABLE vehicles
  ADD CONSTRAINT vehicles_capacity_check
  CHECK (capacity IS NULL OR capacity >= 0);

ALTER TABLE vehicles
  ADD CONSTRAINT vehicles_volume_check
  CHECK (volume IS NULL OR volume >= 0);
4.5 freights
CREATE TABLE freights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  origin_city VARCHAR(120) NOT NULL,
  origin_country VARCHAR(120) NOT NULL,
  destination_city VARCHAR(120) NOT NULL,
  destination_country VARCHAR(120) NOT NULL,
  weight NUMERIC(10,2),
  volume NUMERIC(10,2),
  truck_type truck_type,
  price NUMERIC(12,2),
  auction BOOLEAN NOT NULL DEFAULT FALSE,
  status freight_status NOT NULL DEFAULT 'draft',
  vehicles_required INTEGER NOT NULL DEFAULT 1,
  vehicles_assigned INTEGER NOT NULL DEFAULT 0,
  loading_date TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
Ограничения:
ALTER TABLE freights
  ADD CONSTRAINT freights_weight_check
  CHECK (weight IS NULL OR weight >= 0);

ALTER TABLE freights
  ADD CONSTRAINT freights_volume_check
  CHECK (volume IS NULL OR volume >= 0);

ALTER TABLE freights
  ADD CONSTRAINT freights_price_check
  CHECK (price IS NULL OR price >= 0);

ALTER TABLE freights
  ADD CONSTRAINT freights_vehicles_required_check
  CHECK (vehicles_required > 0);

ALTER TABLE freights
  ADD CONSTRAINT freights_vehicles_assigned_check
  CHECK (vehicles_assigned >= 0);

ALTER TABLE freights
  ADD CONSTRAINT freights_vehicles_assigned_not_gt_required_check
  CHECK (vehicles_assigned <= vehicles_required);
4.6 bids
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES freights(id) ON DELETE CASCADE,
  driver_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  message TEXT,
  status bid_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Ограничения:
ALTER TABLE bids
  ADD CONSTRAINT bids_price_check
  CHECK (price >= 0);
Уникальность:
ALTER TABLE bids
  ADD CONSTRAINT bids_unique_active_driver_bid
  UNIQUE (freight_id, driver_user_id);

Примечание: если в будущем понадобится несколько ставок от одного водителя в рамках торга, эта уникальность должна быть переработана в отдельную модель истории ставок.

4.7 orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NOT NULL REFERENCES freights(id) ON DELETE RESTRICT,
  driver_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  shipper_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  bid_id UUID UNIQUE REFERENCES bids(id) ON DELETE SET NULL,
  price NUMERIC(12,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);
Ограничения:
ALTER TABLE orders
  ADD CONSTRAINT orders_price_check
  CHECK (price >= 0);
4.8 chats
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_id UUID NULL REFERENCES freights(id) ON DELETE SET NULL,
  order_id UUID NULL REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Ограничения:
ALTER TABLE chats
  ADD CONSTRAINT chats_freight_or_order_required_check
  CHECK (freight_id IS NOT NULL OR order_id IS NOT NULL);
4.9 chat_participants
CREATE TABLE chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_message_id UUID NULL
);
Уникальность:
ALTER TABLE chat_participants
  ADD CONSTRAINT chat_participants_unique_user_per_chat
  UNIQUE (chat_id, user_id);
4.10 messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL
);
4.11 notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ NULL
);
4.12 reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Ограничения:
ALTER TABLE reviews
  ADD CONSTRAINT reviews_rating_check
  CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE reviews
  ADD CONSTRAINT reviews_no_self_review_check
  CHECK (from_user_id <> to_user_id);
4.13 audit_logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(150) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
4.14 banners
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image_file_id UUID NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ NULL,
  ends_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
4.15 ads
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image_file_id UUID NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  target_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ NULL,
  ends_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
4.16 system_settings
CREATE TABLE system_settings (
  key VARCHAR(150) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID NULL REFERENCES users(id) ON DELETE SET NULL
);
5. INDEXES
5.1 users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
5.2 user_documents
CREATE INDEX idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX idx_user_documents_status ON user_documents(status);
CREATE INDEX idx_user_documents_type ON user_documents(type);
5.3 files
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_entity_type_entity_id ON files(entity_type, entity_id);
CREATE INDEX idx_files_created_at ON files(created_at DESC);
5.4 vehicles
CREATE INDEX idx_vehicles_driver_user_id ON vehicles(driver_user_id);
CREATE INDEX idx_vehicles_truck_type ON vehicles(truck_type);
CREATE INDEX idx_vehicles_is_active ON vehicles(is_active);
5.5 freights
CREATE INDEX idx_freights_owner_user_id ON freights(owner_user_id);
CREATE INDEX idx_freights_status ON freights(status);
CREATE INDEX idx_freights_origin_city ON freights(origin_city);
CREATE INDEX idx_freights_destination_city ON freights(destination_city);
CREATE INDEX idx_freights_loading_date ON freights(loading_date);
CREATE INDEX idx_freights_created_at ON freights(created_at DESC);
CREATE INDEX idx_freights_deleted_at ON freights(deleted_at);
CREATE INDEX idx_freights_truck_type ON freights(truck_type);
CREATE INDEX idx_freights_auction ON freights(auction);
5.6 bids
CREATE INDEX idx_bids_freight_id ON bids(freight_id);
CREATE INDEX idx_bids_driver_user_id ON bids(driver_user_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_created_at ON bids(created_at DESC);
5.7 orders
CREATE INDEX idx_orders_freight_id ON orders(freight_id);
CREATE INDEX idx_orders_driver_user_id ON orders(driver_user_id);
CREATE INDEX idx_orders_shipper_user_id ON orders(shipper_user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_deleted_at ON orders(deleted_at);
5.8 chats / messages
CREATE INDEX idx_chats_freight_id ON chats(freight_id);
CREATE INDEX idx_chats_order_id ON chats(order_id);

CREATE INDEX idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_user_id ON messages(sender_user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_deleted_at ON messages(deleted_at);
5.9 notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
5.10 reviews
CREATE INDEX idx_reviews_from_user_id ON reviews(from_user_id);
CREATE INDEX idx_reviews_to_user_id ON reviews(to_user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
5.11 audit_logs
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity_type_entity_id ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
5.12 banners / ads
CREATE INDEX idx_banners_is_active ON banners(is_active);
CREATE INDEX idx_banners_sort_order ON banners(sort_order);

CREATE INDEX idx_ads_is_active ON ads(is_active);
CREATE INDEX idx_ads_sort_order ON ads(sort_order);
6. UPDATED_AT TRIGGERS

Для таблиц с updated_at должен использоваться единый trigger.

6.1 функция
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
6.2 triggers
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_freights_updated_at
BEFORE UPDATE ON freights
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_bids_updated_at
BEFORE UPDATE ON bids
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_banners_updated_at
BEFORE UPDATE ON banners
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_ads_updated_at
BEFORE UPDATE ON ads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
7. SOFT DELETE RULES

Soft delete разрешён только для следующих таблиц:

users

freights

orders

messages при необходимости скрытия, а не физического удаления

Soft delete реализуется через:

deleted_at TIMESTAMPTZ NULL

AI не должен добавлять soft delete в каждую таблицу без причины.

8. RELATION RULES

Основные отношения:

один user → много vehicles

один user → много freights

один user → много bids

один freight → много bids

один freight → один или несколько orders в зависимости от модели назначения машин

один chat → много messages

один user → много notifications

один order → максимум один review

один file может быть привязан к разным сущностям через entity_type + entity_id, но критичные документы должны иметь явные связи через отдельные таблицы

9. SQL DESIGN DECISIONS
9.1 Почему UUID

UUID безопаснее для публичных API и удобнее для распределённой архитектуры.

9.2 Почему enum

Ключевые бизнес-статусы должны быть строго ограничены допустимыми значениями.

9.3 Почему JSONB ограничен

JSONB допускается только для:

audit_logs.metadata

system_settings.value

Во всех остальных случаях предпочтительна нормализованная структура.

9.4 Почему файлы вынесены отдельно

Бинарные данные не должны храниться в PostgreSQL. В БД — только метаданные и связи.

10. MIGRATION RULES

При изменении этой схемы AI обязан:

обновить DATABASE_SCHEMA.md

обновить Prisma schema

обновить миграции

проверить API-контракты

проверить индексы и ограничения

убедиться, что изменение объясняется бизнес-функцией

AI не должен менять SQL-структуру изолированно от остальной архитектуры.

11. ЧТО НЕЛЬЗЯ ДЕЛАТЬ

AI не должен:

удалять foreign keys ради “простоты”

заменять нормальные связи JSON-полями

хранить пароли, токены и секреты в открытом виде

создавать неиндексируемые критичные поля поиска без индексов

использовать неограниченные текстовые поля там, где нужна строгая структура

плодить nullable-поля без явной причины

строить таблицы “на будущее”, если у них нет роли в текущей архитектуре

12. ФИНАЛЬНЫЙ ПРИНЦИП

SQL-схема Logist.kg должна быть:

строгой

понятной

нормализованной

безопасной

расширяемой

совместимой с Prisma и backend-архитектурой

Если SQL-решение:

ломает связи

создаёт дублирование

ухудшает производительность

затрудняет поддержку

оно считается неправильным и не должно использоваться как стандарт.
