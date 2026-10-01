package com.pharmacy.product.mapper;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.pharmacy.product.dto.ProductDetailsResponse;
import com.pharmacy.product.dto.ProductImageResponse;
import com.pharmacy.product.dto.ProductListResponse;
import com.pharmacy.product.dto.ProductResponse;
import com.pharmacy.product.entity.Product;
import com.pharmacy.product.entity.ProductImage;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final ProductImageMapper productImageMapper;

    public ProductResponse mapToResponse(Product product) {

        return new ProductResponse(

                product.getPublicId(),

                product.getCategory().getPublicId(),

                product.getCategory().getName(),

                product.getSku(),

                product.getName(),

                product.getBrand(),

                product.getManufacturer(),

                product.getDosageForm(),

                product.getStrength(),

                product.getPackSize(),

                product.getShortDescription(),

                product.getDescription(),

                product.getMrp(),

                product.isActive()
        );
    }

    public ProductListResponse mapToListResponse(Product product) {

        String primaryImageUrl = product.getImages()
                .stream()
                .filter(ProductImage::isPrimaryImg)
                .findFirst()
                .map(image -> productImageMapper.mapToResponse(image).imageUrl())
                .orElse(null);

        return new ProductListResponse(

                product.getPublicId(),

                product.getCategory().getName(),

                product.getSku(),

                product.getName(),

                product.getBrand(),
                product.getManufacturer(),

                product.getDosageForm(),

                product.getStrength(),

                product.isActive(),

                primaryImageUrl
        );
    }

    public ProductDetailsResponse mapToDetailsResponse(Product product) {

        List<ProductImageResponse> imageResponses = product.getImages()
                .stream()
                .sorted(Comparator.comparing(ProductImage::getDisplayOrder))
                .map(productImageMapper::mapToResponse)
                .toList();

        return new ProductDetailsResponse(

                product.getPublicId(),

                product.getCategory().getPublicId(),

                product.getCategory().getName(),

                product.getSku(),

                product.getName(),

                product.getBrand(),

                product.getManufacturer(),

                product.getDosageForm(),

                product.getStrength(),

                product.getPackSize(),

                product.getShortDescription(),

                product.getDescription(),

                product.getMrp(),

                product.isActive(),

                imageResponses
        );
    }
}