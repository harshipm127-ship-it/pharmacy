package com.pharmacy.customer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.dto.request.CompleteCustomerProfileRequest;
import com.pharmacy.customer.dto.response.CustomerProfileResponse;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.service.CustomerProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer/profile")
@RequiredArgsConstructor
public class CustomerProfileController {

    private final CustomerProfileService customerProfileService;

    @PutMapping
    public ResponseEntity<ApiResponse<CustomerProfileResponse>>
            completeProfile(
                    @AuthenticationPrincipal User user,
                    @Valid @RequestBody
                    CompleteCustomerProfileRequest request) {

        return ResponseEntity.ok(
                customerProfileService.completeProfile(
                        user,
                        request
                )
        );
    }

    @GetMapping
     public ResponseEntity<ApiResponse<CustomerProfileResponse>> getProfile(
        @AuthenticationPrincipal User user
     ){
           
        return ResponseEntity.ok(customerProfileService.getProfile(user)); 
     }
}