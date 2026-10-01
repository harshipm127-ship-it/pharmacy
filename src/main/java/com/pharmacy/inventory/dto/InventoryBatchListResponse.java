package com.pharmacy.inventory.dto;

import java.time.LocalDate;
import java.util.UUID;

public record InventoryBatchListResponse(

        UUID publicId,

        String productSku,

        String productName,

        String storeName,

        String batchNumber,

        LocalDate expiryDate,

        Integer availableQuantity,

        Boolean active

) {
}
