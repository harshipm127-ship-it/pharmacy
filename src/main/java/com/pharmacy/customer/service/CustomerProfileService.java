package com.pharmacy.customer.service;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.dto.request.CompleteCustomerProfileRequest;
import com.pharmacy.customer.dto.response.CustomerProfileResponse;
import com.pharmacy.customer.entity.User;

public interface CustomerProfileService {

    ApiResponse<CustomerProfileResponse> completeProfile(
            User user,
            CompleteCustomerProfileRequest request
    );

     ApiResponse<CustomerProfileResponse> getProfile(User user); 
}