package com.pharmacy.checkout.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CheckoutPreviewResponse(

        UUID addressPublicId,

        CheckoutStoreResponse store,

        List<CheckoutItemResponse> items,

        Integer totalItems,

        BigDecimal subtotal,

        BigDecimal deliveryFee,

        BigDecimal totalAmount

) {
}