# Experiment 6: JWT Authentication with Spring Boot

## 🎯 Objective
Implement JWT (JSON Web Token) Authentication in a Spring Boot backend application to manage user sessions, secure API endpoints, and demonstrate token-based authentication using Postman.

---

## 📚 Technologies Used
| Technology       | Purpose                          |
|------------------|----------------------------------|
| Spring Boot 3.2  | Backend framework                |
| Spring Security  | Authentication & Authorization   |
| Spring Data JPA  | Database access layer            |
| H2 Database      | In-memory relational database    |
| jjwt 0.12.5      | JWT token generation & validation|
| BCrypt           | Password hashing                 |
| Maven            | Build tool & dependency management|

---

## 🧩 Project Structure
```
exp_6/
├── pom.xml                                          # Maven dependencies
├── README.md                                        # Project documentation  
├── screenshots/                                     # Postman testing screenshots
│   ├── 01-register-user.png
│   ├── 02-login-success.png
│   ├── 03-protected-route-access.png
│   ├── 04-logout-token-invalidation.png
│   └── 05-access-after-logout.png
└── src/
    └── main/
        ├── java/com/jwt/auth/
        │   ├── JwtAuthApplication.java              # Main application entry point
        │   ├── config/
        │   │   └── DataInitializer.java             # Pre-loads test users
        │   ├── controller/
        │   │   └── AuthController.java              # REST API endpoints
        │   ├── model/
        │   │   ├── User.java                        # User entity (JPA)
        │   │   ├── AuthRequest.java                 # Login request DTO
        │   │   ├── AuthResponse.java                # Auth response DTO
        │   │   └── RegisterRequest.java             # Registration request DTO
        │   ├── repository/
        │   │   └── UserRepository.java              # User database repository
        │   ├── security/
        │   │   ├── SecurityConfig.java              # Spring Security configuration
        │   │   ├── JwtUtil.java                     # JWT token utility class
        │   │   ├── JwtAuthFilter.java               # JWT authentication filter
        │   │   ├── CustomUserDetailsService.java    # Custom user details loader
        │   │   └── TokenBlacklistService.java       # Token blacklist for logout
        │   └── service/
        │       └── AuthService.java                 # Business logic for auth
        └── resources/
            └── application.properties               # App configuration
```

---

## 🔧 How JWT Authentication Works

### Flow Diagram
```
┌──────────┐    POST /login     ┌──────────────┐
│  Client  │ ─────────────────► │   Server     │
│ (Postman)│                    │ (Spring Boot)│
│          │ ◄───────────────── │              │
│          │   JWT Token        │              │
│          │                    │              │
│          │  GET /protected    │              │
│          │  Authorization:    │              │
│          │  Bearer <token>    │              │
│          │ ─────────────────► │              │
│          │                    │  Validate    │
│          │ ◄───────────────── │  JWT Token   │
│          │  Protected Data    │              │
└──────────┘                    └──────────────┘
```

### Step-by-Step Process:
1. **User Registration**: Client sends username & password → Server hashes password with BCrypt → Stores in H2 database
2. **User Login**: Client sends credentials → Server verifies → Generates JWT token → Returns token to client
3. **Access Protected Route**: Client sends request with `Authorization: Bearer <token>` header → Server validates JWT → Returns protected data
4. **Logout**: Client sends logout request with token → Server blacklists token → Token becomes invalid

---

## 🚀 How to Run

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Steps
```bash
# Navigate to project directory
cd exp_6

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The server will start on **http://localhost:5000**

### Pre-loaded Test Users
| Username  | Password    | Role  |
|-----------|-------------|-------|
| user123   | password123 | USER  |
| admin     | admin123    | ADMIN |

---

## 🧪 API Endpoints

| Method | Endpoint              | Description                  | Auth Required |
|--------|----------------------|------------------------------|---------------|
| POST   | `/api/auth/register` | Register a new user          | ❌ No          |
| POST   | `/api/auth/login`    | Login and get JWT token      | ❌ No          |
| POST   | `/api/auth/logout`   | Logout (invalidate token)    | ✅ Yes         |
| GET    | `/api/auth/protected`| Access protected resource    | ✅ Yes         |
| GET    | `/api/auth/profile`  | Get user profile             | ✅ Yes         |
| GET    | `/api/auth/admin`    | Admin-only resource          | ✅ Yes         |

---

## 📮 Postman Testing Guide

### 1. Register a New User (POST)
- **URL**: `http://localhost:5000/api/auth/register`
- **Method**: POST
- **Body** (raw JSON):
```json
{
    "username": "newuser",
    "password": "newpass123",
    "role": "USER"
}
```
- **Expected Response** (201 Created):
```json
{
    "token": null,
    "message": "User registered successfully!",
    "username": "newuser"
}
```

### 2. Login and Get JWT Token (POST)
- **URL**: `http://localhost:5000/api/auth/login`
- **Method**: POST
- **Body** (raw JSON):
```json
{
    "username": "user123",
    "password": "password123"
}
```
- **Expected Response** (200 OK):
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "message": "Login successful!",
    "username": "user123"
}
```

### 3. Access Protected Route (GET)
- **URL**: `http://localhost:5000/api/auth/protected`
- **Method**: GET
- **Headers**:
  - Key: `Authorization`
  - Value: `Bearer <your_jwt_token_here>`
- **Expected Response** (200 OK):
```json
{
    "message": "You have accessed a protected route!",
    "username": "user123",
    "authorities": "[ROLE_USER]",
    "timestamp": 1713168000000
}
```

### 4. Access Without Token (GET)
- **URL**: `http://localhost:5000/api/auth/protected`
- **Method**: GET
- **No Authorization header**
- **Expected Response**: 403 Forbidden

### 5. Logout / Token Invalidation (POST)
- **URL**: `http://localhost:5000/api/auth/logout`
- **Method**: POST
- **Headers**:
  - Key: `Authorization`
  - Value: `Bearer <your_jwt_token_here>`
- **Expected Response** (200 OK):
```json
{
    "token": null,
    "message": "Logout successful! Token has been invalidated.",
    "username": null
}
```

### 6. Access After Logout (GET)
- **URL**: `http://localhost:5000/api/auth/protected`
- **Method**: GET
- **Headers**: Same token as before logout
- **Expected Response**: 403 Forbidden (token is now blacklisted)

---

## 🔐 Security Implementation Details

### JWT Token Structure
A JWT token consists of three parts separated by dots:
```
Header.Payload.Signature
```

- **Header**: Contains the algorithm (HS256) and token type (JWT)
- **Payload**: Contains claims (username, role, expiration)
- **Signature**: Verifies the token hasn't been tampered with

### Key Security Features
1. **BCrypt Password Hashing**: Passwords are never stored in plain text
2. **Stateless Authentication**: No server-side sessions; JWT carries all auth info
3. **Token Expiration**: Tokens expire after 1 hour (configurable)
4. **Token Blacklisting**: Logout invalidates tokens immediately
5. **Spring Security Filter Chain**: Every request passes through JWT validation

### Configuration
- JWT Secret Key: Configured in `application.properties`
- Token Expiration: 3600000ms (1 hour)
- Password Encoding: BCrypt with default strength

---

## 📸 Screenshots
Screenshots demonstrating the JWT authentication flow are stored in the `screenshots/` folder:
1. **Register User** - New user registration via Postman
2. **Login Success** - JWT token received after login
3. **Protected Route** - Accessing secured endpoint with token
4. **Logout** - Token invalidation
5. **Access After Logout** - Denied access after token invalidation

---

## 📝 Key Learnings
- JWT provides a stateless authentication mechanism suitable for REST APIs
- Spring Security integrates seamlessly with custom JWT filters
- Token blacklisting is essential for proper logout implementation
- BCrypt ensures passwords are stored securely
- The Authorization header with Bearer scheme is the standard for token transmission
