package com.pharmacy.customer.dto.response;

import java.math.BigDecimal;

import com.pharmacy.customer.enums.AddressType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {

    private Long id;

    private String publicId;

    private AddressType addressType;

    private String recipientName;

    private String phoneNumber;

    private String addressLine1;

    private String addressLine2;

    private String landmark;

    private String city;

    private String state;

    private String postalCode;

    private String country;

   private  BigDecimal latitude;
   private BigDecimal longitude;
    
    private boolean isDefault;
}