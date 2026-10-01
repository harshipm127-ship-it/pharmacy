package com.pharmacy.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AdminLoginRequest(

        @NotBlank
        String identifier,

        @NotBlank
        String password

) {
}