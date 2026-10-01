package com.pharmacy.auth.service.impl;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.auth.dto.request.AdminLoginRequest;
import com.pharmacy.auth.dto.request.AdminRegisterRequest;
import com.pharmacy.auth.dto.response.AdminResponse;
import com.pharmacy.auth.dto.response.AuthResponse;
import com.pharmacy.auth.security.JwtService;
import com.pharmacy.auth.service.AdminAuthService;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.customer.entity.Role;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.entity.UserCredential;
import com.pharmacy.customer.enums.LoginType;
import com.pharmacy.customer.enums.RoleType;
import com.pharmacy.customer.enums.UserStatus;
import com.pharmacy.customer.repository.RoleRepository;
import com.pharmacy.customer.repository.UserCredentialRepository;
import com.pharmacy.customer.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAuthServiceImp implements AdminAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AdminResponse register(AdminRegisterRequest request) {

        String email = request.email().trim().toLowerCase();
        String phoneNumber = request.phoneNumber().trim();

        // Check duplicate phone
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new DuplicateResourceException(
                    "Phone number is already registered."
            );
        }

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException(
                    "Email is already registered."
            );
        }

        // Find ADMIN role
        Role adminRole = roleRepository
                .findByName(RoleType.ADMIN.name())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "ADMIN role is not configured."
                        )
                );

        // Create user
        User user = User.builder()
                .firstName(request.firstName().trim())
                .lastName(
                        request.lastName() == null
                                ? null
                                : request.lastName().trim()
                )
                .email(email)
                .phoneNumber(phoneNumber)
                .status(UserStatus.ACTIVE)
                .role(adminRole)
                .build();

        user = userRepository.save(user);

        // Create password credential
        UserCredential credential = UserCredential.builder()
                .user(user)
                .loginType(LoginType.PASSWORD)
                .passwordHash(
                        passwordEncoder.encode(request.password())
                )
                .verified(true)
                .lastLoginAt(null)
                .build();

        userCredentialRepository.save(credential);

        return toAdminResponse(user);
    }

    @Override
    public AuthResponse login(AdminLoginRequest request) {

        String identifier = request.identifier().trim();

        User user;

        /*
         * If identifier contains @, treat it as email.
         * Otherwise treat it as phone number.
         */
        if (identifier.contains("@")) {

            user = userRepository
                    .findByEmail(identifier.toLowerCase())
                    .orElseThrow(() ->
                            new BadRequestException(
                                    "Invalid administrator credentials."
                            )
                    );

        } else {

            user = userRepository
                    .findByPhoneNumber(identifier)
                    .orElseThrow(() ->
                            new BadRequestException(
                                    "Invalid administrator credentials."
                            )
                    );
        }

        // Account must be active
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException(
                    "Administrator account is not active."
            );
        }

        // Account must have ADMIN role
        if (user.getRole() == null
                || !RoleType.ADMIN.name()
                        .equals(user.getRole().getName())) {

            throw new BadRequestException(
                    "This account is not an administrator."
            );
        }

        // Find credentials
        UserCredential credential =
                userCredentialRepository
                        .findByUserId(user.getId())
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Password credentials were not found."
                                )
                        );

        // Verify password credentials
        if (credential.getLoginType() != LoginType.PASSWORD) {
            throw new BadRequestException(
                    "This account does not use password authentication."
            );
        }

        if (!Boolean.TRUE.equals(credential.getVerified())) {
            throw new BadRequestException(
                    "Administrator credentials are not verified."
            );
        }

        // Verify password
        if (!passwordEncoder.matches(
                request.password(),
                credential.getPasswordHash())) {

            throw new BadRequestException(
                    "Invalid administrator credentials."
            );
        }

        // Update last login
        credential.setLastLoginAt(
                OffsetDateTime.now()
        );

        // Generate JWTs
        String accessToken =
                jwtService.generateAccessToken(user);

        String refreshToken =
                jwtService.generateRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                user.getId(),
                user.getPublicId().toString(),
                user.getPhoneNumber(),
                getFullName(user),
                user.getRole().getName(),
                false
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AdminResponse getProfile(UUID publicId) {

        User user = userRepository
                .findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Administrator not found."
                        )
                );

        if (user.getRole() == null
                || !RoleType.ADMIN.name()
                        .equals(user.getRole().getName())) {

            throw new BadRequestException(
                    "This account is not an administrator."
            );
        }

        return toAdminResponse(user);
    }

    private AdminResponse toAdminResponse(User user) {

        return new AdminResponse(
                user.getPublicId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().getName(),
                user.getStatus().name()
        );
    }

    private String getFullName(User user) {

        String firstName = user.getFirstName() == null
                ? ""
                : user.getFirstName().trim();

        String lastName = user.getLastName() == null
                ? ""
                : user.getLastName().trim();

        return (firstName + " " + lastName).trim();
    }
}