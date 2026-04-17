# Experiment 9 — Frontend Integration with RBAC (React + Session-Based UI)

> **Based on Experiment 7** — This experiment extends the Role-Based Authorization backend implemented earlier.

## 🎯 Objective

Build a React frontend for RBAC APIs with:
- **Bootstrap + Material UI** for premium UI design
- **Session-based authentication** using `sessionStorage`
- **Role-based UI restriction** (USER / ADMIN dashboards)
- **Secure API calls** with HTTP Basic Auth

---

## 🧩 Features Implemented

### 1. Login Page
- Accepts username & password
- Calls backend `POST /api/auth/login`
- Stores user, role & credentials in `sessionStorage`
- Redirects based on role:
  - `ROLE_USER` → User Dashboard (`/user`)
  - `ROLE_ADMIN` → Admin Dashboard (`/admin`)

### 2. Role-Based Dashboards

| Dashboard | Accessible Endpoints | Access Level |
|-----------|---------------------|-------------|
| **User Dashboard** | `/api/user/profile` | USER, ADMIN |
| **Admin Dashboard** | `/api/admin/dashboard`, `/api/user/profile` | ADMIN only |

### 3. Role-Based UI Control
- **USER** → cannot see admin button, restricted from admin routes
- **ADMIN** → sees all controls, full access to all endpoints
- Protected routes redirect unauthorized users to login

### 4. Logout
- Clears `sessionStorage` completely
- Redirects to login page

---

## 💻 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React | Frontend framework |
| Bootstrap | CSS framework |
| Material UI (MUI) | Component library |
| Axios | HTTP client for API calls |
| React Router | Client-side routing |
| Spring Boot (Exp 7) | Backend RBAC API |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- Experiment 7 backend running on `http://localhost:8080`

### Install & Run

```bash
# Navigate to frontend
cd exp_9/frontend

# Install dependencies
npm install axios bootstrap @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom

# Start development server
npm start
```

The app runs on `http://localhost:3000`

### Backend CORS Setup
Add the following to `SecurityConfig.java` in Experiment 7:

```java
.cors(cors -> cors.configurationSource(request -> {
    var config = new org.springframework.web.cors.CorsConfiguration();
    config.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
    config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(java.util.List.of("*"));
    config.setAllowCredentials(true);
    return config;
}))
```

---

## 📁 Project Structure

```
exp_9/
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js           # Login page with auth
    │   │   ├── UserDashboard.js   # User role dashboard
    │   │   └── AdminDashboard.js  # Admin role dashboard
    │   ├── App.js                 # Router + Theme setup
    │   ├── App.css                # Minimal styles
    │   ├── index.js               # Entry point
    │   └── index.css              # Global styles
    ├── package.json
    └── README.md
```

---

## 🔐 Role-Based Restriction Logic

```
┌─────────────────────────────────────────────────┐
│                   Login Page                     │
│          (username + password input)             │
└────────────────────┬────────────────────────────┘
                     │
          POST /api/auth/login
                     │
        ┌────────────┴────────────┐
        │                         │
   ROLE_USER                 ROLE_ADMIN
        │                         │
        ▼                         ▼
┌───────────────┐      ┌──────────────────┐
│ User Dashboard│      │ Admin Dashboard  │
│               │      │                  │
│ ✅ /user/profile     │ ✅ /admin/dashboard
│ ❌ /admin/dashboard  │ ✅ /user/profile │
└───────────────┘      └──────────────────┘
```

---

## 🧪 Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| `user1` | `user123` | ROLE_USER |
| `admin1` | `admin123` | ROLE_ADMIN |

---

## 📸 Required Screenshots

1. ✅ Login UI
2. ✅ USER accessing user endpoint
3. ✅ USER denied access to admin endpoint
4. ✅ ADMIN accessing admin endpoint
5. ✅ Session storage showing role
6. ✅ Unauthorized access handling

---

## 📘 Explanation

- **React frontend** integrates with the RBAC backend from Experiment 7
- **Role** is stored in `sessionStorage` after successful login via `/api/auth/login`
- **UI components** are dynamically rendered based on the user's role
- **Protected routes** enforce role verification before rendering dashboards
- **Secure API calls** use HTTP Basic Authentication headers
- **Access denied** scenarios show proper 403 error dialogs

---

## ✅ Summary

This experiment demonstrates a complete frontend implementation of role-based authorization using **React**, **Bootstrap**, and **Material UI**, integrated with the **Spring Boot RBAC backend** from Experiment 7. The application features session-based authentication, role-based routing, dynamic UI control, and proper error handling for unauthorized access.
