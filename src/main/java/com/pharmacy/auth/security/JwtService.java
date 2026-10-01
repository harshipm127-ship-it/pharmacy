package com.pharmacy.auth.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.pharmacy.customer.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey signingKey;

    private final long accessTokenExpirationMs;

    private final long refreshTokenExpirationMs;

    public JwtService(
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.access-token-expiration-ms}") long accessTokenExpirationMs,
            @Value("${jwt.refresh-token-expiration-ms}") long refreshTokenExpirationMs) {

        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);

        if (keyBytes.length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must decode to at least 32 bytes."
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(keyBytes);

        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    /**
     * Generates an access token for the user.
     */
    public String generateAccessToken(User user) {

        return generateToken(
                user,
                accessTokenExpirationMs,
                "access"
        );
    }

    /**
     * Generates a refresh token for the user.
     */
    public String generateRefreshToken(User user) {

        return generateToken(
                user,
                refreshTokenExpirationMs,
                "refresh"
        );
    }

    /**
     * Extracts the user's public UUID from the JWT subject.
     *
     * The JWT subject contains User.publicId.
     */
    public String extractUserPublicId(String token) {

        return claims(token).getSubject();
    }

    /**
     * Extracts the database user ID from the JWT.
     */
    public Long extractUserId(String token) {

        return claims(token).get("userId", Long.class);
    }

    /**
     * Extracts the user's role from the JWT.
     */
    public String extractRole(String token) {

        return claims(token).get("role", String.class);
    }

    /**
     * Validates the JWT signature and expiration.
     */
    public boolean isTokenValid(String token) {

        try {

            claims(token);

            return true;

        } catch (RuntimeException ex) {

            return false;
        }
    }

    /**
     * Checks whether the token is an access token.
     *
     * Access tokens are allowed to authenticate API requests.
     */
    public boolean isAccessToken(String token) {

        try {

            return isTokenValid(token)
                    && "access".equals(
                            claims(token).get("tokenType", String.class)
                    );

        } catch (RuntimeException ex) {

            return false;
        }
    }

    /**
     * Checks whether the token is a refresh token.
     *
     * Refresh tokens are only accepted by the refresh endpoint.
     */
    public boolean isRefreshToken(String token) {

        try {

            return isTokenValid(token)
                    && "refresh".equals(
                            claims(token).get("tokenType", String.class)
                    );

        } catch (RuntimeException ex) {

            return false;
        }
    }

    /**
     * Creates an access or refresh JWT.
     */
    private String generateToken(
            User user,
            long expirationMs,
            String tokenType) {

        Date now = new Date();

        return Jwts.builder()
                .subject(user.getPublicId().toString())
                .claim("role", user.getRole().getName())
                .claim("userId", user.getId())
                .claim("tokenType", tokenType)
                .issuedAt(now)
                .expiration(
                        new Date(now.getTime() + expirationMs)
                )
                .signWith(signingKey)
                .compact();
    }

    /**
     * Parses and validates the JWT.
     *
     * If the signature is invalid or the token is expired,
     * JJWT throws an exception.
     */
    private Claims claims(String token) {

        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}