package com.pharmacy.category.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.pharmacy.common.entity.BaseEntity;
import com.pharmacy.department.entity.Department;
import com.pharmacy.subcategory.entity.SubCategory;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "categories",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_department_category_name",
            columnNames = {"department_id", "name"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
@JoinColumn(name = "department_id", nullable = false)
private Department department;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

   @OneToMany(
    mappedBy = "category",
    fetch = FetchType.LAZY,
    cascade = CascadeType.ALL
)
   @Builder.Default
   private List<SubCategory> subCategories = new ArrayList<>();
}