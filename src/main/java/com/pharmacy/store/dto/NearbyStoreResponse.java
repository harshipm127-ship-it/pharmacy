package com.pharmacy.store.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record NearbyStoreResponse(

    UUID storePublicId, 
    String code,
    String name, 
    String area, 
    String city, 
    BigDecimal latitude, 
    BigDecimal longitude, 
    BigDecimal deliveryRadiusKm, 
    BigDecimal distanceKm, 
    boolean deliverable
) {

}
