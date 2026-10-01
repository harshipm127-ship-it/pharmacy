package com.pharmacy.cart.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartResponse(

    UUID publicId, 
    List<CartItemResponse> items, 

    Integer totalItems, 

    BigDecimal subtotal

) {

}
