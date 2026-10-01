package com.pharmacy.inventory.dto;


import java.math.BigDecimal;
import java.util.UUID;

public record InventoryBatchAllocation(

        UUID batchPublicId,

        int quantity,

        BigDecimal sellingPrice,

        BigDecimal itemTotal

) {
}