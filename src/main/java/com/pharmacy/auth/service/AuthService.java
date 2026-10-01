package com.pharmacy.auth.service;

import com.pharmacy.auth.dto.request.SendOtpRequest;
import com.pharmacy.auth.dto.request.VerifyOtpRequest;
import com.pharmacy.auth.dto.response.AuthResponse;
import com.pharmacy.common.dto.ApiResponse;

public interface AuthService {

   ApiResponse<Void> sendOtp(SendOtpRequest request);

    ApiResponse<AuthResponse> verifyOtp(VerifyOtpRequest request);

}
