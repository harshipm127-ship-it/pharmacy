package com.pharmacy.checkout.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.checkout.dto.CheckoutPreviewRequest;
import com.pharmacy.checkout.dto.CheckoutPreviewResponse;
import com.pharmacy.checkout.service.CheckOutService;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.entity.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckOutService checkoutService;

    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<CheckoutPreviewResponse>> preview(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CheckoutPreviewRequest request) {

        return ResponseEntity.ok(
                checkoutService.preview(user, request)
        );
    }
}