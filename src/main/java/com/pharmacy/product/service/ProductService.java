package com.pharmacy.product.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.pharmacy.category.entity.Category;
import com.pharmacy.category.repository.CategoryRepository;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.IllegalOperationException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.product.dto.CreateProductRequest;
import com.pharmacy.product.dto.ProductDetailsResponse;
import com.pharmacy.product.dto.ProductListResponse;
import com.pharmacy.product.dto.ProductPageResponse;
import com.pharmacy.product.dto.ProductResponse;
import com.pharmacy.product.dto.UpdateProductRequest;
import com.pharmacy.product.entity.Product;
import com.pharmacy.product.mapper.ProductMapper;
import com.pharmacy.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

private final CategoryRepository categoryRepository;
private final ProductMapper  productMapper;
private final ProductRepository productRepository;

public ApiResponse<ProductResponse> createProduct(CreateProductRequest request) {

    // Validate Category
    Category category = categoryRepository
            .findByPublicId(request.categoryPublicId())
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Category not found with publicId: "
                                    + request.categoryPublicId()));

    if (!category.isActive()) {
        throw new IllegalOperationException(
                "Cannot create product for an inactive category.");
    }

    // Validate SKU
    Optional<Product> existingProduct = productRepository.findBySku(request.sku().trim());

    if (existingProduct.isPresent()) {

        if (existingProduct.get().isActive()) {
            throw new DuplicateResourceException(
                    "SKU already exists.");
        }

        throw new DuplicateResourceException(
                "A product with this SKU already exists but is inactive. Please restore it.");
    }

    // Create Product
    Product product = Product.builder()
            .category(category)
            .sku(request.sku().trim())
            .name(request.name().trim())
            .shortDescription(request.shortDescription().trim())
            .description(request.description())
            .mrp(request.mrp())
            .brand(request.brand())
            .manufacturer(request.manufacturer())
            .dosageForm(request.dosageForm())
            .strength(request.strength())
            .packSize(request.packSize())
            .active(request.active() != null ? request.active() : true)
            .build();

    Product savedProduct = productRepository.save(product);

    return new ApiResponse<>(
            true,
            "Product created successfully.",
            productMapper.mapToResponse(savedProduct));
            
        
        }

public ApiResponse<ProductPageResponse> getAllProducts(
        int page,
        int size,
        String search,
        String sortBy,
        String direction) {

    Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);

    Page<Product> productPage;

    if (search == null || search.isBlank()) {
        productPage = productRepository.findAll(pageable);
    } else {
        productPage = productRepository
                .findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(
                        search,
                        search,
                        pageable);
    }

   List<ProductListResponse> responses = productPage.getContent()
        .stream()
        .map(productMapper::mapToListResponse)
        .toList();

    ProductPageResponse pageResponse = new ProductPageResponse(
            responses,
            productPage.getNumber(),
            productPage.getTotalPages(),
            productPage.getTotalElements(),
            productPage.getSize(),
            productPage.isFirst(),
            productPage.isLast());

    return new ApiResponse<>(
            true,
            "Products fetched successfully.",
            pageResponse);
}

public ApiResponse<ProductDetailsResponse> getProductByPublicId(UUID publicId) {

    Product product = productRepository.findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Product not found."));

    ProductDetailsResponse response = productMapper.mapToDetailsResponse(product);

    return new ApiResponse<>(
            true,
            "Product details fetched successfully.",
            response);
}

//update Product method 

 public ApiResponse<ProductResponse> updateProduct(
        UUID publicId,
        UpdateProductRequest request) {

    Product product = productRepository.findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Product not found."));

    // Validate Category
    Category category = categoryRepository
            .findByPublicId(request.categoryPublicId())
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Category not found with publicId: "
                                    + request.categoryPublicId()));

    if (!category.isActive()) {
        throw new IllegalOperationException(
                "Cannot assign an inactive category.");
    }

  product.setCategory(category);

product.setName(request.name().trim());

product.setBrand(request.brand());

product.setManufacturer(request.manufacturer());

product.setDosageForm(request.dosageForm());

product.setStrength(request.strength());

product.setPackSize(request.packSize());

product.setShortDescription(request.shortDescription().trim());

product.setDescription(request.description());

product.setMrp(request.mrp());

    if (request.active() != null) {
        product.setActive(request.active());
    }

    Product updatedProduct = productRepository.save(product);

    return new ApiResponse<>(
            true,
            "Product updated successfully.",
            productMapper.mapToResponse(updatedProduct));
}

//soft delete product method
public ApiResponse<Void> deleteProduct(UUID publicId) {
 
        Product product = productRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found."));

                if(!product.isActive()) {
                    throw new BadRequestException("Product is already inactive.");
                }
                product.setActive(false);
                productRepository.save(product); 

                return new ApiResponse<>(
                        true,
                        "Product deleted (soft delete) successfully.",
                        null);
}


//restore the product that was soft deleted 

public ApiResponse<ProductResponse> restoreProduct(UUID publicId) {

    Product product = productRepository.findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Product not found."));

    if (product.isActive()) {
        throw new BadRequestException(
                "Product is already active.");
    }

    product.setActive(true);

    Product restoredProduct = productRepository.save(product);

    return new ApiResponse<>(
            true,
            "Product restored successfully.",
            productMapper.mapToResponse(restoredProduct));
}


}