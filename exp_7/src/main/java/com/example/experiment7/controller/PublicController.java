package com.example.experiment7.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    /**
     * GET /api/public/hello
     * Public endpoint accessible to everyone without authentication.
     *
     * Response (200):
     * {
     *   "message": "This is a public endpoint. No authentication required!"
     * }
     */
    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "This is a public endpoint. No authentication required!");
        return ResponseEntity.ok(response);
    }
}
