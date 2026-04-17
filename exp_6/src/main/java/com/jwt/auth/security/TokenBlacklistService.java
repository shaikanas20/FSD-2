package com.jwt.auth.security;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

/**
 * Service to manage blacklisted JWT tokens.
 * When a user logs out, their token is added to the blacklist
 * to prevent further use until it naturally expires.
 */
@Service
public class TokenBlacklistService {

    // In-memory set of blacklisted tokens
    // In production, use Redis or a database for persistence
    private final Set<String> blacklistedTokens = new HashSet<>();

    /**
     * Add a token to the blacklist (logout).
     * @param token the JWT token to blacklist
     */
    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    /**
     * Check if a token is blacklisted.
     * @param token the JWT token to check
     * @return true if the token is blacklisted
     */
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}
