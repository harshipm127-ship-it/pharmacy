package com.pharmacy.store.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.store.entity.Store;
import java.util.List;


public interface StoreRepository extends JpaRepository<Store, UUID> {
   
    Optional<Store> findByPublicId(UUID publicId);

    Optional<Store> findByCode(String code); 
     boolean existsByCode(String code);

  Page<Store> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCaseOrAreaContainingIgnoreCaseOrCityContainingIgnoreCaseOrStateContainingIgnoreCaseOrAddressLine1ContainingIgnoreCaseOrLandmarkContainingIgnoreCase(
        String name,
        String code,
        String area,
        String city,
        String state,
        String addressLine1,
        String landmark,
        Pageable pageable);

        List<Store> findByActiveTrue(); 
}
