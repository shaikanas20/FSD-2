package com.example.experiment7.controller;

import com.example.experiment7.dto.LoginRequest;
import com.example.experiment7.dto.LoginResponse;
import com.example.experiment7.service.AuthService;
import com.example.experiment7.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/login
     * Authenticate user with username and password.
     *
     * Request Body:
     * {
     *   "username": "user1",
     *   "password": "user123"
     * }
     *
     * Success Response (200):
     * {
     *   "message": "Login successful",
     *   "username": "user1",
     *   "role": "ROLE_USER"
     * }
     *
     * Failure Response (401):
     * {
     *   "message": "Invalid username or password"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = authService.authenticate(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            LoginResponse response = new LoginResponse(
                    "Login successful",
                    user.getUsername(),
                    user.getRole()
            );
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put("status", 401);
            errorBody.put("error", "Unauthorized");
            errorBody.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
        }
    }
}
