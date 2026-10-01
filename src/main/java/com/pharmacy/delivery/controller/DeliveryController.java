package com.pharmacy.delivery.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.customer.entity.User;
import com.pharmacy.delivery.dto.DeliveryCheckResponse;
import com.pharmacy.delivery.dto.SelectedStoreResponse;
import com.pharmacy.delivery.dto.StoreFulfillmentResponse;
import com.pharmacy.delivery.service.DeliveryService;
import com.pharmacy.store.dto.NearbyStoreResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/delivery")
@RequiredArgsConstructor
public class DeliveryController {

     private final DeliveryService deliveryService; 


     @GetMapping("/check")
     public ApiResponse<DeliveryCheckResponse> checkDelivery(
       @AuthenticationPrincipal User user, 
       @RequestParam Long addressId,
       @RequestParam UUID storePublicId 
     ){ 

        return deliveryService.checkDelivery(user, addressId, storePublicId); 
     }
@   GetMapping("/nearest-stores")
     public ApiResponse<List<NearbyStoreResponse>> findNearestStores(
       @AuthenticationPrincipal User user, 
       @RequestParam Long addressId, 
       @RequestParam(defaultValue = "5") int limit
     ){
       return deliveryService.findNearestStore(user, addressId, limit); 
     }

     @GetMapping("/stores-for-cart")
     public ApiResponse<List<StoreFulfillmentResponse>> findStoresForCart(
        @AuthenticationPrincipal User user,
        @RequestParam Long addressId,
        @RequestParam(defaultValue = "5") int limit
) {
       return deliveryService.findStoreForCart(user, addressId, limit);   
}

@GetMapping("/select-store")
public ApiResponse<SelectedStoreResponse> selectStoreForCart(
        @AuthenticationPrincipal User user,
        @RequestParam Long addressId) {

    return deliveryService.selectedStoreForCart(
            user,
            addressId
    );
}
}
