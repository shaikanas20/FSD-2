package com.jwt.auth.service;

import com.jwt.auth.model.*;
import com.jwt.auth.repository.UserRepository;
import com.jwt.auth.security.JwtUtil;
import com.jwt.auth.security.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Authentication Service.
 * Handles user registration, login, and logout business logic.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    /**
     * Register a new user.
     * @param request the registration request containing username, password, and role
     * @return AuthResponse with success message
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // Create new user with encoded password
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : "USER");

        userRepository.save(user);

        return new AuthResponse(null, "User registered successfully!", user.getUsername());
    }

    /**
     * Authenticate user and generate JWT token.
     * @param request the login request containing username and password
     * @return AuthResponse with JWT token
     */
    public AuthResponse login(AuthRequest request) {
        // Authenticate using Spring Security's AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Generate JWT token
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, "Login successful!", request.getUsername());
    }

    /**
     * Logout user by blacklisting their JWT token.
     * @param token the JWT token to invalidate
     * @return AuthResponse with logout message
     */
    public AuthResponse logout(String token) {
        tokenBlacklistService.blacklistToken(token);
        return new AuthResponse(null, "Logout successful! Token has been invalidated.", null);
    }
}
