package com.pharmacy.store.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.store.dto.CreateStoreRequest;
import com.pharmacy.store.dto.StoreDetailsResponse;
import com.pharmacy.store.dto.StoreListResponse;
import com.pharmacy.store.dto.StoreResponse;
import com.pharmacy.store.dto.UpdateStoreRequest;
import com.pharmacy.store.service.StoreService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/stores")
@RequiredArgsConstructor
public class StoreController {

 private final StoreService storeService;

   @PostMapping
    public ResponseEntity<ApiResponse<StoreResponse>> createStore(
        @Valid @RequestBody CreateStoreRequest request) {

        return ResponseEntity.ok(storeService.createStore(request));
     }

     
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StoreListResponse>>> getAllStores(

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "") String search,

            @RequestParam(defaultValue = "name") String sortBy,

            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                storeService.getAllStores(
                        page,
                        size,
                        search,
                        sortBy,
                        direction));
                }
 
@GetMapping("/{publicId}")
public ResponseEntity<ApiResponse<StoreDetailsResponse>> getStoreDetails(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            storeService.getStoreDetailsByPublicId(publicId));
}

@PutMapping("/{publicId}")
public ResponseEntity<ApiResponse<StoreResponse>> updateStore(
        @PathVariable UUID publicId,
        @Valid @RequestBody UpdateStoreRequest request) {

            return ResponseEntity.ok(
                    storeService.updateStore(publicId, request));
}
//controller endpoint for soft delete store
@DeleteMapping("/{publicId}")
public ResponseEntity<ApiResponse<StoreResponse>> deleteStore(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            storeService.deleteStore(publicId));
}

@PutMapping("/{publicId}/restore")
public ResponseEntity<ApiResponse<StoreResponse>> restoreStore(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            storeService.restoreStore(publicId));
}
}