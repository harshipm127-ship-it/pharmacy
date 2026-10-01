package com.pharmacy.inventory.dto;

import java.util.UUID;

public record InventoryDetailsResponse(

    UUID publicId,

    UUID productPublicId,
    String productName,

    UUID storePublicId,
    String storeCode,
    String storeName,

    boolean active

) {}