package com.pharmacy.inventory.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.inventory.dto.CreateInventoryRequest;
import com.pharmacy.inventory.dto.InventoryListResponse;
import com.pharmacy.inventory.dto.InventoryResponse;
import com.pharmacy.inventory.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@Validated
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryResponse>> createInventory(
            @Valid @RequestBody CreateInventoryRequest request) {

        ApiResponse<InventoryResponse> response =
                inventoryService.createInventory(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public  ResponseEntity<ApiResponse<Page<InventoryListResponse>>> getAllInvetory(
      @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(required = false) String search,

            @RequestParam(defaultValue = "createdAt") String sortBy,

            @RequestParam(defaultValue = "desc") String direction) {

        return ResponseEntity.ok(
                inventoryService.getAllInventory(
                        page,
                        size,
                        search,
                        sortBy,
                        direction));
    }

    @GetMapping("/{publicId}")
public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryByPublicId(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            inventoryService.getInventoryByPublicId(publicId));
}

    @DeleteMapping("/{publicId}")
    public ResponseEntity<ApiResponse<Void>> deleteInventory(
            @PathVariable UUID publicId) {

        return ResponseEntity.ok(
                inventoryService.deleteInventory(publicId));
    }

    @PatchMapping("/{publicId}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreInventory(
            @PathVariable UUID publicId) {

        return ResponseEntity.ok(
                inventoryService.restoreInventory(publicId));
    }

}