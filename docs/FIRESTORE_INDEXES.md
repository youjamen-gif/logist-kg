
# FIRESTORE_INDEXES.md — Logist.kg

## Purpose
These indexes optimize search queries and reduce read costs in Firestore.

---

## 1. Route Search Index

Collection: freights

Fields:
- originCity (ASC)
- destinationCity (ASC)

Purpose:
Fast search by route.

---

## 2. Country Route Index

Collection: freights

Fields:
- originCountry (ASC)
- destinationCountry (ASC)

Purpose:
International freight filtering.

---

## 3. Loading Date Index

Collection: freights

Fields:
- loadingDate (ASC)
- createdAt (DESC)

Purpose:
Sort loads by loading date and freshness.

---

## 4. Weight + Truck Type

Collection: freights

Fields:
- weight (ASC)
- truckType (ASC)

Purpose:
Filter loads by weight and truck type.

---

## 5. Freight Status

Collection: freights

Fields:
- status (ASC)
- createdAt (DESC)

Purpose:
Quick retrieval of active loads.

---

## 6. Bids by Freight

Collection: bids

Fields:
- freightId (ASC)
- createdAt (DESC)

Purpose:
Quickly fetch all bids for a load.

---

## 7. Driver Bids

Collection: bids

Fields:
- driverId (ASC)
- createdAt (DESC)

Purpose:
Show driver's bid history.

---

## 8. Reviews by User

Collection: reviews

Fields:
- toUserId (ASC)
- createdAt (DESC)

Purpose:
Show user rating history.

---

## 9. Messages in Chat

Collection: messages

Fields:
- conversationId (ASC)
- createdAt (ASC)

Purpose:
Load messages in order.

---

## Best Practices

- Avoid indexing large text fields like description.
- Only create indexes that are used in queries.
- Always use pagination with limit().
- Monitor query costs in Firebase console.
