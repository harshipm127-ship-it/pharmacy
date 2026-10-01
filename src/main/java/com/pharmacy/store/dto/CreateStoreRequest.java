package com.pharmacy.store.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateStoreRequest(

    @NotBlank(message = "Store code is required.")
    @Size(max = 20)
    String code,

    @NotBlank(message = "Store name is required.")
    @Size(max = 100)
    String name,

    @NotBlank(message = "Address Line 1 is required.")
    @Size(max = 255)
    String addressLine1,

    @Size(max = 255)
    String addressLine2,

    @Size(max = 150)
    String landmark,

    @NotBlank(message = "Area is required.")
    @Size(max = 100)
    String area,

    @NotBlank(message = "City is required.")
    @Size(max = 100)
    String city,

    @NotBlank(message = "State is required.")
    @Size(max = 100)
    String state,

    @NotBlank(message = "Country is required.")
    @Size(max = 100)
    String country,

    @NotBlank(message = "Postal code is required.")
    @Size(max = 15)
    String postalCode,

    @Size(max = 15)
    String phoneNumber,

    @Email(message = "Invalid email.")
    @Size(max = 150)
    String email,

    @NotNull(message = "Latitude is required.")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90.")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90.")
    BigDecimal latitude,

    @NotNull(message = "Longitude is required.")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180.")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180.")
    BigDecimal longitude,

    @NotNull(message = "Delivery radius is required.")
    @DecimalMin(value = "0.1", message = "Delivery radius must be greater than 0.")
    BigDecimal deliveryRadiusKm,

    Boolean active

) {}