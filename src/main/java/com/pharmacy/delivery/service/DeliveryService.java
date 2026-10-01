package com.pharmacy.delivery.service;

import com.pharmacy.inventory.service.InventoryBatchService;
import com.pharmacy.inventory.service.InventoryBatchServiceImp;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.pharmacy.cart.entity.Cart;
import com.pharmacy.cart.entity.CartItem;
import com.pharmacy.cart.repository.CartRepository;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.customer.entity.CustomerAddress;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.repository.CustomerAddressRepository;
import com.pharmacy.delivery.dto.DeliveryCheckResponse;
import com.pharmacy.delivery.dto.SelectedStoreResponse;
import com.pharmacy.delivery.dto.StoreFulfillmentResponse;
import com.pharmacy.inventory.entity.Inventory;
import com.pharmacy.inventory.repository.InventoryBatchRepository;
import com.pharmacy.inventory.repository.InventoryRepository;
import com.pharmacy.store.dto.NearbyStoreResponse;
import com.pharmacy.store.entity.Store;
import com.pharmacy.store.repository.StoreRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryService {
 
    private final InventoryBatchService inventoryBatchService;
    private final CustomerAddressRepository customerAddressRepository; 
    private final StoreRepository storeRepository;
    private final CartRepository cartRepository;
    private final InventoryRepository inventoryRepository;


    public ApiResponse<DeliveryCheckResponse> checkDelivery(
        User user, Long addressId, UUID storePublicId
    ){

         CustomerAddress address = customerAddressRepository.findByIdAndUser(addressId, user)
         .orElseThrow(()-> new ResourceNotFoundException("Customer Address not found."));

         Store store= storeRepository.findByPublicId(storePublicId)
         .orElseThrow(()-> new ResourceNotFoundException("Store not found"));


                 validateLocationData(address, store);

                 BigDecimal distanceKm = calculateDistanceKm(
                    address.getLatitude(),
                    address.getLongitude(),
                    store.getLatitude(),
                    store.getLongitude()
);

                 boolean deliverable=  distanceKm.compareTo(store.getDeliveryRadiusKm())<=0;
              DeliveryCheckResponse response =

              new DeliveryCheckResponse(
                store.getPublicId(), 
                address.getPublicId(), 
                deliverable, 
                distanceKm, 
                store.getDeliveryRadiusKm()
              ); 
              
              String message = deliverable ? "Store can deliver  to this address" : "Store dose not deliver to this address ";
         return new ApiResponse<>(
            true, 
            message, 
            response
         ); 
    
    }

    private void validateLocationData(CustomerAddress address,  Store store){

        if(address.getLatitude() ==null || address.getLongitude()==null){
             throw new BadRequestException(
                    "Customer address does not have valid location coordinates.");
        }
         if(store.getLatitude()==null ||  store.getLongitude()== null){
              throw new BadRequestException(
                    "Customer address does not have valid location coordinates.");
         }
          if (store.getDeliveryRadiusKm() == null
                || store.getDeliveryRadiusKm()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new BadRequestException(
                    "Store does not have a valid delivery radius.");
        }
    }

   private BigDecimal calculateDistanceKm(
        BigDecimal latitude1,
        BigDecimal longitude1,
        BigDecimal latitude2,
        BigDecimal longitude2) {

    double lat1 = Math.toRadians(latitude1.doubleValue());
    double lon1 = Math.toRadians(longitude1.doubleValue());

    double lat2 = Math.toRadians(latitude2.doubleValue());
    double lon2 = Math.toRadians(longitude2.doubleValue());

    double deltaLat = lat2 - lat1;
    double deltaLon = lon2 - lon1;

    double a =
            Math.pow(Math.sin(deltaLat / 2), 2)
            + Math.cos(lat1)
            * Math.cos(lat2)
            * Math.pow(Math.sin(deltaLon / 2), 2);

    // Protect against floating-point rounding.
    a = Math.max(0.0, Math.min(1.0, a));

    double c =
            2 * Math.atan2(
                    Math.sqrt(a),
                    Math.sqrt(1.0 - a)
            );

    double earthRadiusKm = 6371.0088;

    double distance = earthRadiusKm * c;

    return BigDecimal.valueOf(distance)
            .setScale(2, RoundingMode.HALF_UP);
}

public ApiResponse<List<NearbyStoreResponse>> findNearestStore(
        User user , Long addressId, int limit
){
 CustomerAddress customerAddress = customerAddressRepository.findByIdAndUser(addressId, user)
 .orElseThrow(()-> new ResourceNotFoundException("Cusomter Address not found"));
 
  if(customerAddress.getLatitude() == null || customerAddress.getLongitude()==null){
        throw new BadRequestException("Customer address does not have valid location coordinates."); 
  }
  if(limit<=0){
        throw new BadRequestException("Store limit must be greater thatn zero");
  }

   List<NearbyStoreResponse> stores=
   storeRepository.findByActiveTrue().stream().filter(store -> 
         store.getLatitude()!=null && store.getLongitude()!=null 
        && store.getDeliveryRadiusKm()!=null 
        && store.getDeliveryRadiusKm().compareTo(BigDecimal.ZERO)>0)
        .map(store -> {
                BigDecimal distanceKm = 
                calculateDistanceKm(customerAddress.getLatitude(), 
                customerAddress.getLongitude(), store.getLatitude(), store.getLongitude());
                boolean deliverable =
                                distanceKm.compareTo(
                                        store.getDeliveryRadiusKm()
                                ) <= 0;

                return new NearbyStoreResponse(
                 store.getPublicId(), store.getCode(),store.getName(),store.getArea(),
                 store.getCity(),store.getLatitude(),store.getLongitude(),
                 store.getDeliveryRadiusKm(), distanceKm, deliverable);
        }).sorted(
                 Comparator.comparing(
                 NearbyStoreResponse::distanceKm
                    )
                    )
                    .limit(limit)
                    .toList();

return new ApiResponse<>(
        true, stores.isEmpty()?"No store found" : "Nearest Stores retrieved successfully",
        stores
);
 }

 public ApiResponse<List<StoreFulfillmentResponse>> findStoreForCart(
        User user, Long addressId,  int limit
 ){
     CustomerAddress address = customerAddressRepository.findByIdAndUser(addressId, user)
     .orElseThrow(()-> new ResourceNotFoundException("Customer Address not found "));

           validateCustomerLocation(address); 

           Cart cart = cartRepository.findByUser(user)
           .orElseThrow(()->new ResourceNotFoundException("Cart not found")); 
        
        if(cart.getItems().isEmpty()){
                throw new BadRequestException("cart is Empty"); 
        }
     if(limit<=0){
        throw new BadRequestException("Store limit  must be greater than zero ");
     }
     List<StoreFulfillmentResponse> stores=
     storeRepository.findByActiveTrue().stream()
     //only store with valid location/radius
     .filter(store ->  store.getLatitude() != null
                            && store.getLongitude() != null
                            && store.getDeliveryRadiusKm() != null
                            && store.getDeliveryRadiusKm()
                                    .compareTo(BigDecimal.ZERO) > 0
              ).map(store->{

                BigDecimal distanceKm = 
                calculateDistanceKm(address.getLatitude(), address.getLongitude(),
                  store.getLatitude(), store.getLongitude()); 
                
                     boolean deliverable =
                                distanceKm.compareTo(
                                        store.getDeliveryRadiusKm()
                                ) <= 0;

                        boolean canFulfillCart =
                                deliverable
                                && canStoreFulfillCart(
                                        store.getId(),
                                        cart
                                );

                        return new StoreFulfillmentResponse(
                                store.getPublicId(),
                                store.getCode(),
                                store.getName(),
                                store.getCity(),
                                store.getArea(),
                                distanceKm,
                                store.getDeliveryRadiusKm(),
                                deliverable,
                                canFulfillCart
                        );
              }).sorted(
             Comparator.comparing(StoreFulfillmentResponse::distanceKm)                
              ).limit(limit).toList();

               return new ApiResponse<>(
                true, 
                "Store fullfillment check completed successfully", 
                stores
               ); 
 }


 private boolean  canStoreFulfillCart(
        UUID storeId, 
        Cart  cart
 ){
    for(CartItem cartItem :cart.getItems()){
        UUID productId = cartItem.getProduct().getId(); 

        int requestQuantity = cartItem.getQuantity();
        
        Inventory inventory = inventoryRepository.findByProductIdAndStoreId(productId, storeId)
        .orElse(null); 

        //Store does not carry this product 

        if(inventory==null|| !inventory.isActive()){
                return false; 
        }
        try {
                inventoryBatchService.allocateStock(inventory, requestQuantity);
        } catch (BadRequestException e) {
                // Inventory batches cannot fulfill the request quantity

         return false; 
        }   
}
return true; 
 }

 private void validateCustomerLocation(
        CustomerAddress address) {

    if (address.getLatitude() == null
            || address.getLongitude() == null) {

        throw new BadRequestException(
                "Customer address does not have valid location coordinates."
        );
    }
}
 

//Store selection method  
public ApiResponse<SelectedStoreResponse> selectedStoreForCart(
        User user, Long addressId
){
   CustomerAddress address = customerAddressRepository.findByIdAndUser(addressId, user)
   .orElseThrow(()-> new ResourceNotFoundException("Customer Address not found. "));

   validateCustomerLocation(address);

   Cart cart = cartRepository.findByUser(user).orElseThrow(
        ()-> new ResourceNotFoundException("Cart Not found")
   ); 

   if(cart.getItems().isEmpty()){
        throw new BadRequestException("Cart is Empty");
   }

    Store selectedStore = null;
    BigDecimal selectedDistance = null;

    for(Store store : storeRepository.findByActiveTrue()){
        if (store.getLatitude() == null
                || store.getLongitude() == null
                || store.getDeliveryRadiusKm() == null
                || store.getDeliveryRadiusKm()
                        .compareTo(BigDecimal.ZERO) <= 0) {
            continue;
        }
        BigDecimal distanceKm = 
          calculateDistanceKm(
                        address.getLatitude(),
                        address.getLongitude(),
                        store.getLatitude(),
                        store.getLongitude()
                );
     // Store cannot deliver to the address
   if (distanceKm.compareTo(
                store.getDeliveryRadiusKm()) > 0) {
            continue;
        }
     //Store dose not have enough stock for the entire cart 

     if(!canStoreFulfillCart(store.getId(), cart)){
        continue;
     }
  //First eligible store
   if (selectedStore == null || distanceKm.compareTo(selectedDistance)<0) {
          selectedStore = store;
          selectedDistance = distanceKm;
   }
 }
 if (selectedStore == null) {
        throw new BadRequestException("No store can fulfill the cart for this address.");
 }
  SelectedStoreResponse response =
            new SelectedStoreResponse(
                    selectedStore.getPublicId(),
                    selectedStore.getCode(),
                    selectedStore.getName(),
                    selectedStore.getArea(),
                    selectedStore.getCity(),
                    selectedDistance,
                    selectedStore.getDeliveryRadiusKm()
       );
       return new ApiResponse<>(
        true, 
        "Store selected successfully", 
        response
       );
}
}
