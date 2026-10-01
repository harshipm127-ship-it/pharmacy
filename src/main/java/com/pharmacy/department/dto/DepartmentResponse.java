package com.pharmacy.department.dto;

import java.util.UUID;

public record DepartmentResponse(
    
    UUID publicId,
    String name, 
    String description, 
    boolean active
) {

}
