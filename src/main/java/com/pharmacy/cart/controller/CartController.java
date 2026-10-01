package com.pharmacy.cart.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.cart.request.AddCartItemRequest;
import com.pharmacy.cart.request.UpdateCartItemRequest;
import com.pharmacy.cart.response.CartResponse;
import com.pharmacy.cart.service.CartService;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.entity.User;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService; 

  @GetMapping
  public ResponseEntity<ApiResponse<CartResponse>> getCart(
        @AuthenticationPrincipal User user,
        @RequestParam UUID addressPublicId
) {
    return ResponseEntity.ok(
            cartService.getCart(user, addressPublicId)
    );
}
 @PostMapping("/items")
  public ResponseEntity<ApiResponse<CartResponse>> addItem(
        @AuthenticationPrincipal User user,
        @RequestParam UUID addressPublicId,
        @Valid @RequestBody AddCartItemRequest request
) {
    return ResponseEntity.ok(
            cartService.addItem(user, addressPublicId, request)
    );
}
    @PutMapping("/items/{itemPublicId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
        @AuthenticationPrincipal User user,
        @RequestParam UUID addressPublicId,
        @PathVariable UUID itemPublicId,
        @Valid @RequestBody UpdateCartItemRequest request
) {
    return ResponseEntity.ok(
            cartService.updateItem(
                    user,
                    addressPublicId,
                    itemPublicId,
                    request
            )
    );
}

   @DeleteMapping("/items/{itemPublicId}")
   public ResponseEntity<ApiResponse<CartResponse>> removeItem(
        @AuthenticationPrincipal User user,
        @RequestParam UUID addressPublicId,
        @PathVariable UUID itemPublicId
) {
    return ResponseEntity.ok(
            cartService.removeItem(
                    user,
                    addressPublicId,
                    itemPublicId
            )
    );
}
   @DeleteMapping
   public ResponseEntity<ApiResponse<Void>> clearCart(
        @AuthenticationPrincipal User user
) {
    return ResponseEntity.ok(
            cartService.clearCart(user)
    );
}
}