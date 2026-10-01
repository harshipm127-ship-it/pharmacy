package com.pharmacy.inventory.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record CreateInventoryRequest(

    @NotNull(message = "Product publicId is required.")
    UUID productPublicId,

    @NotNull(message = "Store publicId is required.")
    UUID storePublicId

) {}