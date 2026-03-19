# 🧠 DevTinder – Database Schema Design (MongoDB)

This document defines the database architecture for **DevTinder** — a real-time developer networking platform focused on intelligent matching and real-time communication.

---

## 🚀 Overview

The schema is designed with:

* ✅ Document-based structure (MongoDB)
* ✅ Optimized read performance (denormalized where needed)
* ✅ Scalable messaging system
* ✅ Flexible schema for future features
* ✅ Real-time readiness (Socket.io + Redis)

---

## 🧑 Users

Stores core user information.

```
id → Unique user identifier (ObjectId)
name → Display name
email → Unique login identifier
password → Secure credential storage (hashed)
bio → User description
avatar → Profile image
github → External developer profile

experience_level → beginner / intermediate / advanced

skills → array of strings (e.g., ["react", "node"])
interests → array of strings (e.g., ["open source", "startups"])

last_seen_at → Last active timestamp (fallback for offline status)
created_at → Record creation time
updated_at → Last update time
```

> 💡 Skills and interests are embedded for faster reads and simpler queries

---

## 🔄 Swipes (Feed Control)

```
id → Unique identifier
user_id → Who swiped
target_user_id → Who was seen
action → like / pass
created_at → Timestamp
```

**Constraint:**

* A user can swipe another user only once
* Enforced using a unique index on `(user_id, target_user_id)`

**Purpose:**

* Prevent duplicate recommendations
* Track user preferences

---

## ❤️ Connections (Relationship Model)

```
id → Unique identifier
users → array of two user ids
status → pending / accepted / rejected / blocked
created_at → Timestamp
```

**MongoDB Approach:**

* Store users in sorted order OR handle both combinations in queries

**Purpose:**

* Represents matches between users
* Acts like a graph relationship

---

## 💬 Conversations

```
id → Unique identifier
participants → array of user ids
created_at → Timestamp
```

> 💡 Supports future group chat by simply adding more participants

---

## 💬 Messages

```
id → Unique identifier
conversation_id → reference to conversation
sender_id → sender user id
content → message text

created_at → message sent time
delivered_at → delivery time
seen_at → read time
```

### 🔥 Message Lifecycle

| Field        | Meaning           |
| ------------ | ----------------- |
| created_at   | Message sent      |
| delivered_at | Message delivered |
| seen_at      | Message read      |

---

## 🔔 Notifications

```
id → Unique identifier
user_id → receiver
type → message / connection / match
reference_id → related entity id
is_read → boolean
created_at → timestamp
```

**Used for:**

* Notifications
* Unread indicators

---

## 🚫 Blocks (Safety System)

```
id → Unique identifier
blocker_id → user who blocks
blocked_id → user being blocked
created_at → timestamp
```

**Constraint:**

* Unique index on `(blocker_id, blocked_id)`

**Prevents:**

* Messaging
* Feed visibility

---

## ⚡ Indexing Strategy

**Users**

* `email` → unique
* `skills` → for matching
* `interests` → for matching

**Swipes**

* `(user_id, target_user_id)` → unique

**Connections**

* `users` → fast lookup

**Messages**

* `conversation_id` → efficient chat queries

---

## 🧠 Presence (Handled Outside DB)

Presence is **NOT stored in MongoDB**

Instead:

* 🟢 Redis → real-time online/offline status
* ⚫ MongoDB → `last_seen_at` fallback

---

## 🔥 Key Design Decisions

### 1. Document-Based Optimization

* Skills & interests are embedded
* Reduces joins
* Improves performance

### 2. Conversation-Based Messaging

* Messages stored as separate documents (NOT arrays)

**Benefits:**

* Pagination
* Scalability
* Real-time delivery

### 3. Flexible Schema Design

* Easy to extend
* Supports evolving features

### 4. Time Handling

* Stored as MongoDB Date (ISO format)

---

## 🚀 Future Extensions

* Group chats
* Message attachments
* Smart recommendation engine
* Activity analytics
* AI-based matching

---

## 🎯 Summary

This schema supports:

* ✅ Real-time messaging
* ✅ Intelligent matching
* ✅ Scalable architecture
* ✅ Flexible backend design

---

## 💡 Final Note

This MongoDB design prioritizes:

* Performance (fewer joins)
* Flexibility (schema evolution)
* Real-world scalability
