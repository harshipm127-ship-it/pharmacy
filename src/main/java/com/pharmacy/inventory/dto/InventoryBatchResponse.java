package com.pharmacy.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record InventoryBatchResponse(

    UUID publicId, 

     UUID inventoryPublicId,

        UUID productPublicId,

        String productName,

        String productSku,
        
        UUID storePublicId,

        String storeName,

        String batchNumber,

        LocalDate manufacturingDate,

        LocalDate expiryDate,

        BigDecimal purchasePrice,

        BigDecimal mrp,

        BigDecimal sellingPrice,

        Integer receivedQuantity,

        Integer availableQuantity,

        Boolean active
) {

}
