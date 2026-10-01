package com.pharmacy.store.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.DuplicateResourceException;
import com.pharmacy.common.exception.IllegalOperationException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.store.dto.CreateStoreRequest;
import com.pharmacy.store.dto.StoreDetailsResponse;
import com.pharmacy.store.dto.StoreListResponse;
import com.pharmacy.store.dto.StoreResponse;
import com.pharmacy.store.dto.UpdateStoreRequest;
import com.pharmacy.store.entity.Store;
import com.pharmacy.store.repository.StoreRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreService {

    private final StoreRepository storeRepository;

public ApiResponse<StoreResponse> createStore(CreateStoreRequest request) {

    if (storeRepository.existsByCode(request.code())) {
        throw new DuplicateResourceException("Store code already exists.");
    }

   Store store = Store.builder()
        .code(request.code())
        .name(request.name())
        .addressLine1(request.addressLine1())
        .addressLine2(request.addressLine2())
        .landmark(request.landmark())
        .area(request.area())
        .city(request.city())
        .state(request.state())
        .country(request.country())
        .postalCode(request.postalCode())
        .phoneNumber(request.phoneNumber())
        .email(request.email())
        .latitude(request.latitude())
        .longitude(request.longitude())
        .deliveryRadiusKm(request.deliveryRadiusKm())
        .active(request.active() != null ? request.active() : true)
        .build();

    Store savedStore = storeRepository.save(store);

    return new ApiResponse<>(
            true,
            "Store created successfully.",
            mapToResponse(savedStore));
}

public ApiResponse<Page<StoreListResponse>> getAllStores(
    int page, 
    int size,
     String search,
    String sortBy,
    String direction) {

         Sort sort =  direction.equalsIgnoreCase("desc") 
         ? Sort.by(sortBy).descending() 
         : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
       Page<Store> stores = storeRepository
        .findByNameContainingIgnoreCaseOrCodeContainingIgnoreCaseOrAreaContainingIgnoreCaseOrCityContainingIgnoreCaseOrStateContainingIgnoreCaseOrAddressLine1ContainingIgnoreCaseOrLandmarkContainingIgnoreCase(
                search,
                search,
                search,
                search,
                search,
                search,
                search,
                pageable);

        Page<StoreListResponse> response = stores.map(store ->
        new StoreListResponse(
                store.getPublicId(),
                store.getCode(),
                store.getName(),
                store.getArea(),
                store.getCity(),
                store.isActive()
        ));

        String message = response.isEmpty()
        ? "No stores found."
        : "Stores retrieved successfully.";
         return  new ApiResponse<>(true,  
        message,             
        response);
    
}
   private StoreResponse mapToResponse(Store store) {

    return new StoreResponse(
            store.getPublicId(),
            store.getCode(),
            store.getName(),
            store.getAddressLine1(),
            store.getAddressLine2(),
            store.getLandmark(),
            store.getArea(),
            store.getCity(),
            store.getState(),
            store.getCountry(),
            store.getPostalCode(),
            store.getPhoneNumber(),
            store.getEmail(),

                        // Location
                        store.getLatitude(),
                        store.getLongitude(),
                        store.getDeliveryRadiusKm(),
            store.isActive()
    );
}
//method for geting all store 
public ApiResponse<StoreDetailsResponse> getStoreDetailsByPublicId(UUID publicId) {

    Store store = storeRepository.findByPublicId(publicId)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Store not found."));

    StoreDetailsResponse response = new StoreDetailsResponse(
         store.getPublicId(),
        store.getCode(),
        store.getName(),
        store.getAddressLine1(),
        store.getAddressLine2(),
        store.getLandmark(),
        store.getArea(),
        store.getCity(),
        store.getState(),
        store.getCountry(),
        store.getPostalCode(),
        store.getPhoneNumber(),
        store.getEmail(),

                        // Location
                        store.getLatitude(),
                        store.getLongitude(),
                        store.getDeliveryRadiusKm(),
        store.isActive()
    );

    return new ApiResponse<>(
            true,
            "Store details fetched successfully.",
            response);
}

public ApiResponse<StoreResponse> updateStore(UUID publicId, UpdateStoreRequest request){

    Store store = storeRepository.findByPublicId(publicId)
    .orElseThrow(() -> new ResourceNotFoundException("Store not found."));
             
   store.setName(request.name());

store.setAddressLine1(request.addressLine1());
store.setAddressLine2(request.addressLine2());
store.setLandmark(request.landmark());

store.setArea(request.area());
store.setCity(request.city());
store.setState(request.state());
store.setCountry(request.country());

store.setPostalCode(request.postalCode());
 store.setLatitude(request.latitude());
 store.setLongitude(request.longitude());
 store.setDeliveryRadiusKm(request.deliveryRadiusKm());
store.setPhoneNumber(request.phoneNumber());
store.setEmail(request.email());

if (request.active() != null) {
    store.setActive(request.active());
}
    storeRepository.save(store);
    return new ApiResponse<>(
            true,
            "Store updated successfully.",
            mapToResponse(store));
}

public ApiResponse<StoreResponse> deleteStore(UUID publicId){

    Store store = storeRepository.findByPublicId(publicId)
    .orElseThrow(() -> new ResourceNotFoundException("Store not found."));

    if(!store.isActive()){
        throw new IllegalOperationException("Store is already inactive.");
    }   
    store.setActive(false);

    Store updatedStore = storeRepository.save(store);
    return new ApiResponse<>(
            true,
            "Store deleted successfully.",
            mapToResponse(updatedStore));
}

public ApiResponse<StoreResponse>  restoreStore(UUID publicId){

    Store store = storeRepository.findByPublicId(publicId)
    .orElseThrow(() -> new ResourceNotFoundException("Store not found."));
    if(store.isActive()) {
        throw new IllegalOperationException("Store is already active.");
    }
    store.setActive(true);
    Store updatedStore = storeRepository.save(store);
    return new ApiResponse<>(
            true,
            "Store restored successfully.",
            mapToResponse(updatedStore));   
}
}
