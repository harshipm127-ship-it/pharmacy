package com.pharmacy.category.dto;

import java.util.UUID;

public record CategoryResponse(

     UUID publicId,

        UUID departmentPublicId,

        String departmentName,

        String name,

        String description,

        boolean active
) {

}
