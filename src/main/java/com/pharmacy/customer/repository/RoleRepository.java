package com.pharmacy.customer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.customer.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByPublicId(String name);
    Optional<Role> findByName(String name);  
    boolean existsByName(String name);

}
