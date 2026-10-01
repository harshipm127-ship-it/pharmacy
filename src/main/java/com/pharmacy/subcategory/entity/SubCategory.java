package com.pharmacy.subcategory.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.pharmacy.category.entity.Category;
import com.pharmacy.common.entity.BaseEntity;
import com.pharmacy.product.entity.Product;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "sub_categories",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_category_subcategory_name",
            columnNames = { "category_id", "name" }
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubCategory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

//     @OneToMany(
//     mappedBy = "subCategory",
//     fetch = FetchType.LAZY,
//     cascade = CascadeType.ALL
// )
// @Builder.Default
// private List<Product> products = new ArrayList<>();

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}