package com.pharmacy.store.dto;

import java.util.UUID;

public record StoreListResponse(

    UUID publicId,

    String code,

    String name,

    String area,

    String city,

    Boolean active

) {}