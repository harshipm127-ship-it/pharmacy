package com.pharmacy.cart.service;

import java.util.UUID;

import com.pharmacy.cart.request.AddCartItemRequest;
import com.pharmacy.cart.request.UpdateCartItemRequest;
import com.pharmacy.cart.response.CartResponse;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.entity.User;

public interface CartService {

    ApiResponse<CartResponse> getCart(
            User user,
            UUID addressPublicId
    );

    ApiResponse<CartResponse> addItem(
        User user,
        UUID addressPublicId,
        AddCartItemRequest request
);

ApiResponse<CartResponse> updateItem(
        User user,
        UUID addressPublicId,
        UUID itemPublicId,
        UpdateCartItemRequest request
);

ApiResponse<CartResponse> removeItem(
        User user,
        UUID addressPublicId,
        UUID itemPublicId
);

    ApiResponse<Void> clearCart(User user);
}