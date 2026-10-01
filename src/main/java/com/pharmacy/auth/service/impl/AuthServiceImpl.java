package com.pharmacy.auth.service.impl;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.auth.dto.request.SendOtpRequest;
import com.pharmacy.auth.dto.request.VerifyOtpRequest;
import com.pharmacy.auth.dto.response.AuthResponse;
import com.pharmacy.auth.security.JwtService;
import com.pharmacy.auth.service.AuthService;
import com.pharmacy.common.dto.ApiResponse;
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
import com.pharmacy.otp.service.OtpService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final OtpService otpService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final JwtService jwtService;

    @Override
    public ApiResponse<Void> sendOtp(SendOtpRequest request) {

        String phoneNumber = request.getPhoneNumber().trim();

        log.info("Sending OTP to {}", phoneNumber);

        otpService.sendOtp(phoneNumber);

        return new ApiResponse<>(
                true,
                "OTP sent successfully",
                null
        );
    }

    @Override
    public ApiResponse<AuthResponse> verifyOtp(
            VerifyOtpRequest request) {

        String phoneNumber = request.getPhoneNumber().trim();
        String otp = request.getOtp().trim();

        log.info("Verifying OTP for {}", phoneNumber);

        boolean verified =
                otpService.verifyOtp(phoneNumber, otp);

        if (!verified) {
            throw new IllegalStateException("Invalid OTP");
        }

        User user = userRepository
                .findByPhoneNumber(phoneNumber)
                .orElse(null);

        boolean newUser = false;

        if (user == null) {

            log.info(
                    "Creating new customer for phone {}",
                    phoneNumber
            );

            Role customerRole =
                    roleRepository
                            .findByName(RoleType.CUSTOMER.name())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "CUSTOMER role is not configured."
                                    )
                            );

            user = User.builder()
                    .firstName("Customer")
                    .lastName(null)
                    .email(null)
                    .phoneNumber(phoneNumber)
                    .status(UserStatus.ACTIVE)
                    .role(customerRole)
                    .build();

            user = userRepository.save(user);

            UserCredential credential =
                    UserCredential.builder()
                            .user(user)
                            .loginType(LoginType.OTP)
                            .passwordHash(null)
                            .verified(true)
                            .lastLoginAt(OffsetDateTime.now())
                            .build();

            userCredentialRepository.save(credential);

            newUser = true;

        } else {

            log.info(
                    "Existing customer found for {}",
                    phoneNumber
            );

            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new IllegalStateException(
                        "Customer account is not active."
                );
            }

            if (!RoleType.CUSTOMER.name()
                    .equals(user.getRole().getName())) {

                throw new IllegalStateException(
                        "This account is not a customer account."
                );
            }

            UserCredential credential =
                    userCredentialRepository
                            .findByUserId(user.getId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Customer credentials were not found."
                                    )
                            );

            if (credential.getLoginType() != LoginType.OTP) {
                throw new IllegalStateException(
                        "This account does not use OTP authentication."
                );
            }

            credential.setVerified(true);
            credential.setLastLoginAt(
                    OffsetDateTime.now()
            );
        }

        AuthResponse response = responseFor(
                user,
                newUser
        );

        log.info(
                "Customer OTP authentication successful for {}",
                phoneNumber
        );

        return new ApiResponse<>(
                true,
                newUser
                        ? "Customer registered and logged in successfully."
                        : "Login successful.",
                response
        );
    }

  private AuthResponse responseFor(
        User user,
        boolean newUser) {

    return new AuthResponse(
            jwtService.generateAccessToken(user),
            jwtService.generateRefreshToken(user),
            "Bearer",
            user.getId(),
            user.getPublicId().toString(),
            user.getPhoneNumber(),
            buildFullName(user),
            user.getRole().getName(),
            newUser
    );

    }

    private String buildFullName(User user) {

        String firstName =
                user.getFirstName() == null
                        ? ""
                        : user.getFirstName().trim();

        String lastName =
                user.getLastName() == null
                        ? ""
                        : user.getLastName().trim();

        return (firstName + " " + lastName).trim();
    }
}