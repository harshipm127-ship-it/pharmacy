package com.pharmacy.cart.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.cart.entity.Cart;
import com.pharmacy.customer.entity.User;

public interface CartRepository extends JpaRepository<Cart , UUID>{


    Optional<Cart> findByUser(User user);
    
    Optional<Cart> findByPublicIdAndUser(UUID publicId, User user); 
    
}
