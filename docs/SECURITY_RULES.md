# SECURITY_RULES.md — Logist.kg

Документ определяет правила безопасности платформы Logist.kg.

Эти правила обязательны для:

- backend
- frontend
- API
- работы с базой данных
- работы с файлами
- работы с авторизацией

Любое изменение системы должно учитывать эти правила.

---

# 1. Основной принцип безопасности

Backend является единственным источником принятия решений.

Frontend считается **небезопасной средой**.

Backend обязан:

- проверять данные
- проверять роли
- проверять ownership
- проверять статус пользователя

Никакие проверки безопасности не должны выполняться только на frontend.

---

# 2. Основные типы угроз

Платформа должна защищаться от:

```text
SQL Injection
XSS
CSRF
Brute force
DDoS
Unauthorized access
Privilege escalation
File upload attacks
Data leakage
3. Защита авторизации

Система использует:

JWT Access Token
JWT Refresh Token

Правила:

access token короткоживущий

refresh token можно отзывать

refresh token хранится безопасно

access token не хранится в localStorage при возможности

4. JWT правила

JWT должен содержать минимум данных:

{
  "sub": "user_id",
  "role": "driver"
}

JWT не должен содержать:

email
phone
sensitive data
5. Password безопасность

Пароли должны:

хэшироваться bcrypt
не храниться в plaintext
не возвращаться API

Рекомендуемый алгоритм:

bcrypt
cost factor ≥ 10
6. Rate limiting

Следующие endpoint'ы должны иметь ограничения:

/auth/login
/auth/register
/auth/refresh
/files/upload

Rate limit пример:

5 requests / minute
7. Validation

Backend обязан валидировать все входящие данные.

Используется:

class-validator
class-transformer

Каждый endpoint должен иметь DTO.

8. SQL Injection защита

Backend использует:

Prisma ORM

Это предотвращает SQL injection.

AI не должен писать raw SQL без необходимости.

9. XSS защита

Frontend должен:

экранировать пользовательский контент

не вставлять HTML напрямую

Backend должен:

проверять текстовые поля

не возвращать небезопасный HTML

10. CSRF защита

Если используются cookies:

httpOnly
secure
sameSite

API должен быть защищён.

11. Ownership защита

Backend обязан проверять владельца ресурса.

Примеры:

driver может редактировать только свой vehicle
shipper может редактировать только свой freight

Frontend не является источником истины.

12. Role-based access

Доступ контролируется ролями:

guest
driver
shipper
dispatcher
admin

Admin endpoints:

/admin/*
13. Защита файлов

Файлы должны:

проверяться по MIME type
проверяться по размеру
сканироваться на вредоносный код

Максимальный размер:

10MB
14. Хранение файлов

Файлы хранятся:

S3 / MinIO

В базе данных хранится только:

file metadata
15. Секреты

Секреты никогда не должны храниться:

в коде
в GitHub
в frontend

Они должны храниться в:

.env
secret manager
16. Admin безопасность

Admin endpoints должны:

требовать admin роль
логироваться
иметь audit log

Admin действия должны подтверждаться.

17. Audit logging

Следующие действия должны логироваться:

login
logout
admin actions
document verification
user blocking
settings change
18. Data protection

API не должен возвращать:

password_hash
internal tokens
private admin notes
19. Error handling

Backend не должен раскрывать внутренние ошибки.

Плохой пример:

SQL error
stack trace

Хороший пример:

Internal server error
20. CORS

Backend должен ограничивать CORS.

Разрешённые домены:

frontend domain
admin domain
21. Monitoring

Система должна отслеживать:

failed logins
suspicious activity
API abuse
22. Backup

База данных должна иметь:

регулярные backups
23. Основной принцип

Безопасность должна быть:

по умолчанию включена

Если решение:

упрощает безопасность

отключает проверки

доверяет frontend

оно считается неправильным.
