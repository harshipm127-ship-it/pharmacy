package com.pharmacy.department.dto;

import java.util.UUID;

public record DepartmentListResponse(

    UUID publicId, 

    String name, 

    boolean active
) {

}
