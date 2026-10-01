package com.pharmacy.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
public record InventoryBatchDetailsResponse(

    UUID publicId,

    UUID inventoryPublicId,

    UUID productPublicId,

    String productSku,

    String productName,

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

) {}