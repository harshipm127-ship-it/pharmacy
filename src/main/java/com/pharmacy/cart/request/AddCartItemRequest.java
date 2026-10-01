package com.pharmacy.cart.request;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
    
    @NotNull(message = "product public Id is required")
    UUID productPublicId, 
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1. ")
    Integer quantity

) {

}
