package com.example.experiment7.config;

import com.example.experiment7.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * BCrypt password encoder bean for encoding/verifying passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager bean (useful for programmatic authentication).
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Security filter chain with role-based access control.
     *
     * Access Rules:
     * - /api/public/**  → accessible to everyone (no auth required)
     * - /api/user/**    → accessible to USER and ADMIN roles
     * - /api/admin/**   → accessible to ADMIN role only
     * - /api/auth/**    → accessible to everyone (login endpoint)
     * - /h2-console/**  → accessible to everyone (dev only)
     * - all other requests → require authentication
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for REST API usage
            .csrf(csrf -> csrf.disable())

            // Enable CORS for React frontend
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
                config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(java.util.List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))

            // Allow H2 console frames
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))

            // URL-based authorization rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )

            // Enable HTTP Basic Authentication (for Postman testing)
            .httpBasic(Customizer.withDefaults())

            // Return 401 JSON for unauthenticated requests
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType("application/json");
                    Map<String, Object> body = new HashMap<>();
                    body.put("status", 401);
                    body.put("error", "Unauthorized");
                    body.put("message", "Authentication is required to access this resource");
                    body.put("path", request.getRequestURI());
                    new ObjectMapper().writeValue(response.getOutputStream(), body);
                })
                // Return 403 JSON for forbidden requests
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType("application/json");
                    Map<String, Object> body = new HashMap<>();
                    body.put("status", 403);
                    body.put("error", "Forbidden");
                    body.put("message", "You do not have permission to access this resource");
                    body.put("path", request.getRequestURI());
                    new ObjectMapper().writeValue(response.getOutputStream(), body);
                })
            );

        return http.build();
    }
}
