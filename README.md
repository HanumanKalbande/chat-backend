# Chat Backend

A scalable, production-oriented real-time chat backend built with **Node.js, TypeScript (Strict Mode), PostgreSQL, Firebase, and Socket.IO**.

The application provides secure one-to-one messaging, real-time communication, message delivery and read receipts, push notifications, and persistent message storage.

## 🚀 Features

- **User Authentication:** Secure authentication using JWT and Firebase Authentication.
- **One-to-One Chat:** Private conversations between two users.
- **Real-Time Messaging:** Instant communication using Socket.IO.
- **Message Persistence:** Store users, conversations, and messages in PostgreSQL.
- **Firebase Integration:** Firebase Cloud Messaging (FCM) for push notifications.
- **Message Status:** Track sent, delivered, and read messages.
- **Read Receipts:** Update message read status.
- **Online Presence:** Track user online/offline status.
- **Typing Indicators:** Notify users when someone is typing.
- **REST APIs:** Structured and versioned RESTful endpoints.
- **Strict TypeScript:** Strong typing with strict compiler settings.
- **Database Management:** Prisma ORM with migrations.
- **Scalable Architecture:** Modular, maintainable, and extensible backend.
- **Docker Support:** Containerized application and PostgreSQL setup.
- **API Validation:** Request validation and centralized error handling.
- **Logging:** Structured application logging.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| TypeScript | Strictly typed development |
| Express.js | REST API framework |
| PostgreSQL | Primary relational database |
| Prisma ORM | Database access and migrations |
| Firebase Admin SDK | Firebase integration |
| Firebase Cloud Messaging | Push notifications |
| Socket.IO | Real-time communication |
| JWT | API authentication |
| Zod | Request validation |
| Docker | Containerization |
| Jest | Unit and integration testing |
| Swagger / OpenAPI | API documentation |

## 🏗️ Architecture

```text
                    Web Application
                           |
                    REST API / Socket.IO
                           |
                    Node.js + TypeScript
                           |
             +-------------+-------------+
             |             |             |
         Auth Module   Chat Module   Message Module
             |             |             |
             +-------------+-------------+
                           |
                      Prisma ORM
                           |
                       PostgreSQL
                           |
                  Notification Service
                           |
                    Firebase Admin SDK
                           |
                Firebase Cloud Messaging
                           |
                    Web Push Notifications
```

## 📁 Project Structure

```text
chat-backend/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── chats/
│   │   ├── messages/
│   │   └── notifications/
│   │
│   ├── middleware/
│   ├── services/
│   ├── sockets/
│   ├── firebase/
│   ├── utils/
│   ├── types/
│   ├── app.ts
│   └── server.ts
│
├── tests/
├── docker/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Prerequisites

Install the following tools before starting:

- Node.js 20+
- npm
- PostgreSQL 15+
- Docker and Docker Compose (optional)
- Firebase project
- Firebase service account credentials

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/HanumanKalbande/chat-backend.git

cd chat-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file using the example:

```bash
cp .env.example .env
```

Configure:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/chat_db"

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=1d

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"

CORS_ORIGIN=http://localhost:3000
```

Never commit `.env` or Firebase service account credentials.

### 4. Run database migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start development server

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

## 🐳 Docker Setup

Start the application and PostgreSQL using Docker Compose:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Stop containers:

```bash
docker compose down
```

## 🔌 API Endpoints

Base URL:

```text
/api/v1
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get authenticated user |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Get current user profile |
| GET | `/users/:userId` | Get user details |
| GET | `/users/search?q=` | Search users |

### Chats

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chats` | Create one-to-one chat |
| GET | `/chats` | Get user's chat list |
| GET | `/chats/:chatId` | Get chat details |
| DELETE | `/chats/:chatId` | Delete or archive chat |

### Messages

| Method | Endpoint | Description |
|---|---|---|
| POST | `/chats/:chatId/messages` | Send message |
| GET | `/chats/:chatId/messages` | Get chat messages |
| PATCH | `/chats/:chatId/messages/:messageId/read` | Mark message as read |
| DELETE | `/chats/:chatId/messages/:messageId` | Delete message |

## 🔄 Socket.IO Events

### Client to Server

| Event | Description |
|---|---|
| `chat:join` | Join chat room |
| `chat:leave` | Leave chat room |
| `message:send` | Send real-time message |
| `message:read` | Mark message as read |
| `typing:start` | Start typing indicator |
| `typing:stop` | Stop typing indicator |

### Server to Client

| Event | Description |
|---|---|
| `message:new` | Receive new message |
| `message:delivered` | Message delivery confirmation |
| `message:read` | Read receipt |
| `user:online` | User online status |
| `user:offline` | User offline status |
| `typing:update` | Typing status update |

## 🔔 Firebase Notifications

Firebase Cloud Messaging is used to send push notifications when a recipient is offline or not actively connected.

Notification workflow:

1. User sends a message.
2. Backend validates and persists the message in PostgreSQL.
3. Socket.IO delivers the message to connected recipients.
4. If the recipient is offline, Firebase Cloud Messaging sends a push notification.
5. Delivery and read status are updated through backend events.

PostgreSQL remains the source of truth for messages and chat history.

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run linting:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

## 🔐 Security

- JWT-based authentication and authorization.
- Strict request validation.
- Password hashing using bcrypt or Argon2.
- Secure Firebase Admin SDK configuration.
- Environment-based secret management.
- User-level chat and message access validation.
- Rate limiting and request throttling.
- CORS configuration.
- Protection against unauthorized message access.

## 📈 Scalability & Production Considerations

- Stateless Node.js API instances.
- PostgreSQL indexing and connection pooling.
- Redis adapter for Socket.IO horizontal scaling.
- Background jobs for push notifications.
- Pagination for chat history.
- Structured logging and monitoring.
- Graceful shutdown and health checks.
- Database backups and migration management.

## 🛣️ Future Enhancements

- Group chat functionality.
- Image and document sharing.
- Message reactions.
- Message editing.
- Voice and video calling.
- End-to-end encryption.
- Multi-device synchronization.

## 👨‍💻 Author

**Hanuman Kalbande**

GitHub: [HanumanKalbande](https://github.com/HanumanKalbande)
