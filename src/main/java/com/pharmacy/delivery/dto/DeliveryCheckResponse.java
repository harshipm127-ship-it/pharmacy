package com.pharmacy.delivery.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record DeliveryCheckResponse(

    UUID storePublicId, 
    UUID addressPublicId,
    boolean deliverable,
    BigDecimal distanceKm, 
    BigDecimal deliveryRadiusKm
) {

}
