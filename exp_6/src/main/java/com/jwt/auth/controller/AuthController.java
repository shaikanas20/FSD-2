package com.jwt.auth.controller;

import com.jwt.auth.model.*;
import com.jwt.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller.
 * Handles HTTP requests for user registration, login, logout,
 * and access to protected resources.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new user account.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * POST /api/auth/login
     * Authenticate user and return JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    /**
     * POST /api/auth/logout
     * Invalidate the JWT token (logout).
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            AuthResponse response = authService.logout(token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Logout failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * GET /api/auth/protected
     * A protected endpoint that requires a valid JWT token.
     * Returns the authenticated user's details.
     */
    @GetMapping("/protected")
    public ResponseEntity<?> protectedRoute() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "You have accessed a protected route!");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities().toString());
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/auth/profile
     * A protected endpoint that returns user profile information.
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("username", authentication.getName());
        response.put("role", authentication.getAuthorities().toString());
        response.put("message", "Profile fetched successfully");
        response.put("isAuthenticated", authentication.isAuthenticated());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/auth/admin
     * An admin-only protected endpoint.
     */
    @GetMapping("/admin")
    public ResponseEntity<?> adminRoute() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome Admin! You have access to admin resources.");
        response.put("username", authentication.getName());
        response.put("role", authentication.getAuthorities().toString());

        return ResponseEntity.ok(response);
    }
}
