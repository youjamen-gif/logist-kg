# FIRESTORE_QUERIES.md — Logist.kg

Документ описывает **основные запросы Firestore**, которые используются платформой.  
Все запросы оптимизированы для минимальных расходов и быстрого поиска.

---

# 1. Получение списка грузов

Используется на странице **поиска грузов**.

1. Фильтр по маршруту:

```js
db.collection("freights")
  .where("originCity", "==", originCity)
  .where("destinationCity", "==", destinationCity)
  .orderBy("createdAt", "desc")
  .limit(30)
2. Фильтр по стране
db.collection("freights")
  .where("originCountry", "==", originCountry)
  .where("destinationCountry", "==", destinationCountry)
  .orderBy("createdAt", "desc")
  .limit(30)
3. Фильтр по дате загрузки
db.collection("freights")
  .where("loadingDate", ">=", selectedDate)
  .orderBy("loadingDate")
  .limit(30)
4. Фильтр по типу кузова
db.collection("freights")
  .where("truckType", "==", truckType)
  .limit(30)
5. Фильтр по весу
db.collection("freights")
  .where("weight", ">=", minWeight)
  .where("weight", "<=", maxWeight)
  .limit(30)
6. Получить детали груза
db.collection("freights")
  .doc(freightId)
  .get()
7. Получить отклики на груз
db.collection("bids")
  .where("freightId", "==", freightId)
  .orderBy("createdAt", "desc")
8. Получить отклики водителя
db.collection("bids")
  .where("driverId", "==", driverId)
  .orderBy("createdAt", "desc")
9. Получить транспорт водителя
db.collection("vehicles")
  .where("driverId", "==", driverId)
10. Получить профиль пользователя
db.collection("users")
  .doc(userId)
11. Получить отзывы пользователя
db.collection("reviews")
  .where("toUserId", "==", userId)
  .orderBy("createdAt", "desc")
12. Получить список чатов
db.collection("conversations")
  .where("participants", "array-contains", userId)
13. Получить сообщения чата
db.collection("messages")
  .where("conversationId", "==", conversationId)
  .orderBy("createdAt")
  .limit(50)
14. Получить уведомления пользователя
db.collection("notifications")
  .where("userId", "==", userId)
  .orderBy("createdAt", "desc")
  .limit(20)
15. Получить грузы компании
db.collection("freights")
  .where("companyId", "==", companyId)
  .orderBy("createdAt", "desc")
16. Получить активные грузы
db.collection("freights")
  .where("status", "==", "active")
  .orderBy("createdAt", "desc")
  .limit(30)
17. Пагинация
db.collection("freights")
  .orderBy("createdAt", "desc")
  .startAfter(lastVisible)
  .limit(30)
18. Увеличить просмотры груза
db.collection("freights")
  .doc(freightId)
  .update({
    views: firebase.firestore.FieldValue.increment(1)
  })
19. Создать отклик
db.collection("bids").add({
  freightId: freightId,
  driverId: driverId,
  price: price,
  createdAt: serverTimestamp()
})
20. Создать груз
db.collection("freights").add({
  originCity: originCity,
  destinationCity: destinationCity,
  weight: weight,
  price: price,
  loadingDate: loadingDate,
  createdAt: serverTimestamp()
})