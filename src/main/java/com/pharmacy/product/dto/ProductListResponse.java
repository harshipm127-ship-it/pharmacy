package com.pharmacy.product.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.pharmacy.product.enmus.DosageForm;

public record ProductListResponse(

   
        UUID publicId,

        String categoryName,

        String sku,

        String name,

        String brand,

        String manufacturer,

        DosageForm dosageForm,

        String strength,

        Boolean active,

        String primaryImageUrl

) {
}