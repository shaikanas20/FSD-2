### 🎓 Experiment 10 — Student Management System (CRUD)

## Advanced CRUD Operations on MongoDB using Node.js + Express.js with  Dashboard UI 

# Objective

- Build  REST APIs  using Node.js and Express.js
- Connect backend with  MongoDB  database
- Perform  Create, Read, Update, Delete  operations
- Built-in  Premium Dashboard UI  — no Postman needed!
- Understand backend routing, controllers, middleware, and error handling

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
|  Node.js  | JavaScript runtime |
|  Express.js  | Web framework for REST APIs |
|  MongoDB  | NoSQL database |
|  Mongoose  | MongoDB ODM with validation |
|  Morgan  | HTTP request logger |
|  CORS  | Cross-Origin Resource Sharing |
|  dotenv  | Environment variable management |
|  express-validator  | Request validation middleware |

---

# Project Structure

```
exp_10/
├── server.js                    # Entry point — Express server
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
│
├── config/
│   ├── config.js                # Centralized configuration
│   └── db.js                    # MongoDB connection handler
│
├── models/
│   └── Student.js               # Mongoose schema & model
│
├── controllers/
│   └── studentController.js     # Business logic for CRUD
│
├── routes/
│   └── studentRoutes.js         # API route definitions
│
├── middleware/
│   └── errorHandler.js          # Global error handler
│
└── public/
    ├── index.html               # Frontend Dashboard UI
    ├── styles.css               # Premium dark theme CSS
    └── app.js                   # Frontend JavaScript logic
```

---

# Installation & Setup

  1. Prerequisites
- Node.js (v14+)
- MongoDB installed and running on `mongodb://127.0.0.1:27017`

  2. Install Dependencies
```bash
cd exp_10
npm install
```

  3. Start MongoDB
```bash
mongod
```

  4. Run the Server
```bash
npm run dev

```

  5. Open in Browser
```
http://localhost:5000
```

---

# API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | Get all students (with pagination, search, filter) |
| `GET` | `/api/students/:id` | Get single student by ID |
| `POST` | `/api/students` | Create new student |
| `PUT` | `/api/students/:id` | Update student by ID |
| `DELETE` | `/api/students/:id` | Delete student by ID |
| `GET` | `/api/students/stats/overview` | Get dashboard statistics |

  Query Parameters (GET /api/students)

| Parameter | Example | Description |
|-----------|---------|-------------|
| `page` | `?page=2` | Page number for pagination |
| `limit` | `?limit=5` | Records per page |
| `sort` | `?sort=-name` | Sort field (prefix `-` for descending) |
| `search` | `?search=rahul` | Search by name or email |
| `course` | `?course=BCA` | Filter by course |
| `status` | `?status=Active` | Filter by status |

---

# API Testing (Postman)

  Create Student
```
POST http://localhost:5000/api/students
Content-Type: application/json

{
  "studentId": "24bt1",
  "name": "shaik",
  "email": "shaik@gmail.com",
  "course": "B.tech",
  "phone": "9876543210",
  "enrollmentYear": 2024
}
```

  Get All Students
```
GET http://localhost:5000/api/students
```

  Get Single Student
```
GET http://localhost:5000/api/students/<student_id>
```

  Update Student
```
PUT http://localhost:5000/api/students/<student_id>
Content-Type: application/json

{
  "studentId": "STU001",
  "name": "shaik",
  "course": "B.tech",
  "status": "Active"
}
```

  Delete Student
```
DELETE http://localhost:5000/api/students/<student_id>
```

---

# Features Implemented

  Backend Features
-    CRUD Operations  — Create, Read, Update, Delete student records
-    Validation  — Schema-level validation with custom error messages
-    Pagination  — Server-side pagination for large datasets
-    Search  — Search by name or email (case-insensitive)
-    Filtering  — Filter by course and status
-    Sorting  — Sort by any field
-    Aggregation  — Dashboard statistics using MongoDB aggregation pipeline
-    Error Handling  — Global error handler middleware
-    HTTP Logging  — Request logging with Morgan
-    Environment Config  — Secure config with dotenv

  Frontend Features
-    Dashboard  — Real-time stats with animated counters
-    Bar Charts  — Course & status distribution visualization
-    Student Table  — Paginated table with actions
-    Add/Edit Form  — Form with client-side validation
-    View Details  — Modal popup with student info
-    Delete Confirmation  — Safe delete with confirmation modal
-    Search & Filter  — Live search with debounce
-    Toast Notifications  — Success/error feedback
-    Responsive Design  — Works on all screen sizes
-    Dark Theme  — Premium glassmorphism UI
-    Animations  — Smooth transitions and micro-interactions

---

# How It Works

1.  Node.js  runs the JavaScript server-side runtime
2.  Express.js  handles HTTP requests and routing
3.  Mongoose  connects to MongoDB and defines the data schema
4.  Controllers  contain the business logic for each operation
5.  Routes  map HTTP methods/URLs to controller functions
6.  Middleware  handles cross-cutting concerns (CORS, logging, errors)
7.  Frontend  communicates with the API using `fetch()` calls
8.  MongoDB  stores all student records in the `collegeDB` database

---

# Screenshots Required

1.   MongoDB Connected Message (terminal)
2.   Dashboard with Statistics
3.   Create Record (Add Student Form)
4.   Read All Records (Student Table)
5.   Update Record (Edit Form)
6.   Delete Record (Confirmation Modal)
7.   Database Collection View (MongoDB Compass)

---

