package com.pharmacy.category.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.category.entity.Category;
import com.pharmacy.department.entity.Department;

public interface CategoryRepository extends JpaRepository<Category ,UUID>{

    Optional<Category> findByPublicId(UUID publicId); 

    boolean existsByDepartmentAndNameIgnoreCase(Department department, String name); 

    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable); 
}
