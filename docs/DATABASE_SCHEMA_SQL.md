# DATABASE_SCHEMA_SQL.md — Logist.kg

## 1. Main principle

The platform uses PostgreSQL as the main database.  
All core business entities are stored as relational tables.

---

## 2. Main tables

- users
- driver_profiles
- company_profiles
- vehicles
- freights
- bids
- conversations
- messages
- notifications
- reviews
- reports
- banners
- ads
- system_settings
- subscriptions
- payments
- audit_logs

---

## 3. users

Stores all platform users.

Fields:

- id (uuid, primary key)
- email (unique)
- password_hash
- role
- name
- phone
- phone_verified
- documents_verified
- status
- rating
- reviews_count
- created_at
- updated_at

Roles:

- driver
- shipper
- dispatcher
- admin

Status:

- active
- blocked
- pending

---

## 4. driver_profiles

Stores extended driver information.

Fields:

- id (uuid, primary key)
- user_id (foreign key -> users.id)
- passport_number
- passport_file_url
- tech_passport_file_url
- truck_type
- capacity
- notes
- created_at
- updated_at

Relationship:
- one driver profile belongs to one user

---

## 5. company_profiles

Stores company / shipper information.

Fields:

- id (uuid, primary key)
- user_id (foreign key -> users.id)
- company_name
- legal_address
- inn
- okpo
- passport_or_registration_data
- created_at
- updated_at

Relationship:
- one company profile belongs to one user

---

## 6. vehicles

Stores driver vehicles.

Fields:

- id (uuid, primary key)
- driver_user_id (foreign key -> users.id)
- plate_number
- trailer_number
- truck_type
- capacity
- dimensions
- tech_passport_url
- created_at
- updated_at

Relationship:
- one user can have many vehicles

---

## 7. freights

Stores load listings.

Fields:

- id (uuid, primary key)
- created_by_user_id (foreign key -> users.id)
- company_user_id (foreign key -> users.id)
- origin_city
- destination_city
- origin_country
- destination_country
- weight
- dimensions
- price
- currency
- loading_date
- description
- documents_required
- consolidation
- truck_type
- trucks_needed
- status
- views_count
- bids_count
- is_auction
- created_at
- updated_at

Status:

- active
- in_review
- blocked
- completed
- cancelled

---

## 8. bids

Stores driver bids on freights.

Fields:

- id (uuid, primary key)
- freight_id (foreign key -> freights.id)
- driver_user_id (foreign key -> users.id)
- company_user_id (foreign key -> users.id)
- price
- message
- status
- created_at
- updated_at

Status:

- pending
- accepted
- rejected
- cancelled

---

## 9. conversations

Stores chat dialogs.

Fields:

- id (uuid, primary key)
- freight_id (nullable, foreign key -> freights.id)
- type
- created_at
- updated_at

Types:

- support
- freight_chat
- auction_chat
- private

---

## 10. conversation_participants

Because PostgreSQL is relational, participants should be stored in a separate table.

Fields:

- id (uuid, primary key)
- conversation_id (foreign key -> conversations.id)
- user_id (foreign key -> users.id)
- joined_at

---

## 11. messages

Stores chat messages.

Fields:

- id (uuid, primary key)
- conversation_id (foreign key -> conversations.id)
- sender_user_id (foreign key -> users.id)
- message_text
- file_url
- created_at
- updated_at

---

## 12. notifications

Stores user notifications.

Fields:

- id (uuid, primary key)
- user_id (foreign key -> users.id)
- type
- title
- message
- is_read
- related_entity_type
- related_entity_id
- created_at

Types:

- new_bid
- bid_accepted
- bid_rejected
- new_message
- verification_success
- system

---

## 13. reviews

Stores ratings and reviews.

Fields:

- id (uuid, primary key)
- from_user_id (foreign key -> users.id)
- to_user_id (foreign key -> users.id)
- freight_id (foreign key -> freights.id)
- rating
- comment
- created_at

---

## 14. reports

Stores complaints and moderation reports.

Fields:

- id (uuid, primary key)
- created_by_user_id (foreign key -> users.id)
- target_entity_type
- target_entity_id
- report_type
- message
- status
- moderator_comment
- created_at
- updated_at

Status:

- new
- in_progress
- resolved
- rejected

---

## 15. banners

Stores homepage / platform banners.

Fields:

- id (uuid, primary key)
- title
- image_url
- link
- is_active
- sort_order
- created_at
- updated_at

---

## 16. ads

Stores paid advertisements.

Fields:

- id (uuid, primary key)
- title
- image_url
- link
- is_active
- starts_at
- ends_at
- created_at
- updated_at

---

## 17. system_settings

Stores global platform settings.

Fields:

- id (uuid, primary key)
- key (unique)
- value_json
- updated_by_user_id (foreign key -> users.id)
- updated_at

Recommended keys:

- site_theme
- primary_color
- font_family
- background_image
- social_links
- support_contacts
- homepage_content
- platform_limits

---

## 18. subscriptions

Stores subscription plans for users.

Fields:

- id (uuid, primary key)
- user_id (foreign key -> users.id)
- plan_name
- status
- started_at
- expires_at
- created_at
- updated_at

Status:

- active
- expired
- cancelled

---

## 19. payments

Stores payment history.

Fields:

- id (uuid, primary key)
- user_id (foreign key -> users.id)
- subscription_id (nullable, foreign key -> subscriptions.id)
- amount
- currency
- payment_method
- status
- external_payment_id
- created_at
- updated_at

Status:

- pending
- paid
- failed
- refunded

---

## 20. audit_logs

Stores critical platform activity.

Fields:

- id (uuid, primary key)
- user_id (nullable, foreign key -> users.id)
- action
- entity_type
- entity_id
- metadata_json
- created_at

Examples:
- create_freight
- update_freight
- delete_freight
- login
- block_user
- verify_documents
- update_settings

---

## 21. Recommended indexes

### users
- email unique
- role
- status

### freights
- origin_city, destination_city
- origin_country, destination_country
- status, created_at
- loading_date
- truck_type
- company_user_id

### bids
- freight_id, created_at
- driver_user_id, created_at
- company_user_id, created_at
- status

### messages
- conversation_id, created_at

### notifications
- user_id, created_at
- user_id, is_read

### reports
- status, created_at

---

## 22. Important rules

- no large arrays inside rows
- no file binaries inside database
- all files stored in MinIO / S3
- use UUID primary keys
- use foreign keys for relations
- use pagination in all list endpoints
- never rely on frontend for permissions

---

## 23. Migration note

Current Firebase collections should map to SQL tables as follows:

- users -> users
- drivers -> driver_profiles
- companies -> company_profiles
- vehicles -> vehicles
- freights -> freights
- bids -> bids
- conversations -> conversations
- messages -> messages
- notifications -> notifications
- reviews -> reviews
- reports -> reports
- banners -> banners
- ads -> ads
- system_settings -> system_settings
- subscriptions -> subscriptions
- payments -> payments
- audit_logs -> audit_logs
