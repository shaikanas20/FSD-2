package com.example.experiment7.config;

import com.example.experiment7.entity.User;
import com.example.experiment7.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    /**
     * Initialize demo users on application startup.
     * This replaces the data.sql approach to ensure passwords are
     * properly BCrypt-encoded at runtime.
     *
     * Demo Users:
     * ┌───────────┬───────────┬────────────┐
     * │ Username  │ Password  │ Role       │
     * ├───────────┼───────────┼────────────┤
     * │ user1     │ user123   │ ROLE_USER  │
     * │ admin1    │ admin123  │ ROLE_ADMIN │
     * └───────────┴───────────┴────────────┘
     */
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // Only seed if database is empty
            if (userRepository.count() == 0) {
                User user = new User(
                        "user1",
                        passwordEncoder.encode("user123"),
                        "ROLE_USER"
                );
                userRepository.save(user);

                User admin = new User(
                        "admin1",
                        passwordEncoder.encode("admin123"),
                        "ROLE_ADMIN"
                );
                userRepository.save(admin);

                System.out.println("=== Demo Users Created ===");
                System.out.println("user1  / user123  → ROLE_USER");
                System.out.println("admin1 / admin123 → ROLE_ADMIN");
                System.out.println("==========================");
            }
        };
    }
}
