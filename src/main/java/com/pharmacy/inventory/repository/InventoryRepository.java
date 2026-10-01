package com.pharmacy.inventory.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.inventory.entity.Inventory;


public interface InventoryRepository extends JpaRepository<Inventory ,UUID> {

     Optional<Inventory> findByPublicId(UUID publicId);

    boolean existsByProductIdAndStoreId(UUID productId, UUID storeId);

    Optional<Inventory> findByProductIdAndStoreId(UUID productId, UUID storeId);

    Page<Inventory> findByActiveTrue(Pageable pageable);

    Page<Inventory>
       findByProduct_NameContainingIgnoreCaseOrProduct_SkuContainingIgnoreCaseOrStore_NameContainingIgnoreCaseOrStore_CodeContainingIgnoreCase(
        String productName,
        String sku,
        String storeName,
        String storeCode,
        Pageable pageable);
}
