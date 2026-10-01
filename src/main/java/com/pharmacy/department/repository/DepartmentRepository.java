package com.pharmacy.department.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.department.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    Optional<Department> findByPublicId(UUID publicId);

    boolean existsByNameIgnoreCase(String name);

    Page<Department> findByNameContainingIgnoreCase(String name, Pageable pageable);

}