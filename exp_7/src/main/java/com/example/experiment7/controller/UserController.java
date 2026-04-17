package com.example.experiment7.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    /**
     * GET /api/user/profile
     * User endpoint accessible to authenticated users with ROLE_USER or ROLE_ADMIN.
     *
     * Requires: HTTP Basic Auth with valid credentials
     * Allowed Roles: USER, ADMIN
     *
     * Response (200):
     * {
     *   "message": "Welcome, authenticated user!",
     *   "username": "user1",
     *   "authorities": "[ROLE_USER]"
     * }
     *
     * Without Auth → 401 Unauthorized
     * With wrong role → 403 Forbidden (not applicable here since both roles allowed)
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getUserProfile(Authentication authentication) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome, authenticated user!");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities().toString());
        return ResponseEntity.ok(response);
    }
}
