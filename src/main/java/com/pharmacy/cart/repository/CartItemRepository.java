package com.pharmacy.cart.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.cart.entity.Cart;
import com.pharmacy.cart.entity.CartItem;
import com.pharmacy.product.entity.Product;

public interface CartItemRepository extends JpaRepository<CartItem,  UUID>{

        Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

        Optional<CartItem> findByPublicIdAndCart(UUID publicId, Cart cart);
}
