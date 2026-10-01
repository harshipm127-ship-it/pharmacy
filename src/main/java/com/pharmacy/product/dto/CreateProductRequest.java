package com.pharmacy.product.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.pharmacy.product.enmus.DosageForm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateProductRequest(

        @NotNull(message = "Category publicId is required.")
        UUID categoryPublicId,

        @NotBlank(message = "SKU is required.")
        @Size(max = 50)
        String sku,

        @NotBlank(message = "Product name is required.")
        @Size(max = 100)
        String name,

        @Size(max = 100)
        String brand,

        @Size(max = 150)
        String manufacturer,

        @NotNull(message = "Dosage form is required.")
        DosageForm dosageForm,

        @Size(max = 50)
        String strength,

        @Size(max = 50)
        String packSize,

        @NotBlank(message = "Short description is required.")
        @Size(max = 255)
        String shortDescription,

        @Size(max = 500)
        String description,

        @NotNull
        @Positive
        BigDecimal mrp,

        @NotNull
        @Positive
        BigDecimal sellingPrice,

        Boolean active

) {
}