package com.pharmacy.checkout.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record CheckoutPreviewRequest(
    @NotNull(message = "Address publicId is required")
    UUID addressPublicId
) {

}
