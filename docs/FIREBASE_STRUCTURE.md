# FIREBASE_STRUCTURE.md — Logist.kg

## 1. Firebase Services

### Authentication
Использовать:
- Email/Password
- Google
- Телефон позже, если понадобится

### Firestore
Основная база платформы.

### Storage
Для:
- паспорта
- техпаспорта
- фото профиля
- фото транспорта
- документы компании

### Hosting
Для деплоя frontend.

### Functions
Только для:
- уведомлений
- модерации
- фоновых проверок
- платных функций

---

## 2. Основные коллекции Firestore

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

## 3. Логика коллекций

### users
Общая информация о каждом пользователе.

### drivers
Расширенный профиль водителя.

### companies
Расширенный профиль отправителя / компании.

### vehicles
Транспорт водителей.

### freights
Объявления о грузах.

### bids
Отклики на грузы.

### reviews
Отзывы и рейтинг.

### conversations
Чаты.

### messages
Сообщения внутри чатов.

### notifications
Уведомления пользователям.

### subscriptions
Подписки.

### payments
История оплат.

### ads
Рекламные блоки.

### banners
Баннеры на платформе.

### reports
Жалобы.

### audit_logs
Логи действий.

### system_settings
Настройки платформы.

---

## 4. Связи

users/{userId}
drivers/{driverId}
companies/{companyId}
vehicles/{vehicleId}
freights/{freightId}
bids/{bidId}
reviews/{reviewId}
conversations/{conversationId}
messages/{messageId}

---

## 5. Важные правила структуры

- не хранить большие массивы в документах
- не хранить файлы в Firestore
- не дублировать данные без необходимости
- использовать ссылки через id
- каждую сущность хранить в отдельной коллекции

---

## 6. Что хранить в Storage

driver-documents/
company-documents/
vehicle-documents/
avatars/
chat-files/

---

## 7. Что не делать

- не хранить description в индексах
- не делать realtime на всю коллекцию freights
- не делать открытые read/write rules
- не смешивать profile и business data в одном документе без причины