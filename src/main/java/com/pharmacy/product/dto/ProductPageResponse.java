package com.pharmacy.product.dto;

import java.util.List;

public record ProductPageResponse(

        List<ProductListResponse> products,

        int currentPage,

        int totalPages,

        long totalElements,

        int pageSize,

        boolean first,

        boolean last

) {
}