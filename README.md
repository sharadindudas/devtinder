# 🚀 DevTinder – Connect with Developers Like Never Before!

## 🔥 Overview

DevTinder is a **developer networking platform** where tech enthusiasts can **connect, chat, and collaborate** based on mutual interest. Inspired by Tinder, it lets users **swipe left to ignore and right to connect**, with real-time chat powered by **Socket.io**.

🌐 **Live Demo**: [https://devtinder-remo.vercel.app](https://devtinder-remo.vercel.app)
📌 **GitHub Repository**: [DevTinder Repo](https://github.com/sharadindudas/devtinder)

## ✨ Features

- ✅ **JWT + httpOnly Cookie Authentication** – Secure signup, login and logout.
- ✅ **Swipeable Feed** – Browse developer profiles and swipe to connect (paginated).
- ✅ **Connection Requests** – Send interest, accept or reject incoming requests.
- ✅ **Real-time Chat** – Socket.io messaging (authenticated) with notification sounds.
- ✅ **Profile Management** – Edit your profile, skills and photo; change your password.
- ✅ **Hardened Backend** – Helmet, CORS, rate limiting, request validation and structured logging.

## 🛠 Tech Stack

**Frontend:** React 18, TypeScript, Vite, Zustand, React Router, React Hook Form + Yup, Axios, Tailwind CSS + DaisyUI, Socket.io Client, `react-tinder-card`, `react-hot-toast`

**Backend:** Node.js, Express 5, TypeScript, MongoDB + Mongoose, Socket.io, JWT, bcrypt, Yup, Helmet, `express-rate-limit`, Morgan + Winston

**Tooling:** Bun (package manager), ESLint, Prettier

## 📂 Project Structure

```bash
devtinder/
├── backend/                # Express + Socket.io API (TypeScript)
│   └── src/
│       ├── config/         # env + MongoDB connection
│       ├── controllers/    # auth, profile, user, request, chat
│       ├── middlewares/    # auth, error, rate limit, logging, 404
│       ├── models/         # User, ConnectionRequest, Chat, Message
│       ├── routes/         # /api/v1 route definitions
│       ├── utils/          # socket, handlers, logger
│       └── validations/    # Yup schemas
├── frontend/               # React + Vite SPA (TypeScript)
│   └── src/
│       ├── components/     # UI components
│       ├── hooks/          # data-fetching / action hooks
│       ├── pages/          # route pages
│       ├── store/          # Zustand global store
│       ├── schemas/        # Yup form schemas
│       └── utils/          # axios instance, helpers
└── README.md
```

## 📋 Prerequisites

- [**Bun**](https://bun.sh) (recommended – the repo ships a `bun.lock`) or Node.js 18+ with npm
- A **MongoDB** database (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

## 🏗️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/sharadindudas/devtinder.git
cd devtinder
```

### 2️⃣ Configure environment variables

Copy the sample files and fill in your values:

```bash
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env
```

**Backend (`backend/.env`)**

| Variable       | Description                                              | Example                     |
| -------------- | -------------------------------------------------------- | --------------------------- |
| `PORT`         | Port the API listens on                                  | `6565`                      |
| `NODE_ENV`     | `development` or `production` (controls cookie security) | `development`               |
| `SERVER_URL`   | Public URL of the API (used in logs)                     | `http://localhost:6565`     |
| `MONGODB_URL`  | MongoDB connection string (db name `devtinder`)          | `mongodb://localhost:27017` |
| `JWT_SECRET`   | Secret used to sign JWTs                                 | `a_long_random_secret`      |
| `FRONTEND_URL` | Allowed CORS origin (the frontend URL)                   | `http://localhost:5173`     |

**Frontend (`frontend/.env`)**

| Variable           | Description                                                              | Example                 |
| ------------------ | ------------------------------------------------------------------------ | ----------------------- |
| `VITE_BACKEND_URL` | Backend origin (REST calls append `/api/v1`; Socket.io uses it directly) | `http://localhost:6565` |

> In development (`NODE_ENV` unset or `development`) auth cookies use `SameSite=Lax` + non-secure so they work over `http://localhost`. In production they switch to `SameSite=None` + `Secure`.

### 3️⃣ Install dependencies & run

**Backend**

```bash
cd backend
bun install
bun run dev        # ts-node-dev with hot reload
```

**Frontend** (in a second terminal)

```bash
cd frontend
bun install
bun run dev        # Vite dev server on http://localhost:5173
```

> Using npm instead of Bun? `npm install && npm run dev` works too, but Bun is the committed lockfile.

## 📜 Available Scripts

**Backend**

| Script             | Description                       |
| ------------------ | --------------------------------- |
| `bun run dev`      | Start the API in watch mode       |
| `bun run build`    | Compile TypeScript to `dist/`     |
| `bun run start`    | Run the compiled server (`dist/`) |
| `bun run lint:fix` | Lint and auto-fix                 |
| `bun run format`   | Format with Prettier              |

**Frontend**

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `bun run dev`     | Start the Vite dev server           |
| `bun run build`   | Type-check and build for production |
| `bun run preview` | Preview the production build        |
| `bun run lint`    | Lint the project                    |
| `bun run format`  | Format with Prettier                |

## 📡 API Reference

Base URL: `/api/v1` — protected routes require the `devtinderToken` httpOnly cookie.

| Method | Endpoint                             | Auth | Description                              |
| ------ | ------------------------------------ | :--: | ---------------------------------------- |
| GET    | `/health`                            |  –   | Health check                             |
| POST   | `/auth/signup`                       |  –   | Register a new user                      |
| POST   | `/auth/login`                        |  –   | Log in (sets the auth cookie)            |
| POST   | `/auth/logout`                       |  –   | Log out (clears the cookie)              |
| GET    | `/profile/view`                      |  ✅  | Get the logged-in user's profile         |
| PATCH  | `/profile/edit`                      |  ✅  | Update profile details                   |
| PUT    | `/profile/password`                  |  ✅  | Change password                          |
| GET    | `/user/feed`                         |  ✅  | Paginated feed of users to swipe         |
| GET    | `/user/requests/received`            |  ✅  | Incoming connection requests             |
| GET    | `/user/connections`                  |  ✅  | Accepted connections                     |
| POST   | `/request/send/:status/:userId`      |  ✅  | Send request (`interested` / `ignored`)  |
| POST   | `/request/review/:status/:requestId` |  ✅  | Review request (`accepted` / `rejected`) |
| GET    | `/chat/:userId`                      |  ✅  | Paginated message history with a user    |

**Socket.io events** (handshake authenticated via the auth cookie):

| Event             | Direction       | Payload                   | Description                        |
| ----------------- | --------------- | ------------------------- | ---------------------------------- |
| `joinChat`        | client → server | `{ receiverId }`          | Join a chat room with a connection |
| `sendMessage`     | client → server | `{ message, receiverId }` | Send a message to a connection     |
| `messageReceived` | server → client | message object            | New message broadcast to the room  |
| `error`           | server → client | string                    | Auth / validation error            |

## 🧩 Data Models

- **User** – name, email (unique), password (hashed), age, gender, about, skills, photoUrl
- **ConnectionRequest** – `senderId`, `receiverId`, `status` (`interested` / `ignored` / `accepted` / `rejected`)
- **Chat** – `roomId` (unique), `participants`
- **Message** – `chatId` (indexed), `senderId`, `message` — stored in its own collection for scalable, paginated history

## 🧠 Upcoming Features (Planned)

- 🚧 **Online/Offline Status** – Show when a user is online or last seen.
- 💬 **Typing Indicator** – Show when the other user is typing.
- 📎 **File Attachments in Chat** – Send images, PDFs or code snippets.
- 🎯 **Personalized Recommendation Feed** – Rank the feed by relevance using skills, interests, experience, "looking for" and location instead of a plain listing.
- 🛡️ **Reporting & Blocking** – Report or block inappropriate behavior.
- 🔔 **Push Notifications** – Real-time alerts for messages and requests.
- 📱 **Mobile Responsiveness / PWA** – Installable, mobile-friendly experience.
- 💥 **Unit & Integration Tests** – Improve stability and reliability.

## 🤝 Contributing

Contributions are welcome! Fork the repository, create a feature branch, and open a pull request. Please run `bun run lint:fix` and `bun run format` before submitting.

## 📫 Contact

👨‍💻 **Author:** [Sharadindu Das](https://github.com/sharadindudas)
📧 **Email:** sharadindudas774@gmail.com
