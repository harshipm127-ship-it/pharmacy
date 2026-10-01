package com.pharmacy.inventory.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.inventory.dto.CreateInventoryBatchRequest;
import com.pharmacy.inventory.dto.InventoryBatchAllocation;
import com.pharmacy.inventory.dto.InventoryBatchDetailsResponse;
import com.pharmacy.inventory.dto.InventoryBatchListResponse;
import com.pharmacy.inventory.dto.InventoryBatchResponse;
import com.pharmacy.inventory.dto.UpdateInventoryBatchRequest;
import com.pharmacy.inventory.entity.Inventory;

public interface InventoryBatchService {

    ApiResponse<InventoryBatchResponse> createInventoryBatch(
            CreateInventoryBatchRequest request);

    ApiResponse<InventoryBatchResponse> updateInventoryBatch(
            UUID publicId,
            UpdateInventoryBatchRequest request);
    ApiResponse<InventoryBatchDetailsResponse> getInventoryBatchByPublicId(
        UUID publicId);

    ApiResponse<Page<InventoryBatchListResponse>> getAllInventoryBatches(
            Pageable pageable,
            String search);

    ApiResponse<Void> deleteInventoryBatch(
            UUID publicId);

    ApiResponse<Void> restoreInventoryBatch(
            UUID publicId);

List<InventoryBatchAllocation> allocateStock(Inventory inventory, int requiredQuantity);        
}