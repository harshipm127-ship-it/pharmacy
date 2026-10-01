package com.pharmacy.checkout.service;

import com.pharmacy.checkout.dto.CheckoutPreviewRequest;
import com.pharmacy.checkout.dto.CheckoutPreviewResponse;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.entity.User;

public interface CheckOutService {
 
public ApiResponse<CheckoutPreviewResponse> preview(
        User user,
        CheckoutPreviewRequest request);
}
