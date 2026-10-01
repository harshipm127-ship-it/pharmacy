package com.pharmacy.product.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.product.dto.ProductImageResponse;
import com.pharmacy.product.service.ProductImageService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

@PostMapping("/{productPublicId}/images")
public ResponseEntity<ApiResponse<List<ProductImageResponse>>> uploadProductImages(

        @PathVariable UUID productPublicId,

        @RequestParam("files") List<MultipartFile> files,

        @RequestParam(defaultValue = "0") int primaryImageIndex) {

    return ResponseEntity.status(HttpStatus.CREATED)
            .body(productImageService.uploadProductImages(
                    productPublicId,
                    files,
                    primaryImageIndex));
}

    @DeleteMapping("/images/{imagePublicId}")
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(
            @PathVariable UUID imagePublicId) {

        return ResponseEntity.ok(
                productImageService.deleteProductImage(imagePublicId));
    }

    @PutMapping("/images/{imagePublicId}/primary")
    public ResponseEntity<ApiResponse<ProductImageResponse>> setPrimaryProductImage(
            @PathVariable UUID imagePublicId) {

        return ResponseEntity.ok(
                productImageService.setPrimaryImage(imagePublicId));
    }
}