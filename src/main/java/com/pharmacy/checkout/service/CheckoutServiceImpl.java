package com.pharmacy.checkout.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.pharmacy.cart.entity.Cart;
import com.pharmacy.cart.entity.CartItem;
import com.pharmacy.cart.repository.CartRepository;

import com.pharmacy.checkout.dto.CheckoutItemResponse;
import com.pharmacy.checkout.dto.CheckoutPreviewRequest;
import com.pharmacy.checkout.dto.CheckoutPreviewResponse;
import com.pharmacy.checkout.dto.CheckoutStoreResponse;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.common.exception.ResourceNotFoundException;

import com.pharmacy.customer.entity.CustomerAddress;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.repository.CustomerAddressRepository;

import com.pharmacy.delivery.dto.StoreFulfillmentResponse;
import com.pharmacy.delivery.service.DeliveryService;
import com.pharmacy.inventory.dto.InventoryBatchAllocation;
import com.pharmacy.inventory.entity.Inventory;
import com.pharmacy.inventory.entity.InventoryBatch;
import com.pharmacy.inventory.repository.InventoryBatchRepository;
import com.pharmacy.inventory.repository.InventoryRepository;
import com.pharmacy.inventory.service.InventoryBatchService;
import com.pharmacy.store.entity.Store;
import com.pharmacy.store.repository.StoreRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements CheckOutService{

    private final CustomerAddressRepository customerAddressRepository; 
   
    private  final CartRepository cartRepository; 
     
    private final DeliveryService deliveryService; 

    private final  InventoryRepository inventoryRepository; 
    
    private final InventoryBatchRepository inventoryBatchRepository;  
    
    private final StoreRepository storeRepository; 

    private final InventoryBatchService inventoryBatchService;

    @Override
    public ApiResponse<CheckoutPreviewResponse> preview(
        User user,
        CheckoutPreviewRequest request) {
        // validate customer's address 

        CustomerAddress address = 
        customerAddressRepository.findByUser(user).stream()
        .filter(a -> a.getPublicId().equals(request.addressPublicId()))
        .findFirst().orElseThrow(()-> new ResourceNotFoundException("Customer address not found. "));
    
        //get customer's cart

        Cart cart = cartRepository.findByUser(user)
        .orElseThrow(() -> new ResourceNotFoundException("Cart Not found"));

        //cart cannot be empty
        if(cart.getItems().isEmpty()){
            throw new BadRequestException("Cart is empty");
        }
        /* 
        Ask Delivery domain for nearby store that can actully 
        fulfill the entire cart 

        We don't duplicate: 
        -Haversine
        -delivery radius
        -inventory
        */ 
       ApiResponse<List<StoreFulfillmentResponse>> storeResponse=
        deliveryService.findStoreForCart(user, address.getId(), 5); 
 
        StoreFulfillmentResponse selectedStore =
        storeResponse.data()
                .stream()
                .filter(StoreFulfillmentResponse::deliverable)
                .filter(StoreFulfillmentResponse::canFulfillCart)
                .findFirst()
                .orElseThrow(() ->
                        new BadRequestException(
                                "No store can fulfill the cart for this address."
                        ));
       // convert cart items into checkout items 
       // Convert cart items into checkout items
List<CheckoutItemResponse> items =
        cart.getItems()
                .stream()
                .map(item ->
                        mapItem(
                                item,
                                selectedStore.storePublicId()
                        )
                )
                .toList();
       // calculate totals 
       Integer totalItems =
        cart.getItems().stream().mapToInt(CartItem::getQuantity).sum();

      BigDecimal subtotal =
        items.stream()
                .map(CheckoutItemResponse::itemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        //Delivery fee is not implemented yet. 
        BigDecimal deliveryFee = BigDecimal.ZERO.setScale(2); 
        BigDecimal totalAmount=  subtotal.add(deliveryFee); 
    
    CheckoutStoreResponse store= 
        new CheckoutStoreResponse(
             selectedStore.storePublicId(), 
             selectedStore.code(),
             selectedStore.name(),
             selectedStore.city(),
             selectedStore.area(), 
             selectedStore.distanceKm(),
             selectedStore.deliveryRadiusKm()
        );

          CheckoutPreviewResponse response =
            new CheckoutPreviewResponse(
                    address.getPublicId(),
                    store,
                    items,
                    totalItems,
                    subtotal,
                    deliveryFee,
                    totalAmount
            );

    return new ApiResponse<CheckoutPreviewResponse>(
            true,
            "Checkout preview generated successfully.",
            response
    );
        }
private CheckoutItemResponse mapItem(
        CartItem item,
        UUID storePublicId
) {

    Store store = storeRepository
            .findByPublicId(storePublicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Selected store not found."
                    ));

    Inventory inventory = inventoryRepository
            .findByProductIdAndStoreId(
                    item.getProduct().getId(),
                    store.getId()
            )
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Product inventory not found in selected store."
                    ));

    List<InventoryBatchAllocation> allocations =
            inventoryBatchService.allocateStock(
                    inventory,
                    item.getQuantity()
            );

    BigDecimal itemTotal =
            allocations.stream()
                    .map(InventoryBatchAllocation::itemTotal)
                    .reduce(
                            BigDecimal.ZERO,
                            BigDecimal::add
                    );

    BigDecimal sellingPrice =
            itemTotal.divide(
                    BigDecimal.valueOf(item.getQuantity()),
                    2,
                    RoundingMode.HALF_UP
            );

    return new CheckoutItemResponse(
            item.getProduct().getPublicId(),
            item.getProduct().getSku(),
            item.getProduct().getName(),
            sellingPrice,
            item.getQuantity(),
            itemTotal
    );
}
}
