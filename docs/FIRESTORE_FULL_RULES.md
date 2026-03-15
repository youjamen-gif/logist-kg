rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // -----------------------
    // USERS — все пользователи
    // -----------------------
    match /users/{userId} {
      allow read: if request.auth != null; // все авторизованные видят профили
      allow create: if request.auth != null;
      allow update: if request.auth.uid == userId;
      allow delete: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // DRIVERS — профили водителей
    // -----------------------
    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == driverId;
      allow update: if request.auth.uid == driverId;
      allow delete: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // COMPANIES — профили компаний
    // -----------------------
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow create: if getRole(request.auth.uid) in ["shipper", "admin"];
      allow update: if getRole(request.auth.uid) in ["shipper", "admin"];
      allow delete: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // VEHICLES — машины водителей
    // -----------------------
    match /vehicles/{vehicleId} {
      allow read: if request.auth != null;
      allow create: if getRole(request.auth.uid) == "driver";
      allow update: if resource.data.driverId == request.auth.uid;
      allow delete: if resource.data.driverId == request.auth.uid || getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // FREIGHTS — грузы
    // -----------------------
    match /freights/{freightId} {
      allow read: if true; // все видят
      allow create: if getRole(request.auth.uid) in ["shipper", "dispatcher", "admin"];
      allow update: if resource.data.companyId == request.auth.uid || getRole(request.auth.uid) == "admin";
      allow delete: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // BIDS — отклики водителей
    // -----------------------
    match /bids/{bidId} {
      allow read: if request.auth != null;
      allow create: if getRole(request.auth.uid) == "driver";
      allow update: if resource.data.driverId == request.auth.uid || getRole(request.auth.uid) == "admin";
      allow delete: if resource.data.driverId == request.auth.uid || getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // REVIEWS — отзывы
    // -----------------------
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if false;
      allow delete: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // CONVERSATIONS & MESSAGES — чат
    // -----------------------
    match /conversations/{conversationId} {
      allow read: if isParticipant(conversationId);
      allow create: if request.auth != null;
    }

    match /messages/{messageId} {
      allow read: if isParticipant(resource.data.conversationId);
      allow create: if request.auth != null;
    }

    // -----------------------
    // NOTIFICATIONS
    // -----------------------
    match /notifications/{id} {
      allow read: if resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if resource.data.userId == request.auth.uid;
    }

    // -----------------------
    // SUBSCRIPTIONS
    // -----------------------
    match /subscriptions/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }

    // -----------------------
    // REPORTS — жалобы
    // -----------------------
    match /reports/{id} {
      allow read: if getRole(request.auth.uid) == "admin";
      allow create: if request.auth != null;
      allow update: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // BANNERS & ADS — публичные
    // -----------------------
    match /banners/{id} {
      allow read: if true;
      allow create, update, delete: if getRole(request.auth.uid) == "admin";
    }

    match /ads/{id} {
      allow read: if true;
      allow create, update, delete: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // SYSTEM SETTINGS
    // -----------------------
    match /system_settings/{id} {
      allow read: if true;
      allow write: if getRole(request.auth.uid) == "admin";
    }

    // -----------------------
    // FUNCTIONS
    // -----------------------
    function getRole(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role;
    }

    function isParticipant(conversationId) {
      return request.auth != null &&
        request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
    }

  }
}