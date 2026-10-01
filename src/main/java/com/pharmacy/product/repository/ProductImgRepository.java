package com.pharmacy.product.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.product.entity.Product;
import com.pharmacy.product.entity.ProductImage;

public interface ProductImgRepository extends JpaRepository<ProductImage, UUID> {

    Optional<ProductImage> findByPublicId(UUID publicId);

    List<ProductImage> findByProductPublicId(UUID productPublicId);

    List<ProductImage> findByProductAndPrimaryImgTrue(Product product);

    Optional<ProductImage> findTopByProductOrderByDisplayOrderDesc(Product product);

    Optional<ProductImage> findFirstByProductOrderByDisplayOrderAsc(Product product);
}