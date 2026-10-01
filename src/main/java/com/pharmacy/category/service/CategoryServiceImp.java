package com.pharmacy.category.service;

import java.util.UUID;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.pharmacy.category.dto.CategoaryListResponse;
import com.pharmacy.category.dto.CategoryResponse;
import com.pharmacy.category.dto.CreateCategoryRequest;
import com.pharmacy.category.dto.UpdateCategoryRequest;
import com.pharmacy.category.entity.Category;
import com.pharmacy.category.repository.CategoryRepository;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.IllegalOperationException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.department.entity.Department;
import com.pharmacy.department.repository.DepartmentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImp  implements CategoryService{


     private final CategoryRepository categoryRepository;

    private final DepartmentRepository departmentRepository;
    @Override
    public ApiResponse<CategoryResponse> createCategory(CreateCategoryRequest request) {
        
    
        Department department =departmentRepository.findByPublicId(request.departmentPublicId())
         .orElseThrow(()-> 
         new ResourceNotFoundException("Department not found with the publicId"+ request.departmentPublicId()));
  
         if(!department.isActive()){
            throw new IllegalOperationException("Cannot create category for an inactive department. "); 
         }


if (categoryRepository.existsByDepartmentAndNameIgnoreCase(
        department,
        request.name().trim())) {

    throw new DuplicateResourceException(
            "Category already exists in this department.");
}
      
         //create Category

         Category category = Category.builder()
                .department(department)

                .name(request.name().trim())
                .description(request.description())
                .active(true)
                .build();

                try {
                     Category savedCategory = categoryRepository.save(category); 
                     return new ApiResponse<>(
                        true, "category created successfully", 
                     mapToResponse(savedCategory));                     
                } catch (Exception ex) {
                   if (ExceptionUtils.getRootCauseMessage(ex)
                    .contains("uk_department_category_name")) {

                throw new DuplicateResourceException(
                        "Category already exists in this department.");
        }
        throw ex;
    }
        }
             
    @Override
    public ApiResponse<CategoryResponse> getCategory(UUID publicId) {
         
        Category category = categoryRepository.findByPublicId(publicId)
        .orElseThrow(() ->  new ResourceNotFoundException(" Category not found with publicId: "+ publicId));

        return new ApiResponse<>(
            true, "Category retrieved successfully",mapToResponse(category) 
        );
    }

    @Override
    public ApiResponse<Page<CategoaryListResponse>> getCategories(int page, int size, String search, String sortBy,
            boolean ascending) {
        Sort sort = ascending
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

    Pageable pageable = PageRequest.of(page - 1, size, sort);

    Page<Category> categories;

    if (search == null || search.isBlank()) {

        categories = categoryRepository.findAll(pageable);

    } else {

        categories = categoryRepository
                .findByNameContainingIgnoreCase(search.trim(), pageable);
    }

    return new ApiResponse<>(
            true,
            "Categories retrieved successfully.",
            categories.map(this::mapToListResponse));
    }

    @Override
    public ApiResponse<CategoryResponse> updateCategory(UUID publicId, UpdateCategoryRequest request) {
           Category category = categoryRepository.findByPublicId(publicId)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Category not found with publicId: " + publicId));

    category.setName(request.name().trim());
    category.setDescription(request.description());

    try {

        Category updated = categoryRepository.save(category);

        return new ApiResponse<>(
                true,
                "Category updated successfully.",
                mapToResponse(updated));

    } catch (DataIntegrityViolationException ex) {

        if (ExceptionUtils.getRootCauseMessage(ex)
                .contains("uk_department_category_name")) {

            throw new DuplicateResourceException(
                    "Category already exists in this department.");
        }

        throw ex;
    }
}

   @Override
public ApiResponse<Void> deleteCategory(UUID publicId) {

    Category category = categoryRepository.findByPublicId(publicId)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Category not found with publicId: " + publicId));

    if (!category.isActive()) {
        throw new IllegalOperationException(
                "Category is already inactive.");
    }

    category.setActive(false);

    categoryRepository.save(category);

    return new ApiResponse<>(
            true,
            "Category deleted successfully.",
            null);
}

  @Override
public ApiResponse<Void> restoreCategory(UUID publicId) {

    Category category = categoryRepository.findByPublicId(publicId)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Category not found with publicId: " + publicId));

    if (category.isActive()) {
        throw new IllegalOperationException(
                "Category is already active.");
    }

    category.setActive(true);

    categoryRepository.save(category);

    return new ApiResponse<>(
            true,
            "Category restored successfully.",
            null);
}

    private CategoryResponse mapToResponse(Category category) {

        return new CategoryResponse(

                category.getPublicId(),

                category.getDepartment().getPublicId(),
                category.getDepartment().getName(),

                category.getName(),

                category.getDescription(),

                category.isActive());
    }


private CategoaryListResponse mapToListResponse(Category category) {

    return new CategoaryListResponse(

            category.getPublicId(),

            category.getName(),

            category.getDepartment().getName(),

            category.isActive());
}

}
