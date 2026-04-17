package com.example.experiment7.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    /**
     * GET /api/admin/dashboard
     * Admin-only endpoint accessible to users with ROLE_ADMIN.
     *
     * Requires: HTTP Basic Auth with ADMIN credentials
     * Allowed Roles: ADMIN only
     *
     * Response (200):
     * {
     *   "message": "Welcome to the Admin Dashboard!",
     *   "username": "admin1",
     *   "authorities": "[ROLE_ADMIN]"
     * }
     *
     * Without Auth → 401 Unauthorized
     * With USER role → 403 Forbidden
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getAdminDashboard(Authentication authentication) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to the Admin Dashboard!");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities().toString());
        return ResponseEntity.ok(response);
    }
}
