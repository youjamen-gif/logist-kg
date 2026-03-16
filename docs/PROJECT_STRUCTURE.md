# PROJECT_STRUCTURE.md — Logist.kg

Документ фиксирует целевую структуру репозитория Logist.kg.
Это главный ориентир для AI и разработчиков: куда создавать файлы, где должна жить логика и какие зоны считаются актуальными.

---

# 1. Цель структуры

Структура проекта должна обеспечивать:

- понятное разделение frontend и backend
- предсказуемое размещение файлов
- лёгкую навигацию для AI и человека
- безопасное масштабирование проекта
- минимизацию хаоса и дублирования
- удобную поддержку production-разработки

---

# 2. Главный принцип

Проект делится на 3 основные рабочие зоны:

- `frontend/` — клиентская часть
- `backend/` — серверная часть
- `docs/` — архитектурная и продуктовая документация

Все новые изменения AI должен вносить только в эти целевые зоны, если нет специально оговорённой причины сделать иначе.

---

# 3. Корневая структура репозитория

Ниже приведена целевая структура верхнего уровня.

```text
logist-kg/
├─ frontend/
├─ backend/
├─ docs/
├─ .gitignore
├─ README.md
├─ docker-compose.yml                # опционально
├─ .env.example
└─ scripts/                          # опционально, только для общих devops/dev scripts
4. Назначение корневых директорий
frontend/

Содержит весь код клиентского приложения:

страницы

layouts

UI-компоненты

формы

клиентские хуки

API client

frontend utilities

frontend types

backend/

Содержит весь код серверного приложения:

NestJS modules

controllers

services

DTO

guards

Prisma schema

миграции

backend utilities

jobs

integrations

docs/

Содержит архитектурные, продуктовые и технические документы:

структура проекта

архитектура backend

схема БД

auth flow

admin panel structure

API spec

roadmap

development plan

scripts/

Разрешён только для общих скриптов проекта:

seed helpers

deployment helpers

environment bootstrap scripts

data migration helpers

CI/CD utilities

AI не должен переносить туда бизнес-логику приложения.

5. Что считается legacy и не должно развиваться

Если в репозитории есть старые директории или старые файлы вне целевой структуры, AI должен считать их legacy-зоной, пока они явно не включены в новую архитектуру.

Примеры потенциального legacy:

корневой src/, если там остались следы старой реализации

старые firebase-конфиги

временные файлы генерации

устаревшие markdown-инструкции, противоречащие текущей архитектуре

Правило:

AI не должен развивать legacy-структуру.
AI должен переносить проект к целевой структуре, а не укреплять старую.

6. Полная целевая структура frontend
frontend/
├─ src/
│  ├─ app/
│  │  ├─ (public)/
│  │  │  ├─ page.tsx
│  │  │  ├─ find-cargo/
│  │  │  ├─ find-transport/
│  │  │  ├─ cargo/[id]/
│  │  │  ├─ transport/[id]/
│  │  │  ├─ login/
│  │  │  ├─ register/
│  │  │  ├─ pricing/
│  │  │  ├─ about/
│  │  │  ├─ contacts/
│  │  │  ├─ terms/
│  │  │  └─ privacy/
│  │  │
│  │  ├─ (dashboard)/
│  │  │  ├─ dashboard/
│  │  │  ├─ my-cargo/
│  │  │  ├─ my-vehicles/
│  │  │  ├─ my-bids/
│  │  │  ├─ my-bookings/
│  │  │  ├─ notifications/
│  │  │  ├─ messages/
│  │  │  ├─ settings/
│  │  │  └─ profile/
│  │  │
│  │  ├─ admin/
│  │  │  ├─ page.tsx
│  │  │  ├─ users/
│  │  │  ├─ freights/
│  │  │  ├─ vehicles/
│  │  │  ├─ bids/
│  │  │  ├─ verification/
│  │  │  ├─ reports/
│  │  │  ├─ audit-logs/
│  │  │  ├─ banners/
│  │  │  ├─ ads/
│  │  │  └─ settings/
│  │  │
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ loading.tsx
│  │  ├─ error.tsx
│  │  └─ not-found.tsx
│  │
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ layout/
│  │  ├─ shared/
│  │  ├─ forms/
│  │  ├─ tables/
│  │  ├─ cards/
│  │  ├─ filters/
│  │  ├─ modals/
│  │  ├─ auth/
│  │  ├─ cargo/
│  │  ├─ vehicle/
│  │  ├─ bid/
│  │  ├─ chat/
│  │  ├─ notification/
│  │  └─ admin/
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ cargo/
│  │  ├─ vehicles/
│  │  ├─ bids/
│  │  ├─ users/
│  │  ├─ notifications/
│  │  ├─ chat/
│  │  ├─ admin/
│  │  └─ verification/
│  │
│  ├─ lib/
│  │  ├─ api/
│  │  │  ├─ client.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ cargo.ts
│  │  │  ├─ vehicles.ts
│  │  │  ├─ bids.ts
│  │  │  ├─ users.ts
│  │  │  ├─ admin.ts
│  │  │  ├─ notifications.ts
│  │  │  └─ chat.ts
│  │  ├─ config/
│  │  ├─ utils/
│  │  ├─ constants/
│  │  ├─ formatters/
│  │  ├─ guards/
│  │  └─ socket/
│  │
│  ├─ hooks/
│  │  ├─ useAuth.ts
│  │  ├─ usePagination.ts
│  │  ├─ useDebounce.ts
│  │  ├─ useNotifications.ts
│  │  └─ useSocket.ts
│  │
│  ├─ store/
│  │  ├─ auth/
│  │  ├─ filters/
│  │  ├─ notifications/
│  │  └─ ui/
│  │
│  ├─ providers/
│  │  ├─ AuthProvider.tsx
│  │  ├─ QueryProvider.tsx
│  │  ├─ SocketProvider.tsx
│  │  └─ ThemeProvider.tsx
│  │
│  ├─ types/
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  ├─ cargo.ts
│  │  ├─ vehicle.ts
│  │  ├─ bid.ts
│  │  ├─ user.ts
│  │  ├─ admin.ts
│  │  └─ common.ts
│  │
│  ├─ styles/
│  │  └─ globals.css
│  │
│  └─ middleware.ts
│
├─ public/
├─ package.json
├─ tsconfig.json
├─ next.config.ts
├─ tailwind.config.ts
├─ postcss.config.js
└─ .env.example
7. Правила структуры frontend
7.1 app/

Используется только для:

маршрутов

layout

route-level loading/error states

тонких page-компонентов

серверных entry points

AI не должен размещать крупную бизнес-логику прямо в page.tsx.

7.2 components/

Используется для переиспользуемых визуальных компонентов.

AI должен:

держать UI-компоненты максимально изолированными

выносить повторяющиеся шаблоны

разделять generic UI и domain UI

7.3 features/

Используется для логически сгруппированных клиентских сценариев по доменам:

auth

cargo

vehicles

bids

admin

verification

Здесь может жить:

feature-specific hooks

containers

form logic

action handlers

presentation orchestration

7.4 lib/api/

Здесь находится весь frontend-доступ к backend API.

AI не должен вызывать backend хаотично из компонентов.
Все вызовы API должны проходить через единый слой.

7.5 types/

Здесь хранятся типы frontend-уровня и типы контрактов API.

AI не должен раскидывать типы бессистемно по десяткам файлов, если это мешает поддержке.

7.6 providers/

Здесь находятся глобальные провайдеры приложения:

auth

query/cache

socket

theme

7.7 store/

Используется только для клиентского состояния интерфейса и локального состояния приложения.

AI не должен использовать store как замену backend.

8. Полная целевая структура backend
backend/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  │
│  ├─ common/
│  │  ├─ decorators/
│  │  ├─ guards/
│  │  ├─ interceptors/
│  │  ├─ filters/
│  │  ├─ pipes/
│  │  ├─ dto/
│  │  ├─ types/
│  │  ├─ constants/
│  │  ├─ utils/
│  │  └─ helpers/
│  │
│  ├─ config/
│  │  ├─ app.config.ts
│  │  ├─ auth.config.ts
│  │  ├─ database.config.ts
│  │  ├─ redis.config.ts
│  │  ├─ storage.config.ts
│  │  └─ validation.ts
│  │
│  ├─ prisma/
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  │
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ dto/
│  │  │  ├─ guards/
│  │  │  ├─ strategies/
│  │  │  └─ interfaces/
│  │  │
│  │  ├─ users/
│  │  │  ├─ users.module.ts
│  │  │  ├─ users.controller.ts
│  │  │  ├─ users.service.ts
│  │  │  ├─ dto/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ freights/
│  │  │  ├─ freights.module.ts
│  │  │  ├─ freights.controller.ts
│  │  │  ├─ freights.service.ts
│  │  │  ├─ dto/
│  │  │  ├─ policies/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ vehicles/
│  │  │  ├─ vehicles.module.ts
│  │  │  ├─ vehicles.controller.ts
│  │  │  ├─ vehicles.service.ts
│  │  │  ├─ dto/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ bids/
│  │  │  ├─ bids.module.ts
│  │  │  ├─ bids.controller.ts
│  │  │  ├─ bids.service.ts
│  │  │  ├─ dto/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ orders/
│  │  │  ├─ orders.module.ts
│  │  │  ├─ orders.controller.ts
│  │  │  ├─ orders.service.ts
│  │  │  ├─ dto/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ notifications/
│  │  │  ├─ notifications.module.ts
│  │  │  ├─ notifications.controller.ts
│  │  │  ├─ notifications.service.ts
│  │  │  ├─ dto/
│  │  │  ├─ gateways/
│  │  │  └─ templates/
│  │  │
│  │  ├─ chat/
│  │  │  ├─ chat.module.ts
│  │  │  ├─ chat.controller.ts
│  │  │  ├─ chat.service.ts
│  │  │  ├─ chat.gateway.ts
│  │  │  ├─ dto/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ verification/
│  │  │  ├─ verification.module.ts
│  │  │  ├─ verification.controller.ts
│  │  │  ├─ verification.service.ts
│  │  │  ├─ dto/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ admin/
│  │  │  ├─ admin.module.ts
│  │  │  ├─ admin-users.controller.ts
│  │  │  ├─ admin-freights.controller.ts
│  │  │  ├─ admin-vehicles.controller.ts
│  │  │  ├─ admin-reports.controller.ts
│  │  │  ├─ admin-settings.controller.ts
│  │  │  ├─ services/
│  │  │  ├─ dto/
│  │  │  └─ serializers/
│  │  │
│  │  ├─ files/
│  │  │  ├─ files.module.ts
│  │  │  ├─ files.controller.ts
│  │  │  ├─ files.service.ts
│  │  │  ├─ dto/
│  │  │  └─ storage/
│  │  │
│  │  ├─ audit/
│  │  │  ├─ audit.module.ts
│  │  │  ├─ audit.service.ts
│  │  │  └─ dto/
│  │  │
│  │  ├─ payments/
│  │  │  ├─ payments.module.ts
│  │  │  ├─ payments.controller.ts
│  │  │  ├─ payments.service.ts
│  │  │  ├─ dto/
│  │  │  └─ providers/
│  │  │
│  │  └─ health/
│  │     ├─ health.module.ts
│  │     └─ health.controller.ts
│  │
│  └─ jobs/
│     ├─ notifications/
│     ├─ cleanup/
│     ├─ moderation/
│     └─ sync/
│
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
│
├─ test/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/
│
├─ package.json
├─ tsconfig.json
├─ nest-cli.json
└─ .env.example
9. Правила структуры backend
9.1 common/

Только общие backend-механизмы:

decorators

guards

filters

interceptors

pipes

shared DTO

shared helpers

AI не должен складывать туда доменную бизнес-логику.

9.2 config/

Вся централизованная конфигурация backend.

AI должен:

хранить env parsing и config factory здесь

не разбрасывать чтение env-переменных по всему проекту

9.3 prisma/

Слой подключения к БД через Prisma.

9.4 modules/

Главная зона доменной логики backend.

Каждый модуль должен быть самостоятельным и понятным.
Стандарт модуля:

module-name/
├─ module-name.module.ts
├─ module-name.controller.ts
├─ module-name.service.ts
├─ dto/
├─ serializers/
└─ дополнительные файлы модуля
9.5 jobs/

Фоновые задачи:

напоминания

пересчёты

очистка временных данных

delayed notifications

moderation routines

AI не должен использовать jobs/ как место для обычной синхронной бизнес-логики.

10. Структура документации
docs/
├─ AI_RULES.md
├─ PROJECT_STRUCTURE.md
├─ BACKEND_ARCHITECTURE.md
├─ DATABASE_SCHEMA.md
├─ DATABASE_SCHEMA_SQL.md
├─ AUTH_FLOW.md
├─ API_SPEC_BACKEND.md
├─ ADMIN_PANEL_STRUCTURE.md
├─ ARCHITECTURE_DIAGRAM.md
├─ DEVELOPMENT_PLAN.md
├─ PRODUCT_ROADMAP.md
└─ legacy/
   └─ firebase/
      ├─ FIREBASE_COST_RULES.md
      ├─ FIREBASE_STRUCTURE.md
      ├─ FIRESTORE_FULL_RULES.md
      ├─ FIRESTORE_INDEXES.md
      └─ FIRESTORE_QUERIES.md
11. Правила для docs/

AI должен:

поддерживать документы в актуальном состоянии

хранить активные документы в корне docs/

переносить устаревшие firebase-документы в docs/legacy/firebase/

не смешивать целевую архитектуру и устаревшие подходы в одном файле

обновлять связанные документы при архитектурных изменениях

AI не должен:

оставлять firebase-документы как действующий стандарт

ссылаться на устаревшие файлы как на основную архитектуру

менять кодовую архитектуру без синхронного обновления docs

12. Naming conventions
Общие правила

имена директорий — lowercase, kebab-case при необходимости

имена файлов — предсказуемые и единообразные

один файл = одна явная ответственность

не использовать случайные сокращения

Frontend

React components: PascalCase.tsx

hooks: useXxx.ts

utility files: camelCase.ts или domain-kebab-case.ts по принятому стилю

route files: стандарт Next.js (page.tsx, layout.tsx, loading.tsx, error.tsx)

Backend

NestJS files: feature-name.controller.ts, feature-name.service.ts, feature-name.module.ts

DTO: create-entity.dto.ts, update-entity.dto.ts, filter-entity.dto.ts

serializer: entity-response.serializer.ts

13. Куда AI должен добавлять новый код
Если задача про страницу:

добавлять в frontend/src/app/...

Если задача про UI-блок:

добавлять в frontend/src/components/...

Если задача про доменный frontend-сценарий:

добавлять в frontend/src/features/...

Если задача про вызов API:

добавлять в frontend/src/lib/api/...

Если задача про backend endpoint:

добавлять в соответствующий модуль backend/src/modules/...

Если задача про общую backend-защиту:

добавлять в backend/src/common/...

Если задача про Prisma:

изменять backend/prisma/schema.prisma и миграции

Если задача про архитектурные правила:

изменять docs/...

14. Куда AI не должен добавлять новый код

AI не должен создавать новый production-код:

в корневом src/

в случайных папках вне frontend/ и backend/

в docs/, если это не документация

в public/, если это не статические файлы

в scripts/, если это бизнес-логика

в старых firebase-папках

в дублирующих директориях типа components2, new, temp, final-final

15. Правила маршрутов frontend
Public routes

Публичные страницы должны находиться в (public) или в явно публичной зоне.

Authenticated routes

Личный кабинет и пользовательские разделы должны находиться в (dashboard) или аналогичной защищённой группе.

Admin routes

Все admin-страницы должны жить только в app/admin/....

AI не должен смешивать admin-роуты с обычными пользовательскими страницами.

16. Правила модульности backend

Каждый backend-модуль должен:

иметь понятную границу ответственности

не знать лишнего о внутреннем устройстве других модулей

использовать общие механизмы через common/

работать через DTO и сервисы

отдавать наружу понятный API

AI не должен:

писать giant-module на весь проект

смешивать unrelated responsibility

создавать циклические зависимости между модулями

копировать один и тот же код в несколько модулей

17. Правила тестовой структуры
Frontend

При появлении тестов:

frontend/src/__tests__/
frontend/src/components/.../*.test.tsx
frontend/src/features/.../*.test.ts
Backend
backend/test/unit/
backend/test/integration/
backend/test/e2e/

AI должен держать тесты рядом с понятной зоной ответственности или в выделенной test-структуре, без хаоса.

18. Правила env и конфигурации
Frontend

только публичные переменные с безопасным префиксом

без секретов

пример переменных в frontend/.env.example

Backend

все секреты только на backend

конфигурация через env

пример переменных в backend/.env.example

AI не должен:

вставлять реальные секреты в код

хранить токены в markdown-документах

размещать чувствительные env в frontend

19. Правила миграции текущего репозитория к целевой структуре

Если в репозитории уже есть смешанная структура, AI должен использовать такой принцип:

новые изменения делать только в целевой зоне

старый код не расширять без необходимости

при возможности переносить legacy-код по частям

не ломать рабочие части без причины

после переноса обновлять документацию

20. Чеклист для AI перед созданием файла

Перед созданием нового файла AI обязан проверить:

это frontend, backend или docs?

есть ли уже подходящая директория?

не дублирует ли новый файл существующий?

соответствует ли имя файла naming convention?

не создаёт ли файл ещё один слой хаоса?

можно ли следующему AI быстро понять, зачем этот файл нужен?

21. Финальный принцип

Структура проекта должна помогать разработке, а не мешать ей.

Если AI сомневается, куда писать код, он обязан выбрать решение, которое:

лучше соответствует разделению frontend/backend

уменьшает хаос

ближе к целевой архитектуре

легче поддерживается

не закрепляет legacy
