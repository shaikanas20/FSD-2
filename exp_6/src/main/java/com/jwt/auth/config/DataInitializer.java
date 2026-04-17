package com.jwt.auth.config;

import com.jwt.auth.model.User;
import com.jwt.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data Initializer.
 * Pre-loads sample users into the database on application startup.
 * This ensures users are available for testing with Postman.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default users if they don't exist
        if (!userRepository.existsByUsername("user123")) {
            User user = new User();
            user.setUsername("user123");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setRole("USER");
            userRepository.save(user);
            System.out.println("✅ Default user created: user123 / password123");
        }

        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin / admin123");
        }

        System.out.println("=========================================");
        System.out.println("  JWT Auth Server running on port 5000");
        System.out.println("=========================================");
        System.out.println("  Test Credentials:");
        System.out.println("  User  -> user123 / password123");
        System.out.println("  Admin -> admin / admin123");
        System.out.println("=========================================");
    }
}
