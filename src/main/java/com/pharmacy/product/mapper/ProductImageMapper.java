package com.pharmacy.product.mapper;

import org.springframework.stereotype.Component;

import com.pharmacy.config.minioconfig.storage.service.MinioService;
import com.pharmacy.product.dto.ProductImageResponse;
import com.pharmacy.product.entity.ProductImage;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor

public class ProductImageMapper {

    private final MinioService minioService;

public ProductImageResponse mapToResponse(ProductImage image) {

    return new ProductImageResponse(

            image.getPublicId(),

            image.getObjectKey(),

            minioService.getObjectUrl(image.getObjectKey()),

            image.getFileName(),

            image.getContentType(),

            image.getFileSize(),

            image.isPrimaryImg(),

            image.getDisplayOrder()
    );
}
}
