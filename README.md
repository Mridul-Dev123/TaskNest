# 🪺 TaskNest

A full-stack task management web application with user authentication, built using **React**, **Express**, **Prisma**, and **PostgreSQL**.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## ✨ Features

- **User Authentication** — Secure signup, login, and logout with Passport.js & bcrypt
- **Session Management** — Server-side sessions stored in PostgreSQL via `connect-pg-simple`
- **Task CRUD** — Create, read, update, and delete tasks
- **Status Tracking** — Mark tasks as `PENDING` or `COMPLETED` with filtering support
- **Protected Routes** — Only authenticated users can access their tasks
- **Responsive UI** — Clean, modern interface built with Tailwind CSS

---

## 🛠️ Tech Stack

### Backend (`Server/`)

| Technology | Purpose |
|---|---|
| **Express 5** | Web framework & REST API |
| **Prisma ORM** | Database modeling & queries |
| **PostgreSQL** | Relational database |
| **Passport.js** | Authentication (Local Strategy) |
| **bcrypt** | Password hashing |
| **express-session** | Session management |
| **connect-pg-simple** | PostgreSQL session store |

### Frontend (`Client/`)

| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Utility-first styling |

---

## 📁 Project Structure

```
TaskNest/
├── Client/                     # React frontend
│   ├── public/
│   │   └── _redirects           # Netlify SPA redirect rules
│   └── src/
│       ├── api/                 # API client & base URL config
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── TaskCard.jsx
│       │   ├── TaskForm.jsx
│       │   ├── TaskList.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ui/              # Generic UI primitives
│       ├── context/             # Auth context provider
│       ├── hooks/               # Custom React hooks
│       ├── pages/               # Page components
│       │   ├── LoginPage.jsx
│       │   ├── SignupPage.jsx
│       │   └── TasksPage.jsx
│       ├── routes/              # Route definitions
│       └── services/            # Business logic services
│
├── Server/                     # Express backend
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── src/
│       ├── controllers/         # Route handlers
│       │   ├── user.controllers.js
│       │   └── task.controllers.js
│       ├── database/            # Prisma client & queries
│       ├── middleware/          # Auth & passport middleware
│       ├── routes/              # API route definitions
│       └── utils/               # ApiError, ApiResponse, asyncHandler
│
└── package.json                # Root monorepo scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database (local or hosted, e.g. Railway)
- **npm** package manager

### 1. Clone the Repository

```bash
git clone https://github.com/Mridul-Dev123/TaskNest.git
cd TaskNest
```

### 2. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../Client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Server/` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tasknest"
SESSION_SECRET="your-strong-secret-key"
CLIENT_URL="http://localhost:5173"
PORT=5000
BCRYPT_SALT_ROUNDS=10
NODE_ENV="development"
```

Create a `.env` file in the `Client/` directory (optional for dev):

```env
VITE_API_URL="http://localhost:5000/api"
```

### 4. Set Up the Database

```bash
cd Server

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Run the Application

From the **root** directory:

```bash
npm run dev
```

This starts both the server (`http://localhost:5000`) and client (`http://localhost:5173`) concurrently.

Or run them individually:

```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run client
```

---

## 📡 API Reference

**Base URL:** `/api`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Login with credentials | No |
| `GET` | `/api/auth/me` | Get current user info | Yes |
| `GET` | `/api/auth/getUsers` | Get all users | Yes |
| `GET` | `/api/auth/logout` | Logout current user | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for current user | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `PUT` | `/api/tasks/:id` | Update a task | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

---

## 🗄️ Database Schema

```
┌──────────────┐       ┌──────────────────┐
│    User      │       │      Task        │
├──────────────┤       ├──────────────────┤
│ id       (PK)│──┐    │ id          (PK) │
│ username (UQ)│  │    │ title            │
│ password     │  │    │ description      │
│ name         │  └───▶│ userId      (FK) │
│ createdAt    │       │ status (enum)    │
│ updatedAt    │       │ createdAt        │
└──────────────┘       │ updatedAt        │
                       └──────────────────┘

Status Enum: PENDING | COMPLETED
```

---

## 🌐 Deployment

### Backend — [Railway](https://railway.app)

1. Connect your GitHub repo to Railway
2. Set the **root directory** to `Server`
3. Add these **environment variables**:
   - `DATABASE_URL` — Your PostgreSQL connection string
   - `SESSION_SECRET` — A strong secret key
   - `CLIENT_URL` — Your deployed Netlify frontend URL
   - `NODE_ENV` — `production`
   - `BCRYPT_SALT_ROUNDS` — `10`
4. Build command: `npx prisma generate && npx prisma migrate deploy`
5. Start command: `node index.js`

### Frontend — [Netlify](https://netlify.com)

1. Connect your GitHub repo to Netlify
2. Set the **base directory** to `Client`
3. Build command: `npm run build`
4. Publish directory: `Client/dist`
5. Add environment variable:
   - `VITE_API_URL` — Your deployed Railway backend URL (e.g. `https://your-app.up.railway.app/api`)

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
