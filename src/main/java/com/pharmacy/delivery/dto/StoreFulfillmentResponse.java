package com.pharmacy.delivery.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StoreFulfillmentResponse(

        UUID storePublicId,

        String code,

        String name,

        String area,

        String city,

        BigDecimal distanceKm,

        BigDecimal deliveryRadiusKm,

        boolean deliverable,

        boolean canFulfillCart

) {
}