package com.pharmacy.auth.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.auth.dto.request.AdminLoginRequest;
import com.pharmacy.auth.dto.request.AdminRegisterRequest;
import com.pharmacy.auth.dto.response.AdminResponse;
import com.pharmacy.auth.dto.response.AuthResponse;
import com.pharmacy.auth.service.AdminAuthService;
import com.pharmacy.common.dto.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService; 


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AdminResponse>> register(
        @Valid @RequestBody AdminRegisterRequest request
    ){
        return ResponseEntity.status(HttpStatus.CREATED)
        .body(new ApiResponse<>( true, "Admin registered Successfully", 
            adminAuthService.register(request)
        ) );

    }
   @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AdminLoginRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Login successful.",
                        adminAuthService.login(request)
                )
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AdminResponse>> getProfile(
            @RequestParam UUID publicId) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Admin profile fetched successfully.",
                        adminAuthService.getProfile(publicId)
                )
        );
    }
}
