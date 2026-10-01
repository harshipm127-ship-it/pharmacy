package com.pharmacy.inventory.dto;

import java.util.UUID;

public record InventoryListResponse(

    UUID publicId,

    String productSku,

    String productName,

    String storeCode,

    String storeName,

    boolean active

) {}