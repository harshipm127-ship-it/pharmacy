package com.pharmacy.product.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.pharmacy.product.enmus.DosageForm;

public record ProductResponse(

        UUID publicId,

        UUID categoryPublicId,

        String categoryName,

        String sku,

        String name,

        String brand,

        String manufacturer,

        DosageForm dosageForm,

        String strength,

        String packSize,

        String shortDescription,

        String description,

        BigDecimal mrp,


        Boolean active
) {
}