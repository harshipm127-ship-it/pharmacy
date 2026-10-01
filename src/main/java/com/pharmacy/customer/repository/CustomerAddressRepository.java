package com.pharmacy.customer.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.customer.entity.CustomerAddress;
import com.pharmacy.customer.entity.User;

public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {

    List<CustomerAddress> findByUser(User user);

    Optional<CustomerAddress> findByUserAndIsDefaultTrue(User user);

    Optional<CustomerAddress> findByIdAndUser(Long id, User user);

}
