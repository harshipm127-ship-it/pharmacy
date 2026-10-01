package com.pharmacy.inventory.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.inventory.entity.Inventory;
import com.pharmacy.inventory.entity.InventoryBatch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InventoryBatchRepository extends JpaRepository<InventoryBatch,UUID> {

     Optional<InventoryBatch> findByPublicId(UUID publicId);

    boolean existsByInventoryAndBatchNumber(
            Inventory inventory,
            String batchNumber);

    List<InventoryBatch> findByInventoryOrderByExpiryDateAsc(
            Inventory inventory);

    Optional<InventoryBatch> findFirstByInventoryAndActiveTrueOrderByExpiryDateAsc(
            Inventory inventory);

    List<InventoryBatch> findByInventoryAndActiveTrue(
            Inventory inventory);


      boolean existsByInventoryAndBatchNumberAndIdNot(
        Inventory inventory,
        String batchNumber,
        UUID id);
        @Query("""
    SELECT ib
    FROM InventoryBatch ib
    WHERE
        (:search IS NULL OR :search = '' OR
         LOWER(ib.batchNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(ib.inventory.product.sku) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(ib.inventory.product.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
         LOWER(ib.inventory.store.name) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
Page<InventoryBatch> searchInventoryBatches(@Param("search") String search, Pageable pageable);

     @Query("""
    SELECT COALESCE(SUM(ib.availableQuantity), 0)
    FROM InventoryBatch ib
    WHERE ib.inventory.store.id = :storeId
      AND ib.inventory.product.id = :productId
      AND ib.inventory.active = true
      AND ib.active = true
      AND ib.expiryDate >= CURRENT_DATE
      AND ib.availableQuantity > 0
    """)
Integer getAvailableQuantityForStoreAndProduct(@Param("storeId") UUID storeId,
        @Param("productId") UUID productId);
       
        
        @Query("""
               SELECT COALESCE(SUM(ib.availableQuantity), 0) FROM InventoryBatch ib
               WHERE ib.inventory.id = :inventoryId AND ib.active = true
               AND ib.expiryDate >= :today
               AND ib.availableQuantity > 0
    """)
        Long getAvailableQuantity(@Param("inventoryId") UUID inventoryId, 
                                  @Param("today") LocalDate today      
); 
}
