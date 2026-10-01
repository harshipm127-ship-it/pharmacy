package com.pharmacy.cart.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.pharmacy.cart.entity.Cart;
import com.pharmacy.cart.entity.CartItem;
import com.pharmacy.cart.repository.CartItemRepository;
import com.pharmacy.cart.repository.CartRepository;
import com.pharmacy.cart.request.AddCartItemRequest;
import com.pharmacy.cart.request.UpdateCartItemRequest;
import com.pharmacy.cart.response.CartItemResponse;
import com.pharmacy.cart.response.CartResponse;
import com.pharmacy.common.dto.ApiResponse;
import com.pharmacy.common.exception.BadRequestException;
import com.pharmacy.common.exception.ResourceNotFoundException;
import com.pharmacy.customer.entity.CustomerAddress;
import com.pharmacy.customer.entity.User;
import com.pharmacy.customer.repository.CustomerAddressRepository;
import com.pharmacy.delivery.dto.StoreFulfillmentResponse;
import com.pharmacy.delivery.service.DeliveryService;
import com.pharmacy.inventory.entity.Inventory;
import com.pharmacy.inventory.entity.InventoryBatch;
import com.pharmacy.inventory.repository.InventoryBatchRepository;
import com.pharmacy.inventory.repository.InventoryRepository;
import com.pharmacy.product.entity.Product;
import com.pharmacy.product.repository.ProductRepository;
import com.pharmacy.store.entity.Store;
import com.pharmacy.store.repository.StoreRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private final InventoryBatchRepository inventoryBatchRepository;
    private final InventoryRepository inventoryRepository;

    private final CustomerAddressRepository customerAddressRepository;
    private final DeliveryService deliveryService;
    private final StoreRepository storeRepository;


    // =========================================================
    // GET CART
    // =========================================================

    @Override
    public ApiResponse<CartResponse> getCart(
            User user,
            UUID addressPublicId) {

        Cart cart = getOrCreateCart(user);

        if (cart.getItems().isEmpty()) {

            return new ApiResponse<>(
                    true,
                    "Cart retrieved successfully.",
                    new CartResponse(
                            cart.getPublicId(),
                            List.of(),
                            0,
                            BigDecimal.ZERO
                    )
            );
        }

        Store store = resolveFulfillmentStore(
                user,
                addressPublicId
        );

        return new ApiResponse<>(
                true,
                "Cart retrieved successfully.",
                mapToResponse(cart, store)
        );
    }


    // =========================================================
    // ADD ITEM
    // =========================================================

    @Override
    public ApiResponse<CartResponse> addItem(
            User user,
            UUID addressPublicId,
            AddCartItemRequest request) {

        Product product = productRepository
                .findByPublicId(request.productPublicId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found."
                        ));

        if (!product.isActive()) {
            throw new BadRequestException(
                    "Product is currently unavailable."
            );
        }

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository
                        .findByCartAndProduct(cart, product)
                        .orElse(null);

        if (cartItem == null) {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.quantity())
                    .build();

            cartItemRepository.save(cartItem);

        } else {

            int newQuantity =
                    cartItem.getQuantity() + request.quantity();

            if (newQuantity <= 0) {
                throw new BadRequestException(
                        "Cart quantity must be greater than zero."
                );
            }

            cartItem.setQuantity(newQuantity);

            cartItemRepository.save(cartItem);
        }

        Store store = resolveFulfillmentStore(
                user,
                addressPublicId
        );

        return new ApiResponse<>(
                true,
                "Product added to cart successfully.",
                mapToResponse(cart, store)
        );
    }


    // =========================================================
    // UPDATE ITEM
    // =========================================================

    @Override
    public ApiResponse<CartResponse> updateItem(
            User user,
            UUID addressPublicId,
            UUID itemPublicId,
            UpdateCartItemRequest request) {

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository
                        .findByPublicIdAndCart(
                                itemPublicId,
                                cart
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart item not found."
                                ));

        Product product = cartItem.getProduct();

        if (!product.isActive()) {
            throw new BadRequestException(
                    "Product is currently unavailable."
            );
        }

        cartItem.setQuantity(request.quantity());

        cartItemRepository.save(cartItem);

        Store store = resolveFulfillmentStore(
                user,
                addressPublicId
        );

        return new ApiResponse<>(
                true,
                "Cart item updated successfully.",
                mapToResponse(cart, store)
        );
    }


    // =========================================================
    // REMOVE ITEM
    // =========================================================

    @Override
    public ApiResponse<CartResponse> removeItem(
            User user,
            UUID addressPublicId,
            UUID itemPublicId) {

        Cart cart = getOrCreateCart(user);

        CartItem cartItem =
                cartItemRepository
                        .findByPublicIdAndCart(
                                itemPublicId,
                                cart
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart item not found."
                                ));

        cartItemRepository.delete(cartItem);

        /*
         * If the cart is now empty, there is no need to
         * resolve a fulfillment store.
         */
        if (cart.getItems().isEmpty()) {

            return new ApiResponse<>(
                    true,
                    "Cart item removed successfully.",
                    new CartResponse(
                            cart.getPublicId(),
                            List.of(),
                            0,
                            BigDecimal.ZERO
                    )
            );
        }

        Store store = resolveFulfillmentStore(
                user,
                addressPublicId
        );

        return new ApiResponse<>(
                true,
                "Cart item removed successfully.",
                mapToResponse(cart, store)
        );
    }


    // =========================================================
    // CLEAR CART
    // =========================================================

    @Override
    public ApiResponse<Void> clearCart(User user) {

        Cart cart = getOrCreateCart(user);

        cart.getItems().clear();

        cartRepository.save(cart);

        return new ApiResponse<>(
                true,
                "Cart cleared successfully.",
                null
        );
    }


    // =========================================================
    // GET OR CREATE CART
    // =========================================================

    private Cart getOrCreateCart(User user) {

        return cartRepository
                .findByUser(user)
                .orElseGet(() -> {

                    Cart cart = Cart.builder()
                            .user(user)
                            .build();

                    return cartRepository.save(cart);
                });
    }


    // =========================================================
    // RESOLVE FULFILLMENT STORE
    // =========================================================

    private Store resolveFulfillmentStore(
            User user,
            UUID addressPublicId) {

        CustomerAddress address =
                customerAddressRepository
                        .findByUser(user)
                        .stream()
                        .filter(a ->
                                a.getPublicId()
                                        .equals(addressPublicId))
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Customer address not found."
                                ));

        ApiResponse<List<StoreFulfillmentResponse>>
                storeResponse =
                deliveryService.findStoreForCart(
                        user,
                        address.getId(),
                        5
                );

        StoreFulfillmentResponse selectedStore =
                storeResponse.data()
                        .stream()
                        .filter(
                                StoreFulfillmentResponse::deliverable
                        )
                        .filter(
                                StoreFulfillmentResponse::canFulfillCart
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "No store can fulfill the cart for this address."
                                )
                        );

        return storeRepository
                .findByPublicId(
                        selectedStore.storePublicId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Selected store not found."
                        ));
    }


    // =========================================================
    // MAP CART RESPONSE
    // =========================================================

    private CartResponse mapToResponse(
            Cart cart,
            Store store) {

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        List<CartItemResponse> items =
                new java.util.ArrayList<>();

        for (CartItem item : cart.getItems()) {

            Inventory inventory =
                    inventoryRepository
                            .findByProductIdAndStoreId(
                                    item.getProduct().getId(),
                                    store.getId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Product inventory not found in selected store."
                                    ));

            InventoryBatch batch =
                    inventoryBatchRepository
                            .findFirstByInventoryAndActiveTrueOrderByExpiryDateAsc(
                                    inventory
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "No active inventory batch found."
                                    ));

            BigDecimal sellingPrice =
                    batch.getSellingPrice();

            BigDecimal itemTotal =
                    sellingPrice.multiply(
                            BigDecimal.valueOf(
                                    item.getQuantity()
                            )
                    );

            totalItems += item.getQuantity();

            subtotal = subtotal.add(itemTotal);

            items.add(
                    new CartItemResponse(
                            item.getPublicId(),
                            item.getProduct().getPublicId(),
                            item.getProduct().getSku(),
                            item.getProduct().getName(),
                            sellingPrice,
                            item.getQuantity(),
                            itemTotal
                    )
            );
        }

        return new CartResponse(
                cart.getPublicId(),
                items,
                totalItems,
                subtotal
        );
    }
}