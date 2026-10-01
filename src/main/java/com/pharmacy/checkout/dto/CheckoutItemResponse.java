package com.pharmacy.checkout.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record CheckoutItemResponse(

    UUID productPublicId, 
    String sku, 
    String productName, 
    BigDecimal sellingPrice, 
    Integer quantity, 
    BigDecimal itemTotal
) {

}
