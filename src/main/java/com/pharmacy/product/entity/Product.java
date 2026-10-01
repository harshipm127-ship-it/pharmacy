package com.pharmacy.product.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.pharmacy.category.entity.Category;
import com.pharmacy.common.entity.BaseEntity;
import com.pharmacy.product.enmus.DosageForm;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 50)
    private String name;
    
    @Column(nullable = false, length = 255)
    private String shortDescription;

    @Column(length = 500)
    private String description;
    @Column(nullable = false)
    
    private BigDecimal mrp;

    @Column(nullable = false)
    private boolean active;

   @Enumerated(EnumType.STRING)
   @Column(name = "dosage_form", length = 30)
   private DosageForm dosageForm;

    @Column(length = 100)
    private String brand;

    @Column(length = 150)
    private String manufacturer;

     @Column(length = 50)
     private String strength;

     @Column(name = "pack_size", length = 50)
     private String packSize;

    @OneToMany(
        mappedBy = "product",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<ProductImage> images= new ArrayList<>();


    
}
