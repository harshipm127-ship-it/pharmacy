package com.pharmacy.category.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
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

import com.pharmacy.category.dto.CategoaryListResponse;
import com.pharmacy.category.dto.CategoryResponse;
import com.pharmacy.category.dto.CreateCategoryRequest;
import com.pharmacy.category.dto.UpdateCategoryRequest;
import com.pharmacy.category.service.CategoryService;
import com.pharmacy.common.dto.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryController {


private final CategoryService categoryService;

@PostMapping
public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
        @Valid @RequestBody CreateCategoryRequest request) {

    return ResponseEntity.status(HttpStatus.CREATED)
            .body(categoryService.createCategory(request));
}


@GetMapping("/{publicId}")
public ResponseEntity<ApiResponse<CategoryResponse>> getCategory(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            categoryService.getCategory(publicId));
}

@GetMapping
public ResponseEntity<ApiResponse<Page<CategoaryListResponse>>> getCategories(

        @RequestParam(defaultValue = "1") int page,

        @RequestParam(defaultValue = "10") int size,

        @RequestParam(required = false) String search,

        @RequestParam(defaultValue = "name") String sortBy,

        @RequestParam(defaultValue = "true") boolean ascending) {

    return ResponseEntity.ok(
            categoryService.getCategories(
                    page,
                    size,
                    search,
                    sortBy,
                    ascending));
}

@PutMapping("/{publicId}")
public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
        @PathVariable UUID publicId,
        @Valid @RequestBody UpdateCategoryRequest request) {

    return ResponseEntity.ok(
            categoryService.updateCategory(publicId, request));
}
@DeleteMapping("/{publicId}")
public ResponseEntity<ApiResponse<Void>> deleteCategory(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            categoryService.deleteCategory(publicId));
}
@PatchMapping("/{publicId}/restore")
public ResponseEntity<ApiResponse<Void>> restoreCategory(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            categoryService.restoreCategory(publicId));
}
}
