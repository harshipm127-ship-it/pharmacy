package com.pharmacy.category.dto;

import java.util.UUID;

public record CategoaryListResponse(

       UUID publicId,

        String name,

        String departmentName,

        boolean active
) {

}
