package com.pharmacy.product.dto;

import java.util.UUID;

public record ProductImageResponse(

        UUID publicId,

        String objectKey,

        String imageUrl,

        String fileName,

        String contentType,

        Long fileSize,

        boolean primaryImage,

        Integer displayOrder

) {
}