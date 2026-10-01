package com.pharmacy.department.service;


import java.util.UUID;

import org.springframework.data.domain.Page;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.department.dto.CreateDepartmentRequest;
import com.pharmacy.department.dto.DepartmentListResponse;
import com.pharmacy.department.dto.DepartmentResponse;
import com.pharmacy.department.dto.UpdateDepartmentRequest;

public interface DepartmentService {

    ApiResponse<DepartmentResponse> createDepartment(CreateDepartmentRequest request);

    ApiResponse<DepartmentResponse> getDepartment(UUID publicId);

    ApiResponse<Page<DepartmentListResponse>> getDepartments(
            int page,
            int size,
            String search,
            String sortBy,
            boolean ascending);

    ApiResponse<DepartmentResponse> updateDepartment(
            UUID publicId,
            UpdateDepartmentRequest request);

    ApiResponse<Void> deleteDepartment(UUID publicId);

    ApiResponse<Void> restoreDepartment(UUID publicId);
}