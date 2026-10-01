package com.pharmacy.product.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.config.minioconfig.storage.service.MinioService;
import com.pharmacy.product.dto.ProductImageResponse;
import com.pharmacy.product.entity.Product;
import com.pharmacy.product.entity.ProductImage;
import com.pharmacy.product.mapper.ProductImageMapper;
import com.pharmacy.product.repository.ProductImgRepository;
import com.pharmacy.product.repository.ProductRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductImageService {
private final ProductRepository productRepository;

private final ProductImgRepository productImageRepository;

private final MinioService minioService;

private final ProductImageMapper productImageMapper;

public ApiResponse<List<ProductImageResponse>> uploadProductImages(
        UUID productPublicId,
        List<MultipartFile> files,
        int primaryImageIndex) {

    if (files == null || files.isEmpty()) {
        throw new BadRequestException("Please select at least one image.");
    }

    Product product = productRepository.findByPublicId(productPublicId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found."));

    if (!product.isActive()) {
        throw new BadRequestException(
                "Cannot upload images to an inactive product.");
    }

    List<ProductImageResponse> responses = new ArrayList<>();

    for (int i = 0; i < files.size(); i++) {

        MultipartFile file = files.get(i);

        ProductImage saved = uploadSingleImage(
                product,
                file,
                i == primaryImageIndex);

        responses.add(productImageMapper.mapToResponse(saved));
    }

    return new ApiResponse<>(
            true,
            "Product images uploaded successfully.",
            responses);
}
public ApiResponse<Void> deleteProductImage(UUID imagePublicId) {

    ProductImage productImage = productImageRepository.findByPublicId(imagePublicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Product image not found."));

    Product product = productImage.getProduct();
    boolean wasPrimaryImage = productImage.isPrimaryImg();

    // Delete from MinIO
    minioService.deleteFile(productImage.getObjectKey());

    // Delete from database
    productImageRepository.delete(productImage);

    // If the deleted image was the primary image,
    // assign the next available image as primary.
    if (wasPrimaryImage) {

        productImageRepository
                .findFirstByProductOrderByDisplayOrderAsc(product)
                .ifPresent(newPrimaryImage -> {
                    newPrimaryImage.setPrimaryImg(true);
                    productImageRepository.save(newPrimaryImage);
                });
    }

    return new ApiResponse<>(
            true,
            "Product image deleted successfully.",
            null);
}

    //method for changing the primary image of a product
    public ApiResponse<ProductImageResponse> setPrimaryImage(UUID imagePublicId) {

    // Find the selected image
    ProductImage selectedImage = productImageRepository
        .findByPublicId(imagePublicId)
        .orElseThrow(() ->
                new ResourceNotFoundException("Product image not found."));

        if (selectedImage.isPrimaryImg()) {
        return new ApiResponse<>(
                true,
                "Image is already the primary image.",
               productImageMapper.mapToResponse(selectedImage)
        );
    }
    Product product = selectedImage.getProduct();

    // Find the current primary image(s)
    List<ProductImage> primaryImages =
            productImageRepository.findByProductAndPrimaryImgTrue(product);

    // Remove primary flag
    primaryImages.forEach(image -> image.setPrimaryImg(false));

    productImageRepository.saveAll(primaryImages);

    // Set selected image as primary
    selectedImage.setPrimaryImg(true);

    ProductImage updatedImage = productImageRepository.save(selectedImage);
return new ApiResponse<>(
        true,
        "Primary image updated successfully.",
      productImageMapper.mapToResponse(updatedImage));
}


private ProductImage uploadSingleImage(
        Product product,
        MultipartFile file,
        boolean primaryImage) {

    if (primaryImage) {
        List<ProductImage> primaryImages =
                productImageRepository.findByProductAndPrimaryImgTrue(product);

        primaryImages.forEach(image -> image.setPrimaryImg(false));

        productImageRepository.saveAll(primaryImages);
    }

    String objectKey = minioService.uploadFile(
            file,
            "products/" + product.getPublicId());

    int displayOrder = productImageRepository
            .findTopByProductOrderByDisplayOrderDesc(product)
            .map(image -> image.getDisplayOrder() + 1)
            .orElse(0);

    ProductImage productImage = ProductImage.builder()
            .product(product)
            .objectKey(objectKey)
            .fileName(file.getOriginalFilename())
            .contentType(file.getContentType())
            .fileSize(file.getSize())
            .primaryImg(primaryImage)
            .displayOrder(displayOrder)
            .build();

    return productImageRepository.save(productImage);
}
}
