# 🏠 RentApp

A full-stack rent management web application for landlords to manage properties, tenants, and payments — built with React + Firebase on the frontend and Node.js + MongoDB on the backend.

---

## 🚀 Live Demo

- **Frontend:** https://rent-app-ecru-nine.vercel.app

---

## 📁 Project Structure

```
RentApp/
├── backend/                        # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── firebase.js         # Firebase Admin SDK setup
│   │   ├── controllers/
│   │   │   ├── property.controller.js
│   │   │   ├── tenant.controller.js
│   │   │   └── payment.controller.js
│   │   ├── middleware/
│   │   │   └── auth.js             # Firebase token verification
│   │   ├── models/
│   │   │   ├── Property.js
│   │   │   ├── Tenant.js
│   │   │   └── Payment.js
│   │   ├── routes/
│   │   │   ├── property.routes.js
│   │   │   ├── tenant.routes.js
│   │   │   └── payment.routes.js
│   │   └── app.js                  # Express app config
│   ├── server.js                   # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                       # React + Vite app
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Payments.jsx
    │   │   ├── Properties.jsx
    │   │   ├── Signup.jsx
    │   │   └── Tenants.jsx
    │   ├── routes/
    │   ├── api.jsx                 # Axios instance
    │   ├── firebase.jsx            # Firebase client config
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Axios |
| Auth | Firebase Authentication |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Admin SDK | Firebase Admin |
| Deployment (FE) | Vercel |

---

## 🔧 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Firebase project (with Authentication enabled)

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/RentApp.git
cd RentApp
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_DATABASE_URL=your_database_url
```

Start the backend:

```bash
npm start          # production
npm run dev        # development (nodemon)
```

Backend runs on `http://localhost:4000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default: 4000) |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase private key |
| `FIREBASE_DATABASE_URL` | Firebase database URL |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |

---

## 📡 API Endpoints

All endpoints require a Firebase Bearer token in the `Authorization` header.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/me` | Get current logged-in user |

### Properties
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/properties` | Create a new property |
| GET | `/api/properties` | Get all properties for user |

### Tenants
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tenants` | Add a new tenant |
| GET | `/api/tenants` | Get all tenants for user |
| DELETE | `/api/tenants/:id` | Delete a tenant |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments` | Record a payment |
| GET | `/api/payments` | Get all payments for user |
| GET | `/api/payments/:tenantId` | Get payments for a specific tenant |

---

## 🚢 Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com`
4. Deploy

### Backend → Railway / Render
1. Push `backend/` to GitHub
2. Create a new project on Railway or Render
3. Set all environment variables from `.env.example`
4. Set start command: `npm start`
5. Deploy

---

## 🛡️ Security

- All API routes are protected with Firebase ID token verification
- Each user can only access their own properties, tenants, and payments (`userId` scoped queries)
- `.env` files are gitignored — never committed to the repo

---

## ✅ Current Features

- 🔐 Firebase Authentication (Email/Password + Google Sign-in)
- 🏠 Add and view rental properties with type, address, and rent amount
- 👤 Add tenants and link them to specific properties
- 💰 Record rent payments per tenant with date tracking
- 📊 Dashboard overview of properties, tenants, and payments
- 🔒 User-scoped data — every landlord sees only their own data
- 🌐 CORS-protected REST API with Bearer token auth on every route
- ⚡ Fast frontend with Vite + React 18

---

## 🔮 Future Improvements

### 🏗️ Short Term
- [ ] Edit and update property details (name, rent, address)
- [ ] Edit tenant info (contact, rent due date)
- [ ] Delete properties (with cascade delete of linked tenants/payments)
- [ ] Rent due date reminders / overdue indicators on dashboard
- [ ] Payment status badge — Paid / Unpaid / Overdue per tenant

### 📈 Mid Term
- [ ] Monthly rent analytics chart (revenue over time)
- [ ] Export payments as PDF or Excel report
- [ ] Search and filter tenants/properties
- [ ] Pagination for large tenant/payment lists
- [ ] Email notifications to tenants when rent is due

### 🚀 Long Term
- [ ] Multi-role support — Landlord and Tenant login portals
- [ ] Tenant can view their own payment history after login
- [ ] Online rent payment integration (Razorpay / Stripe)
- [ ] Mobile app (React Native) using the same backend API
- [ ] Admin dashboard for managing multiple landlords (SaaS model)
- [ ] Automated monthly payment reminders via SMS (Twilio)
- [ ] Maintenance request system — tenants can raise issues


## 👨‍💻 Author

**Nitin Jaiswal**  
Student at KIET  
[GitHub](https://github.com/nitinjaiswal02) • [LinkedIn](https://linkedin.com/in/nitin-jaiswal-219545328)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
