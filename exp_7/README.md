# Experiment 7: Role-Based Authorization (RBAC) with Spring Boot

Objective

This project demonstrates Role-Based Access Control (RBAC) using Spring Boot and Spring Security. It implements authentication and authorization where API endpoints are protected based on user roles (`ROLE_USER` and `ROLE_ADMIN`).

Features

- ✅ User authentication using Spring Security with HTTP Basic Auth
- ✅ Role-based access control (`ROLE_USER`, `ROLE_ADMIN`)
- ✅ Protected APIs accessible only by assigned roles
- ✅ Custom JSON error responses for 401 Unauthorized and 403 Forbidden
- ✅ H2 in-memory database with JPA for user storage
- ✅ BCrypt password encoding
- ✅ Public, User-only, and Admin-only endpoints

Tech Stack

| Technology        | Purpose                      |
|-|---|
| Spring Boot 3.2.4 | Application framework        |
| Spring Security   | Authentication & Authorization|
| Spring Data JPA   | Database access layer        |
| H2 Database       | In-memory database           |
| Lombok            | Boilerplate reduction        |
| Maven             | Dependency management        |
| Java 17           | Runtime                      |

---

Project Structure

```
exp_7/
├── pom.xml
├── README.md
├── screenshots/
│   ├── 01-login-success.png
│   ├── 02-user-endpoint-success.png
│   ├── 03-admin-endpoint-success.png
│   └── 04-access-denied.png
└── src/
    ├── main/
    │   ├── java/com/example/experiment7/
    │   │   ├── Experiment7Application.java
    │   │   ├── config/
    │   │   │   ├── SecurityConfig.java
    │   │   │   └── DataInitializer.java
    │   │   ├── controller/
    │   │   │   ├── AuthController.java
    │   │   │   ├── PublicController.java
    │   │   │   ├── UserController.java
    │   │   │   └── AdminController.java
    │   │   ├── dto/
    │   │   │   ├── LoginRequest.java
    │   │   │   └── LoginResponse.java
    │   │   ├── entity/
    │   │   │   └── User.java
    │   │   ├── repository/
    │   │   │   └── UserRepository.java
    │   │   └── service/
    │   │       ├── AuthService.java
    │   │       └── CustomUserDetailsService.java
    │   └── resources/
    │       ├── application.properties
    │       └── data.sql
    └── test/
        └── java/com/example/experiment7/
            └── Experiment7ApplicationTests.java
```

---

Demo Users

| Username | Password  | Role        |
|----------|-----------|-------------|
| `user1`  | `user123` | `ROLE_USER` |
| `admin1` | `admin123`| `ROLE_ADMIN`|

Passwords are BCrypt-encoded and seeded automatically on startup via `DataInitializer.java`.

---

API Endpoints

Public Endpoints (No Auth Required)

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | `/api/public/hello` | Public welcome page  |
| POST   | `/api/auth/login`   | Authenticate user    |

Protected Endpoints

| Method | Endpoint              | Required Role    | Description            |
|--------|-----------------------|------------------|------------------------|
| GET    | `/api/user/profile`   | USER or ADMIN    | User profile info      |
| GET    | `/api/admin/dashboard`| ADMIN only       | Admin dashboard        |


Access Control Rules

| Scenario                              | HTTP Status       |
|---------------------------------------|-------------------|
| No authentication provided            | `401 Unauthorized`|
| Valid auth, insufficient role          | `403 Forbidden`   |
| Valid auth, correct role               | `200 OK`          |



How to Run

# Prerequisites
- Java 17+
- Maven 3.8+

# Steps

1. Clone the repository
   ```bash
   cd exp_7
   ```

2. Build the project
   ```bash
   mvn clean install
   ```

3. Run the application
   ```bash
   mvn spring-boot:run
   ```

4. The application starts on http://localhost:8080

5. Access H2 Console (optional): http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:rbacdb`
   - Username: `sa`
   - Password: *(leave empty)*

---

Postman Testing Guide

# Case 1: Access Public Endpoint (No Auth)
- Method: `GET`
- URL: `http://localhost:8080/api/public/hello`
- Auth: None
- Expected: `200 OK`
```json
{
  "message": "This is a public endpoint. No authentication required!"
}
```

# Case 2: Login with Valid Credentials
- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Body (JSON):
```json
{
  "username": "user1",
  "password": "user123"
}
```
- Expected: `200 OK`
```json
{
  "message": "Login successful",
  "username": "user1",
  "role": "ROLE_USER"
}
```

# Case 3: Login with Invalid Credentials
- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Body (JSON):
```json
{
  "username": "user1",
  "password": "wrongpassword"
}
```
- Expected: `401 Unauthorized`

# Case 4: USER Accessing User Endpoint 
- Method: `GET`
- URL: `http://localhost:8080/api/user/profile`
- Auth: Basic Auth → `user1` / `user123`
- Expected: `200 OK`
```json
{
  "message": "Welcome, authenticated user!",
  "username": "user1",
  "authorities": "[ROLE_USER]"
}
```

# Case 5: USER Accessing Admin Endpoint 
- Method: `GET`
- URL: `http://localhost:8080/api/admin/dashboard`
- Auth: Basic Auth → `user1` / `user123`
- Expected: `403 Forbidden`
```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "You do not have permission to access this resource",
  "path": "/api/admin/dashboard"
}
```

# Case 6: ADMIN Accessing Admin Endpoint 
- Method: `GET`
- URL: `http://localhost:8080/api/admin/dashboard`
- Auth: Basic Auth → `admin1` / `admin123`
- Expected: `200 OK`
```json
{
  "message": "Welcome to the Admin Dashboard!",
  "username": "admin1",
  "authorities": "[ROLE_ADMIN]"
}
```

# Case 7: No Auth → 401 Unauthorized
- Method: `GET`
- URL: `http://localhost:8080/api/user/profile`
- Auth: None
- Expected: `401 Unauthorized`
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication is required to access this resource",
  "path": "/api/user/profile"
}
```

---

 
Security Configuration Summary

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/public/").permitAll()
            .requestMatchers("/api/auth/").permitAll()
            .requestMatchers("/api/user/").hasAnyRole("USER", "ADMIN")
            .requestMatchers("/api/admin/").hasRole("ADMIN")
            .anyRequest().authenticated()
        )
        .httpBasic(Customizer.withDefaults());
    return http.build();
}
```

---
Key Concepts Learned

1. Authentication vs Authorization
   - Authentication: Verifying who the user is (login)
   - Authorization: Verifying what the user can access (roles)

2. 401 vs 403
   - `401 Unauthorized`: No valid credentials provided
   - `403 Forbidden`: Valid credentials but insufficient permissions

3. Spring Security Filter Chain
   - Intercepts all HTTP requests
   - Applies authentication and authorization rules
   - Returns appropriate error responses

4. BCrypt Password Encoding
   - Passwords are never stored in plain text
   - BCrypt generates salted hashes for secure storage

5. Role-Based Access Control (RBAC)
   - Users are assigned roles
   - Endpoints are protected by role requirements
   - Spring Security enforces access at the filter level

