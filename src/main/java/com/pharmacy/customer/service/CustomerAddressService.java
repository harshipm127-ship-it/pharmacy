package com.pharmacy.customer.service;

import java.util.List;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.dto.request.CreateAddressRequest;
import com.pharmacy.customer.dto.request.UpdateAddressRequest;
import com.pharmacy.customer.dto.response.AddressResponse;
import com.pharmacy.customer.entity.User;

public interface CustomerAddressService {

    ApiResponse<List<AddressResponse>> getAddresses( User user);

   ApiResponse<AddressResponse> addAddress( User user, CreateAddressRequest request);

      ApiResponse<AddressResponse> updateAddress(
            User user,
            Long addressId,
            UpdateAddressRequest request
    );

    ApiResponse<Void> deleteAddress(
            User user,
            Long addressId
    );

    ApiResponse<AddressResponse> makeDefault(
            User user,
            Long addressId
    );
}