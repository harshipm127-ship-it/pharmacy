package com.pharmacy.auth.service;

import java.util.UUID;

import com.pharmacy.auth.dto.request.AdminLoginRequest;
import com.pharmacy.auth.dto.request.AdminRegisterRequest;
import com.pharmacy.auth.dto.response.AdminResponse;
import com.pharmacy.auth.dto.response.AuthResponse;

public interface AdminAuthService {

    AdminResponse register(AdminRegisterRequest request);

    AuthResponse login(AdminLoginRequest request);

    AdminResponse getProfile(UUID publicId);
}