package com.pharmacy.customer.dto.request;

import java.math.BigDecimal;

import com.pharmacy.customer.enums.AddressType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAddressRequest {

    @NotNull
    private AddressType addressType;

    @NotBlank
    private String recipientName;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String addressLine1;

    private String addressLine2;

    private String landmark;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String postalCode;

    @NotBlank
    private String country;

    @NotNull
    private BigDecimal latitude;

    @NotNull
    private BigDecimal longitude;

    private boolean isDefault;
}