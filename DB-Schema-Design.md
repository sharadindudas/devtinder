# 🧠 DevTinder – Database Schema Design

This document defines the **database architecture** for DevTinder — a real-time developer networking platform focused on intelligent matching and real-time communication.

---

## 🚀 Overview

The schema is designed with:

* ✅ **Normalized relational structure (PostgreSQL)**
* ✅ **Scalable messaging system**
* ✅ **Graph-based connection modeling**
* ✅ **Real-time readiness (Socket.io + Redis)**
* ✅ **Future extensibility (group chat, recommendations, analytics)**

---

## 🧑 Users

Stores core user information.

* `id` – Unique user identifier (UUID)
* `name` – Display name
* `email` – Unique login identifier
* `password` – Secure credential storage
* `bio` – User description
* `avatar` – Profile image
* `github` – External developer profile
* `experience_level` – beginner / intermediate / advanced
* `last_seen_at` – Last active timestamp (used for offline status)
* `created_at` – Record creation time
* `updated_at` – Last update time

---

## 🧠 Skills (Skill Tagging System)

### skills

* `id` – Unique skill identifier
* `name` – Skill name (e.g., React, Node.js)

### user_skills

* `user_id`
* `skill_id`

👉 Enables efficient **many-to-many mapping** for matching algorithms.

---

## 🎯 Interests

### interests

* `id`
* `name` (e.g., Open Source, Freelancing, Startups)

### user_interests

* `user_id`
* `interest_id`

👉 Helps improve **match relevance and personalization**

---

## 🔄 Swipes (Feed Control)

* `id`
* `user_id` – Who swiped
* `target_user_id` – Who was seen
* `action` – like / pass
* `created_at`

👉 Prevents duplicate recommendations and tracks user preferences

---

## ❤️ Connections (Graph Model)

* `id`
* `requester_id`
* `receiver_id`
* `status` – pending / accepted / rejected / blocked
* `created_at`

### ⚠️ Important Rule

Always store:

```
user1_id = LEAST(A, B)
user2_id = GREATEST(A, B)
```

👉 Ensures:

* No duplicate connections
* Clean graph representation

---

## 💬 Conversations

* `id`
* `created_at`

👉 Represents a **chat container**

---

## 👥 Conversation Participants

* `conversation_id`
* `user_id`
* `joined_at`

👉 Defines **who is part of a conversation**

---

## 💬 Messages

* `id`
* `conversation_id`
* `sender_id`
* `content`
* `created_at`
* `delivered_at`
* `seen_at`

### 🔥 Message Lifecycle

| State          | Meaning                  |
| -------------- | ------------------------ |
| `created_at`   | Message sent             |
| `delivered_at` | Message reached receiver |
| `seen_at`      | Message read by receiver |

---

## 🔔 Notifications

* `user_id`
* `type` – message / connection / match
* `reference_id`
* `is_read`
* `created_at`

👉 Powers:

* Notification system
* Unread indicators

---

## 🚫 Blocks (Safety System)

* `blocker_id`
* `blocked_id`
* `created_at`

👉 Prevents:

* Messaging
* Feed visibility

---

## ⚡ Indexing Strategy

* Swipes → fast feed filtering
* Connections → quick relationship lookup
* Messages → optimized chat queries
* Skills → efficient matching

---

## 🧠 Presence (Handled Outside DB)

Presence is **NOT stored in database**

Instead:

* 🟢 Redis → real-time online/offline
* ⚫ Database → `last_seen_at` fallback

---

## 🔥 Key Design Decisions

### 1. Conversation-Based Messaging

Messages are not stored as arrays.
They are normalized for:

* Pagination
* Scalability
* Real-time delivery

---

### 2. Graph-Based Connections

Connections use a canonical `(min, max)` ordering to:

* Avoid duplicates
* Simplify queries

---

### 3. Timezone Handling

All timestamps use:

```
TIMESTAMPTZ
```

👉 Ensures global consistency

---

## 🚀 Future Extensions

* Group chats
* Message attachments
* Smart matching algorithm
* Activity analytics
* Recommendation engine

---

## 🎯 Summary

This schema supports:

* ✅ Real-time messaging
* ✅ Intelligent matching
* ✅ Scalable architecture
* ✅ Production-ready backend design

---

> 💡 Designed with a focus on **clean architecture, scalability, and real-world system behavior**
