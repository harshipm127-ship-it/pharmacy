package com.pharmacy.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateInventoryBatchRequest(

        @NotNull(message = "Inventory publicId is required.")
        UUID inventoryPublicId,

        @NotBlank(message = "Batch number is required.")
        String batchNumber,

        LocalDate manufacturingDate,

        @NotNull(message = "Expiry date is required.")
        LocalDate expiryDate,

        @NotNull(message = "Purchase price is required.")
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal purchasePrice,

        @NotNull(message = "MRP is required.")
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal mrp,

        @NotNull(message = "Selling price is required.")
        @DecimalMin(value = "0.0", inclusive = false)
        BigDecimal sellingPrice,

        @NotNull(message = "Received quantity is required.")
        @Positive(message = "Received quantity must be greater than zero.")
        Integer receivedQuantity

) {}