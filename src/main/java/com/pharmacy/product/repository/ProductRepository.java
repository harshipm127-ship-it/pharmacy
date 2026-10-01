package com.pharmacy.product.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.product.entity.Product;



public interface ProductRepository extends JpaRepository<Product, UUID>{

    Optional<Product> findByPublicId(UUID publicId);

      Optional<Product>  findBySku(String sku);

          boolean existsBySku(String sku);

 Page<Product> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(
            String name,
            String sku,
            Pageable pageable);
        }
