package com.pharmacy.checkout.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CheckoutStoreResponse(

        UUID storePublicId,

        String code,

        String name,

        String area,

        String city,

        BigDecimal distanceKm,

        BigDecimal deliveryRadiusKm

) {
}