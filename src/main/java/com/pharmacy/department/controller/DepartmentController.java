package com.pharmacy.department.controller;

import java.util.UUID;

import org.simpleframework.xml.core.Validate;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.department.dto.CreateDepartmentRequest;
import com.pharmacy.department.dto.DepartmentListResponse;
import com.pharmacy.department.dto.DepartmentResponse;
import com.pharmacy.department.service.DepartmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
@Validate
public class DepartmentController {

    private final DepartmentService departmentService;



    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(
        @Valid @RequestBody CreateDepartmentRequest request
    ){
           return ResponseEntity.status(HttpStatus.CREATED)
           .body(departmentService.createDepartment(request));
    }


    @GetMapping("/{publicId}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartment(
         @PathVariable UUID publicId
    ){
        return ResponseEntity.ok(departmentService.getDepartment(publicId));
    } 
    @GetMapping
    public ResponseEntity<ApiResponse<Page<DepartmentListResponse>>> getAllDepartments(
@RequestParam(defaultValue = "1") int page,

        @RequestParam(defaultValue = "10") int size,

        @RequestParam(required = false) String search,

        @RequestParam(defaultValue = "name") String sortBy,

        @RequestParam(defaultValue = "true") boolean ascending)

    { 
           return ResponseEntity.ok(departmentService.getDepartments(page, size, search, sortBy, ascending));
    }


    @DeleteMapping("/{publicId}")
      public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable UUID publicId){
        return ResponseEntity.ok(departmentService.deleteDepartment(publicId));

      }

      @PatchMapping("/{publicId}/restore")
public ResponseEntity<ApiResponse<Void>> restoreDepartment(
        @PathVariable UUID publicId) {

    return ResponseEntity.ok(
            departmentService.restoreDepartment(publicId));
}
}

