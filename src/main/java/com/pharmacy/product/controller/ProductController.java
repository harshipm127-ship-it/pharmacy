package com.pharmacy.product.controller;

import java.util.UUID;

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
import com.pharmacy.product.dto.ProductPageResponse;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.product.dto.CreateProductRequest;
import com.pharmacy.product.dto.ProductDetailsResponse;
import com.pharmacy.product.dto.ProductResponse;
import com.pharmacy.product.dto.UpdateProductRequest;
import com.pharmacy.product.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
            
                return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(request));            }


@GetMapping
public ResponseEntity<ApiResponse<ProductPageResponse>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "") String search,
        @RequestParam(defaultValue = "name") String sortBy,
        @RequestParam(defaultValue = "asc") String direction) {

    return ResponseEntity.ok(
            productService.getAllProducts(
                    page,
                    size,
                    search,
                    sortBy,
                    direction));
}

@GetMapping("/{publicId}")
public ResponseEntity<ApiResponse<ProductDetailsResponse>> getProductById(
        @PathVariable UUID publicId) {

    ApiResponse<ProductDetailsResponse> response =
            productService.getProductByPublicId(publicId);

    return ResponseEntity.ok(response);
}

@PutMapping("/{publicId}")
public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
        @PathVariable UUID publicId,
        @Valid @RequestBody UpdateProductRequest request) {

    ApiResponse<ProductResponse> response =
            productService.updateProduct(publicId, request);

    return ResponseEntity.ok(response);
}

    @DeleteMapping("/{publicId}")
   public ResponseEntity<ApiResponse<Void>> deleteProduct(
        @PathVariable UUID publicId) {
         ApiResponse<Void> response = productService.deleteProduct(publicId);
        return ResponseEntity.ok(response);
    }

@PatchMapping("/{publicId}/restore")
public ResponseEntity<ApiResponse<ProductResponse>> restoreProduct(
        @PathVariable UUID publicId) {
    ApiResponse<ProductResponse> response =
            productService.restoreProduct(publicId);

    return ResponseEntity.ok(response);
}
}

