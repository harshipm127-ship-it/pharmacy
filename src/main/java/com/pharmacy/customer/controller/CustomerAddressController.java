package com.pharmacy.customer.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.dto.request.CreateAddressRequest;
import com.pharmacy.customer.dto.request.UpdateAddressRequest;
import com.pharmacy.customer.dto.response.AddressResponse;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.service.CustomerAddressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer/addresses")
@RequiredArgsConstructor
public class CustomerAddressController {


private final CustomerAddressService customerAddressService;

    @GetMapping
     public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddress(
        @AuthenticationPrincipal User user
      )
      {
            return ResponseEntity.ok(customerAddressService.getAddresses(user));
      } 

      @PostMapping
      public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
       @AuthenticationPrincipal User user, @Valid @RequestBody CreateAddressRequest request
      )
      {
          return ResponseEntity.ok(customerAddressService.addAddress(user, request)); 
      }
      
    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @AuthenticationPrincipal User user,
            @PathVariable Long addressId,
            @Valid @RequestBody UpdateAddressRequest request) {

        return ResponseEntity.ok(customerAddressService.updateAddress
        (user,addressId,request));
    }
    @DeleteMapping("/addressId")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
        @AuthenticationPrincipal @PathVariable Long addressId
    ){
    return ResponseEntity.ok(customerAddressService.deleteAddress(null, addressId));
    }

    @PatchMapping("/addressId")
    public ResponseEntity<ApiResponse<AddressResponse>> makeDefault(
        @AuthenticationPrincipal User user,  @PathVariable Long addressId
    )
    {
        return ResponseEntity.ok(customerAddressService.makeDefault(user, addressId)); 
    }
 }


