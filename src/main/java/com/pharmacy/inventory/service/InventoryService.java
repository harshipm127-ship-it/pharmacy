package com.pharmacy.inventory.service;

import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.IllegalOperationException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.inventory.dto.CreateInventoryRequest;
import com.pharmacy.inventory.dto.InventoryListResponse;
import com.pharmacy.inventory.dto.InventoryResponse;
import com.pharmacy.inventory.entity.Inventory;
import com.pharmacy.inventory.repository.InventoryRepository;
import com.pharmacy.product.entity.Product;
import com.pharmacy.product.repository.ProductRepository;
import com.pharmacy.store.entity.Store;
import com.pharmacy.store.repository.StoreRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    private final ProductRepository productRepository;
    
    private final StoreRepository storeRepository;

    public ApiResponse<InventoryResponse> createInventory(CreateInventoryRequest request) {

    // Validate Product
    Product product = productRepository.findByPublicId(request.productPublicId())
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Product not found with publicId: " + request.productPublicId()));

    if (!product.isActive()) {
        throw new IllegalOperationException(
                "Cannot create inventory for an inactive product.");
    }

    // Validate Store
    Store store = storeRepository.findByPublicId(request.storePublicId())
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Store not found with publicId: " + request.storePublicId()));

    if (!store.isActive()) {
        throw new IllegalOperationException(
                "Cannot create inventory for an inactive store.");
    }

    // Business validation
    if (inventoryRepository.existsByProductIdAndStoreId(
            product.getId(), store.getId())) {

        throw new DuplicateResourceException(
                "Inventory already exists for this product in this store.");
    }

    Inventory inventory = Inventory.builder()
            .product(product)
            .store(store)
            .active(true)
            .build();

    try {

        Inventory savedInventory = inventoryRepository.saveAndFlush(inventory);

        return new ApiResponse<>(
                true,
                "Inventory created successfully.",
                mapToResponse(savedInventory));

    } catch (DataIntegrityViolationException ex) {

        // Handles rare concurrent insert
        throw new DuplicateResourceException(
                "Inventory already exists for this product in this store.");
    }
}

public ApiResponse<Page<InventoryListResponse>> getAllInventory(
        int page,
        int size,
        String search,
        String sortBy,
        String direction) {

    Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);

    Page<Inventory> inventories;

    if (search == null || search.isBlank()) {

        inventories = inventoryRepository.findAll(pageable);

    } else {

        inventories = inventoryRepository
                .findByProduct_NameContainingIgnoreCaseOrProduct_SkuContainingIgnoreCaseOrStore_NameContainingIgnoreCaseOrStore_CodeContainingIgnoreCase(
                        search,
                        search,
                        search,
                        search,
                        pageable);
    }

    Page<InventoryListResponse> response =
            inventories.map(this::mapToListResponse);

    return new ApiResponse<>(
            true,
            "Inventory retrieved successfully.",
            response);
}
private InventoryResponse mapToResponse(Inventory inventory) {

    return new InventoryResponse(

            inventory.getPublicId(),

            inventory.getProduct().getPublicId(),
            inventory.getProduct().getName(),

            inventory.getStore().getPublicId(),
            inventory.getStore().getCode(),
            inventory.getStore().getName(),

            inventory.isActive()
    );
}
 private InventoryListResponse mapToListResponse(Inventory inventory) {

    return new InventoryListResponse(

            inventory.getPublicId(),

            inventory.getProduct().getSku(),

            inventory.getProduct().getName(),

            inventory.getStore().getCode(),

            inventory.getStore().getName(),

            inventory.isActive()
    );
}
//get single inventoryById
public ApiResponse<InventoryResponse> getInventoryByPublicId(UUID publicId){
 
        Inventory inventory = inventoryRepository
        .findByPublicId(publicId)
        .orElseThrow(() -> new ResourceNotFoundException("Inventory not found with publicId"+publicId));

        return new ApiResponse<>(

            true,

            "Inventory retrieved successfully.",

            mapToResponse(inventory));
}

public ApiResponse<Void> deleteInventory(UUID publicId) {

    Inventory inventory = inventoryRepository
            .findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Inventory not found with publicId: " + publicId));

    if (!inventory.isActive()) {
        throw new IllegalOperationException(
                "Inventory is already inactive.");
    }

    inventory.setActive(false);

    inventoryRepository.save(inventory);

    return new ApiResponse<>(
            true,
            "Inventory deactivated successfully.",
            null);
}

public ApiResponse<Void> restoreInventory(UUID publicId) {

    Inventory inventory = inventoryRepository
            .findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Inventory not found with publicId: " + publicId));

    if (inventory.isActive()) {
        throw new IllegalOperationException(
                "Inventory is already active.");
    }

    inventory.setActive(true);

    inventoryRepository.save(inventory);

    return new ApiResponse<>(
            true,
            "Inventory restored successfully.",
            null);
}
}
