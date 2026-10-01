package com.pharmacy.auth.security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.enums.UserStatus;
import com.pharmacy.customer.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        // Public auth endpoints should bypass JWT claim parsing entirely.
        // Otherwise a stale Authorization header on /api/auth/send-otp or similar
        // routes can hit JwtService.extractUserPublicId() and explode with an
        // ExpiredJwtException before Spring reaches the permission rules.
        if (requestUri.startsWith("/api/auth/")) {
            System.out.println("Skipping JWT parsing for public auth URI: " + requestUri);
            filterChain.doFilter(request, response);
            return;
        }

        String authorization =
                request.getHeader(HttpHeaders.AUTHORIZATION);

        System.out.println("===== JWT FILTER =====");
        System.out.println("URI: " + request.getRequestURI());
        System.out.println(
                "Authorization present: " + (authorization != null)
        );

        /*
         * No Authorization header.
         */
        if (authorization == null
                || !authorization.startsWith("Bearer ")) {

            System.out.println("No Bearer token found.");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.substring(7);

        System.out.println("Bearer token received.");

        /*
         * Check whether the token is a valid access token.
         */
        boolean accessToken = false;
        try {
            accessToken = jwtService.isAccessToken(token);
        } catch (RuntimeException ex) {
            System.out.println("JWT access-token classification failed: " + ex.getMessage());
            accessToken = false;
        }

        System.out.println(
                "Is access token: " + accessToken
        );

        if (SecurityContextHolder.getContext().getAuthentication() == null
                && accessToken) {

            try {

                String tokenPublicId =
                        jwtService.extractUserPublicId(token);

                String role =
                        jwtService.extractRole(token);

                System.out.println(
                        "Token publicId: " + tokenPublicId
                );

                System.out.println(
                        "Token role: " + role
                );

                UUID publicId =
                        UUID.fromString(tokenPublicId);

                User user = userRepository
                        .findByPublicIdWithRole(publicId)
                        .orElse(null);

                System.out.println(
                        "User found: " + (user != null)
                );

                if (user != null) {

                    System.out.println(
                            "DB user ID: " + user.getId()
                    );

                    System.out.println(
                            "DB user role: "
                            + user.getRole().getName()
                    );

                    System.out.println(
                            "DB user status: "
                            + user.getStatus()
                    );
                }

                /*
                 * Verify:
                 *
                 * 1. User exists
                 * 2. Token role matches DB role
                 * 3. User is active
                 */
                if (user != null
                        && role != null
                        && role.equals(user.getRole().getName())
                        && user.getStatus() == UserStatus.ACTIVE) {

                    var authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            );

                    var authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    List.of(authority)
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);

                    System.out.println(
                            "JWT AUTHENTICATION SET"
                    );

                    System.out.println(
                            "Authority: ROLE_" + role
                    );

                } else {

                    System.out.println(
                            "JWT authentication rejected."
                    );
                }

            } catch (RuntimeException ex) {

                System.out.println(
                        "JWT authentication skipped due to parsing/validation error: "
                        + ex.getClass().getSimpleName()
                        + " - "
                        + ex.getMessage()
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(null);
            }
        } else {

            System.out.println(
                    "Access token validation failed."
            );
        }

        System.out.println(
                "Authentication before controller: "
                + SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );

        filterChain.doFilter(request, response);
    }
}