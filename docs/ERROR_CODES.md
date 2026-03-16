# ERROR_CODES.md — Logist.kg

Документ содержит полный список кодов ошибок API платформы Logist.kg.

Все backend ошибки должны использовать **эти коды**.

Frontend должен ориентироваться на **error.code**, а не на текст сообщения.

Формат ошибки API:

{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}

---

# 1. Общие ошибки

GENERAL_UNKNOWN_ERROR  
Непредвиденная ошибка системы.

INTERNAL_SERVER_ERROR  
Ошибка сервера.

SERVICE_UNAVAILABLE  
Сервис временно недоступен.

INVALID_REQUEST  
Некорректный запрос.

VALIDATION_ERROR  
Ошибка валидации входных данных.

RESOURCE_NOT_FOUND  
Ресурс не найден.

RESOURCE_CONFLICT  
Конфликт данных.

TOO_MANY_REQUESTS  
Слишком много запросов.

---

# 2. Ошибки авторизации

UNAUTHORIZED  
Пользователь не авторизован.

INVALID_TOKEN  
Неверный токен.

TOKEN_EXPIRED  
Токен истёк.

REFRESH_TOKEN_INVALID  
Refresh токен недействителен.

REFRESH_TOKEN_EXPIRED  
Refresh токен истёк.

ACCESS_DENIED  
Недостаточно прав доступа.

ACCOUNT_BLOCKED  
Аккаунт заблокирован.

ACCOUNT_DELETED  
Аккаунт удалён.

---

# 3. Ошибки регистрации

EMAIL_ALREADY_EXISTS  
Email уже используется.

INVALID_EMAIL  
Некорректный email.

INVALID_PASSWORD  
Некорректный пароль.

WEAK_PASSWORD  
Слишком слабый пароль.

PHONE_ALREADY_EXISTS  
Телефон уже используется.

PHONE_NOT_VERIFIED  
Телефон не подтверждён.

---

# 4. Ошибки пользователей

USER_NOT_FOUND  
Пользователь не найден.

USER_BLOCKED  
Пользователь заблокирован.

USER_NOT_VERIFIED  
Пользователь не прошёл проверку.

INVALID_USER_ROLE  
Некорректная роль пользователя.

CANNOT_MODIFY_OTHER_USER  
Нельзя изменять другого пользователя.

---

# 5. Ошибки грузов (Freights)

FREIGHT_NOT_FOUND  
Груз не найден.

FREIGHT_ALREADY_PUBLISHED  
Груз уже опубликован.

FREIGHT_NOT_ACTIVE  
Груз не активен.

FREIGHT_CANNOT_BE_EDITED  
Груз нельзя редактировать.

FREIGHT_CANNOT_BE_DELETED  
Груз нельзя удалить.

FREIGHT_INVALID_STATUS  
Некорректный статус груза.

---

# 6. Ошибки транспорта (Vehicles)

VEHICLE_NOT_FOUND  
Транспорт не найден.

VEHICLE_ALREADY_EXISTS  
Транспорт уже существует.

VEHICLE_NOT_VERIFIED  
Транспорт не подтверждён.

VEHICLE_CANNOT_BE_DELETED  
Транспорт нельзя удалить.

---

# 7. Ошибки ставок (Bids)

BID_NOT_FOUND  
Ставка не найдена.

BID_ALREADY_EXISTS  
Ставка уже существует.

BID_ALREADY_ACCEPTED  
Ставка уже принята.

BID_ALREADY_REJECTED  
Ставка уже отклонена.

BID_CANNOT_BE_MODIFIED  
Ставку нельзя изменить.

BID_CANNOT_BE_WITHDRAWN  
Ставку нельзя отменить.

---

# 8. Ошибки заказов (Orders)

ORDER_NOT_FOUND  
Заказ не найден.

ORDER_ALREADY_STARTED  
Заказ уже начался.

ORDER_ALREADY_COMPLETED  
Заказ уже завершён.

ORDER_ALREADY_CANCELLED  
Заказ уже отменён.

ORDER_INVALID_STATUS  
Некорректный статус заказа.

ORDER_CANNOT_BE_CANCELLED  
Заказ нельзя отменить.

---

# 9. Ошибки сообщений

CHAT_NOT_FOUND  
Чат не найден.

MESSAGE_NOT_FOUND  
Сообщение не найдено.

MESSAGE_TOO_LONG  
Сообщение слишком длинное.

CANNOT_MESSAGE_SELF  
Нельзя отправить сообщение самому себе.

---

# 10. Ошибки файлов

FILE_NOT_FOUND  
Файл не найден.

FILE_TOO_LARGE  
Файл слишком большой.

INVALID_FILE_TYPE  
Недопустимый тип файла.

FILE_UPLOAD_FAILED  
Ошибка загрузки файла.

---

# 11. Ошибки документов

DOCUMENT_NOT_FOUND  
Документ не найден.

DOCUMENT_ALREADY_VERIFIED  
Документ уже проверен.

DOCUMENT_REJECTED  
Документ отклонён.

DOCUMENT_INVALID_TYPE  
Некорректный тип документа.

---

# 12. Ошибки отзывов

REVIEW_NOT_FOUND  
Отзыв не найден.

REVIEW_ALREADY_EXISTS  
Отзыв уже существует.

REVIEW_CANNOT_BE_MODIFIED  
Отзыв нельзя изменить.

REVIEW_INVALID_RATING  
Некорректный рейтинг.

---

# 13. Ошибки админ панели

ADMIN_ACTION_FORBIDDEN  
Админ действие запрещено.

ADMIN_ENTITY_NOT_FOUND  
Админ сущность не найдена.

ADMIN_INVALID_OPERATION  
Некорректная админ операция.

ADMIN_PERMISSION_DENIED  
Недостаточно прав администратора.

---

# 14. Ошибки системы

SYSTEM_MAINTENANCE_MODE  
Система находится в режиме обслуживания.

FEATURE_DISABLED  
Функция отключена.

CONFIGURATION_ERROR  
Ошибка конфигурации системы.

---

# 15. Основной принцип ошибок

Backend должен:

- использовать error.code из этого списка
- не возвращать случайные ошибки
- не раскрывать внутренние детали системы

Frontend должен:

- ориентироваться на error.code
- отображать пользовательские сообщения на основе кода ошибки
