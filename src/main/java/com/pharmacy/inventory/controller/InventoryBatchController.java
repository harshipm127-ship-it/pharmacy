package com.pharmacy.inventory.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.inventory.dto.CreateInventoryBatchRequest;
import com.pharmacy.inventory.dto.InventoryBatchDetailsResponse;
import com.pharmacy.inventory.dto.InventoryBatchListResponse;
import com.pharmacy.inventory.dto.InventoryBatchResponse;
import com.pharmacy.inventory.dto.UpdateInventoryBatchRequest;
import com.pharmacy.inventory.service.InventoryBatchService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/inventory-batches")
@RequiredArgsConstructor
public class InventoryBatchController {

    private final InventoryBatchService inventoryBatchService; 



    @PostMapping
    public ResponseEntity<ApiResponse<InventoryBatchResponse>> createInvetoryBatch(
       
        @Valid @RequestBody CreateInventoryBatchRequest request
    ){
             
        return ResponseEntity.status(HttpStatus.CREATED)
        .body(inventoryBatchService.createInventoryBatch(request)); 
    }

    @PutMapping("/{publicId}")
    public ResponseEntity<ApiResponse<InventoryBatchResponse>> updateInventoryBatch(
        @Valid @PathVariable UUID publicId, 
        @RequestBody UpdateInventoryBatchRequest request
    ){
         return ResponseEntity.ok(inventoryBatchService.
            updateInventoryBatch(publicId, request)); 
    }

    @GetMapping("/{publicId}")
public ResponseEntity<ApiResponse<InventoryBatchDetailsResponse>>
getInventoryBatchByPublicId(

        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            inventoryBatchService.getInventoryBatchByPublicId(publicId));
}

@GetMapping
public ResponseEntity<ApiResponse<Page<InventoryBatchListResponse>>> getAllInventoryBatches(

        @RequestParam(defaultValue = "0") int page,

        @RequestParam(defaultValue = "10") int size,

        @RequestParam(required = false) String search,

        @RequestParam(defaultValue = "expiryDate") String sortBy,

        @RequestParam(defaultValue = "asc") String direction) {

    Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);

    return ResponseEntity.ok(
            inventoryBatchService.getAllInventoryBatches(
                    pageable,
                    search));
}
  @DeleteMapping("/{publicId}")
public ResponseEntity<ApiResponse<Void>> deleteInventoryBatch(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            inventoryBatchService.deleteInventoryBatch(publicId));
}
@PatchMapping("/{publicId}/restore")
public ResponseEntity<ApiResponse<Void>> restoreInventoryBatch(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            inventoryBatchService.restoreInventoryBatch(publicId));
}
}
