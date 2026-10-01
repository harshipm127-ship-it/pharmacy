package com.pharmacy.category.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateCategoryRequest(

    @NotNull(message = "Department public Id is required")
    UUID departmentPublicId,
    @Size(max = 100) 
    String name, 

    @Size(max = 500)
    String description
) {

}
