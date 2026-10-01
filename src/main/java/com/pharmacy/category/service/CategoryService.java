package com.pharmacy.category.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.pharmacy.category.dto.CategoaryListResponse;
import com.pharmacy.category.dto.CategoryResponse;
import com.pharmacy.category.dto.CreateCategoryRequest;
import com.pharmacy.category.dto.UpdateCategoryRequest;
import com.pharmacy.common.dto.ApiResponse;

public interface CategoryService {

       ApiResponse<CategoryResponse> createCategory(
            CreateCategoryRequest request);

    ApiResponse<CategoryResponse> getCategory(
            UUID publicId);

    ApiResponse<Page<CategoaryListResponse>> getCategories(
            int page,
            int size,
            String search,
            String sortBy,
            boolean ascending);

    ApiResponse<CategoryResponse> updateCategory(
            UUID publicId,
            UpdateCategoryRequest request);

    ApiResponse<Void> deleteCategory(
            UUID publicId);

    ApiResponse<Void> restoreCategory(
            UUID publicId);
}
