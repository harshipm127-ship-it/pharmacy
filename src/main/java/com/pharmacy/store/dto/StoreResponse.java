package com.pharmacy.store.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StoreResponse(

    UUID publicId,
    String code,
    String name,
    String addressLine1,
    String addressLine2,
    String landmark,
    String area,
    String city,
    String state,
    String country,
    String postalCode,
    String phoneNumber,
    String email,

    BigDecimal latitude,
    BigDecimal longitude,
    BigDecimal deliveryRadiusKm,

    Boolean active

) {}