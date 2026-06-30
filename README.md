# رَدیف | Radif

A full-stack web application for an automotive ECU engineering clinic. Covers online appointment booking, a gated technical wiki/dump archive, and an admin dashboard for managing bookings and content.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs |
| Fonts | Vazirmatn (self-hosted) |

---

## Project Structure

```
.
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers (auth, appointments, articles)
│   ├── middleware/       # JWT protect + admin guard
│   ├── models/          # Mongoose schemas (User, Appointment, Article)
│   ├── routes/          # Express routers
│   └── server.js        # Entry point
│
└── ecu-eng/             # Vite frontend
    └── src/
        ├── components/  # Navbar, Footer, Toast
        ├── context/     # AuthContext (JWT rehydration)
        ├── hooks/       # useReveal (IntersectionObserver)
        ├── pages/       # Home, Auth, Booking, Wiki, Dashboard, ...
        └── utils/       # Axios instance with auth interceptor
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/radif
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
```

### Frontend

```bash
cd ecu-eng
npm install
npm run dev
```

App runs at `http://localhost:5173`. Backend at `http://localhost:5000`.

---

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |
| POST | `/api/appointments` | Public |
| GET | `/api/appointments` | Admin |
| PATCH | `/api/appointments/:id/status` | Admin |
| GET | `/api/appointments/track/:code` | Public |
| GET | `/api/articles` | Public (soft auth) |
| POST | `/api/articles` | Admin |
| PATCH | `/api/articles/:id` | Admin |
| DELETE | `/api/articles/:id` | Admin |

---

## Auth Flow

- Registration and login return a signed JWT (30-day expiry).
- Token is stored in `localStorage` and attached via Axios request interceptor.
- On app mount, `AuthContext` rehydrates state via `GET /api/auth/me`.
- Admin routes are guarded by `protect` + `admin` middleware chain.

---

## Key Features

- **Online booking** — 3-step wizard (service → date/time → vehicle info) with server-generated `ECU-XXXX` tracking codes.
- **Technical wiki** — article and dump file archive. Download URLs are stripped from API responses for unauthenticated users.
- **Admin dashboard** — manage appointments (status cycling), publish/unpublish articles, upload dump files.
- **RTL layout** — full right-to-left support with Vazirmatn font.
