package com.pharmacy.department.service;

import java.util.UUID;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.IllegalOperationException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.department.dto.CreateDepartmentRequest;
import com.pharmacy.department.dto.DepartmentListResponse;
import com.pharmacy.department.dto.DepartmentResponse;
import com.pharmacy.department.dto.UpdateDepartmentRequest;
import com.pharmacy.department.entity.Department;
import com.pharmacy.department.repository.DepartmentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DpertmentServiceImp implements DepartmentService{


    private final DepartmentRepository departmentRepository;


     public ApiResponse<DepartmentResponse> createDepartment(CreateDepartmentRequest request) {

        Department department = Department.builder()
                .name(request.name().trim())
                .description(request.description())
                .active(true)
                .build();

        try {

            Department savedDepartment = departmentRepository.save(department);

            return new ApiResponse<>(
                    true,
                    "Department created successfully.",
                    mapToResponse(savedDepartment));

        } catch (DataIntegrityViolationException ex) {

            if (ExceptionUtils.getRootCauseMessage(ex)
                    .contains("uk_department_name")) {

                throw new DuplicateResourceException(
                        "Department already exists.");
            }

            throw ex;
        }
    }
//getDepartment by publicid 
     public ApiResponse<DepartmentResponse> getDepartment(UUID publicId) {

        Department department = departmentRepository
                .findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with publicId: " + publicId));

        return new ApiResponse<>(
                true,
                "Department retrieved successfully.",
                mapToResponse(department));
    }
    //get all department

@Override
public ApiResponse<Page<DepartmentListResponse>> getDepartments(
        int page,
        int size,
        String search,
        String sortBy,
        boolean ascending) {

    Sort sort = ascending
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

    Pageable pageable = PageRequest.of(page - 1, size, sort);

    Page<Department> departments;

    if (search == null || search.isBlank()) {

        departments = departmentRepository.findAll(pageable);

    } else {

        departments = departmentRepository.findByNameContainingIgnoreCase(
                search.trim(),
                pageable);
    }

    return new ApiResponse<>(
            true,
            "Departments retrieved successfully.",
            departments.map(this::mapToListResponse));
}


 //update Departments 
 public ApiResponse<DepartmentResponse> updateDepartment(
            UUID publicId,
            UpdateDepartmentRequest request) {

        Department department = departmentRepository
                .findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with publicId: " + publicId));

        department.setName(request.name().trim());
        department.setDescription(request.description());

        try {

            Department updatedDepartment = departmentRepository.save(department);

            return new ApiResponse<>(
                    true,
                    "Department updated successfully.",
                    mapToResponse(updatedDepartment));

        } catch (DataIntegrityViolationException ex) {

            if (ExceptionUtils.getRootCauseMessage(ex)
                    .contains("uk_department_name")) {

                throw new DuplicateResourceException(
                        "Department already exists.");
            }

            throw ex;
        }
    }
   //delete department 

    public ApiResponse<Void> deleteDepartment(UUID publicId) {

        Department department = departmentRepository
                .findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with publicId: " + publicId));

        if (!department.isActive()) {

            throw new IllegalOperationException(
                    "Department is already inactive.");
        }

        department.setActive(false);

        departmentRepository.save(department);

        return new ApiResponse<>(
                true,
                "Department deleted successfully.",
                null);
    }
   //restore depratment 

    public ApiResponse<Void> restoreDepartment(UUID publicId) {

        Department department = departmentRepository
                .findByPublicId(publicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department not found with publicId: " + publicId));

        if (department.isActive()) {

            throw new IllegalOperationException(
                    "Department is already active.");
        }

        department.setActive(true);

        departmentRepository.save(department);

        return new ApiResponse<>(
                true,
                "Department restored successfully.",
                null);
    }

     //mapping 

      private DepartmentResponse mapToResponse(Department department) {

        return new DepartmentResponse(
                department.getPublicId(),
                department.getName(),
                department.getDescription(),
                department.isActive());
    }

    private DepartmentListResponse mapToListResponse(Department department) {

        return new DepartmentListResponse(
                department.getPublicId(),
                department.getName(),
                department.isActive());
    }
}
