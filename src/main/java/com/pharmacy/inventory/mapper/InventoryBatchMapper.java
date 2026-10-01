package com.pharmacy.inventory.mapper;

import org.springframework.stereotype.Component;

import com.pharmacy.inventory.dto.CreateInventoryBatchRequest;
import com.pharmacy.inventory.dto.InventoryBatchDetailsResponse;
import com.pharmacy.inventory.dto.InventoryBatchListResponse;
import com.pharmacy.inventory.dto.InventoryBatchResponse;
import com.pharmacy.inventory.entity.InventoryBatch;


@Component
public class InventoryBatchMapper {


    public InventoryBatch toEntity(CreateInventoryBatchRequest request) {

    return InventoryBatch.builder()

            .batchNumber(request.batchNumber().trim())

            .manufacturingDate(request.manufacturingDate())

            .expiryDate(request.expiryDate())

            .purchasePrice(request.purchasePrice())

            .mrp(request.mrp())

            .sellingPrice(request.sellingPrice())

            .receivedQuantity(request.receivedQuantity())

            // Initially, all received stock is available.
            .availableQuantity(request.receivedQuantity())

            // New batches are active by default.
            .active(true)

            .build();
}

public InventoryBatchResponse toResponse(
        InventoryBatch batch) {

    return new InventoryBatchResponse(

            batch.getPublicId(),

            batch.getInventory().getPublicId(),

            batch.getInventory().getProduct().getPublicId(),

            batch.getInventory().getProduct().getSku(),

            batch.getInventory().getProduct().getName(),

            batch.getInventory().getStore().getPublicId(),

            batch.getInventory().getStore().getName(),

            batch.getBatchNumber(),

            batch.getManufacturingDate(),

            batch.getExpiryDate(),

            batch.getPurchasePrice(),

            batch.getMrp(),

            batch.getSellingPrice(),

            batch.getReceivedQuantity(),

            batch.getAvailableQuantity(),

            batch.isActive()
    );
}

public InventoryBatchDetailsResponse toDetailsResponse(
        InventoryBatch batch) {

    return new InventoryBatchDetailsResponse(

            batch.getPublicId(),

            batch.getInventory().getPublicId(),

            batch.getInventory().getProduct().getPublicId(),

            batch.getInventory().getProduct().getSku(),

            batch.getInventory().getProduct().getName(),

            batch.getInventory().getStore().getPublicId(),

            batch.getInventory().getStore().getName(),

            batch.getBatchNumber(),

            batch.getManufacturingDate(),

            batch.getExpiryDate(),

            batch.getPurchasePrice(),

            batch.getMrp(),

            batch.getSellingPrice(),

            batch.getReceivedQuantity(),

            batch.getAvailableQuantity(),

            batch.isActive()
    );
}
public InventoryBatchListResponse toListResponse(
        InventoryBatch batch) {

    return new InventoryBatchListResponse(

            batch.getPublicId(),

            batch.getInventory()
                    .getProduct()
                    .getSku(),

            batch.getInventory()
                    .getProduct()
                    .getName(),

            batch.getInventory()
               .getStore()
                    .getName(),

            batch.getBatchNumber(),

            batch.getExpiryDate(),

            batch.getAvailableQuantity(),

            batch.isActive()
    );
}
}
