# Experiment 8: Frontend Integration with JWT APIs (Session-Based UI)

## 🧪 Based on Experiment 6
This experiment uses the backend APIs implemented in Experiment 6 (JWT Authentication with Spring Boot).

---

## 🎯 Objective
- Build a frontend UI that consumes JWT APIs
- Implement session-based authentication (token stored per session using `sessionStorage`)
- Restrict access to pages based on login state
- Demonstrate JWT token flow from login to protected data access

---

## 📚 Technologies Used
| Technology        | Purpose                              |
|-------------------|--------------------------------------|
| React 18          | Frontend Framework                   |
| React Router DOM  | Client-side routing                  |
| Bootstrap 5       | Layout & responsive grid             |
| Material UI       | Premium component styling            |
| Axios             | HTTP client for API calls            |
| CSS3              | Custom glassmorphism & animations    |

---

## 🧩 Features Implemented

### 1. Login Page
- User enters **Username** & **Password**
- Calls: `POST /api/auth/login`
- On success:
  - Stores JWT in `sessionStorage`
  - Redirects to dashboard
- Error handling for invalid credentials and server errors
- Demo credential quick-fill buttons
- Show/hide password toggle

### 2. Protected Dashboard Page
- Only accessible if JWT exists in `sessionStorage`
- Calls: `GET /api/auth/protected` and `GET /api/auth/profile`
- Adds token in header:
  ```
  Authorization: Bearer <token>
  ```
- **Tabs:**
  - **Overview** — Shows authentication status, token expiry, username, storage type
  - **Protected Route** — Fetch and display protected API data with response visualization
  - **Token Info** — Decoded JWT payload and color-coded raw token segments
  - **Session** — Session storage details and management

### 3. Logout Functionality
- Calls `POST /api/auth/logout` to invalidate token on server
- Clears session:
  ```javascript
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");
  ```
- Redirects to login page

---

## 🔐 Session-Based Restriction Logic
- If **token exists** in sessionStorage → allow dashboard access
- If **no token** → redirect to login page
- If **token expired** or **unauthorized response** → auto-redirect to login

---

## 📁 Project Structure
```
exp_8/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.js          # Login page component
│   │   ├── Login.css         # Login page styles
│   │   ├── Dashboard.js      # Dashboard page component
│   │   └── Dashboard.css     # Dashboard page styles
│   ├── App.js                # Router configuration
│   ├── App.css               # App-level styles
│   ├── index.js              # Entry point with Bootstrap import
│   └── index.css             # Global design system
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 16+ installed
- Backend (Experiment 6) running on `http://localhost:5000`

### Steps
```bash
# Navigate to project directory
cd exp_8

# Install dependencies (already installed)
npm install

# Start the development server
npm start
```

The React app will open on **http://localhost:3000**

### Dependencies Installed
```bash
npm install axios bootstrap @mui/material @emotion/react @emotion/styled react-router-dom
```

Bootstrap is imported in `index.js`:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

---

## 🚀 How to Test

### Step 1: Start the Backend
```bash
cd ../exp_6
mvn spring-boot:run
# Server starts on http://localhost:5000
```

### Step 2: Start the Frontend
```bash
cd ../exp_8
npm start
# React app opens on http://localhost:3000
```

### Step 3: Login
- Use demo credentials:
  - **USER**: `user123` / `password123`
  - **ADMIN**: `admin` / `admin123`
- Click "Sign In" → JWT token is stored in sessionStorage → Redirected to dashboard

### Step 4: Access Protected Data
- Click "Protected Route" in sidebar
- Click "Fetch Protected Data" button
- API response is displayed in a styled response card

### Step 5: View Token Details
- Click "Token Info" in sidebar
- See decoded JWT payload and color-coded raw token

### Step 6: Logout
- Click "Logout" button in sidebar
- Session is cleared → Redirected to login page
- Trying to access `/dashboard` directly will redirect to login

---

## 📸 Required Screenshots
1. **Login Page** — React UI with form fields
2. **Token in sessionStorage** — DevTools → Application → Session Storage
3. **Protected API Response** — Data visible on dashboard UI
4. **Unauthorized Access** — Redirect to login when no token
5. **Logout** — Session cleared, back at login page

---

## 🔧 API Endpoints Used (from Experiment 6)
| Method | Endpoint               | Description                 | Auth Required |
|--------|------------------------|-----------------------------|---------------|
| POST   | `/api/auth/login`      | Login and get JWT token     | ❌ No          |
| GET    | `/api/auth/protected`  | Access protected resource   | ✅ Yes         |
| GET    | `/api/auth/profile`    | Get user profile            | ✅ Yes         |
| POST   | `/api/auth/logout`     | Logout (invalidate token)   | ✅ Yes         |

---

## 🎨 UI Design Features
- **Glassmorphism** — Frosted glass cards with blur backdrop
- **Gradient backgrounds** — Animated floating orbs
- **Micro-animations** — Fade-in, slide, hover effects
- **Dark theme** — Premium dark color palette
- **Responsive** — Sidebar collapses on mobile
- **SVG icons** — Custom inline SVG icons throughout
- **Color-coded JWT** — Header, payload, signature in different colors

---

## 📘 Key Learnings
- React frontend connects to Spring Boot backend APIs using Axios
- JWT stored in `sessionStorage` persists only for the current browser tab/session
- Protected routes are accessed by including the token in the `Authorization` header
- Logout clears the session and invalidates the token on the server
- Session-based UI restriction prevents unauthorized access to protected pages
- Error handling covers network failures, expired tokens, and invalid credentials
