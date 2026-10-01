package com.pharmacy.cart.response;

import java.math.BigDecimal;
import java.util.UUID;

public record CartItemResponse(
        UUID publicId,

        UUID productPublicId,

        String sku,

        String productName,

        BigDecimal sellingPrice,

        Integer quantity,

        BigDecimal itemTotal
) {

}
