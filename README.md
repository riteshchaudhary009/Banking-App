# Meridian Bank — Online Banking System (React + Tailwind + MongoDB)

A full rewrite of the original PHP/MySQL AdminLTE banking system as a modern
MERN-stack app: **React + Vite + Tailwind CSS** on the frontend, **Node.js +
Express + MongoDB (Mongoose)** on the backend, with JWT authentication.

Every feature from the original app is here:

- **Admin console** — client account management (create/edit/view history/delete),
  deposits, withdrawals, transfers, announcements (CRUD), staff user management,
  system branding settings.
- **Client portal** — balance overview, transfer funds to another account,
  transaction history, announcements, profile editing.
- Account-number lookups with live availability checks (used on deposit/
  withdraw/transfer forms), just like the original's AJAX checks.
- Auto-generated passwords for new accounts when none is supplied.

**Security improvement over the original:** passwords are hashed with
**bcrypt** instead of unsalted MD5, and all SQL string-concatenation (which in
the original was vulnerable to SQL injection) is gone — MongoDB/Mongoose
queries are parameterized by default.

---

## Project structure

```
banking-app/
├── server/              Express + MongoDB API
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/       User, Account, Transaction, Announcement, Setting
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/   auth (JWT), upload (multer)
│   │   ├── server.js
│   │   └── seed.js       seeds demo data
│   └── uploads/          uploaded avatars/logos (created automatically)
└── client/              React + Vite + Tailwind frontend
    └── src/
        ├── pages/admin/   Dashboard, Accounts, Transactions, Announcements, Users, Settings
        ├── pages/client/  Login, Dashboard, Transfer, Transactions, Announcements, Profile
        ├── components/
        ├── context/       AuthContext, SettingsContext
        └── api/axios.js
```

---

## Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - **Local**: install MongoDB Community Server and run `mongod`, or
  - **Atlas**: create a free cluster at https://www.mongodb.com/atlas and copy its connection string

## 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/banking_db   # or your Atlas URI
JWT_SECRET=some_long_random_string
CLIENT_URL=http://localhost:5173
```

Seed the database with demo data (an admin user + two client accounts, mirroring
the original app's sample data):

```bash
npm run seed
```

This prints the demo login credentials:

```
Admin login  -> username: admin           / password: admin123
Client login -> email: jsmith@sample.com  / password: client123
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API runs on `http://localhost:5000` (health check at `/api/health`).

## 2. Frontend setup

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Vite is pre-configured to proxy `/api` and
`/uploads` requests to the backend on port 5000 (see `client/vite.config.js`),
so no extra CORS setup is needed in development.

- Client login: `http://localhost:5173/login`
- Staff/admin login: `http://localhost:5173/admin/login`

## 3. Production build

```bash
cd client
npm run build       # outputs static files to client/dist
```

Serve `client/dist` with any static host (Nginx, Vercel, Netlify, or Express's
`express.static`), and point it at your deployed API. Update `CLIENT_URL` in
the server `.env` to your deployed frontend origin, and update the frontend's
API base URL if you're not using the Vite proxy in production (edit
`client/src/api/axios.js`).

---

## API overview

| Method | Endpoint                             | Access        | Purpose |
|--------|---------------------------------------|---------------|---------|
| POST   | /api/auth/admin/login                 | public        | Staff login |
| POST   | /api/auth/client/login                | public        | Client login |
| GET    | /api/auth/me                          | authenticated | Current profile |
| GET    | /api/accounts                         | admin         | List client accounts |
| POST   | /api/accounts                         | admin         | Create client account |
| PUT    | /api/accounts/:id                     | admin         | Update client account |
| PUT    | /api/accounts/me                      | client        | Update own profile |
| DELETE | /api/accounts/:id                     | admin         | Delete client account |
| GET    | /api/accounts/lookup/:accountNumber   | admin, client | Look up account by number |
| POST   | /api/accounts/check                   | admin, client | Check account number availability |
| POST   | /api/transactions/deposit             | admin         | Deposit into an account |
| POST   | /api/transactions/withdraw            | admin         | Withdraw from an account |
| POST   | /api/transactions/transfer            | admin, client | Transfer between accounts |
| GET    | /api/transactions/me                  | client        | Own transaction history |
| GET    | /api/transactions/account/:accountId  | admin         | An account's transaction history |
| GET    | /api/transactions                     | admin         | All transactions |
| GET    | /api/announcements                    | admin, client | List announcements |
| POST   | /api/announcements                    | admin         | Create announcement |
| PUT    | /api/announcements/:id                | admin         | Update announcement |
| DELETE | /api/announcements/:id                | admin         | Delete announcement |
| GET    | /api/users                            | admin         | List staff users |
| POST   | /api/users                            | admin         | Create staff user (multipart, supports avatar) |
| PUT    | /api/users/:id                        | admin         | Update staff user |
| DELETE | /api/users/:id                        | admin         | Delete staff user |
| GET    | /api/settings                         | public        | Site branding (name, logo, cover) |
| PUT    | /api/settings                         | admin         | Update branding (multipart, supports logo/cover) |

All protected routes expect `Authorization: Bearer <token>`, issued at login
and valid for 2 days.

---

## Notes on this rewrite

- MongoDB's `_id` (ObjectId) replaces MySQL's auto-increment `id` throughout.
- The original's `type` field on `transactions` (1/2/3 for deposit/withdraw/
  transfer) is preserved as-is on the `Transaction` model for continuity.
- The original PHP app's session-based auth is replaced with stateless JWTs,
  which is the standard approach for a decoupled React frontend.
- File uploads (staff avatars, system logo/cover) are handled with `multer`
  and served from `/uploads` — equivalent to the original's `uploads/` folder.
- I was unable to run a live end-to-end test in this environment because no
  MongoDB server was installable here (network access is restricted to
  package registries) — please run through the flows once locally
  (login → create account → deposit → transfer → view history) to confirm
  everything behaves as expected, and let me know if anything needs fixing.
